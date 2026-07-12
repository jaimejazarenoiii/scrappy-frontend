# API Endpoints: Trip Management (Backend P006)

Consumed exclusively through `src/features/trips/services/trip.service.ts`. Components MUST NOT call Axios directly (Constitution VIII).

**Base path**: `/api/v1` (via `VITE_API_BASE_URL`).

**Conventions**: JSON; `Authorization: Bearer <accessToken>`; tenant scoping via JWT; envelope `{ success, data, meta, error }`; paginated lists via `unwrapList()`.

Reconcile exact paths and bodies against Swagger (`GET /docs`) during implementation. Paths below follow established Scrappy module conventions and Spec 007 assumptions.

## List query mapping

Extends `ListQueryParams` / `toQueryParams` where applicable:

| Internal            | API query param |
| ------------------- | --------------- |
| `page`              | `page`          |
| `pageSize`          | `limit`         |
| `search`            | `search`        |
| `sort.field`        | `sortBy`        |
| `sort.direction`    | `sortOrder`     |
| `filters.status`    | `status`        |
| `filters.branchId`  | `branchId`      |
| `filters.vehicleId` | `vehicleId`     |
| `filters.fromDate`  | `fromDate`      |
| `filters.toDate`    | `toDate`        |

## Trip service (`features/trips/services/trip.service.ts`)

### CRUD & list

| Method    | Endpoint                       | Roles (typical) | Request                   | Response                         |
| --------- | ------------------------------ | --------------- | ------------------------- | -------------------------------- |
| `list`    | `GET /trips`                   | authorized      | query params              | `PaginatedResponse<TripSummary>` |
| `get`     | `GET /trips/{tripId}`          | authorized      | —                         | `TripDetail`                     |
| `create`  | `POST /trips`                  | OWNER, MANAGER  | `CreateTripInput`         | `TripDetail` (201)               |
| `update`  | `PATCH /trips/{tripId}`        | OWNER, MANAGER  | `UpdateTripInput`         | `TripDetail`                     |
| `cancel`  | `POST /trips/{tripId}/cancel`  | per backend     | `{ cancellationReason? }` | `TripDetail`                     |
| `archive` | `POST /trips/{tripId}/archive` | if supported    | —                         | `TripDetail`                     |

**Create body (typical)**:

```json
{
  "origin": "Main Branch",
  "destination": "Supplier Yard",
  "scheduledStartAt": "2026-07-10T08:00:00.000Z",
  "branchId": "uuid",
  "warehouseId": "uuid",
  "vehicleId": "uuid",
  "notes": "..."
}
```

**Trip `status` values**: `DRAFT` | `SCHEDULED` | `STARTED` | `COMPLETED` | `CANCELLED`

**Trip number**: `tripNumber` e.g. `TRIP-20260709-000001` when assigned by backend.

### Dashboard (optional)

| Method         | Endpoint               | Response                                    |
| -------------- | ---------------------- | ------------------------------------------- |
| `getDashboard` | `GET /trips/dashboard` | Counts by status, recent trips — if exposed |

If absent, derive summary cards from list `meta` or omit KPI row.

### Workflow actions

| Method     | Endpoint                        | Transition              | Body                            |
| ---------- | ------------------------------- | ----------------------- | ------------------------------- |
| `schedule` | `POST /trips/{tripId}/schedule` | `DRAFT` → `SCHEDULED`   | —                               |
| `start`    | `POST /trips/{tripId}/start`    | `SCHEDULED` → `STARTED` | `{ startingOdometer?: number }` |
| `complete` | `POST /trips/{tripId}/complete` | `STARTED` → `COMPLETED` | `{ endingOdometer?: number }`   |

Errors: `403` forbidden; `409` lifecycle conflict (e.g. vehicle on another active trip); `400` validation (odometer, missing members).

### Trip members

