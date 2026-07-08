---
description: 'Task list for Organization Management (Specification 003)'
---

# Tasks: Organization Management

**Input**: Design documents from `specs/003-organization-management/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Not requested in the specification — no automated test tasks are included.
Validation is via quickstart scenarios plus `pnpm typecheck`, `pnpm lint`, and `pnpm build`.

**Organization**: Tasks are grouped by user story (US1–US4) to enable independent
implementation and testing. Builds strictly on Specifications 001–002; all edits to existing
files are additive (marked EXTEND) and MUST NOT refactor the foundation.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: US1–US4 (user story phase tasks only)
- Exact file paths are included in every task

## Path Conventions

Feature-based paths at repository root: feature code in `src/features/<feature>/`, shared UI
in `src/components/ui/` and `src/components/common/`, cross-cutting wiring in `src/app/`,
`src/lib/`, `src/constants/`. Server lists use `unwrapList()` + `toQueryParams()` from
`src/lib/api-envelope.ts` and `src/lib/list-params.ts` (Spec 002 envelope pattern).

---

## Phase 1: Setup (Shared Scaffolding)

**Purpose**: Prepare organization feature module folders and extend shared constants. The
project and auth/RBAC infrastructure were delivered in Specifications 001–002.

- [x] T001 Scaffold feature module folders (`components/`, `hooks/`, `pages/`, `services/`, `validation/`, `types/`) for `src/features/branches/`, `src/features/warehouses/`, and `src/features/vehicles/`
- [x] T002 [P] EXTEND route path constants (`branches`, `branchNew`, `branchDetail`, `branchEdit`, `warehouses`, `warehouseNew`, `warehouseDetail`, `warehouseEdit`, `vehicles`, `vehicleNew`, `vehicleDetail`, `vehicleEdit`) and `buildRoute` helpers in `src/constants/routes.ts`
- [x] T003 [P] EXTEND permission key constants (`branch.*`, `warehouse.*`, `vehicle.*`) and `PermissionKey` union in `src/constants/permissions.ts`
- [x] T004 [P] Create shared org archive helper `isOrgEntityArchived(deletedAt)` in `src/features/branches/lib/org-status.ts` (re-exported by warehouse/vehicle features for badge tone mapping)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Permission wiring, navigation, and route infrastructure for all organization
modules (US4). MUST complete before user story implementation.

**⚠️ CRITICAL**: No branch/warehouse/vehicle feature work can begin until this phase is complete.

- [x] T005 EXTEND `permissionsForRole()` in `src/features/auth/lib/session.ts` to grant OWNER all org permissions, MANAGER view+create+update+archive, EMPLOYEE view-only for `branch.*`, `warehouse.*`, `vehicle.*` (depends on T003)
- [x] T006 EXTEND navigation config with permission-gated Branches (`MapPin`), Warehouses (`Warehouse`), and Vehicles (`Truck`) entries in `src/constants/navigation.ts` (depends on T002, T003)
- [x] T007 Verify `Sidebar` filters new navigation items via existing `usePermissions().hasAny()` in `src/components/common/Sidebar.tsx` (depends on T006; no code change expected if `anyOf` pattern matches Spec 002)
- [x] T008 EXTEND router with lazy import declarations for all 12 organization pages in `src/app/router/routes.tsx` (imports only; route elements wired per story in T022, T034, T043)
- [x] T009 EXTEND `PermissionGuard` route groups for organization paths per `specs/003-organization-management/contracts/routes-and-guards.md` in `src/app/router/routes.tsx` (depends on T008; pages can 404 until story phases complete)

**Checkpoint**: Navigation visible per role; guarded routes redirect to `/403` without permission; org feature folders exist.

---

## Phase 3: User Story 1 - Manage Branches (Priority: P1) 🎯 MVP

**Goal**: List, search, filter, sort, paginate, view, create, edit, and archive branches
with full UI states and permission-gated actions.

**Independent Test**: Load `/branches` with server pagination, search/filter by status, view
branch detail, create and edit via validated forms, archive with confirmation — on desktop
and mobile. See quickstart §2.

### Implementation for User Story 1

- [x] T010 [P] [US1] Create branch types (`Branch`, `CreateBranchInput`, `UpdateBranchInput`, `BranchStatus`) in `src/features/branches/types/branch.types.ts`
- [x] T011 [P] [US1] Create branch Zod schema (`name` required; optional `address`, `contactNumber`, `status`) in `src/features/branches/validation/branch.schema.ts`
- [x] T012 [US1] Implement `BranchService` (`list` with `unwrapList` + `toQueryParams`, `get`, `create`, `update`, `archive`) and `BRANCH_ENDPOINTS` in `src/features/branches/services/branch.service.ts` (depends on T010)
- [x] T013 [US1] Implement branch query keys and `useBranches(params)` with `keepPreviousData` in `src/features/branches/hooks/useBranches.ts` (depends on T012)
- [x] T014 [US1] Implement `useBranch(id)` detail hook in `src/features/branches/hooks/useBranch.ts` (depends on T012)
- [x] T015 [US1] Implement `useCreateBranch`, `useUpdateBranch`, `useArchiveBranch` mutations (archive: optimistic `deletedAt` + rollback, toast, invalidation) in `src/features/branches/hooks/useBranchMutations.ts` (depends on T012, T013)
- [x] T016 [P] [US1] Implement `useBranchOptions()` hook (active branches for `<Select>` pickers) in `src/features/branches/hooks/useBranchOptions.ts` (depends on T012)
- [x] T017 [P] [US1] Build `BranchForm` (React Hook Form + Zod, status select ACTIVE/INACTIVE, disabled-while-pending) in `src/features/branches/components/BranchForm.tsx` (depends on T011)
- [x] T018 [US1] Build `BranchesListPage` (PageHeader, FilterBar search + status filter, DataTable + `renderMobileCard`, Pagination, `useListQuery`, loading/empty/error states, permission-gated "New branch") in `src/features/branches/pages/BranchesListPage.tsx` (depends on T013, T017)
- [x] T019 [US1] Build `BranchDetailPage` (DescriptionList: name, address, contact, status, companyId; StatusBadge; edit/archive actions behind `PermissionGate`; ConfirmDialog for archive) in `src/features/branches/pages/BranchDetailPage.tsx` (depends on T014, T015)
- [x] T020 [US1] Build `BranchCreatePage` (Card-wrapped `BranchForm`, redirect to detail on success) in `src/features/branches/pages/BranchCreatePage.tsx` (depends on T015, T017)
- [x] T021 [US1] Build `BranchEditPage` (fetch branch, populate form, PATCH on submit, redirect to detail) in `src/features/branches/pages/BranchEditPage.tsx` (depends on T014, T015, T017)
- [x] T022 [US1] Wire branch lazy routes (`/branches`, `/branches/new`, `/branches/:id`, `/branches/:id/edit`) with `PermissionGuard` in `src/app/router/routes.tsx` (depends on T018, T019, T020, T021, T009)

**Checkpoint**: US1 fully functional — branch CRUD + archive under RBAC. MVP deliverable.

---

## Phase 4: User Story 4 - Navigate Organization Modules Securely (Priority: P1)

**Goal**: Organization menu items and routes work correctly with permission gating and deep
linking (validates US4 acceptance scenarios alongside US1).

**Independent Test**: Sign in as owner/manager/employee; confirm nav visibility; direct URL
access; browser back/forward; list URL state preserved via `useListQuery`. See quickstart §1.

### Implementation for User Story 4

- [x] T023 [US4] Verify branch routes render inside `DashboardLayout` with global breadcrumb (no redundant `breadcrumbs` prop on `PageHeader`) across `src/features/branches/pages/*.tsx`
- [x] T024 [US4] Manual RBAC matrix check: owner sees all org nav + actions; employee sees view-only (no create/edit/archive buttons) — document results in `specs/003-organization-management/quickstart.md` Notes if gaps found
- [x] T025 [US4] Verify deep-link list state (`?q=`, `page`, `sort`, status filter) on `BranchesListPage` via `useListQuery` in `src/features/branches/pages/BranchesListPage.tsx`

**Checkpoint**: US1 + US4 navigation/security criteria met for branches (warehouses/vehicles extend in US2/US3).

---

## Phase 5: User Story 2 - Manage Warehouses (Priority: P2)

**Goal**: List, search, filter, sort, paginate, view, create, edit, and archive warehouses;
display backend-provided branch association when present.

**Independent Test**: Full warehouse CRUD workflow with UI states; optional `branchId` on
form/detail per OpenAPI. See quickstart §3.

### Implementation for User Story 2

- [x] T026 [P] [US2] Create warehouse types (`Warehouse`, `CreateWarehouseInput`, `UpdateWarehouseInput`, optional `branchId`/`branch` embed) in `src/features/warehouses/types/warehouse.types.ts`
- [x] T027 [P] [US2] Create warehouse Zod schema (mirror branch fields + optional `branchId` if OpenAPI requires) in `src/features/warehouses/validation/warehouse.schema.ts`
- [x] T028 [US2] Implement `WarehouseService` (`list`, `get`, `create`, `update`, `archive`) with envelope unwrap in `src/features/warehouses/services/warehouse.service.ts` (depends on T026)
- [x] T029 [US2] Implement `useWarehouses`, `useWarehouse`, and mutation hooks in `src/features/warehouses/hooks/useWarehouses.ts`, `useWarehouse.ts`, `useWarehouseMutations.ts` (depends on T028)
- [x] T030 [P] [US2] Build `WarehouseForm` (RHF + Zod; optional branch `<Select>` from `useBranchOptions()` when `branchId` in contract) in `src/features/warehouses/components/WarehouseForm.tsx` (depends on T027, T016)
- [x] T031 [US2] Build `WarehousesListPage` (same list pattern as branches; warehouse-specific empty state copy) in `src/features/warehouses/pages/WarehousesListPage.tsx` (depends on T029, T030)
- [x] T032 [US2] Build `WarehouseDetailPage` (show branch association from API payload only; no client-side joins) in `src/features/warehouses/pages/WarehouseDetailPage.tsx` (depends on T029)
- [x] T033 [US2] Build `WarehouseCreatePage` and `WarehouseEditPage` in `src/features/warehouses/pages/WarehouseCreatePage.tsx` and `WarehouseEditPage.tsx` (depends on T029, T030)
- [x] T034 [US2] Wire warehouse lazy routes with `PermissionGuard` in `src/app/router/routes.tsx` (depends on T031, T032, T033, T009)

**Checkpoint**: US1 + US2 functional — warehouses independently testable.

---

## Phase 6: User Story 3 - Manage Vehicles (Priority: P3)

**Goal**: List, search, filter, sort, paginate, view, create, edit, and archive vehicles with
operational status and optional associations per backend.

**Independent Test**: Full vehicle CRUD; plate number required; status enum
AVAILABLE/IN_USE/MAINTENANCE/INACTIVE; archive flow. See quickstart §4.

### Implementation for User Story 3

- [x] T035 [P] [US3] Create vehicle types (`Vehicle`, `VehicleStatus`, `CreateVehicleInput`, `UpdateVehicleInput`, optional `branchId`, `warehouseId`, `vehicleType`) in `src/features/vehicles/types/vehicle.types.ts`
- [x] T036 [P] [US3] Create vehicle Zod schema (`plateNumber` required; optional description, status, associations) in `src/features/vehicles/validation/vehicle.schema.ts`
- [x] T037 [US3] Implement `VehicleService` (`list`, `get`, `create`, `update`, `archive`) in `src/features/vehicles/services/vehicle.service.ts` (depends on T035)
- [x] T038 [US3] Implement `useVehicles`, `useVehicle`, and mutation hooks in `src/features/vehicles/hooks/useVehicles.ts`, `useVehicle.ts`, `useVehicleMutations.ts` (depends on T037)
- [x] T039 [P] [US3] Build `VehicleForm` (RHF + Zod; status select; optional branch/warehouse pickers from `useBranchOptions()` and warehouse list hook if OpenAPI defines associations) in `src/features/vehicles/components/VehicleForm.tsx` (depends on T036, T016, T029)
- [x] T040 [US3] Build `VehiclesListPage` (plate number column; vehicle-specific StatusBadge tones) in `src/features/vehicles/pages/VehiclesListPage.tsx` (depends on T038, T039)
- [x] T041 [US3] Build `VehicleDetailPage` (plate, description, status, associations from API only) in `src/features/vehicles/pages/VehicleDetailPage.tsx` (depends on T038)
- [x] T042 [US3] Build `VehicleCreatePage` and `VehicleEditPage` in `src/features/vehicles/pages/VehicleCreatePage.tsx` and `VehicleEditPage.tsx` (depends on T038, T039)
- [x] T043 [US3] Wire vehicle lazy routes with `PermissionGuard` in `src/app/router/routes.tsx` (depends on T040, T041, T042, T009)

**Checkpoint**: All user stories (US1–US4) functional for all three organization modules.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Production-quality pass and Specification 004 readiness.

- [x] T044 [P] Responsive verification of all 12 organization screens at 320px, 768px, 1280px+, and 1536px+ (tables → cards on mobile)
- [x] T045 [P] Light/dark/system theme verification across all organization list, detail, and form pages
- [x] T046 [P] Accessibility audit (labeled forms, keyboard nav, accessible tables/dialogs, focus management, 44×44 touch targets) across organization modules
- [x] T047 [P] Verify loading (skeleton), empty ("no data" vs "no results"), success, and error states on every organization list, detail, and form
- [x] T048 [P] Verify relationship fields on warehouse/vehicle detail and forms render only from API data (FR-020, FR-021) — no client-side relationship logic
- [x] T049 [P] Toast + `ConfirmDialog` consistency for all archive actions across branches, warehouses, vehicles
- [x] T050 [P] Map API `error.details[]` to form fields on 400 validation errors in all three `*Form.tsx` components
- [x] T051 [P] Design-system audit — no duplicate UI primitives; reuse `components/ui/` and `components/common/` only
- [x] T052 Performance review — lazy routes, `keepPreviousData` on lists, optimistic archive rollback, no unnecessary re-renders
- [x] T053 Security review — no secrets, no raw backend exception messages, permission gates on all mutating actions
- [x] T054 Run `pnpm typecheck`, `pnpm lint`, and `pnpm build` — all must complete with zero errors
- [x] T055 Execute `specs/003-organization-management/quickstart.md` validation scenarios (US1–US4) against a running Backend P002 instance
- [x] T056 Verify the Specification 004 Readiness Checklist in `specs/003-organization-management/plan.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately.
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational — MVP slice.
- **User Story 4 (Phase 4)**: Depends on US1 branch routes existing; validates nav/security.
- **User Story 2 (Phase 5)**: Depends on Foundational; `useBranchOptions` from US1 helps forms.
- **User Story 3 (Phase 6)**: Depends on Foundational; branch/warehouse pickers optional.
- **Polish (Phase 7)**: Depends on Phases 3, 5, and 6 (and Phase 4 validation).

### User Story Dependencies

| Story               | Depends on                   | Independent test             |
| ------------------- | ---------------------------- | ---------------------------- |
| US1 Branches (P1)   | Phase 2                      | `/branches` CRUD + archive   |
| US4 Navigation (P1) | US1 routes                   | Nav visibility + deep links  |
| US2 Warehouses (P2) | Phase 2; US1 recommended     | `/warehouses` CRUD + archive |
| US3 Vehicles (P3)   | Phase 2; US1–US2 recommended | `/vehicles` CRUD + archive   |

US2 and US3 can proceed **in parallel** after Phase 2 (and after US1 if using branch picker).

### Within Each User Story

1. Types + Zod schema (parallel)
2. Service (envelope unwrap)
3. Hooks (query keys, mutations)
4. Form component
5. List → Detail → Create → Edit pages
6. Router registration

### Parallel Opportunities

- **Phase 1**: T002, T003, T004 in parallel after T001
- **Phase 3 US1**: T010, T011, T016, T017 in parallel; then service chain; pages sequential
- **Phase 5 US2** and **Phase 6 US3**: entire phases in parallel after US1 completes (if staffed)
- **Phase 7**: All tasks marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Types and validation in parallel:
T010: src/features/branches/types/branch.types.ts
T011: src/features/branches/validation/branch.schema.ts

# After service (T012), hooks and form in parallel:
T016: src/features/branches/hooks/useBranchOptions.ts
T017: src/features/branches/components/BranchForm.tsx
```

---

## Parallel Example: User Stories 2 & 3

```bash
# After Phase 2 completes, two developers can work in parallel:
Developer A: Phase 5 (T026–T034) — Warehouses
Developer B: Phase 6 (T035–T043) — Vehicles
# Both reuse useBranchOptions from US1 when association fields are confirmed
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (Branches)
4. Complete Phase 4: US4 validation for branches
5. **STOP and VALIDATE** — demo branch management to stakeholders

### Incremental Delivery

1. Setup + Foundational → org infrastructure ready
2. US1 Branches → MVP
3. US2 Warehouses → extend org module
4. US3 Vehicles → complete Backend P002
5. Polish → Spec 004 ready

### Parallel Team Strategy

| Developer | Focus                                    |
| --------- | ---------------------------------------- |
| A         | Phase 3 US1 (Branches) — critical path   |
| B         | Phase 5 US2 (Warehouses) — after Phase 2 |
| C         | Phase 6 US3 (Vehicles) — after Phase 2   |

---

## Notes

- All list services MUST use server pagination (`unwrapList` + `toQueryParams`) — do not
  copy the client-side pagination pattern from `EmployeeService.list`.
- Archive uses `POST /{entity}/{id}/archive`, not PATCH.
- Status ACTIVE/INACTIVE is edited via forms; vehicles add operational status enum separate
  from archive (`deletedAt`).
- Optional `branchId` / `warehouseId` / `vehicleType` fields: include only when confirmed
  in OpenAPI at `GET /docs`; detail pages always render whatever the API returns.
- Do not introduce Workforce, Transaction, Trip, or Expense code — out of scope for Spec 003.
