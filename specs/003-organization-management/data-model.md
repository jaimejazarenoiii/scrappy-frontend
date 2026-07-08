# Phase 1 Data Model: Organization Management

Frontend-facing models consumed from Backend P002. Field names follow the Scrappy API
reference and MUST be reconciled with the published OpenAPI schema at `GET /docs`. Types
live in each feature's `types/`; list query types reuse `src/types/pagination.types.ts`.

## Shared Conventions

- All responses use the API envelope: `{ success, data, meta, error }`.
- Paginated lists: `data` is `T[]`; `meta` contains `{ page, limit, total, totalPages }`.
- `unwrapList()` maps `meta.limit` → internal `pageSize`.
- Tenant scoping is implicit via JWT; no `companyId` query param on lists.
- Timestamps are ISO 8601 strings.

## Branch — `features/branches/types/branch.types.ts`

| Field           | Type                     | Notes                       |
| --------------- | ------------------------ | --------------------------- |
| `id`            | `string`                 | UUID                        |
| `companyId`     | `string`                 | Owning company (from token) |
| `name`          | `string`                 | Required; display name      |
| `address`       | `string \| null`         | Physical address            |
| `contactNumber` | `string \| null`         | Contact phone               |
| `status`        | `'ACTIVE' \| 'INACTIVE'` | Operational status          |
| `createdAt`     | `string`                 | ISO timestamp               |
| `updatedAt`     | `string`                 | ISO timestamp               |
| `deletedAt`     | `string \| null`         | Non-null = archived         |

### CreateBranchInput

| Field           | Type                     | Required |
| --------------- | ------------------------ | -------- |
| `name`          | `string`                 | Yes      |
| `address`       | `string`                 | No       |
| `contactNumber` | `string`                 | No       |
| `status`        | `'ACTIVE' \| 'INACTIVE'` | No       |

### UpdateBranchInput

`Partial<CreateBranchInput>` — sent via `PATCH`.

### List query params (API)

Maps from `ListQueryParams` via `toQueryParams`:

| API param   | Source                  |
| ----------- | ----------------------- |
| `page`      | `params.page`           |
| `limit`     | `params.pageSize`       |
| `search`    | `params.search`         |
| `sortBy`    | `params.sort.field`     |
| `sortOrder` | `params.sort.direction` |
| `status`    | `params.filters.status` |

Allowed `sortBy`: `name`, `createdAt`, `status`.

## Warehouse — `features/warehouses/types/warehouse.types.ts`

Mirrors branch shape. Additional optional fields if OpenAPI provides them:

| Field      | Type             | Notes                    |
| ---------- | ---------------- | ------------------------ |
| `branchId` | `string \| null` | Assigned branch (if API) |
| `branch`   | `BranchSummary`  | Expanded embed (if API)  |

`BranchSummary`: `{ id, name }` — display-only when nested.

Create/update inputs mirror branch fields plus optional `branchId`.

List query params: same as branches.

## Vehicle — `features/vehicles/types/vehicle.types.ts`

| Field         | Type                                                     | Notes              |
| ------------- | -------------------------------------------------------- | ------------------ |
| `id`          | `string`                                                 | UUID               |
| `companyId`   | `string`                                                 | Owning company     |
| `plateNumber` | `string`                                                 | Required; unique   |
| `description` | `string \| null`                                         | Free text          |
| `vehicleType` | `string \| null`                                         | If API provides    |
| `status`      | `'AVAILABLE' \| 'IN_USE' \| 'MAINTENANCE' \| 'INACTIVE'` | Operational status |
| `branchId`    | `string \| null`                                         | If API provides    |
| `warehouseId` | `string \| null`                                         | If API provides    |
| `createdAt`   | `string`                                                 |                    |
| `updatedAt`   | `string`                                                 |                    |
| `deletedAt`   | `string \| null`                                         | Archived           |

### CreateVehicleInput

| Field         | Type           | Required |
| ------------- | -------------- | -------- |
| `plateNumber` | `string`       | Yes      |
| `description` | `string`       | No       |
| `status`      | Vehicle status | No       |
| `branchId`    | `string`       | No*      |
| `warehouseId` | `string`       | No*      |
| `vehicleType` | `string`       | No*      |

\*Include only when OpenAPI marks required.

### UpdateVehicleInput

`Partial<CreateVehicleInput>`.

List query params: `page`, `limit`, `search`, `sortBy`, `sortOrder`, `status` (vehicle
operational status if filter supported).

## TanStack Query Keys

| Key                              | Query function              |
| -------------------------------- | --------------------------- |
| `['branches', 'list', params]`   | `BranchService.list`        |
| `['branches', 'detail', id]`     | `BranchService.get`         |
| `['branches', 'picker']`         | Active branches for selects |
| `['warehouses', 'list', params]` | `WarehouseService.list`     |
| `['warehouses', 'detail', id]`   | `WarehouseService.get`      |
| `['vehicles', 'list', params]`   | `VehicleService.list`       |
| `['vehicles', 'detail', id]`     | `VehicleService.get`        |

Mutations invalidate `['branches'|'warehouses'|'vehicles']` list keys and update detail
cache on success. Archive mutations may optimistically set `deletedAt` with rollback on
error. All keys cleared on logout (existing `queryClient.clear()`).

## Validation Schemas (Zod)

| Schema            | File                                                 | Rules summary                                       |
| ----------------- | ---------------------------------------------------- | --------------------------------------------------- |
| `branchSchema`    | `features/branches/validation/branch.schema.ts`      | `name` required max 160; optional address/contact   |
| `warehouseSchema` | `features/warehouses/validation/warehouse.schema.ts` | Same as branch + optional `branchId`                |
| `vehicleSchema`   | `features/vehicles/validation/vehicle.schema.ts`     | `plateNumber` required; optional description/status |

## State Transitions

```text
Branch/Warehouse status: ACTIVE <-> INACTIVE (via PATCH)
Archive: ACTIVE/INACTIVE -> archived (deletedAt set, POST /archive)
Archived: read-only; excluded from default list

Vehicle status: AVAILABLE | IN_USE | MAINTENANCE | INACTIVE (via PATCH)
Archive: same soft-delete pattern as branch
```

No frontend state machine library — transitions occur via API mutations only.

## Relationships (display only)

```text
Company (tenant) 1--* Branch
Branch 1--* Warehouse   (when branchId present on warehouse)
Branch 1--* Vehicle     (when branchId present on vehicle)
Warehouse 1--* Vehicle  (when warehouseId present on vehicle)
```

Rendered on detail pages from API payload; not computed client-side.
