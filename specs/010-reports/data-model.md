# Data Model: Reports (Backend P009)

Frontend types live in `src/features/reports/types/reports.types.ts`. Shapes mirror Backend P009; reconcile against Swagger during implementation. Absorb patterns from Spec 008 `expense-report-api.ts`.

## Domains

### ReportDomain

| Value          | Route                   | Notes                                         |
| -------------- | ----------------------- | --------------------------------------------- |
| `transactions` | `/reports/transactions` | Inbound/outbound columns when API provides    |
| `trips`        | `/reports/trips`        | Status / utilization fields when API provides |
| `expenses`     | `/reports/expenses`     | Category + reference type                     |
| `payroll`      | `/reports/payroll`      | Period + employee pay fields                  |
| `attendance`   | `/reports/attendance`   | Employee attendance rows                      |

## Filter & query model

### ReportFilterSet (per domain)

| Field             | Type            | API param         | Notes                                             |
| ----------------- | --------------- | ----------------- | ------------------------------------------------- |
| `from`            | string          | `from`            | Required; date input `YYYY-MM-DD` → ISO8601 start |
| `to`              | string          | `to`              | Required; date input → ISO8601 end                |
| `branchId`        | string \| null  | `branchId`        | Optional                                          |
| `warehouseId`     | string \| null  | `warehouseId`     | Optional                                          |
| `vehicleId`       | string \| null  | `vehicleId`       | Optional                                          |
| `employeeId`      | string \| null  | `employeeId`      | Optional                                          |
| `tripId`          | string \| null  | `tripId`          | When supported                                    |
| `includeArchived` | boolean         | `includeArchived` | Default `false`                                   |
| `search`          | string \| null  | `search`          | Min length 2 when sent                            |
| `transactionType` | string \| null  | per OpenAPI       | Transactions only                                 |
| `expenseCategory` | string \| null  | per OpenAPI       | Expenses only                                     |
| `payrollPeriod`   | string \| null  | per OpenAPI       | Payroll only                                      |
| `tripStatus`      | string \| null  | per OpenAPI       | Trips only                                        |
| `page`            | number          | `page`            | 1-based                                           |
| `pageSize`        | number          | `limit`           | Backend page size                                 |
| `sortField`       | string \| null  | `sortBy`          | Domain aliases                                    |
| `sortDirection`   | `asc` \| `desc` | `sortOrder`       |                                                   |

**Validation**: `from` and `to` required; `from` ≤ `to`; span ≤ 366 days; only domain-allowed extras included in query.

### ReportExportFormat

`csv` | `xlsx` | `pdf`

PDF offered only when backend capability includes it for that domain.

## Response models

### ReportPageMeta

| Field             | Type                              | Notes                               |
| ----------------- | --------------------------------- | ----------------------------------- |
| `generatedAt`     | string \| null                    | Last computation / generation time  |
| `appliedCriteria` | `Record<string, unknown>` \| null | Echo of filters                     |
| `summary`         | `ReportSummary \| null`           | Backend totals only — display as-is |

### ReportSummary

Opaque bag of numeric/label fields returned by API (e.g. `totalAmount`, `rowCount`, `inboundCount`). Frontend maps known keys to summary cards; unknown keys ignored or shown in a generic definition list — **never computed**.

### ReportListResponse\<TRow\>

| Field             | Type                    |
| ----------------- | ----------------------- |
| `data`            | `TRow[]`                |
| `total`           | number                  |
| `page`            | number                  |
| `pageSize`        | number                  |
| `generatedAt`     | string \| null          |
| `appliedCriteria` | object \| null          |
| `summary`         | `ReportSummary` \| null |

### TransactionReportRow (indicative)

| Field               | Type           | Notes                  |
| ------------------- | -------------- | ---------------------- |
| `id`                | string         |                        |
| `date`              | string         |                        |
| `transactionNumber` | string \| null |                        |
| `type`              | string \| null | INBOUND / OUTBOUND     |
| `status`            | string \| null |                        |
| `totalAmount`       | number \| null |                        |
| `employeeName`      | string \| null |                        |
| `branchName`        | string \| null |                        |
| …                   |                | Reconcile with OpenAPI |

### TripReportRow (indicative)

| Field                    | Type           |
| ------------------------ | -------------- |
| `id`                     | string         |
| `date`                   | string         |
| `status`                 | string \| null |
| `vehiclePlate`           | string \| null |
| `employeeName`           | string \| null |
| `origin` / `destination` | string \| null |
| `durationMinutes`        | number \| null |

### ExpenseReportRow

Align with existing Spec 008 report row: `id`, `date`, `description`, `amount`, `category`, `expenseNumber`, `referenceType`, `referenceId`, `referenceLabel`, location FKs, `status`, `notes`.

### PayrollReportRow (indicative)

| Field          | Type           |
| -------------- | -------------- |
| `id`           | string         |
| `period`       | string \| null |
| `employeeName` | string \| null |
| `gross`        | number \| null |
| `net`          | number \| null |
| `status`       | string \| null |

### AttendanceReportRow (indicative)

| Field          | Type           |
| -------------- | -------------- |
| `id`           | string         |
| `date`         | string         |
| `employeeName` | string \| null |
| `timeIn`       | string \| null |
| `timeOut`      | string \| null |
| `status`       | string \| null |

## Export

### ReportExportRequest

| Field     | Type                                                |
| --------- | --------------------------------------------------- |
| `domain`  | `ReportDomain`                                      |
| `format`  | `ReportExportFormat`                                |
| `filters` | `ReportFilterSet` (without page, or with — per API) |

### ReportExportResult

| Field      | Type           | Notes                                   |
| ---------- | -------------- | --------------------------------------- |
| `blob`     | Blob           | Sync download                           |
| `filename` | string         | From `Content-Disposition` or generated |
| `jobId`    | string \| null | If async — poll until ready             |

## Hub (optional)

### RecentReportItem / SavedReportFilter

Only typed and fetched when endpoints exist. Otherwise hub uses static `REPORT_CATEGORIES` config.

## Zustand (client-only)

### ReportFilterStore (keyed by domain)

- `filtersByDomain: Record<ReportDomain, ReportFilterSet>`
- setters + `resetDomain(domain)`

### ReportPreferencesStore

- `pageSize`, column visibility map, last visited domain
- Persist to localStorage — **no row payloads**

## Relationships

```
ReportFilterSet ──params──► ReportService ──► Backend P009
       │
       └── reportKeys.* ──► TanStack Query ──► Pages
                              │
                              └── export mutation ──► Blob download
```
