# Implementation Plan: Trip Management

**Branch**: `007-trip-management` | **Date**: 2026-07-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/007-trip-management/spec.md`

**Note**: Maps to Backend P006 – Trip Management. Builds strictly on Specifications 001–006 and MUST NOT redesign or replace the existing architecture. Leaves the codebase ready for Specification 008 – Expense Management (Backend P007) with no architectural refactoring.

## Summary

Deliver the Trip Management module as a new feature at `src/features/trips/` with permission-driven navigation and protected routes. The module provides:

- Trip dashboard and list with search, filtering, sorting, and pagination
- Trip details with route information, organizational relationships, vehicle, members, linked transactions, odometer, and workflow timeline
- Create and edit trip plans (Draft and other backend-permitted states)
- Backend-driven workflow transitions: Draft → Scheduled → Started → Completed, and Draft → Cancelled
- Trip members: assign, remove, view, member status when supported
- Vehicle assignment with backend conflict validation (e.g., one active trip per vehicle)
- Transaction linking: view, assign, remove, search/filter candidates; surface outside-transaction validation from API
- Production-quality responsive UI reusing shared primitives from Specifications 001–006

Out of scope (explicitly not implemented):

- Expense Management, Analytics, Reports, Activity Logs
- Client-side workflow state machines, distance calculation, or transaction settlement logic duplication

Technical approach:

- Implement `src/features/trips/` following the proven feature architecture: `types/`, `services/`, `validation/`, `hooks/`, `components/`, `pages/`
- Reuse shared infrastructure: `apiClient` + `unwrap`/`unwrapList`, `useListQuery`, `DataTable`, `FilterBar`, `Pagination`, `PermissionGuard`, `PermissionGate`, RHF + Zod + `applyApiValidationErrors`, `PageHeader`, `PageContainer`, `ConfirmDialog`, `StatusBadge`, skeleton/empty/error states
- Reuse cross-feature pickers: `useEmployeeOptions`, `useBranchOptions`, `useWarehouseOptions`, vehicle list hooks, transaction list/search for linking
- Extend constants and routing additively: `routes.ts`, `navigation.ts`, `permissions.ts`, `routes.tsx`, breadcrumbs
- TanStack Query for all server state; Zustand for list filters, dialog open state, and temporary UI preferences only

## Technical Context

**Language/Version**: TypeScript (Strict Mode) on React 19+ with Vite

**Primary Dependencies**: React Router (Data Router), TanStack Query, Axios, Zustand, React Hook Form, Zod, Tailwind CSS v4, Lucide React, Sonner

**Storage**: N/A (frontend only; persistence via Backend P006 REST APIs)

**Testing**: Manual quickstart validation + `pnpm typecheck`, `pnpm lint`, `pnpm build`

**Target Platform**: Modern browsers (mobile-first: 320px–1536px+); light and dark mode

**Performance Goals**: Lazy-loaded trip routes; targeted query invalidation on mutations; memoized table columns and timeline events

**Constraints**:

- No Axios in UI components (feature service classes only)
- No server state in Zustand
- No hardcoded workflow eligibility beyond permission gates + current status display hints
- No client-side odometer distance calculation unless backend contract explicitly requires it
- No duplication of transaction settlement or pricing logic from Specs 005–006
- No architectural refactor of existing features

**Scale/Scope**: New `trips` feature module; additive constants/routes/navigation/permissions only

## Constitution Check

_GATE: Passed before Phase 0 research. Re-checked after Phase 1 design._

| Gate                                             | Status  | Notes                                                               |
| ------------------------------------------------ | ------- | ------------------------------------------------------------------- |
| API First (I, VIII)                              | ✅ Pass | `TripService` + hooks; UI consumes hooks only                       |
| Type Safety (II, IX)                             | ✅ Pass | Strict TS; Zod per form; feature-local `types/`                     |
| Feature Architecture (III, XVII, XVIII)          | ✅ Pass | Entire module under `src/features/trips/`                           |
| Routing (IV, V)                                  | ✅ Pass | Data Router; nested layouts; lazy-loaded routes                     |
| State (VII)                                      | ✅ Pass | TanStack Query for server data; Zustand for UI/filters only         |
| UI & Styling (VI, X, XI, XII, XXIX–XXXIV, XXXIX) | ✅ Pass | Reuse shared primitives; UI UX Pro Max enterprise patterns          |
| Auth & Security (XIV, XX)                        | ✅ Pass | PermissionGuard routes + PermissionGate actions                     |
| Accessibility (XV, XL)                           | ✅ Pass | Semantic timeline, labeled forms, dialog focus trap, keyboard nav   |
| Responsive Design (XXVII, XXXI)                  | ✅ Pass | Mobile card list; desktop table; stacked detail sections            |
| Page & Table Standards (XXXII, XXXVI)            | ✅ Pass | Standard page header/content; DataTable list pattern                |
| Forms & Dashboards (XXXVII, XXXVIII)             | ✅ Pass | RHF + Zod; disabled while pending; optional dashboard summary cards |
| AI UI Standards (XXVIII, XL)                     | ✅ Pass | Reuse-first; no duplicate primitives                                |
| Performance (XVI, XXXV)                          | ✅ Pass | Lazy routes; efficient query keys and invalidation                  |
| API Contract (XXVI)                              | ✅ Pass | Contracts in `specs/007/.../contracts/`                             |
| Documentation (XXII)                             | ✅ Pass | research, data-model, contracts, quickstart complete                |

No violations. Complexity Tracking not required.

## Project Structure

### Documentation (this feature)

```text
specs/007-trip-management/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
└── contracts/
    ├── api-endpoints.md
    └── routes-and-guards.md
