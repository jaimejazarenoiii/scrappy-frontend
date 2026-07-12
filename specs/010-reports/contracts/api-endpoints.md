# API Endpoints: Reports (Backend P009)

**Base path**: `/api/v1/reports`  
**Auth**: Bearer JWT (company-scoped)  
**Access**: Owner/Manager typical — Employee **403** unless OpenAPI grants scoped access.

List responses use the standard envelope with report payload in `data` and pagination in `meta`:

```json
{
  "success": true,
  "data": {
    "items": [/* domain rows */],
    "appliedCriteria": {/* echo of filters + sort */},
    "generatedAt": "ISO8601"
  },
  "meta": { "page": 1, "limit": 20, "total": 0 }
}
```

Frontend unwraps via `unwrapReportList` in `src/features/reports/lib/report-api.ts` (not bare `data: T[]`).

Errors: `401`, `403`, `400` (validation, e.g. missing `from`/`to` or range > 366 days).

## Shared query parameters (list)

| Param             | Type            | Required | Notes                        |
| ----------------- | --------------- | -------- | ---------------------------- |
| `from`            | ISO8601         | **Yes**  | Range start                  |
| `to`              | ISO8601         | **Yes**  | Range end; max span 366 days |
| `page`            | number          | No       | Default 1                    |
| `limit`           | number          | No       | Page size                    |
| `search`          | string          | No       | Min length typically 2       |
| `sortBy`          | string          | No       | Domain field                 |
| `sortOrder`       | `asc` \| `desc` | No       |                              |
| `branchId`        | UUID            | No       |                              |
| `warehouseId`     | UUID            | No       |                              |
| `vehicleId`       | UUID            | No       |                              |
| `employeeId`      | UUID            | No       |                              |
| `tripId`          | UUID            | No       | When supported               |
| `includeArchived` | boolean         | No       | Default false                |

Domain-specific params (only when documented): transaction type, expense category, payroll period, trip status, etc.

Frontend builds params via `buildReportQueryParams(domain, filters)` in `src/features/reports/lib/report-api.ts`.

---

## GET /reports/transactions

**Purpose**: Transaction report rows + optional summary.  
**Service**: `ReportService.listTransactions(filters)`  
**Hook**: `useTransactionReport(filters)`

**`sortBy` enum**: `transactionDate` | `transactionNumber` | `createdAt` | `partyName` | `status`  
(UI column `date` maps to `transactionDate` via `toReportSortBy`.)

## GET /reports/trips

**Purpose**: Trip report rows + optional summary / utilization fields.  
**Service**: `ReportService.listTrips(filters)`  
**Hook**: `useTripReport(filters)`

## GET /reports/expenses

**Purpose**: Expense report rows (field `date`, not `expenseDate`).  
**Service**: `ReportService.listExpenses(filters)`  
**Hook**: `useExpenseReport(filters)` — **canonical home** (migrate from Spec 008 helper).

**Existing knowledge (Spec 008)**: Requires `from` + `to`; supports shared entity filters and search.

## GET /reports/payroll

**Purpose**: Payroll report rows by period/employee.  
**Service**: `ReportService.listPayroll(filters)`  
**Hook**: `usePayrollReport(filters)`

## GET /reports/attendance

**Purpose**: Attendance report rows.  
**Service**: `ReportService.listAttendance(filters)`  
**Hook**: `useAttendanceReport(filters)`

---

## Export endpoints (reconcile with OpenAPI)

Indicative patterns (pick what OpenAPI documents):

| Pattern              | Example                                                           |
| -------------------- | ----------------------------------------------------------------- |
| Query format on list | `GET /reports/expenses?from=&to=&format=csv` with `Accept` / blob |
| Dedicated export     | `GET /reports/expenses/export?format=xlsx&...`                    |
| POST export          | `POST /reports/expenses/export` body filters                      |

**Service**: `ReportService.export(domain, filters, format): Promise<{ blob, filename }>`  
**Hook**: `useReportExport()` mutation with toast + download helper.

Supported formats baseline: `csv`, `xlsx`; `pdf` when listed.

**Rule**: Never synthesize file bytes on the client.

---

## Optional hub endpoints

| Endpoint                                   | Purpose                    |
| ------------------------------------------ | -------------------------- |
| `GET /reports/recent` (if any)             | Recently generated reports |
| `GET/POST /reports/saved-filters` (if any) | Saved filter presets       |

If absent: hub uses static category config only.

---

## Frontend service contract

```typescript
// src/features/reports/services/report.service.ts
class ReportService {
  listTransactions(filters: ReportFilterSet): Promise<ReportListResponse<TransactionReportRow>>
  listTrips(filters: ReportFilterSet): Promise<ReportListResponse<TripReportRow>>
  listExpenses(filters: ReportFilterSet): Promise<ReportListResponse<ExpenseReportRow>>
  listPayroll(filters: ReportFilterSet): Promise<ReportListResponse<PayrollReportRow>>
  listAttendance(filters: ReportFilterSet): Promise<ReportListResponse<AttendanceReportRow>>
  export(
    domain: ReportDomain,
    filters: ReportFilterSet,
    format: ReportExportFormat,
  ): Promise<ReportExportResult>
}
```

- Uses shared `apiClient`
- No Axios from components
- Normalizers per domain in `lib/*-report-api.ts`

## Out of scope

| Family                         | Notes                      |
| ------------------------------ | -------------------------- |
| `/analytics/*`                 | Spec 009                   |
| `/activity-logs/*`             | Spec 011                   |
| CRUD list endpoints for totals | Forbidden as report source |

## Error handling

| Status | UI                                     |
| ------ | -------------------------------------- |
| 401    | Auth redirect                          |
| 403    | PermissionGuard / forbidden            |
| 400    | Inline filter validation + toast       |
| 5xx    | ErrorState + retry; export toast error |
