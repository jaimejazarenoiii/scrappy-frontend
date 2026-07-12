# API Endpoints: Analytics (Backend P008)

**Base path**: `/api/v1/analytics`  
**Auth**: Bearer JWT (company-scoped)  
**Access**: Owner, Manager — Employee receives **403** on all routes below.

All responses use the standard envelope:

```json
{
  "success": true,
  "data": {},
  "meta": { "requestId": "..." }
}
```

Errors: `401` unauthenticated, `403` forbidden, `400` validation (e.g. custom range > 366 days).

## Shared query parameters

| Param             | Type    | Required      | Notes                                                                  |
| ----------------- | ------- | ------------- | ---------------------------------------------------------------------- |
| `period`          | enum    | No            | `TODAY`, `YESTERDAY`, `THIS_WEEK`, `THIS_MONTH`, `THIS_YEAR`, `CUSTOM` |
| `from`            | ISO8601 | When `CUSTOM` | Start inclusive                                                        |
| `to`              | ISO8601 | When `CUSTOM` | End inclusive; max span 366 days                                       |
| `branchId`        | UUID    | No            | Tenant branch filter                                                   |
| `warehouseId`     | UUID    | No            | Tenant warehouse filter                                                |
| `vehicleId`       | UUID    | No            | Vehicle filter                                                         |
| `employeeId`      | UUID    | No            | Employee filter                                                        |
| `includeArchived` | boolean | No            | Default `false`                                                        |
| `limit`           | number  | No            | Rankings cap; default `10`, max `25`                                   |

Frontend builds params via `buildAnalyticsQueryParams(filters)` in `src/features/analytics/lib/analytics-api.ts`.

---

## GET /analytics/company

**Purpose**: Executive / company-wide KPI overview.

**Service**: `AnalyticsService.getCompany(filters)`

**Hook**: `useCompanyAnalytics(filters)`

**Response `data`** (reconcile with OpenAPI):

| Field                      | Type   |
| -------------------------- | ------ |
| `inboundTransactionCount`  | number |
| `outboundTransactionCount` | number |
| `totalTransactionAmount`   | number |
| `totalExpenses`            | number |
| `totalPayroll`             | number |
| `netOperationalAmount`     | number |
| `activeEmployeeCount`      | number |
| `activeTripCount`          | number |
| `activeVehicleCount`       | number |
| `appliedFilters`           | object |
| `generatedAt`              | string |

---

## GET /analytics/transactions

**Purpose**: Transaction volume, rankings, optional time series.

**Service**: `AnalyticsService.getTransactions(filters)`

**Hook**: `useTransactionAnalytics(filters)`

**Response `data`**:

| Field                  | Type             |
| ---------------------- | ---------------- |
| `transactionCount`     | number           |
| `totalAmount`          | number           |
| `averageValue`         | number           |
| `topMaterials`         | array            |
| `mostActiveEmployees`  | array            |
| `mostActiveBranches`   | array            |
| `mostActiveWarehouses` | array            |
| `timeSeries`           | array (optional) |
| `appliedFilters`       | object           |
| `generatedAt`          | string           |

---

## GET /analytics/expenses

**Purpose**: Expense totals, category/context/status breakdowns.

**Service**: `AnalyticsService.getExpenses(filters)`

**Hook**: `useExpenseAnalytics(filters)`

**Response `data`**:

| Field            | Type                                             |
| ---------------- | ------------------------------------------------ |
| `expenseCount`   | number                                           |
| `totalAmount`    | number                                           |
| `byCategory`     | array `{ category, amount, count, percentage? }` |
| `byContextType`  | array                                            |
| `byStatus`       | array                                            |
| `timeSeries`     | array (optional)                                 |
| `appliedFilters` | object                                           |
| `generatedAt`    | string                                           |

---

## GET /analytics/workforce

**Purpose**: Attendance, payroll summary, employee activity.

**Service**: `AnalyticsService.getWorkforce(filters)`

**Hook**: `useWorkforceAnalytics(filters)`

**Response `data`**:

| Field                | Type   |
| -------------------- | ------ |
| `attendanceSummary`  | object |
| `payrollSummary`     | object |
| `leaveSummary`       | object |
| `cashAdvanceSummary` | object |
| `employeeActivity`   | array  |
| `appliedFilters`     | object |
| `generatedAt`        | string |

---

## GET /analytics/trips

**Purpose**: Trip counts, duration, status distribution, vehicle utilization.

**Service**: `AnalyticsService.getTrips(filters)`

**Hook**: `useTripAnalytics(filters)`

**Response `data`**:

| Field                    | Type           |
| ------------------------ | -------------- |
| `tripCount`              | number         |
| `completedCount`         | number         |
| `cancelledCount`         | number         |
| `averageDurationMinutes` | number \| null |
| `statusDistribution`     | array          |
| `vehicleUtilization`     | array          |
| `appliedFilters`         | object         |
| `generatedAt`            | string         |

---

## GET /analytics/organization

**Purpose**: Branch and warehouse performance, fleet utilization.

**Service**: `AnalyticsService.getOrganization(filters)`

**Hook**: `useOrganizationAnalytics(filters)`

**Response `data`**:

| Field                  | Type   |
| ---------------------- | ------ |
| `branchPerformance`    | array  |
| `warehousePerformance` | array  |
| `vehicleUtilization`   | array  |
| `appliedFilters`       | object |
| `generatedAt`          | string |

---

## Frontend service contract

```typescript
// src/features/analytics/services/analytics.service.ts
class AnalyticsService {
  getCompany(filters: AnalyticsFilterSet): Promise<CompanyAnalytics>
  getTransactions(filters: AnalyticsFilterSet): Promise<TransactionAnalytics>
  getExpenses(filters: AnalyticsFilterSet): Promise<ExpenseAnalytics>
  getWorkforce(filters: AnalyticsFilterSet): Promise<WorkforceAnalytics>
  getTrips(filters: AnalyticsFilterSet): Promise<TripAnalytics>
  getOrganization(filters: AnalyticsFilterSet): Promise<OrganizationAnalytics>
}
```

- Uses shared `apiClient` from Spec 001
- No Axios calls from components or pages
- Normalizers in `lib/analytics-api.ts` coerce nulls and unknown array shapes defensively

## Out of scope (Spec 010)

| Endpoint family                                                     | Notes                                |
| ------------------------------------------------------------------- | ------------------------------------ |
| `GET /reports/*`                                                    | Row reports + export                 |
| `GET /activity-logs/*`                                              | Future spec                          |
| Operational `GET /expenses/dashboard`, `GET /trips/dashboard`, etc. | Module dashboards; not analytics hub |

## Error handling

| Status | UI behavior                                           |
| ------ | ----------------------------------------------------- |
| 401    | Existing auth redirect                                |
| 403    | PermissionGuard on route; inline forbidden if partial |
| 400    | Toast + inline filter validation message              |
| 5xx    | Section `ErrorState` + retry via `refetch`            |
