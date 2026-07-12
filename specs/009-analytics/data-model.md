# Data Model: Analytics (Backend P008)

Frontend types live in `src/features/analytics/types/analytics.types.ts`. Shapes mirror Backend P008; reconcile field names against Swagger during implementation.

## Filter & query model

### AnalyticsPeriodPreset

| Value        | UI label     | API `period` |
| ------------ | ------------ | ------------ |
| `TODAY`      | Today        | `TODAY`      |
| `YESTERDAY`  | Yesterday    | `YESTERDAY`  |
| `THIS_WEEK`  | This week    | `THIS_WEEK`  |
| `THIS_MONTH` | This month   | `THIS_MONTH` |
| `THIS_YEAR`  | This year    | `THIS_YEAR`  |
| `CUSTOM`     | Custom range | `CUSTOM`     |

### AnalyticsFilterSet (UI + query)

| Field             | Type                    | API param         | Notes                            |
| ----------------- | ----------------------- | ----------------- | -------------------------------- |
| `period`          | `AnalyticsPeriodPreset` | `period`          | Default `THIS_MONTH`             |
| `from`            | string \| null          | `from`            | ISO8601; required when `CUSTOM`  |
| `to`              | string \| null          | `to`              | ISO8601; required when `CUSTOM`  |
| `branchId`        | string \| null          | `branchId`        | Optional                         |
| `warehouseId`     | string \| null          | `warehouseId`     | Optional                         |
| `vehicleId`       | string \| null          | `vehicleId`       | Optional                         |
| `employeeId`      | string \| null          | `employeeId`      | Optional                         |
| `includeArchived` | boolean                 | `includeArchived` | Default `false`                  |
| `limit`           | number                  | `limit`           | Rankings; default `10`, max `25` |

**Validation**: `from` ≤ `to`; span ≤ 366 days when `CUSTOM`.

### AnalyticsMetadata (echo from API)

| Field            | Type                      | Notes                         |
| ---------------- | ------------------------- | ----------------------------- |
| `appliedFilters` | `Record<string, unknown>` | Echo of resolved filters      |
| `generatedAt`    | string                    | ISO8601 last computation time |

## Response bundles

### CompanyAnalytics (`GET /analytics/company`)

| Field                      | Type   | UI use              |
| -------------------------- | ------ | ------------------- |
| `inboundTransactionCount`  | number | KPI                 |
| `outboundTransactionCount` | number | KPI                 |
| `totalTransactionAmount`   | number | KPI — revenue proxy |
| `totalExpenses`            | number | KPI                 |
| `totalPayroll`             | number | KPI                 |
| `netOperationalAmount`     | number | KPI — highlight     |
| `activeEmployeeCount`      | number | KPI                 |
| `activeTripCount`          | number | KPI                 |
| `activeVehicleCount`       | number | KPI                 |
| `appliedFilters`           | object | Filter echo         |
| `generatedAt`              | string | Last updated        |

### TransactionAnalytics (`GET /analytics/transactions`)

| Field                  | Type                 | UI use                   |
| ---------------------- | -------------------- | ------------------------ |
| `transactionCount`     | number               | KPI                      |
| `totalAmount`          | number               | KPI                      |
| `averageValue`         | number               | KPI                      |
| `topMaterials`         | `RankingRow[]`       | Bar chart + table        |
| `mostActiveEmployees`  | `EntityRankingRow[]` | Table                    |
| `mostActiveBranches`   | `EntityRankingRow[]` | Table                    |
| `mostActiveWarehouses` | `EntityRankingRow[]` | Table                    |
| `timeSeries`           | `TimeSeriesPoint[]`  | Optional line/area chart |

### ExpenseAnalytics (`GET /analytics/expenses`)

| Field           | Type                  | UI use              |
| --------------- | --------------------- | ------------------- |
| `expenseCount`  | number                | KPI                 |
| `totalAmount`   | number                | KPI                 |
| `byCategory`    | `CategoryBreakdown[]` | Pie/donut + table   |
| `byContextType` | `ContextBreakdown[]`  | Bar chart           |
| `byStatus`      | `StatusBreakdown[]`   | Bar chart           |
| `timeSeries`    | `TimeSeriesPoint[]`   | Optional trend line |

