# API Contract: Backend Workforce Management

Consumed exclusively through feature service classes over the shared `apiClient`
(`src/lib/axios.ts`). Components MUST NOT call Axios directly (Constitution VIII).

**Base path**: `/api/v1` (configured via `VITE_API_BASE_URL`).

**Conventions**: JSON; `Authorization: Bearer <accessToken>`; tenant scoping via JWT;
response envelope `{ success, data, meta, error }`; paginated lists unwrap via `unwrapList()`.

All workforce routes are under `/workforce/...`.

## List query mapping (`lib/list-params.ts`)

| Internal (`ListQueryParams`) | API query param                |
| ---------------------------- | ------------------------------ |
| `page`                       | `page`                         |
| `pageSize`                   | `limit`                        |
| `search`                     | `search`                       |
| `sort.field`                 | `sortBy`                       |
| `sort.direction`             | `sortOrder`                    |
| `filters.*`                  | flat filter keys               |
| `filters.dateFrom`           | `fromDate` (attendance remaps) |
| `filters.dateTo`             | `toDate` (attendance remaps)   |

## Operational dashboard (`features/attendance/services/attendance.service.ts`)

| Method                 | Endpoint                   | Roles | Response                                                                                   |
| ---------------------- | -------------------------- | ----- | ------------------------------------------------------------------------------------------ |
| `operationalDashboard` | `GET /workforce/dashboard` | all   | `WorkforceDashboard` (visibility flags: `canTimeIn`, `canTimeOut`, `canCreateTransaction`) |

## Attendance service

| Method             | Endpoint                                     | Roles             | Request                      | Response                                                  |
| ------------------ | -------------------------------------------- | ----------------- | ---------------------------- | --------------------------------------------------------- |
| `companyDashboard` | `GET /workforce/attendance/dashboard`        | OWNER, MANAGER    | `date?` (defaults today UTC) | `AttendanceDashboard` (per-employee day status + summary) |
| `status`           | `GET /workforce/attendance/status`           | all               | —                            | `{ isTimedIn, openSession }`                              |
| `listMine`         | `GET /workforce/attendance`                  | all               | query (`fromDate`/`toDate`)  | `PaginatedResponse<Attendance>`                           |
| `listCompany`      | `GET /workforce/attendance/company`          | OWNER, MANAGER    | query (+ `employeeId`)       | `PaginatedResponse<Attendance>`                           |
| `get`              | _(no GET-by-id documented)_                  | —                 | resolves via list endpoints  | `Attendance`                                              |
| `timeIn`           | `POST /workforce/attendance/time-in`         | MANAGER, EMPLOYEE | `{ note? }`                  | `Attendance`                                              |
| `timeOut`          | `POST /workforce/attendance/time-out`        | MANAGER, EMPLOYEE | `{ note? }`                  | `Attendance`                                              |
| `correct`          | `PATCH /workforce/attendance/{attendanceId}` | OWNER, MANAGER    | correction fields            | `Attendance`                                              |

**Role rules**: Owners are exempt from time-in/out. Managers and employees must time in before transactions.

**Day status** (`companyDashboard`): `ABSENT` | `ON_TIME` | `LATE` | `TIMED_OUT` | `ON_LEAVE`.
**Session status**: `OPEN` | `CLOSED`.
**List `sortBy`**: `timeInAt` | `createdAt`.

**Company attendance list** items also include `firstName`, `lastName`, and `employeeNumber`.

## Leave service

| Method        | Endpoint                           | Roles                    | Request                                                                 | Response                   |
| ------------- | ---------------------------------- | ------------------------ | ----------------------------------------------------------------------- | -------------------------- |
| `listMine`    | `GET /workforce/leave`             | all                      | query params                                                            | `PaginatedResponse<Leave>` |
| `listCompany` | `GET /workforce/leave/company`     | OWNER, MANAGER           | query params                                                            | `PaginatedResponse<Leave>` |
| `dashboard`   | `GET /workforce/leave/dashboard`   | OWNER, MANAGER           | —                                                                       | `LeaveDashboard`           |
| `get`         | _(no GET-by-id documented)_        | —                        | resolves via list endpoints                                             | `Leave`                    |
| `create`      | `POST /workforce/leave`            | OWNER, MANAGER, EMPLOYEE | `{ leaveType, leaveDate, reason?, employeeId? }`                        | `Leave`                    |
| `manage`      | `PATCH /workforce/leave/{leaveId}` | OWNER, MANAGER           | `{ status?, managerNote?, leaveType?, leaveDate?, reason? }` (≥1 field) | `Leave`                    |

