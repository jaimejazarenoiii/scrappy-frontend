# Phase 0 Research: Organization Management

All decisions comply with the Scrappy Constitution, Specification 003, and reuse the
Specification 001/002 foundations. No new dependencies are introduced.

## R-001 — Feature module pattern (clone Employees, not reinvent)

- **Decision**: Implement each organization entity (`branches`, `warehouses`, `vehicles`) as
  an independent feature folder under `src/features/` mirroring the proven Employees module
  structure: `types/`, `services/`, `validation/`, `hooks/`, `components/`, `pages/`.
  Reuse `DataTable`, `FilterBar`, `Pagination`, `useListQuery`, `PageHeader`,
  `PageContainer`, `ConfirmDialog`, `DescriptionList`, `StatusBadge`, and form patterns
  from Specification 002 without modifying their public APIs.
- **Rationale**: Constitution III/XVIII; minimizes risk and avoids architectural drift;
  Employees demonstrates the full CRUD + archive + permission-gated UX end-to-end.
- **Alternatives considered**: Generic "organization entity" abstraction (rejected —
  over-engineering for three similar but distinct domains); monolithic `organization/`
  feature (rejected — violates feature ownership and parallel development).

## R-002 — Server-driven pagination (P002 lists differ from Employees)

- **Decision**: Branches, warehouses, and vehicles list endpoints are **server-paginated**
  (`GET /branches`, `/warehouses`, `/vehicles`) with query params `page`, `limit`,
  `sortBy`, `sortOrder`, `search`, and `status`. Services call `apiClient` with
  `toQueryParams(ListQueryParams)` and unwrap via `unwrapList()` from `lib/api-envelope.ts`
  into the internal `PaginatedResponse<T>` shape. TanStack Query keys include full
  `ListQueryParams` for cache correctness.
- **Rationale**: Matches the Scrappy API reference (Backend P002); unlike Employees (which
  currently returns a non-paginated array), organization lists must not client-paginate large
  datasets.
- **Alternatives considered**: Client-side filter/paginate like current Employees service
  (rejected — wrong for P002 contract); custom pagination hook per module (rejected —
  `useListQuery` already URL-syncs state).

## R-003 — Sort field mapping

- **Decision**: Map `useListQuery` sort `field` to API `sortBy` via `toQueryParams` (already
  maps `sort.field` → `sortBy`, `sort.direction` → `sortOrder`). Default list sorts:
  branches/warehouses — `name:asc`; vehicles — `plateNumber:asc` if supported, else
  `createdAt:desc` per OpenAPI. Reconcile exact `sortBy` enum values during implementation
  against Swagger at `GET /docs`.
- **Rationale**: Keeps URL bookmarkability (Constitution IV) while honoring backend enums.
- **Alternatives considered**: Hardcode sort in services (rejected — breaks URL sync).

## R-004 — Status filter & archive semantics

- **Decision**: Status filter on list pages sends `status=ACTIVE` or `status=INACTIVE` when
  filtering; default list shows active (non-archived) records. Archive uses
  `POST /{entity}/{id}/archive` (soft delete); archived records have non-null `deletedAt`
  and are excluded from default lists. Status changes (ACTIVE/INACTIVE) are edited via
  create/edit forms — no separate activate/deactivate endpoints unless OpenAPI adds them.
  Vehicle operational status uses `AVAILABLE | IN_USE | MAINTENANCE | INACTIVE` (distinct
  from archive).
- **Rationale**: Matches API reference; avoids inventing lifecycle endpoints.
- **Alternatives considered**: Separate activate/deactivate buttons (rejected — not in API);
  hard-delete UI (rejected — backend uses archive only).

## R-005 — Entity relationships (backend-driven only)

- **Decision**: Display `branchId`, `warehouseId`, `vehicleType`, and nested relationship
  arrays only when present on API responses. Form selects for associations (e.g., warehouse
  → branch) populate options from `GET /branches` (and `/warehouses` for vehicle warehouse
  pickers) via TanStack Query — never hardcoded. Detail pages show related entity names
  using IDs returned by the backend or optional expanded objects if the API embeds them;
  do not compute relationships client-side.
- **Rationale**: FR-020/FR-021; prevents drift when backend evolves associations.
- **Alternatives considered**: Client-side join tables (rejected — duplicates business logic).

## R-006 — Permissions extension (additive to Spec 002)

- **Decision**: Add opaque permission key constants in `constants/permissions.ts`:
  `branch.view|create|update|archive`, `warehouse.*`, `vehicle.*`. Extend
  `permissionsForRole()` in `features/auth/lib/session.ts` so OWNER receives all org
  permissions, MANAGER receives view+create+update+archive for org entities, EMPLOYEE
  receives view-only for org modules (aligned with API: all roles can GET lists/details;
  POST/PATCH/archive restricted to OWNER/MANAGER). Route guards use `PermissionGuard`;
  actions use `PermissionGate`.
- **Rationale**: Reuses Spec 002 authorization primitives; keys are data, not rules
  (Constitution RBAC). Replace with backend-provided permission arrays when available.
- **Alternatives considered**: Role checks in components (rejected — hardcodes policy).

## R-007 — API envelope & error handling (reuse Spec 002)

- **Decision**: All P002 service methods use `ApiEnvelope<T>` generics on `apiClient`,
  unwrap with `unwrap` / `unwrapList`, and rely on normalized errors from `lib/axios.ts`.
  Map `error.details[]` to form fields on 400 `VALIDATION_ERROR`; show toast on 409
  `LIFECYCLE_CONFLICT` for double-archive.
- **Rationale**: Already implemented for auth/company/employees; zero new HTTP plumbing.
- **Alternatives considered**: Per-feature axios instances (rejected — violates VIII).

## R-008 — Shared status badge tones

- **Decision**: Reuse `StatusBadge` with tones mapped per entity: branch/warehouse
  ACTIVE→`active`, INACTIVE→`inactive`, archived (`deletedAt`)→`archived`; vehicle
  AVAILABLE→`active`, IN_USE→`neutral`, MAINTENANCE→`inactive`, INACTIVE→`inactive`,
  archived→`archived`.
- **Rationale**: Consistent UX across modules without new components.
- **Alternatives considered**: Per-entity badge components (rejected — duplication).

## R-009 — Branch picker hook (shared across warehouse/vehicle forms)

- **Decision**: Add a lightweight `useBranchOptions()` hook (or `useBranchesPicker`) in
  `features/branches/hooks/` that fetches active branches for `<Select>` options. Warehouses
  and vehicles import this hook only if their create/edit schemas include `branchId` per
  OpenAPI. Keep the hook in the branches feature to avoid a premature shared abstraction.
- **Rationale**: FR-021; single source for branch options; optional until contract confirms
  association fields.
- **Alternatives considered**: Duplicate fetch in each form (rejected — violates DRY within
  reason); global org store (rejected — server state belongs in Query).

## R-010 — OpenAPI reconciliation

- **Decision**: Hand-write types in each feature's `types/` aligned to the Scrappy API
  reference; verify against `GET /docs` Swagger during implementation. If OpenAPI export is
  available, generate types into feature `types/` without restructuring services.
- **Rationale**: Constitution XXVI; service layer isolates contract drift.
- **Alternatives considered**: Implement before contract review (rejected — risks rework).

## Summary of resolved unknowns

All Technical Context items are resolved; no `NEEDS CLARIFICATION` remain. Optional
association fields (`branchId` on warehouse, `branchId`/`warehouseId`/`vehicleType` on
vehicle) are included in types/forms **only when confirmed** in OpenAPI — detail pages
always render whatever the API returns.
