# Phase 1 Data Model: Workforce Management

Frontend-facing models consumed from Backend P003. Field names follow the Scrappy API
reference and MUST be reconciled with the published OpenAPI schema at `GET /docs`. Types
live in each feature's `types/`; list query types reuse `src/types/pagination.types.ts`.

## Shared Conventions

- All responses use the API envelope: `{ success, data, meta, error }`.
- Paginated lists: `data` is `T[]`; `meta` contains `{ page, limit, total, totalPages }`.
- `unwrapList()` maps `meta.limit` → internal `pageSize`.
- Tenant scoping is implicit via JWT; no `companyId` query param on lists.
- Timestamps are ISO 8601 strings.
- Employee embeds use `EmployeeSummary` from Spec 002 when nested: `{ id, firstName, lastName, employeeNumber? }`.

## Attendance — `features/attendance/types/attendance.types.ts`

| Field        | Type               | Notes                      |
| ------------ | ------------------ | -------------------------- |
| `id`         | `string`           | UUID                       |
| `companyId`  | `string`           | Owning company             |
| `employeeId` | `string`           | Associated employee        |
| `employee`   | `EmployeeSummary`  | Optional embed             |
| `date`       | `string`           | Attendance date (ISO date) |
| `timeIn`     | `string \| null`   | Clock-in timestamp         |
| `timeOut`    | `string \| null`   | Clock-out timestamp        |
| `status`     | `AttendanceStatus` | Backend-defined enum       |
| `notes`      | `string \| null`   | Optional notes             |
| `createdAt`  | `string`           |                            |
| `updatedAt`  | `string`           |                            |

### AttendanceStatus (reconcile with OpenAPI)

Typical values: `PRESENT` | `LATE` | `ABSENT` | `PARTIAL` | `CORRECTED` — exact enum from Swagger.

### AttendanceDashboardSummary

| Field            | Type     | Notes     |
| ---------------- | -------- | --------- |
| `presentToday`   | `number` | KPI count |
| `absentToday`    | `number` | KPI count |
| `lateToday`      | `number` | KPI count |
| `totalEmployees` | `number` | Optional  |

Returned by `GET /attendance/dashboard` or equivalent.

### AttendanceCorrectionInput

| Field     | Type     | Required |
| --------- | -------- | -------- |
| `timeIn`  | `string` | No*      |
| `timeOut` | `string` | No*      |
| `notes`   | `string` | No       |
| `reason`  | `string` | No*      |

\*Required fields per OpenAPI correction endpoint.

### List query params

| API param    | Source                      |
| ------------ | --------------------------- |
| `page`       | `params.page`               |
| `limit`      | `params.pageSize`           |
| `search`     | `params.search`             |
| `sortBy`     | `params.sort.field`         |
| `sortOrder`  | `params.sort.direction`     |
| `status`     | `params.filters.status`     |
| `employeeId` | `params.filters.employeeId` |
| `dateFrom`   | `params.filters.dateFrom`   |
| `dateTo`     | `params.filters.dateTo`     |

## Leave — `features/leave/types/leave.types.ts`

| Field        | Type              | Notes                     |
| ------------ | ----------------- | ------------------------- |
| `id`         | `string`          | UUID                      |
| `companyId`  | `string`          |                           |
| `employeeId` | `string`          |                           |
| `employee`   | `EmployeeSummary` | Optional embed            |
| `leaveType`  | `string`          | e.g. SICK, VACATION       |
| `startDate`  | `string`          | ISO date                  |
| `endDate`    | `string`          | ISO date                  |
| `reason`     | `string \| null`  |                           |
| `status`     | `LeaveStatus`     | Workflow status           |
| `approvedBy` | `string \| null`  | Approver user/employee id |
| `approvedAt` | `string \| null`  |                           |
| `createdAt`  | `string`          |                           |
| `updatedAt`  | `string`          |                           |

### LeaveStatus

Typical: `PENDING` | `APPROVED` | `REJECTED` | `CANCELLED` — reconcile with OpenAPI.

### CreateLeaveInput

| Field        | Type     | Required |
| ------------ | -------- | -------- |
| `employeeId` | `string` | Yes*     |
| `leaveType`  | `string` | Yes      |
| `startDate`  | `string` | Yes      |
| `endDate`    | `string` | Yes      |
| `reason`     | `string` | No       |

\*May default to current user's employee when API supports self-service.

### UpdateLeaveInput

`Partial<CreateLeaveInput>` — only when status allows edit per backend.

### WorkflowHistoryEntry (if API embeds)

| Field       | Type     |
| ----------- | -------- |
| `action`    | `string` |
| `actorName` | `string` |
| `notes`     | `string` |
| `createdAt` | `string` |

## Cash Advance — `features/cash-advances/types/cash-advance.types.ts`