### WorkforceAnalytics (`GET /analytics/workforce`)

| Field                | Type                                                | UI use                          |
| -------------------- | --------------------------------------------------- | ------------------------------- |
| `attendanceSummary`  | `{ present, late, absent, onLeave }`                | KPI strip                       |
| `payrollSummary`     | `{ totalGross, totalNet, paidCount, payableCount }` | KPI + bar                       |
| `leaveSummary`       | `{ pending, approved, rejected }`                   | KPI                             |
| `cashAdvanceSummary` | `{ outstandingAmount, outstandingCount }`           | KPI                             |
| `employeeActivity`   | `EmployeeActivityRow[]`                             | Table — attendance/productivity |

### TripAnalytics (`GET /analytics/trips`)

| Field                    | Type                      | UI use            |
| ------------------------ | ------------------------- | ----------------- |
| `tripCount`              | number                    | KPI               |
| `completedCount`         | number                    | KPI               |
| `cancelledCount`         | number                    | KPI               |
| `startedCount`           | number                    | KPI — if provided |
| `averageDurationMinutes` | number \| null            | KPI               |
| `statusDistribution`     | `StatusBreakdown[]`       | Donut chart       |
| `vehicleUtilization`     | `VehicleUtilizationRow[]` | Bar/table         |

### OrganizationAnalytics (`GET /analytics/organization`)

| Field                  | Type                       | UI use      |
| ---------------------- | -------------------------- | ----------- |
| `branchPerformance`    | `LocationPerformanceRow[]` | Table + bar |
| `warehousePerformance` | `LocationPerformanceRow[]` | Table + bar |
| `vehicleUtilization`   | `VehicleUtilizationRow[]`  | Table       |

## Shared sub-types

### RankingRow

| Field          | Type   |
| -------------- | ------ |
| `materialName` | string |
| `totalAmount`  | number |
| `count`        | number |

### EntityRankingRow

| Field         | Type   |
| ------------- | ------ |
| `id`          | string |
| `displayName` | string |
| `count`       | number |
| `totalAmount` | number |

### CategoryBreakdown

| Field        | Type           |
| ------------ | -------------- |
| `category`   | string         |
| `amount`     | number         |
| `count`      | number         |
| `percentage` | number \| null |

### TimeSeriesPoint

| Field   | Type           |
| ------- | -------------- |
| `date`  | string         |
| `value` | number         |
| `label` | string \| null |

### VehicleUtilizationRow

| Field             | Type           |
| ----------------- | -------------- |
| `vehicleId`       | string         |
| `plateNumber`     | string         |
| `tripCount`       | number         |
| `utilizationRate` | number \| null |

### LocationPerformanceRow

| Field               | Type           |
| ------------------- | -------------- |
| `id`                | string         |
| `name`              | string         |
| `transactionAmount` | number         |
| `expenseAmount`     | number         |
| `tripCount`         | number \| null |

## Chart configuration (frontend-only)

### AnalyticsChartKind

`line` | `bar` | `area` | `pie` | `donut`

Maps API breakdown shape → chart kind per domain section (declarative config in `lib/analytics-chart-config.ts`), not computed data.

## Zustand stores (client-only)

### AnalyticsFilterStore

- `filters: AnalyticsFilterSet`
- `setPeriod`, `setCustomRange`, `setEntityFilter`, `setIncludeArchived`, `setLimit`, `resetFilters`

### AnalyticsPreferencesStore (optional)

- `activeTab: string`
- `autoRefreshEnabled: boolean` (default false)
- `collapsedSections: Record<string, boolean>`

## Relationships

```
AnalyticsFilterSet ──query params──► AnalyticsService ──► Backend P008
       │
       └── analyticsKeys.* ──► TanStack Query hooks ──► Pages/Components
```

No persistence of metric payloads in Zustand.
