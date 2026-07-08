# Route & Guard Contract: Workforce Management

Extends Specification 003 Data Router (`src/app/router/routes.tsx`) additively. All
workforce routes render under `AuthGuard` → `DashboardLayout`. Pages are lazy-loaded.

## Route paths (`src/constants/routes.ts` — EXTEND)

| Constant            | Path                      | Guard                                            | Page                      |
| ------------------- | ------------------------- | ------------------------------------------------ | ------------------------- |
| `attendance`        | `/attendance`             | Auth + `PermissionGuard(['attendance.view'])`    | `AttendanceDashboardPage` |
| `attendanceDetail`  | `/attendance/:id`         | Auth + `PermissionGuard(['attendance.view'])`    | `AttendanceDetailPage`    |
| `leave`             | `/leave`                  | Auth + `PermissionGuard(['leave.view'])`         | `LeaveListPage`           |
| `leaveNew`          | `/leave/new`              | Auth + `PermissionGuard(['leave.create'])`       | `LeaveCreatePage`         |
| `leaveDetail`       | `/leave/:id`              | Auth + `PermissionGuard(['leave.view'])`         | `LeaveDetailPage`         |
| `leaveEdit`         | `/leave/:id/edit`         | Auth + `PermissionGuard(['leave.update'])`       | `LeaveEditPage`           |
| `cashAdvances`      | `/cash-advances`          | Auth + `PermissionGuard(['cashAdvance.view'])`   | `CashAdvancesListPage`    |
| `cashAdvanceNew`    | `/cash-advances/new`      | Auth + `PermissionGuard(['cashAdvance.create'])` | `CashAdvanceCreatePage`   |
| `cashAdvanceDetail` | `/cash-advances/:id`      | Auth + `PermissionGuard(['cashAdvance.view'])`   | `CashAdvanceDetailPage`   |
| `cashAdvanceEdit`   | `/cash-advances/:id/edit` | Auth + `PermissionGuard(['cashAdvance.update'])` | `CashAdvanceEditPage`     |
| `payroll`           | `/payroll`                | Auth + `PermissionGuard(['payroll.view'])`       | `PayrollListPage`         |
| `payrollDetail`     | `/payroll/:id`            | Auth + `PermissionGuard(['payroll.view'])`       | `PayrollDetailPage`       |

### `buildRoute` helpers (EXTEND)

```text
buildRoute.attendanceDetail(id)   → /attendance/{id}
buildRoute.leaveDetail(id)        → /leave/{id}
buildRoute.leaveEdit(id)          → /leave/{id}/edit
buildRoute.cashAdvanceDetail(id)  → /cash-advances/{id}
buildRoute.cashAdvanceEdit(id)    → /cash-advances/{id}/edit
buildRoute.payrollDetail(id)      → /payroll/{id}
```

## Navigation (`src/constants/navigation.ts` — EXTEND)

Add after Vehicles (Workforce group):

| id              | label         | href                  | icon (Lucide)  | `anyOf` permission |
| --------------- | ------------- | --------------------- | -------------- | ------------------ |
| `attendance`    | Attendance    | `ROUTES.attendance`   | `Clock`        | `attendance.view`  |
| `leave`         | Leave         | `ROUTES.leave`        | `CalendarDays` | `leave.view`       |
| `cash-advances` | Cash Advances | `ROUTES.cashAdvances` | `Wallet`       | `cashAdvance.view` |
| `payroll`       | Payroll       | `ROUTES.payroll`      | `Banknote`     | `payroll.view`     |

Sidebar filtering uses existing `usePermissions().hasAny()` (Spec 002) — no hardcoded
role checks.

## PermissionGate usage (actions)

| Action               | Permission key        | Location                  |
| -------------------- | --------------------- | ------------------------- |
| Manual time in       | `attendance.timeIn`   | AttendanceDetailPage      |
| Manual time out      | `attendance.timeOut`  | AttendanceDetailPage      |
| Attendance correct   | `attendance.correct`  | AttendanceDetailPage      |
| New leave            | `leave.create`        | LeaveListPage header      |
| Edit leave           | `leave.update`        | LeaveDetailPage, list row |
| Cancel leave         | `leave.cancel`        | LeaveDetailPage           |
| Approve leave        | `leave.approve`       | LeaveDetailPage           |
| Reject leave         | `leave.reject`        | LeaveDetailPage           |
| New cash advance     | `cashAdvance.create`  | CashAdvancesListPage      |
| Edit cash advance    | `cashAdvance.update`  | CashAdvanceDetailPage     |
| Cancel cash advance  | `cashAdvance.cancel`  | CashAdvanceDetailPage     |
| Approve cash advance | `cashAdvance.approve` | CashAdvanceDetailPage     |
| Reject cash advance  | `cashAdvance.reject`  | CashAdvanceDetailPage     |

Payroll has view-only actions in this spec (no mutating PermissionGate entries).

## AuthGuard / Session

No changes to `AuthGuard` or session bootstrap. Workforce routes inherit authenticated,
tenant-scoped session from Specification 002.

## Breadcrumbs

`DashboardLayout` global breadcrumb derives from route path segments. Workforce pages
do not pass redundant `breadcrumbs` prop to `PageHeader` (Spec 002 convention).

## Deep linking & URL state

List sections and list pages use `useListQuery` so `?q=`, `page`, `pageSize`, `sort`, and
filter params are bookmarkable. Attendance dashboard list section shares the same URL query
state as the embedded records table.