| Field        | Type                | Notes            |
| ------------ | ------------------- | ---------------- |
| `id`         | `string`            | UUID             |
| `companyId`  | `string`            |                  |
| `employeeId` | `string`            |                  |
| `employee`   | `EmployeeSummary`   | Optional embed   |
| `amount`     | `number`            | Requested amount |
| `reason`     | `string \| null`    |                  |
| `status`     | `CashAdvanceStatus` | Workflow status  |
| `approvedBy` | `string \| null`    |                  |
| `approvedAt` | `string \| null`    |                  |
| `createdAt`  | `string`            |                  |
| `updatedAt`  | `string`            |                  |

### CashAdvanceStatus

Typical: `PENDING` | `APPROVED` | `REJECTED` | `CANCELLED` | `DISBURSED` — per OpenAPI.

### CreateCashAdvanceInput

| Field        | Type     | Required |
| ------------ | -------- | -------- |
| `employeeId` | `string` | Yes*     |
| `amount`     | `number` | Yes      |
| `reason`     | `string` | No*      |

### UpdateCashAdvanceInput

`Partial<CreateCashAdvanceInput>`.

## Payroll — `features/payroll/types/payroll.types.ts`

| Field             | Type            | Notes                |
| ----------------- | --------------- | -------------------- |
| `id`              | `string`        | UUID                 |
| `companyId`       | `string`        |                      |
| `periodStart`     | `string`        | Pay period start     |
| `periodEnd`       | `string`        | Pay period end       |
| `status`          | `PayrollStatus` | e.g. OPEN, PROCESSED |
| `totalGross`      | `number`        | Backend-computed     |
| `totalDeductions` | `number`        | Backend-computed     |
| `totalNet`        | `number`        | Backend-computed     |
| `employeeCount`   | `number`        | Optional             |
| `createdAt`       | `string`        |                      |
| `updatedAt`       | `string`        |                      |

### PayrollDetail (extends or embeds line items)

| Field       | Type                | Notes             |
| ----------- | ------------------- | ----------------- |
| `summary`   | `Payroll`           | Run-level summary |
| `lineItems` | `PayrollLineItem[]` | Per-employee rows |

### PayrollLineItem

| Field        | Type              |
| ------------ | ----------------- |
| `employeeId` | `string`          |
| `employee`   | `EmployeeSummary` |
| `grossPay`   | `number`          |
| `deductions` | `number`          |
| `netPay`     | `number`          |

**Frontend MUST display these values as returned — no recalculation.**

### PayrollPeriod (if exposed separately)

| Field         | Type     |
| ------------- | -------- |
| `id`          | `string` |
| `label`       | `string` |
| `periodStart` | `string` |
| `periodEnd`   | `string` |

## TanStack Query Keys

| Key pattern                             | Query function                |
| --------------------------------------- | ----------------------------- |
| `['attendance', 'dashboard']`           | `AttendanceService.dashboard` |
| `['attendance', 'list', params]`        | `AttendanceService.list`      |
| `['attendance', 'detail', id]`          | `AttendanceService.get`       |
| `['attendance', 'history', employeeId]` | Employee attendance history   |
| `['leave', 'list', params]`             | `LeaveService.list`           |
| `['leave', 'detail', id]`               | `LeaveService.get`            |
| `['cash-advances', 'list', params]`     | `CashAdvanceService.list`     |
| `['cash-advances', 'detail', id]`       | `CashAdvanceService.get`      |
| `['payroll', 'list', params]`           | `PayrollService.list`         |
| `['payroll', 'detail', id]`             | `PayrollService.get`          |
| `['payroll', 'periods']`                | `PayrollService.periods`      |
| `['employees', 'picker']`               | Active employees for forms    |

Mutations invalidate relevant list/detail keys. Logout clears all via `queryClient.clear()`.

## Validation Schemas (Zod)

| Schema                       | File                                                       |
| ---------------------------- | ---------------------------------------------------------- |
| `attendanceCorrectionSchema` | `features/attendance/validation/attendance.schema.ts`      |
| `leaveSchema`                | `features/leave/validation/leave.schema.ts`                |
| `cashAdvanceSchema`          | `features/cash-advances/validation/cash-advance.schema.ts` |

Payroll has no mutation schemas in this spec (read-only).

## State Transitions

```text
Leave/Cash Advance: PENDING → APPROVED | REJECTED | CANCELLED (backend-driven)
Attendance: status changes via time-in/out/correction endpoints only
Payroll: read-only display of backend statuses
```

No frontend state machine library — transitions occur via API mutations only.

## Relationships (display only)

```text
Employee 1--* Attendance
Employee 1--* Leave Request
Employee 1--* Cash Advance
Employee 1--* Payroll Line Item (via payroll detail)
```

Rendered from API payload; not computed client-side.