| Method         | Endpoint                                    | Request                     | Response                       |
| -------------- | ------------------------------------------- | --------------------------- | ------------------------------ |
| `listMembers`  | `GET /trips/{tripId}/members`               | —                           | `TripMember[]`                 |
| `addMembers`   | `POST /trips/{tripId}/members`              | `{ employeeIds: string[] }` | `TripMember[]` or `TripDetail` |
| `removeMember` | `DELETE /trips/{tripId}/members/{memberId}` | —                           | `void` or updated list         |

Alternative: `DELETE` with `{ employeeId }` body — follow OpenAPI.

### Vehicle assignment

| Method          | Endpoint                                                 | Request                 | Response     |
| --------------- | -------------------------------------------------------- | ----------------------- | ------------ |
| `assignVehicle` | `PUT /trips/{tripId}/vehicle` or `PATCH /trips/{tripId}` | `{ vehicleId: string }` | `TripDetail` |

Backend validates one active trip per vehicle.

### Transaction linking

| Method                   | Endpoint                                              | Request                           | Response                                      |
| ------------------------ | ----------------------------------------------------- | --------------------------------- | --------------------------------------------- |
| `listLinkedTransactions` | `GET /trips/{tripId}/transactions`                    | —                                 | `LinkedTransactionSummary[]`                  |
| `searchLinkable`         | `GET /trips/{tripId}/transactions/linkable`           | search, status, direction filters | `PaginatedResponse<LinkedTransactionSummary>` |
| `linkTransaction`        | `POST /trips/{tripId}/transactions`                   | `{ transactionId: string }`       | `LinkedTransactionSummary` or `TripDetail`    |
| `unlinkTransaction`      | `DELETE /trips/{tripId}/transactions/{transactionId}` | —                                 | —                                             |

Outside-transaction rule failures return `400`/`409` with message — display verbatim (sanitized).

### History / timeline (optional)

| Method       | Endpoint                      | Response              |
| ------------ | ----------------------------- | --------------------- |
| `getHistory` | `GET /trips/{tripId}/history` | `TripTimelineEvent[]` |

If absent, compose timeline from `TripDetail` lifecycle timestamps in `trip-timeline.ts`.

## Supporting services (existing — not duplicated)

| Need                   | Service                                   | Endpoints                                       |
| ---------------------- | ----------------------------------------- | ----------------------------------------------- |
| Employee labels/picker | `EmployeeService`, `useEmployeeOptions`   | `GET /employees`                                |
| Branch picker          | `BranchService`, `useBranchOptions`       | `GET /branches`                                 |
| Warehouse picker       | `WarehouseService`, `useWarehouseOptions` | `GET /warehouses`                               |
| Vehicle picker         | `VehicleService`                          | `GET /vehicles`                                 |
| Transaction deep link  | `buildRoute.transactionDetail`            | `GET /transactions/{id}` (read-only navigation) |

## Error contract

| HTTP | `error.code`         | Frontend handling                       |
| ---- | -------------------- | --------------------------------------- |
| 400  | `VALIDATION_ERROR`   | Map `details[]` to forms; toast summary |
| 401  | `UNAUTHENTICATED`    | Session refresh / logout                |
| 403  | `FORBIDDEN`          | Hide action or `/403`                   |
| 404  | `RESOURCE_NOT_FOUND` | Trip not found empty state              |
| 409  | `LIFECYCLE_CONFLICT` | Toast + refetch trip detail             |
| 5xx  | —                    | Retryable error state                   |

## Permission keys (proposed — reconcile with backend)

| Key              | Typical use                                |
| ---------------- | ------------------------------------------ |
| `trips.view`     | List, detail, read panels                  |
| `trips.create`   | New trip                                   |
| `trips.update`   | Edit draft fields, members, vehicle, links |
| `trips.schedule` | Schedule action                            |
| `trips.start`    | Start action                               |
| `trips.complete` | Complete action                            |
| `trips.cancel`   | Cancel action                              |

Backend may collapse permissions — map in `session.ts` accordingly.

## Out of scope endpoints

Do not implement client calls for: expenses, analytics, reports, activity logs (Specs 008–011).
