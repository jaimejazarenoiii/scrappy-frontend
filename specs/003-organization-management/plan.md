# Implementation Plan: Organization Management

**Branch**: `003-organization-management` | **Date**: 2026-07-08 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/003-organization-management/spec.md`

**Note**: Maps to Backend P002. Builds strictly on Specifications 001–002 and MUST NOT
redesign or refactor the existing architecture. Leaves the codebase ready for Specification
004 — Workforce Management (Backend P003) without architectural refactoring.

## Summary

Deliver the frontend for Organization Management: full CRUD + archive workflows for
**branches**, **warehouses**, and **vehicles** with server-driven list controls (search,
filter, sort, pagination), permission-gated routes and navigation, and production-quality
responsive UI.

Technical approach: clone the proven Employees feature pattern (service → hooks → pages →
forms) three times under `src/features/branches`, `warehouses`, and `vehicles`. Reuse all
Specification 001/002 shared infrastructure (`apiClient` + envelope unwrap, `useListQuery`,
`DataTable`, `FilterBar`, `Pagination`, `PermissionGuard`, `PermissionGate`, RHF + Zod).
Extend `constants/routes.ts`, `constants/navigation.ts`, and `constants/permissions.ts`
additively. No new npm dependencies.

Design reference: **UI UX Pro Max** — Linear/GitHub/Vercel/Stripe-quality enterprise SaaS;
mobile-first, dark-mode compatible, accessible.

## Technical Context

**Language/Version**: TypeScript (Strict Mode) on React 19+ with Vite

**Primary Dependencies**: React Router (Data Router), TanStack Query, Axios, Zustand,
React Hook Form, Zod, Tailwind CSS v4, Lucide React, TanStack Table, Sonner (all installed;
no new dependencies)

**Storage**: N/A (frontend only; persistence via Backend P002 REST API at `/api/v1`)

**Testing**: Manual quickstart validation + `pnpm typecheck`, `pnpm lint`, `pnpm build`

**Target Platform**: Modern browsers (mobile-first: 320px–1536px+)

**Project Type**: Administrative web application (Scrappy frontend)

**Performance Goals**: Lazy-loaded organization routes; TanStack Query caching with
`keepPreviousData` on lists; optimistic archive with rollback; no unnecessary re-renders

**Constraints**: No Axios in components; no server state in Zustand; no `any`; no hardcoded
RBAC rules; no refactoring of Spec 001/002 foundations; out-of-scope modules (workforce,
transactions, trips, etc.) MUST NOT be introduced

**Scale/Scope**: Branches, Warehouses, Vehicles only — Backend P002

## Constitution Check

_GATE: Passed before Phase 0. Re-checked after Phase 1 design — all gates satisfied._

| Gate                                             | Status  | Notes                                                                                    |
| ------------------------------------------------ | ------- | ---------------------------------------------------------------------------------------- |
| API First (I, VIII)                              | ✅ Pass | `features/*/services/*.service.ts` over `apiClient`; envelope via `unwrap`/`unwrapList`  |
| Type Safety (II, IX)                             | ✅ Pass | Strict TS; Zod per form; types in feature `types/` verified against OpenAPI              |
| Feature Architecture (III, XVII, XVIII)          | ✅ Pass | `src/features/{branches,warehouses,vehicles}` with `@/` imports                          |
| Routing (IV, V)                                  | ✅ Pass | `createBrowserRouter` extended; 12 lazy org routes under `AuthGuard` + `PermissionGuard` |
| State (VII)                                      | ✅ Pass | TanStack Query for all server state; Zustand unchanged (auth/UI only)                    |
| UI & Styling (VI, X, XI, XII, XXIX–XXXIV, XXXIX) | ✅ Pass | Reuse `components/ui/` + `components/common/`; skeletons, empty/error states             |
| Auth & Security (XIV, XX)                        | ✅ Pass | Existing JWT session; permission guards; no secrets                                      |
| Accessibility (XV, XL)                           | ✅ Pass | Labeled forms, keyboard nav, accessible tables/dialogs, 44×44 touch targets              |
| Responsive Design (XXVII, XXXI)                  | ✅ Pass | Mobile card mode via `DataTable.renderMobileCard`; responsive forms                      |
| Page & Table Standards (XXXII, XXXVI)            | ✅ Pass | PageHeader/PageContainer/DataTable/FilterBar/Pagination pattern per Employees            |
| Forms & Dashboards (XXXVII, XXXVIII)             | ✅ Pass | RHF + Zod; inline validation; disabled-while-pending                                     |
| AI UI Standards (XXVIII, XL)                     | ✅ Pass | Reuse-first; no duplicate primitives; production checklist per screen                    |
| Performance (XVI, XXXV)                          | ✅ Pass | Lazy routes; `keepPreviousData`; archive optimistic updates                              |
| API Contract (XXVI)                              | ✅ Pass | Types reconciled with P002 OpenAPI / Scrappy API reference                               |
| Documentation (XXII)                             | ✅ Pass | Spec + plan artifacts document API deps, UI states, validation, errors                   |

No violations. Complexity Tracking not required.

## Project Structure

### Documentation (this feature)

```text
specs/003-organization-management/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── api-endpoints.md
│   └── routes-and-guards.md
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created here)
```

### Source Code (repository root)

New paths only. **Existing files are extended additively.**

```text
src/
├── app/
│   └── router/
│       └── routes.tsx                    # EXTEND: 12 org routes (lazy)
│
├── constants/
│   ├── routes.ts                         # EXTEND: branch/warehouse/vehicle paths + buildRoute
│   ├── navigation.ts                     # EXTEND: 3 nav items (permission-gated)
│   └── permissions.ts                    # EXTEND: branch/warehouse/vehicle keys
│
├── features/
│   ├── auth/
│   │   └── lib/session.ts                # EXTEND: org permissions in ROLE_PERMISSIONS
│   ├── branches/
│   │   ├── components/BranchForm.tsx
│   │   ├── hooks/
│   │   │   ├── useBranches.ts
│   │   │   ├── useBranch.ts
│   │   │   ├── useBranchMutations.ts
│   │   │   └── useBranchOptions.ts       # picker for warehouse/vehicle forms
│   │   ├── pages/
│   │   │   ├── BranchesListPage.tsx
│   │   │   ├── BranchDetailPage.tsx
│   │   │   ├── BranchCreatePage.tsx
│   │   │   └── BranchEditPage.tsx
│   │   ├── services/branch.service.ts
│   │   ├── validation/branch.schema.ts
│   │   └── types/branch.types.ts
│   ├── warehouses/
│   │   ├── components/WarehouseForm.tsx
│   │   ├── hooks/{useWarehouses,useWarehouse,useWarehouseMutations}.ts
│   │   ├── pages/{WarehousesList,Detail,Create,Edit}Page.tsx
│   │   ├── services/warehouse.service.ts
│   │   ├── validation/warehouse.schema.ts
│   │   └── types/warehouse.types.ts
│   └── vehicles/
│       ├── components/VehicleForm.tsx
│       ├── hooks/{useVehicles,useVehicle,useVehicleMutations}.ts
│       ├── pages/{VehiclesList,Detail,Create,Edit}Page.tsx
│       ├── services/vehicle.service.ts
│       ├── validation/vehicle.schema.ts
│       └── types/vehicle.types.ts
```

**Structure Decision**: Three parallel feature modules per Constitution Principle III.
Each owns its CRUD surface. Branch picker hook lives in `branches/` and is imported by
warehouse/vehicle forms only when association fields are confirmed in OpenAPI. No shared
"organization" abstraction layer.

## Implementation Phases

### Phase 0 — Research & Contract Reconciliation

- **Objective**: Resolve technical decisions and align to Backend P002 API contract.
- **Scope**: Pagination strategy; sort/filter mapping; archive semantics; permission keys;
  relationship field handling; OpenAPI verification plan.
- **Tasks**: Produce `research.md`; draft `contracts/`; define `data-model.md`; write
  `quickstart.md` validation scenarios.
- **Deliverables**: `research.md`, `data-model.md`, `contracts/*`, `quickstart.md`.
- **Dependencies**: Specification 003 approved.
- **Validation**: No unresolved NEEDS CLARIFICATION; decisions traceable to constitution.
- **Risks**: OpenAPI drift on optional association fields → mitigate with conditional form
  fields and display-only rendering from API payload.
- **Exit Criteria**: Design artifacts complete; Constitution re-check passes.

### Phase 1 — Foundation Wiring (Routes, Permissions, Navigation)

- **Objective**: Wire organization module entry points before feature pages ship.
- **Scope**: Extend `ROUTES` + `buildRoute`; extend `PERMISSIONS` with branch/warehouse/
  vehicle keys; extend `permissionsForRole()` in `session.ts`; extend `navigation.ts` with
  three items (Lucide: `MapPin`, `Warehouse`, `Truck`); register lazy route placeholders or
  full pages as they land.
- **Tasks**:
  - Add route constants and `buildRoute` helpers
  - Add permission key constants and role mapping
  - Add navigation items with `anyOf` permission arrays
  - Extend `routes.tsx` with `PermissionGuard`-wrapped organization route groups
- **Deliverables**: Updated `constants/*`, `session.ts`, `routes.tsx` (routes may 404 until
  Phase 2–4 pages exist).
- **Dependencies**: Phase 0.
- **Validation**: Typecheck passes; nav items hidden/shown per role; guarded routes redirect
  to `/403` without permission.
- **Risks**: Permission key mismatch with backend → reconcile against OpenAPI during
  implementation; keys are opaque strings only.
- **Exit Criteria**: FR-017, FR-018, FR-019 infrastructure ready; FR-022/FR-023 permission
  wiring extended.

**Parallelizable**: None (blocks Phases 2–4).

### Phase 2 — Branch Management (US1)

- **Objective**: Complete branch CRUD + archive + list controls.
- **Scope**: `branch.types.ts`, `branch.service.ts` (list/get/create/update/archive with
  envelope unwrap), `branch.schema.ts`, hooks (`useBranches`, `useBranch`, mutations),
  `BranchForm`, pages (list/detail/create/edit), archive `ConfirmDialog`, optimistic
  archive rollback.
- **Tasks**:
  - Implement service with server pagination via `toQueryParams` + `unwrapList`
  - List page: `useListQuery`, `FilterBar` (search + status), `DataTable` + mobile cards,
    `Pagination`, empty/error states
  - Detail page: `DescriptionList`, status badge, edit/archive actions (`PermissionGate`)
  - Create/edit pages: `BranchForm` (RHF + Zod), redirect on success
  - Archive mutation with confirmation + toast
- **Deliverables**: `/branches`, `/branches/new`, `/branches/:id`, `/branches/:id/edit`.
- **Dependencies**: Phase 1.
- **Validation**: US1 acceptance scenarios 1–7; quickstart §2.
- **Risks**: Sort field enum mismatch → verify against Swagger `sortBy` values.
- **Exit Criteria**: FR-001–FR-006 met; branch module demoable as MVP.

**Parallelizable**: After Phase 1, can overlap with Phase 3 start once branch service
patterns are established (developer B on warehouses while developer A finishes branch polish).

### Phase 3 — Warehouse Management (US2)

- **Objective**: Complete warehouse CRUD + archive + list controls.
- **Scope**: Mirror Phase 2 structure under `features/warehouses/`. Include optional
  `branchId` field on form/detail if OpenAPI defines it; use `useBranchOptions()` for select.
- **Tasks**: Service, types, schema, hooks, `WarehouseForm`, four pages, archive flow.
- **Deliverables**: `/warehouses/*` routes (4 pages).
- **Dependencies**: Phase 1; Phase 2 recommended (branch picker hook).
- **Validation**: US2 acceptance scenarios 1–4; quickstart §3.
- **Risks**: Branch association not in API v1 → omit picker; show field only when API returns
  `branchId`.
- **Exit Criteria**: FR-007–FR-011 met.

**Parallelizable**: With Phase 4 after Phase 1 (warehouses and vehicles are independent).

### Phase 4 — Vehicle Management (US3)

- **Objective**: Complete vehicle CRUD + archive + list controls.
- **Scope**: Mirror Phase 2 under `features/vehicles/` with vehicle-specific fields
  (`plateNumber`, `description`, operational `status`). Optional `branchId`, `warehouseId`,
  `vehicleType` per OpenAPI. `useBranchOptions()` and optional warehouse picker.
- **Tasks**: Service, types, schema, hooks, `VehicleForm`, four pages, status badge mapping,
  archive flow.
- **Deliverables**: `/vehicles/*` routes (4 pages).
- **Dependencies**: Phase 1; Phase 2–3 recommended for picker hooks.
- **Validation**: US3 acceptance scenarios 1–4; quickstart §4.
- **Risks**: Vehicle status enum UI confusion → clear labels in form select and badge.
- **Exit Criteria**: FR-012–FR-016 met.

**Parallelizable**: With Phase 3 after Phase 1.

### Phase 5 — Relationships, Cross-Module Polish & Spec 004 Readiness

- **Objective**: Verify relationship display, responsive/a11y pass, and production readiness.
- **Scope**: Detail-page relationship fields; filtered empty states; toast consistency;
  permission audit across all org screens; typecheck/lint/build; quickstart walkthrough;
  confirm no out-of-scope code.
- **Tasks**:
  - Verify FR-020/FR-021 on warehouse/vehicle detail and forms
  - Responsive + dark mode pass on all 12 pages
  - Accessibility spot-check (forms, tables, dialogs, keyboard)
  - Run quality gates; execute quickstart scenarios
  - Document any OpenAPI deltas in `contracts/api-endpoints.md`
- **Deliverables**: Green build; completed production checklist; Spec 004 readiness confirmed.
- **Dependencies**: Phases 2–4.
- **Validation**: SC-001–SC-006; quickstart full walkthrough; Principle XL checklist.
- **Risks**: Scope creep into Workforce/Transactions → enforce out-of-scope boundary.
- **Exit Criteria**: All spec acceptance criteria met; ready for `/speckit-tasks`.

## Parallelization

```text
Phase 0 (Research & Contracts)
    ↓
Phase 1 (Routes, Permissions, Navigation)
    ↓
    ├─ Phase 2 (Branches) ─────────────┐
    ├─ Phase 3 (Warehouses) ───────────┤  ← 3 & 4 can start after Phase 1;
    └─ Phase 4 (Vehicles) ─────────────┘     branch picker from Phase 2 helps 3 & 4
                          ↓
                    Phase 5 (Polish & Readiness)
```

- **Maximum parallelism**: After Phase 1, Phases 3 and 4 can proceed in parallel. Phase 2
  should complete first if `useBranchOptions` is needed for warehouse/vehicle forms.
- **Within a phase**: types + service + schema can be built before pages; list page before
  detail before create/edit is the recommended vertical slice order.

## Specification 004 Readiness Checklist

After Phase 5, the following MUST exist for Workforce Management (Backend P003) without
refactoring:

- [x] Three feature modules demonstrating the standard scaffold pattern
- [x] Server-paginated list pattern via `useListQuery` + `unwrapList` (reusable for workforce lists)
- [x] Permission constants + `PermissionGuard`/`PermissionGate` extended additively
- [x] Navigation pattern proven for adding new modules
- [x] No changes to auth session, envelope handling, or dashboard layout architecture
- [x] `features/branches` available for transaction location pickers in Spec 005+
- [x] No Workforce, Transaction, Trip, or Expense code introduced

## Complexity Tracking

No constitution violations; no complexity deviations to justify.

## Artifacts

| Artifact   | Path                             | Status   |
| ---------- | -------------------------------- | -------- |
| Research   | [research.md](./research.md)     | Complete |
| Data Model | [data-model.md](./data-model.md) | Complete |
| Contracts  | [contracts/](./contracts/)       | Complete |
| Quickstart | [quickstart.md](./quickstart.md) | Complete |
| Tasks      | [tasks.md](./tasks.md)           | Complete |