```

### Source Code (repository root)

New paths only. Existing files are extended additively.

```text
src/
├── app/router/routes.tsx                    # EXTEND: trips lazy routes
├── constants/
│   ├── routes.ts                            # EXTEND: trips paths + buildRoute
│   ├── navigation.ts                        # EXTEND: Trips nav item
│   └── permissions.ts                       # EXTEND: trips permission keys
├── features/auth/lib/session.ts             # EXTEND: role → trips permissions
├── lib/breadcrumb.ts                        # EXTEND: trip segments
├── hooks/useBreadcrumbTrail.ts              # EXTEND: trip trails
└── features/trips/
    ├── types/trip.types.ts
    ├── services/trip.service.ts
    ├── validation/
    │   ├── trip.schema.ts
    │   ├── trip-start.schema.ts
    │   ├── trip-complete.schema.ts
    │   └── trip-cancel.schema.ts
    ├── lib/
    │   ├── trip-status.ts
    │   ├── trip-workflow.ts                 # display hints only (not authorization)
    │   └── trip-timeline.ts
    ├── hooks/
    │   ├── useTrips.ts
    │   ├── useTrip.ts
    │   ├── useTripMutations.ts
    │   ├── useTripWorkflowMutations.ts
    │   ├── useTripMembers.ts
    │   ├── useTripMemberMutations.ts
    │   ├── useTripTransactions.ts
    │   ├── useTripTransactionMutations.ts
    │   ├── useTripTimeline.ts
    │   ├── useTripListStore.ts              # Zustand: filters/view prefs
    │   └── useTripDialogStore.ts            # Zustand: active workflow/assign dialogs
    ├── components/
    │   ├── TripStatusBadge.tsx
    │   ├── TripWorkflowActions.tsx
    │   ├── TripWorkflowTimeline.tsx
    │   ├── TripRouteSummary.tsx
    │   ├── TripOdometerSummary.tsx
    │   ├── TripForm.tsx
    │   ├── TripMembersPanel.tsx
    │   ├── TripMemberAssignDialog.tsx
    │   ├── TripVehiclePanel.tsx
    │   ├── TripVehicleAssignDialog.tsx
    │   ├── TripTransactionsPanel.tsx
    │   ├── TripTransactionAssignDialog.tsx
    │   ├── ScheduleTripDialog.tsx
    │   ├── StartTripDialog.tsx
    │   ├── CompleteTripDialog.tsx
    │   └── CancelTripDialog.tsx
    └── pages/
        ├── TripsDashboardPage.tsx             # wraps list + optional summary cards
        ├── TripsListPage.tsx
        ├── TripDetailPage.tsx
        ├── TripCreatePage.tsx
        └── TripEditPage.tsx
