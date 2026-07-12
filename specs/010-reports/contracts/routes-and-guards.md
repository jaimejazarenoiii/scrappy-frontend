# Routes and Guards: Reports (Spec 010)

Maps to Backend P009. New top-level **Reports** navigation item.

## Protected Routes

### Reports hub

- **Route**: `/reports`
- **Guard**: `PermissionGuard` with `PERMISSIONS.reports.view`
- **Lazy**: `ReportsHubPage`
- **Notes**: Category cards, quick access; optional recent/saved sections when API exists
- **Breadcrumb**: Reports

### Transaction reports

- **Route**: `/reports/transactions`
- **Guard**: `PERMISSIONS.reports.view`
- **Lazy**: `TransactionReportsPage`

### Trip reports

- **Route**: `/reports/trips`
- **Guard**: `PERMISSIONS.reports.view`
- **Lazy**: `TripReportsPage`

### Expense reports

- **Route**: `/reports/expenses`
- **Guard**: `PERMISSIONS.reports.view`
- **Lazy**: `ExpenseReportsPage`

### Payroll reports

- **Route**: `/reports/payroll`
- **Guard**: `PERMISSIONS.reports.view`
- **Lazy**: `PayrollReportsPage`

### Attendance reports

- **Route**: `/reports/attendance`
- **Guard**: `PERMISSIONS.reports.view`
- **Lazy**: `AttendanceReportsPage`

## Action Visibility Matrix

Reports are **read-only** (no CRUD on entities from these pages).

| Capability          | Min permission                              | Notes                    |
| ------------------- | ------------------------------------------- | ------------------------ |
| View hub & reports  | `reports.view`                              | Owner, Manager           |
| Export              | `reports.view` or `reports.export` if split | Hide unsupported formats |
| Print               | `reports.view`                              | Browser print            |
| Deep link to entity | target module `*.view`                      | PermissionGate on links  |

Employee: no `reports.view` → nav hidden; direct URL → forbidden.

## Navigation

Add to `src/constants/navigation.ts` (after Analytics):

```typescript
{
  label: 'Reports',
  href: ROUTES.reports,
  icon: FileText, // Lucide
  anyOf: [PERMISSIONS.reports.view],
}
```

## Route constants (`routes.ts`)

```typescript
reports: '/reports',
reportsTransactions: '/reports/transactions',
reportsTrips: '/reports/trips',
reportsExpenses: '/reports/expenses',
reportsPayroll: '/reports/payroll',
reportsAttendance: '/reports/attendance',
```

## Breadcrumbs

| Segment        | Label        |
| -------------- | ------------ |
| `reports`      | Reports      |
| `transactions` | Transactions |
| `trips`        | Trips        |
| `expenses`     | Expenses     |
| `payroll`      | Payroll      |
| `attendance`   | Attendance   |

Extend `useBreadcrumbTrail` / `lib/breadcrumb.ts` additively.

## Lazy loading

All report pages via `React.lazy` in `routes.tsx` with existing `Suspense` fallback.

## Deep linking

- Domain routes load with default month date range from store
- Optional URL sync for `from`/`to` in polish phase
- Unauthorized → forbidden with link home

## Router pattern

- `createBrowserRouter`
- Nested under authenticated `DashboardLayout`
- Browser history + deep linking

## Spec 011 boundary

Do not add `/activity-logs` routes in this spec.