**Role rules**: Owners cannot request leave for themselves — `employeeId` is required for owners. Managers may optionally pass `employeeId` to create on behalf of someone else. Employees create for themselves.

**Company list** items include `firstName`, `lastName`, `employeeNumber`.

**leaveType**: `HALF_DAY` | `FULL_DAY`.
**status**: `PENDING` | `APPROVED` | `REJECTED` | `CANCELLED`.

## Cash Advance service

| Method        | Endpoint                               | Roles          | Request                           | Response                         |
| ------------- | -------------------------------------- | -------------- | --------------------------------- | -------------------------------- |
| `listMine`    | `GET /workforce/cash-advances`         | EMPLOYEE       | query params                      | `PaginatedResponse<CashAdvance>` |
| `listCompany` | `GET /workforce/cash-advances/company` | OWNER, MANAGER | query params                      | `PaginatedResponse<CashAdvance>` |
| `get`         | _(no GET-by-id documented)_            | —              | resolves via list endpoints       | `CashAdvance`                    |
| `create`      | `POST /workforce/cash-advances`        | OWNER, MANAGER | `{ employeeId, amount, reason? }` | `CashAdvance`                    |

**status**: `OUTSTANDING` | `SETTLED` (no approve/reject workflow).

## Payroll service

| Method     | Endpoint                                        | Roles          | Request                                          | Response                     |
| ---------- | ----------------------------------------------- | -------------- | ------------------------------------------------ | ---------------------------- |
| `list`     | `GET /workforce/payroll`                        | all            | query params                                     | `PaginatedResponse<Payroll>` |
| `get`      | `GET /workforce/payroll/{payrollId}`            | all            | —                                                | `Payroll`                    |
| `generate` | `POST /workforce/payroll`                       | OWNER, MANAGER | `{ payPeriodStart, payPeriodEnd, employeeIds? }` | `Payroll` or `Payroll[]`     |
| `markPaid` | `POST /workforce/payroll/{payrollId}/mark-paid` | OWNER, MANAGER | `{ paymentReference? }`                          | `Payroll`                    |

**status**: `PAYABLE` | `PAID`.
Per-employee record fields: `grossSalary`, `cashAdvanceDeductions`, `netPay` (no nested line items).

## Error contract

| HTTP | `error.code`                                     | Frontend handling        |
| ---- | ------------------------------------------------ | ------------------------ |
| 400  | `VALIDATION_ERROR`                               | Form field map + toast   |
| 401  | `UNAUTHENTICATED`                                | Session refresh / logout |
| 403  | `FORBIDDEN`                                      | Hidden action or `/403`  |
| 404  | `RESOURCE_NOT_FOUND`                             | Detail not-found state   |
| 409  | `LIFECYCLE_CONFLICT` / `BUSINESS_RULE_VIOLATION` | Toast; refresh           |

## TanStack Query keys

| Key pattern                                  | Invalidated by         |
| -------------------------------------------- | ---------------------- |
| `['attendance', 'operational-dashboard']`    | attendance mutations   |
| `['attendance', 'company-dashboard', date?]` | attendance mutations   |
| `['attendance', 'status']`                   | time-in / time-out     |
| `['attendance', 'list', scope, params]`      | attendance mutations   |
| `['attendance', 'detail', id]`               | attendance mutations   |
| `['leave', 'dashboard']`                     | leave mutations        |
| `['leave', 'detail', id]`                    | leave mutations        |
| `['cash-advances', 'list', scope, params]`   | cash advance mutations |
| `['cash-advances', 'detail', id]`            | cash advance mutations |
| `['payroll', 'list', params]`                | generate / mark-paid   |
| `['payroll', 'detail', id]`                  | mark-paid              |
