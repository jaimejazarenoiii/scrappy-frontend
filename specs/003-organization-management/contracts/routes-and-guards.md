# Route & Guard Contract: Organization Management

Extends Specification 002 Data Router (`src/app/router/routes.tsx`) additively. All
organization routes render under `AuthGuard` → `DashboardLayout`. Pages are lazy-loaded.

## Route paths (`src/constants/routes.ts` — EXTEND)

| Constant          | Path                   | Guard                                          | Page                  |
| ----------------- | ---------------------- | ---------------------------------------------- | --------------------- |
| `branches`        | `/branches`            | Auth + `PermissionGuard(['branch.view'])`      | `BranchesListPage`    |
| `branchNew`       | `/branches/new`        | Auth + `PermissionGuard(['branch.create'])`    | `BranchCreatePage`    |
| `branchDetail`    | `/branches/:id`        | Auth + `PermissionGuard(['branch.view'])`      | `BranchDetailPage`    |
| `branchEdit`      | `/branches/:id/edit`   | Auth + `PermissionGuard(['branch.update'])`    | `BranchEditPage`      |
| `warehouses`      | `/warehouses`          | Auth + `PermissionGuard(['warehouse.view'])`   | `WarehousesListPage`  |
| `warehouseNew`    | `/warehouses/new`      | Auth + `PermissionGuard(['warehouse.create'])` | `WarehouseCreatePage` |
| `warehouseDetail` | `/warehouses/:id`      | Auth + `PermissionGuard(['warehouse.view'])`   | `WarehouseDetailPage` |
| `warehouseEdit`   | `/warehouses/:id/edit` | Auth + `PermissionGuard(['warehouse.update'])` | `WarehouseEditPage`   |
| `vehicles`        | `/vehicles`            | Auth + `PermissionGuard(['vehicle.view'])`     | `VehiclesListPage`    |
| `vehicleNew`      | `/vehicles/new`        | Auth + `PermissionGuard(['vehicle.create'])`   | `VehicleCreatePage`   |
| `vehicleDetail`   | `/vehicles/:id`        | Auth + `PermissionGuard(['vehicle.view'])`     | `VehicleDetailPage`   |
| `vehicleEdit`     | `/vehicles/:id/edit`   | Auth + `PermissionGuard(['vehicle.update'])`   | `VehicleEditPage`     |

### `buildRoute` helpers (EXTEND)

```text
buildRoute.branchDetail(id)   → /branches/{id}
buildRoute.branchEdit(id)     → /branches/{id}/edit
buildRoute.warehouseDetail(id)
buildRoute.warehouseEdit(id)
buildRoute.vehicleDetail(id)
buildRoute.vehicleEdit(id)
```

## Navigation (`src/constants/navigation.ts` — EXTEND)

Add after Employees (or grouped under Organization):

| id           | label      | href                | icon (Lucide) | `anyOf` permission |
| ------------ | ---------- | ------------------- | ------------- | ------------------ |
| `branches`   | Branches   | `ROUTES.branches`   | `MapPin`      | `branch.view`      |
| `warehouses` | Warehouses | `ROUTES.warehouses` | `Warehouse`   | `warehouse.view`   |
| `vehicles`   | Vehicles   | `ROUTES.vehicles`   | `Truck`       | `vehicle.view`     |

Sidebar filtering uses existing `usePermissions().hasAny()` (Spec 002) — no hardcoded
role checks.

## PermissionGate usage (actions)

| Action            | Permission key      | Location                   |
| ----------------- | ------------------- | -------------------------- |
| New branch        | `branch.create`     | BranchesListPage header    |
| Edit branch       | `branch.update`     | BranchDetailPage, list row |
| Archive branch    | `branch.archive`    | BranchDetailPage           |
| New warehouse     | `warehouse.create`  | WarehousesListPage         |
| Edit warehouse    | `warehouse.update`  | WarehouseDetailPage        |
| Archive warehouse | `warehouse.archive` | WarehouseDetailPage        |
| New vehicle       | `vehicle.create`    | VehiclesListPage           |
| Edit vehicle      | `vehicle.update`    | VehicleDetailPage          |
| Archive vehicle   | `vehicle.archive`   | VehicleDetailPage          |

## AuthGuard / Session

No changes to `AuthGuard` or session bootstrap. Organization routes inherit authenticated,
tenant-scoped session from Specification 002 (`hydrateSession` via `/users/me` +
`/companies/me`).

## Breadcrumbs

`DashboardLayout` global breadcrumb derives from route path segments. Organization pages
do not pass redundant `breadcrumbs` prop to `PageHeader` (Spec 002 convention).

## Deep linking & URL state

List pages use `useListQuery` so `?q=`, `page`, `pageSize`, `sort`, and filter params are
bookmarkable. Navigating away and back restores list state from the URL.
