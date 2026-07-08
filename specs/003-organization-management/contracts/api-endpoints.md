# API Contract: Backend P002 (Organization Management)

Consumed exclusively through feature service classes over the shared `apiClient`
(`src/lib/axios.ts`). Components MUST NOT call Axios directly (Constitution VIII).

**Base path**: `/api/v1` (configured via `VITE_API_BASE_URL`).

**Conventions**: JSON; `Authorization: Bearer <accessToken>` on authenticated requests;
tenant scoping via JWT; response envelope `{ success, data, meta, error }`; paginated lists
unwrap via `unwrapList()` into `PaginatedResponse<T>`.

## List query mapping (`lib/list-params.ts`)

| Internal (`ListQueryParams`) | API query param |
| ---------------------------- | --------------- |
| `page`                       | `page`          |
| `pageSize`                   | `limit`         |
| `search`                     | `search`        |
| `sort.field`                 | `sortBy`        |
| `sort.direction`             | `sortOrder`     |
| `filters.status`             | `status`        |

## Branch service (`features/branches/services/branch.service.ts`)

| Method    | Endpoint                            | Roles          | Request             | Response                    |
| --------- | ----------------------------------- | -------------- | ------------------- | --------------------------- |
| `list`    | `GET /branches`                     | all            | query params        | `PaginatedResponse<Branch>` |
| `get`     | `GET /branches/{branchId}`          | all            | —                   | `Branch`                    |
| `create`  | `POST /branches`                    | OWNER, MANAGER | `CreateBranchInput` | `Branch` (201)              |
| `update`  | `PATCH /branches/{branchId}`        | OWNER, MANAGER | `UpdateBranchInput` | `Branch`                    |
| `archive` | `POST /branches/{branchId}/archive` | OWNER, MANAGER | —                   | `Branch`                    |

**Create body**: `{ name, address?, contactNumber?, status? }`

**Branch shape**: `{ id, companyId, name, address, contactNumber, status, createdAt, updatedAt, deletedAt }`

**List `sortBy`**: `name` | `createdAt` | `status` (default `name` or per OpenAPI)

**List `status` filter**: `ACTIVE` | `INACTIVE`

## Warehouse service (`features/warehouses/services/warehouse.service.ts`)

| Method    | Endpoint                                 | Roles          | Request                | Response                       |
| --------- | ---------------------------------------- | -------------- | ---------------------- | ------------------------------ |
| `list`    | `GET /warehouses`                        | all            | query params           | `PaginatedResponse<Warehouse>` |
| `get`     | `GET /warehouses/{warehouseId}`          | all            | —                      | `Warehouse`                    |
| `create`  | `POST /warehouses`                       | OWNER, MANAGER | `CreateWarehouseInput` | `Warehouse` (201)              |
| `update`  | `PATCH /warehouses/{warehouseId}`        | OWNER, MANAGER | `UpdateWarehouseInput` | `Warehouse`                    |
| `archive` | `POST /warehouses/{warehouseId}/archive` | OWNER, MANAGER | —                      | `Warehouse`                    |

Same list params and core fields as branches. Optional `branchId` on create/update if
OpenAPI defines it.

## Vehicle service (`features/vehicles/services/vehicle.service.ts`)

| Method    | Endpoint                             | Roles          | Request              | Response                     |
| --------- | ------------------------------------ | -------------- | -------------------- | ---------------------------- |
| `list`    | `GET /vehicles`                      | all            | query params         | `PaginatedResponse<Vehicle>` |
| `get`     | `GET /vehicles/{vehicleId}`          | all            | —                    | `Vehicle`                    |
| `create`  | `POST /vehicles`                     | OWNER, MANAGER | `CreateVehicleInput` | `Vehicle` (201)              |
| `update`  | `PATCH /vehicles/{vehicleId}`        | OWNER, MANAGER | `UpdateVehicleInput` | `Vehicle`                    |
| `archive` | `POST /vehicles/{vehicleId}/archive` | OWNER, MANAGER | —                    | `Vehicle`                    |

**Create body**: `{ plateNumber, description?, status? }` plus optional association fields
per OpenAPI.

**Vehicle `status`**: `AVAILABLE` | `IN_USE` | `MAINTENANCE` | `INACTIVE`

## Error contract

Uses normalized envelope errors from `lib/axios.ts`:

| HTTP | `error.code`         | Frontend handling                             |
| ---- | -------------------- | --------------------------------------------- |
| 400  | `VALIDATION_ERROR`   | Map `details[]` to form fields; summary toast |
| 401  | `UNAUTHENTICATED`    | Session refresh / logout (Spec 002)           |
| 403  | `FORBIDDEN`          | Hidden action or `/403`                       |
| 404  | `RESOURCE_NOT_FOUND` | Detail not-found state                        |
| 409  | `LIFECYCLE_CONFLICT` | Toast (e.g., archive twice); refresh list     |
| 5xx  | —                    | Retryable error state                         |

## TanStack Query keys

| Key pattern                      | Invalidated by               |
| -------------------------------- | ---------------------------- |
| `['branches', 'list', params]`   | create/update/archive branch |
| `['branches', 'detail', id]`     | update/archive branch        |
| `['branches', 'picker']`         | create/update/archive branch |
| `['warehouses', 'list', params]` | warehouse mutations          |
| `['warehouses', 'detail', id]`   | warehouse mutations          |
| `['vehicles', 'list', params]`   | vehicle mutations            |
| `['vehicles', 'detail', id]`     | vehicle mutations            |

Logout clears all keys via `queryClient.clear()` (Spec 002 tenant isolation).

## Permission keys (`constants/permissions.ts`)

| Module    | Keys                                                                          |
| --------- | ----------------------------------------------------------------------------- |
| Branch    | `branch.view`, `branch.create`, `branch.update`, `branch.archive`             |
| Warehouse | `warehouse.view`, `warehouse.create`, `warehouse.update`, `warehouse.archive` |
| Vehicle   | `vehicle.view`, `vehicle.create`, `vehicle.update`, `vehicle.archive`         |

Keys are opaque identifiers for guards/gates — not authorization rules.