```

**Structure Decision**: New feature module per Constitution Principle III, cloned from organization + transactions patterns. Transaction linking reuses `TransactionService` / transaction types for summaries and deep links — no settlement UI duplication.

## Implementation Phases

### Phase 0 — Research & Contract Reconciliation

- **Objective**: Confirm Backend P006 endpoints, status values, workflow actions, and relationship payloads match frontend contracts.
- **Scope**: Trip CRUD, workflow (schedule/start/complete/cancel), members, vehicle assignment, transaction linking, dashboard summary (if any), permission keys, timeline/history endpoint (if any).
- **Tasks**:
  1. Produce `research.md` with decisions and alternatives
  2. Produce `data-model.md` with entities, relationships, and transitions
  3. Produce `contracts/api-endpoints.md` and `contracts/routes-and-guards.md`
  4. Draft `quickstart.md` validation scenarios
- **Deliverables**: Phase 0 documentation artifacts
- **Dependencies**: Backend P006 API reference / Swagger at `GET /docs`
- **Validation**: No unresolved NEEDS CLARIFICATION in technical context
- **Risks**: Endpoint path or permission key mismatch → reconcile during Phase 1 against live API
- **Exit Criteria**: Contracts documented; implementation can proceed without architecture changes

**Status**: ✅ Complete (artifacts in this spec directory)

**Parallelizable**: No

---

### Phase 1 — Types, Service & Status Foundation

- **Objective**: Establish trip data layer and service methods callable from hooks.
- **Scope**: `trip.types.ts`, `trip.service.ts`, `trip-status.ts`, query key factory.
- **Tasks**:
  1. Define `TripStatus`: `DRAFT` | `SCHEDULED` | `STARTED` | `COMPLETED` | `CANCELLED`
  2. Define `TripSummary`, `TripDetail`, `TripMember`, `LinkedTransactionSummary`, workflow input types
  3. Add `TRIP_ENDPOINTS` constant object mirroring contract paths
  4. Implement `TripService.list`, `get`, `create`, `update`, `cancel`, `schedule`, `start`, `complete`, `archive` (if supported)
  5. Implement nested: `listMembers`, `addMembers`, `removeMember`, `assignVehicle`, `listLinkedTransactions`, `searchLinkableTransactions`, `linkTransaction`, `unlinkTransaction`
  6. Add `trip-status.ts` labels/tones with unknown-status fallback
  7. Add `trip-workflow.ts` with pure status display helpers (e.g. `isDraftStatus`) — not authorization
  8. Create `tripKeys` query key factory in hooks or `lib/query-keys.ts` colocated with feature
- **Deliverables**: `types/`, `services/`, `lib/trip-status.ts`, `lib/trip-workflow.ts`
- **Dependencies**: Phase 0 contracts
- **Validation**: `pnpm typecheck` passes; service paths match `contracts/api-endpoints.md`
- **Risks**: Nested resource paths differ from contract → update service only, not UI
- **Exit Criteria**: Service layer callable; types align with API reference

**Parallelizable**: No (foundation for all UI phases)

---

### Phase 2 — Permissions, Routes & Navigation Wiring

- **Objective**: Wire protected trip routes and permission-driven navigation.
- **Scope**: `routes.ts`, `permissions.ts`, `session.ts`, `routes.tsx`, breadcrumbs.
- **Tasks**:
  1. Add `ROUTES.trips`, `tripsNew`, `tripDetail`, `tripEdit` + `buildRoute.tripDetail(id)`, `buildRoute.tripEdit(id)`
  2. Extend `PERMISSIONS.trips` with keys: `view`, `create`, `update`, `schedule`, `start`, `complete`, `cancel` (reconcile strings against backend during implementation)
  3. Map trip permissions to OWNER/MANAGER/EMPLOYEE in `session.ts` (additive)
  4. Register lazy routes: `TripsDashboardPage`, `TripCreatePage`, `TripDetailPage`, `TripEditPage`
  5. Protect each route with `PermissionGuard` (`trips.view` minimum; create/edit with respective keys)
  6. Add `Trips` nav item to `navigation.ts` with `anyOf: [PERMISSIONS.trips.view]`
  7. Extend breadcrumb config for trip list, new, detail, edit segments
- **Deliverables**: Updated constants, router, session, breadcrumbs
- **Dependencies**: Phase 1 permission key naming from contracts
- **Validation**: Deep links work; unauthorized users blocked; nav hidden without permission
- **Risks**: Over-broad employee permissions → match backend role matrix
- **Exit Criteria**: All four trip routes reachable and protected

**Parallelizable**: Can start after Phase 1 types exist (route constants known)

---

### Phase 3 — List, Dashboard & Detail (Read UX)

- **Objective**: Implement core read surfaces with status rendering and relationship summaries.
- **Scope**: `TripsListPage`, `TripsDashboardPage`, `TripDetailPage` (read-only sections first).
- **Tasks**:
  1. Implement `useTrips(params)` with `useListQuery` integration
  2. Implement `useTrip(id)` detail query
  3. Build list page: `PageHeader`, `FilterBar` (status, date range, vehicle, branch), search, `DataTable` + mobile cards, `Pagination`
  4. Add optional dashboard summary cards above list when `GET /trips/dashboard` or list meta provides aggregates
  5. Build detail page skeleton: header with `TripStatusBadge`, `TripRouteSummary`, branch/warehouse display via existing label helpers
  6. Add `DescriptionList` sections for trip identity, schedule/actual timestamps, notes
  7. Wire loading, empty, error, not-found states
  8. Document title updates per page
- **Deliverables**: List + dashboard + detail read layout
- **Dependencies**: Phase 1–2
- **Validation**: User Story 1 acceptance scenarios; SC-004 find-and-open timing
- **Risks**: List filter param names mismatch → align with `toQueryParams` / contract
- **Exit Criteria**: Users can browse, filter, and open trip details

**Parallelizable**: After Phase 2 route wiring

---

### Phase 4 — Create & Edit Trip Forms

- **Objective**: Trip plan creation and editing with validated forms.
- **Scope**: `TripForm`, `TripCreatePage`, `TripEditPage`, `trip.schema.ts`, `useTripMutations`.
- **Tasks**:
  1. Create Zod schema for create/update (origin, destination, scheduledStart, branchId, warehouseId, notes, etc.)
  2. Build `TripForm` with RHF + `applyApiValidationErrors`
  3. Integrate branch/warehouse selects via existing option hooks
  4. Implement `useCreateTrip`, `useUpdateTrip` mutations with toast + navigation on success
  5. Gate edit route/button by backend-permitted status (typically `DRAFT`; confirm via API)
  6. Disable submit while pending; show success toast and redirect to detail
- **Deliverables**: Create/edit pages + form component + mutations
- **Dependencies**: Phase 3 detail page (navigation target)
- **Validation**: User Story 2 acceptance scenarios
- **Risks**: Partial PATCH semantics → send only changed fields
- **Exit Criteria**: Create and edit flows persist via backend

**Parallelizable**: After Phase 3 (detail exists)

---

### Phase 5 — Workflow Actions (Schedule, Start, Complete, Cancel)

- **Objective**: Backend-driven workflow transitions with confirmation dialogs.
- **Scope**: `TripWorkflowActions`, workflow dialogs, `useTripWorkflowMutations`, `useTripDialogStore`.
- **Tasks**:
  1. Create Zod schemas for start (starting odometer if required), complete (ending odometer), cancel (reason if required)
  2. Implement mutations: `schedule`, `start`, `complete`, `cancel`
  3. Build `TripWorkflowActions` toolbar gated by `PermissionGate` + current status display hints
  4. Build `ScheduleTripDialog`, `StartTripDialog`, `CompleteTripDialog`, `CancelTripDialog` (reuse `ConfirmDialog` pattern from Spec 006)
  5. On success: invalidate `tripKeys.detail(id)` and list queries; close dialog; toast
  6. On 409 lifecycle conflict: toast + refetch detail
  7. Embed actions on `TripDetailPage` header
- **Deliverables**: Workflow components + hooks
- **Dependencies**: Phase 1 service methods; Phase 3 detail page
- **Validation**: User Story 3 acceptance scenarios; SC-002 status accuracy
- **Risks**: Showing actions backend forbids → hide on 403 or use optimistic permission+status gating with API as authority
- **Exit Criteria**: Full happy-path workflow operable from detail page

**Parallelizable**: Phase 6–7 can proceed in parallel after Phase 1

---

### Phase 6 — Trip Members

- **Objective**: Assign, remove, and display trip members.
- **Scope**: `TripMembersPanel`, `TripMemberAssignDialog`, member hooks.
- **Tasks**:
  1. Implement `useTripMembers(tripId)` and `useTripMemberMutations`
  2. Build members panel with list, empty state, section error
  3. Build assign dialog with `useEmployeeOptions` multi-select
  4. Implement remove with confirmation when permitted
  5. Display member status badge when API returns status field
  6. Gate actions with `PermissionGate` + trip status hints
- **Deliverables**: Members panel + dialog + hooks
- **Dependencies**: Phase 3 detail page
- **Validation**: User Story 4 acceptance scenarios
- **Risks**: Member list embedded in detail vs separate endpoint → support both via service
- **Exit Criteria**: Members assign/remove/view works on eligible trips

**Parallelizable**: With Phase 7 after Phase 3

---

### Phase 7 — Vehicle Assignment

- **Objective**: Assign, change, and display trip vehicle with backend validation.
- **Scope**: `TripVehiclePanel`, `TripVehicleAssignDialog`.
- **Tasks**:
  1. Implement vehicle assign/change via `TripService.assignVehicle` (or PATCH trip `vehicleId`)
  2. Build vehicle panel showing plate/description from trip detail or nested vehicle object
  3. Build assign dialog using vehicle list hook; show availability hint if API provides `isAvailable` or similar
  4. Surface backend conflict errors (one active trip per vehicle) inline in dialog
  5. Gate change action by status per backend rules
- **Deliverables**: Vehicle panel + dialog
- **Dependencies**: Phase 3 detail; organization vehicle hooks
- **Validation**: User Story 5 acceptance scenarios
- **Risks**: Vehicle availability not in API → omit availability UI; show conflicts only on error
- **Exit Criteria**: Vehicle assign/change/display works with API validation messages

**Parallelizable**: With Phase 6 after Phase 3

---

### Phase 8 — Transaction Linking

- **Objective**: Link transactions to trips with search/filter and summaries; no transaction logic duplication.
- **Scope**: `TripTransactionsPanel`, `TripTransactionAssignDialog`.
- **Tasks**:
  1. Implement `useTripTransactions(tripId)` and link/unlink mutations
  2. Build linked transactions table: number, direction, party, status badge (reuse `TransactionStatusBadge`), amount from API
  3. Build assign dialog: search/filter linkable transactions via backend endpoint (not client-side filtering of full catalog)
  4. Display outside-transaction validation errors from API on failed link
  5. Row action: deep link to `buildRoute.transactionDetail(id)` — no embedded transaction editor
  6. Do not reimplement settlement, items, or pricing UI
- **Deliverables**: Transactions panel + assign dialog
- **Dependencies**: Phase 3 detail; Spec 005–006 transaction types/components for display only
- **Validation**: User Story 6 acceptance scenarios; SC-005 summary accuracy
- **Risks**: Link endpoint vs PATCH `tripId` on transaction → follow contract; document in service
- **Exit Criteria**: Link/view/remove transactions on trips with backend validation surfaced

**Parallelizable**: With Phases 6–7 after Phase 3

---

### Phase 9 — Timeline, Odometer & Route Polish

- **Objective**: Complete operational visibility sections on trip detail.
- **Scope**: `TripWorkflowTimeline`, `TripOdometerSummary`, `trip-timeline.ts`, `useTripTimeline`.
- **Tasks**:
  1. Implement `trip-timeline.ts` builder from detail lifecycle fields and/or `GET /trips/:id/history`
  2. Build `TripWorkflowTimeline` (clone `TransactionSettlementTimeline` accessible `<ol>` pattern)
  3. Build `TripOdometerSummary` — display starting/ending odometer and distance only when API provides; no client calculation
  4. Ensure `TripRouteSummary` shows origin, destination, scheduled/actual timestamps
  5. Section-level loading/empty/error states
- **Deliverables**: Timeline + odometer + route components
- **Dependencies**: Phase 5 workflow (lifecycle fields populated)
- **Validation**: User Story 7 acceptance scenarios
- **Risks**: No dedicated history endpoint → compose from detail timestamps only
- **Exit Criteria**: Route, timeline, and odometer sections production-ready

**Parallelizable**: After Phase 5 (partial timeline possible earlier from detail fields)

---

### Phase 10 — Integration Hardening & Quality Gates

- **Objective**: Edge cases, concurrent updates, accessibility, and release readiness.
- **Scope**: Cross-cutting polish across trips module.
- **Tasks**:
  1. Handle unknown `TripStatus` in badge and filters
  2. On 403: toast + hide action on next render
  3. On 409: refresh detail + user-safe conflict message
  4. Verify deep links for all routes with/without permission
  5. Verify no expense/analytics/report/activity-log code introduced
  6. Verify `transaction.tripId` display on transaction detail remains compatible (optional link back to trip)
  7. Run `pnpm typecheck`, `pnpm lint`, `pnpm build`
  8. Execute `quickstart.md` manual validation checklist
  9. Dark mode spot-check on all trip pages
  10. Keyboard and screen-reader pass on dialogs, tables, timeline
- **Deliverables**: Hardened module; passing quality gates
- **Dependencies**: Phases 1–9 complete
- **Validation**: All spec FRs and success criteria; Constitution production checklist
- **Risks**: Manual quickstart blocked without running backend → document seed prerequisites
- **Exit Criteria**: Production-ready Trip Management; no refactor needed before Spec 008

**Parallelizable**: No

---

## Parallel Development Summary

| After phase | Can run in parallel                               |
| ----------- | ------------------------------------------------- |
| Phase 3     | Phases 4, 6, 7, 8 (detail shell required)         |
| Phase 1     | Phase 2 (once route/permission names fixed)       |
| Phase 5     | Phase 9 (timeline enrichment)                     |
| Phase 6–8   | Independent panels once detail page layout exists |

Recommended team split after Phase 3: one stream on forms (4) + workflow (5); another on members (6), vehicle (7), transactions (8).

## Spec 008 Readiness

- New feature isolated under `src/features/trips/`; no changes to transactions settlement architecture
- `TransactionDetail.tripId` can link to `buildRoute.tripDetail(tripId)` additively in a later polish task (optional, non-blocking)
- Route namespace `/trips/*` stable for expense module to reference trip context later
- No shared Zustand store pollution; trip list filters remain feature-local

## Complexity Tracking

Not required — all constitution gates pass without justified violations.
