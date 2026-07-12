# Tasks: Specification 007 – Trip Management

**Input**: Design documents from `/specs/007-trip-management/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Not requested in Specification 007 (manual quickstart validation required).

**Organization**: Tasks grouped by user story for independent implementation and testing. New module at `src/features/trips/` — no architectural refactor of Specs 001–006.

## Phase 1: Setup (Trip Module Scaffolding)

**Purpose**: Create feature directory tree and placeholder files so foundational work can proceed without import errors.

- [x] T001 Create directory tree under `src/features/trips/` per `plan.md`: `components/`, `hooks/`, `pages/`, `services/`, `types/`, `validation/`, `lib/`.
- [x] T002 [P] Create `src/features/trips/types/trip.types.ts` with exported placeholder types (`TripStatus`, `TripSummary`, `TripDetail`).
- [x] T003 [P] Create `src/features/trips/services/trip.service.ts` with exported `TRIP_ENDPOINTS` and `TripService` placeholder object.
- [x] T004 [P] Create `src/features/trips/lib/trip-status.ts` with placeholder `tripStatusLabel` and `tripStatusTone` exports.
- [x] T005 [P] Create `src/features/trips/lib/trip-workflow.ts` with placeholder status display helpers (`isDraftStatus`, etc.).
- [x] T006 [P] Create `src/features/trips/lib/trip-timeline.ts` with placeholder `buildTripTimeline` export.
- [x] T007 [P] Create `src/features/trips/validation/trip.schema.ts` with placeholder Zod schema for create/update.
- [x] T008 [P] Create `src/features/trips/validation/trip-start.schema.ts` with placeholder Zod schema for starting odometer.
- [x] T009 [P] Create `src/features/trips/validation/trip-complete.schema.ts` with placeholder Zod schema for ending odometer.
- [x] T010 [P] Create `src/features/trips/validation/trip-cancel.schema.ts` with placeholder Zod schema for cancellation reason.
- [x] T011 [P] Create `src/features/trips/hooks/trip-keys.ts` with exported `tripKeys` query key factory placeholders.
- [x] T012 [P] Create placeholder hooks: `src/features/trips/hooks/useTrips.ts`, `useTrip.ts`, `useTripMutations.ts`, `useTripWorkflowMutations.ts`.
- [x] T013 [P] Create placeholder hooks: `src/features/trips/hooks/useTripMembers.ts`, `useTripMemberMutations.ts`, `useTripTransactions.ts`, `useTripTransactionMutations.ts`, `useTripTimeline.ts`.
- [x] T014 [P] Create `src/features/trips/hooks/useTripListStore.ts` (Zustand) for list filter and view preference state.
- [x] T015 [P] Create `src/features/trips/hooks/useTripDialogStore.ts` (Zustand) for active workflow/assign dialog type.
- [x] T016 [P] Create placeholder components: `src/features/trips/components/TripStatusBadge.tsx`, `TripRouteSummary.tsx`, `TripOdometerSummary.tsx`.
- [x] T017 [P] Create placeholder components: `src/features/trips/components/TripWorkflowActions.tsx`, `TripWorkflowTimeline.tsx`, `TripForm.tsx`.
- [x] T018 [P] Create placeholder panels: `src/features/trips/components/TripMembersPanel.tsx`, `TripVehiclePanel.tsx`, `TripTransactionsPanel.tsx`.
- [x] T019 [P] Create placeholder dialogs: `src/features/trips/components/ScheduleTripDialog.tsx`, `StartTripDialog.tsx`, `CompleteTripDialog.tsx`, `CancelTripDialog.tsx`.
- [x] T020 [P] Create placeholder dialogs: `src/features/trips/components/TripMemberAssignDialog.tsx`, `TripVehicleAssignDialog.tsx`, `TripTransactionAssignDialog.tsx`.
- [x] T021 [P] Create placeholder pages: `src/features/trips/pages/TripsDashboardPage.tsx`, `TripsListPage.tsx`, `TripDetailPage.tsx`, `TripCreatePage.tsx`, `TripEditPage.tsx`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Types, services, status libs, routes, permissions, and navigation. **No user story work until this phase completes.**

- [x] T022 Define `TripStatus` union in `src/features/trips/types/trip.types.ts`: `DRAFT` | `SCHEDULED` | `STARTED` | `COMPLETED` | `CANCELLED`.
- [x] T023 Define `TripSummary` and `TripDetail` interfaces in `src/features/trips/types/trip.types.ts` per `data-model.md` (route, schedule, odometer, org fields).
- [x] T024 Define `TripMember`, `TripMemberStatus`, and `TripVehicleSummary` types in `src/features/trips/types/trip.types.ts`.
- [x] T025 Define `LinkedTransactionSummary` type in `src/features/trips/types/trip.types.ts` reusing `Direction`, `TransactionStatus`, `LocationType` from `src/features/transactions/types/transaction.types.ts`.
- [x] T026 Define input types in `src/features/trips/types/trip.types.ts`: `CreateTripInput`, `UpdateTripInput`, `StartTripInput`, `CompleteTripInput`, `CancelTripInput`, `AssignMembersInput`, `AssignVehicleInput`, `LinkTransactionInput`.
- [x] T027 Define `TripTimelineEvent` type in `src/features/trips/types/trip.types.ts` for normalized timeline UI.
- [x] T028 Implement `TRIP_ENDPOINTS` in `src/features/trips/services/trip.service.ts` per `contracts/api-endpoints.md` (base, detail, workflow, members, vehicle, transactions, history).
- [x] T029 Implement `TripService.list` in `src/features/trips/services/trip.service.ts` calling `GET /trips` with `unwrapList`.
- [x] T030 Implement `TripService.get` in `src/features/trips/services/trip.service.ts` calling `GET /trips/:id`.
- [x] T031 Implement `TripService.create` and `TripService.update` in `src/features/trips/services/trip.service.ts`.
- [x] T032 Implement workflow methods in `src/features/trips/services/trip.service.ts`: `schedule`, `start`, `complete`, `cancel` (and `archive` if supported by backend).
- [x] T033 Implement member methods in `src/features/trips/services/trip.service.ts`: `listMembers`, `addMembers`, `removeMember`.
- [x] T034 Implement vehicle method `TripService.assignVehicle` in `src/features/trips/services/trip.service.ts`.
- [x] T035 Implement transaction link methods in `src/features/trips/services/trip.service.ts`: `listLinkedTransactions`, `searchLinkableTransactions`, `linkTransaction`, `unlinkTransaction`.
- [x] T036 Implement optional `TripService.getDashboard` and `TripService.getHistory` in `src/features/trips/services/trip.service.ts` when endpoints exist (graceful no-op or detail fallback documented in service).
- [x] T037 Implement `trip-status.ts` in `src/features/trips/lib/trip-status.ts` with labels/tones for all statuses and unknown-status fallback.
- [x] T038 Implement `trip-workflow.ts` in `src/features/trips/lib/trip-workflow.ts` with pure display helpers: `isDraftStatus`, `isScheduledStatus`, `isStartedStatus`, `isCompletedStatus`, `isCancelledStatus` (not authorization).
- [x] T039 Implement `buildTripTimeline` in `src/features/trips/lib/trip-timeline.ts` from detail lifecycle fields and optional history array.
- [x] T040 Implement `tripKeys` factory in `src/features/trips/hooks/trip-keys.ts` for list, detail, members, transactions, timeline, and linkable queries.
- [x] T041 Update `src/constants/permissions.ts` additively with `PERMISSIONS.trips`: `view`, `create`, `update`, `schedule`, `start`, `complete`, `cancel` per `contracts/routes-and-guards.md`.
- [x] T042 Update `PermissionKey` union in `src/constants/permissions.ts` to include trips permission keys.
- [x] T043 Update `src/features/auth/lib/session.ts` `ROLE_PERMISSIONS` for OWNER/MANAGER/EMPLOYEE with trips permission keys (reconcile against Backend P006).
- [x] T044 Update `src/constants/routes.ts` with `trips`, `tripsNew`, `tripDetail`, `tripEdit` route constants.
- [x] T045 Update `src/constants/routes.ts` `buildRoute` with `tripDetail(id)` and `tripEdit(id)` helpers.
- [x] T046 Update `src/constants/navigation.ts` to add Trips nav item with `anyOf: [PERMISSIONS.trips.view]` and distinct Lucide icon (after Transactions).
- [x] T047 Register lazy trip routes in `src/app/router/routes.tsx` for all four pages with `PermissionGuard` per `contracts/routes-and-guards.md`.
- [x] T048 Update `src/lib/breadcrumb.ts` to support trips, new, detail, and edit breadcrumb segments.
- [x] T049 Update `src/hooks/useBreadcrumbTrail.ts` to resolve trip breadcrumb labels from trip detail query cache (`tripNumber` or route summary).
- [x] T050 Run `pnpm typecheck` after foundational changes and fix compile errors in `src/features/trips/` and updated constants.

**Checkpoint**: Types, services, routes, and permissions ready — user story implementation can begin.

---

## Phase 3: User Story 1 – Discover and Open Trips (Priority: P1) 🎯 MVP

**Goal**: Authorized users browse trips with search/filter/sort/pagination and open trip details with backend-provided fields and relationships.

**Independent Test**: Navigate to `/trips`, filter and search, open a trip detail page; verify status, route summary, and relationship placeholders load from API with loading/empty/error states.

- [x] T051 [US1] Implement `useTrips(params)` in `src/features/trips/hooks/useTrips.ts` using TanStack Query and `TripService.list`.
- [x] T052 [US1] Implement `useTrip(id)` in `src/features/trips/hooks/useTrip.ts` with enabled guard when `id` is defined.
- [x] T053 [US1] Implement `TripStatusBadge` in `src/features/trips/components/TripStatusBadge.tsx` using `trip-status.ts` labels/tones.
- [x] T054 [US1] Implement `TripRouteSummary` in `src/features/trips/components/TripRouteSummary.tsx` showing origin, destination, and schedule/actual timestamps from `TripDetail`.
- [x] T055 [US1] Build `TripsListPage` in `src/features/trips/pages/TripsListPage.tsx` with `PageHeader`, `FilterBar` (status, branch, vehicle, date range), search, `DataTable`, mobile cards, and `Pagination`.
- [x] T056 [US1] Wire `useListQuery` in `TripsListPage` for search, sort, page, and filter state synced to query params.
- [x] T057 [US1] Add status filter options in `TripsListPage` for all `TripStatus` values with safe unknown fallback.
- [x] T058 [US1] Implement loading skeleton, empty state, and error state with retry in `src/features/trips/pages/TripsListPage.tsx`.
- [x] T059 [US1] Implement `TripsDashboardPage` in `src/features/trips/pages/TripsDashboardPage.tsx` wrapping `TripsListPage` with optional summary KPI cards when dashboard/meta data exists.
- [x] T060 [US1] Build read-only `TripDetailPage` in `src/features/trips/pages/TripDetailPage.tsx` with `PageHeader`, `TripStatusBadge`, `TripRouteSummary`, and `DescriptionList` for trip identity and notes.
- [x] T061 [US1] Display branch and warehouse context on `TripDetailPage` using existing branch/warehouse label helpers from organization features.
- [x] T062 [US1] Add loading (`PageSkeleton`), not-found (`EmptyState`), and error (`ErrorState`) handling in `src/features/trips/pages/TripDetailPage.tsx`.
- [x] T063 [US1] Add row click navigation from `TripsListPage` to `buildRoute.tripDetail(id)` with keyboard-accessible row actions.
- [x] T064 [US1] Gate New trip button in `TripsListPage` with `PermissionGate` (`PERMISSIONS.trips.create`).
- [x] T065 [US1] Set `document.title` in `TripsListPage` and `TripDetailPage` per page context.
- [x] T066 [US1] Verify `/trips` and `/trips/:id` deep links work with browser back/forward after Phase 2 route registration.

**Checkpoint**: User Story 1 independently testable — list and detail read UX complete.

---

## Phase 4: User Story 2 – Create and Edit Trip Plans (Priority: P1)

**Goal**: Authorized users create and edit eligible trips with validated forms and backend persistence.

**Independent Test**: Create trip at `/trips/new`, save, reopen edit, change fields, verify detail reflects latest API state; invalid submit shows inline errors.

- [x] T067 [US2] Implement Zod schemas in `src/features/trips/validation/trip.schema.ts` for create/update fields (origin, destination, scheduledStartAt, branchId, warehouseId, notes).
- [x] T068 [US2] Implement `TripForm` in `src/features/trips/components/TripForm.tsx` with React Hook Form, Zod resolver, and `applyApiValidationErrors`.
- [x] T069 [US2] Integrate branch and warehouse selects in `TripForm` via `useBranchOptions` and `useWarehouseOptions` from organization features.
- [x] T070 [US2] Implement `useCreateTrip` mutation in `src/features/trips/hooks/useTripMutations.ts` with success toast and navigation to `buildRoute.tripDetail(id)`.
- [x] T071 [US2] Implement `useUpdateTrip` mutation in `src/features/trips/hooks/useTripMutations.ts` with `tripKeys` invalidation for detail and lists.
- [x] T072 [US2] Build `TripCreatePage` in `src/features/trips/pages/TripCreatePage.tsx` wrapping `TripForm` with `PageHeader`, breadcrumbs, and disabled submit while pending.
- [x] T073 [US2] Build `TripEditPage` in `src/features/trips/pages/TripEditPage.tsx` loading trip via `useTrip`, hydrating form, and handling save/cancel navigation.
- [x] T074 [US2] Gate Edit action on `TripDetailPage` with `PermissionGate` (`trips.update`) and `isDraftStatus` display hint (confirm against backend editability).
- [x] T075 [US2] Redirect or show ineligible state on `TripEditPage` when trip status is not editable per backend rules.
- [x] T076 [US2] Show success toast and navigate to detail after create/update in `TripCreatePage` and `TripEditPage`.
- [x] T077 [US2] Set `document.title` for create and edit pages in `src/features/trips/pages/TripCreatePage.tsx` and `TripEditPage.tsx`.

**Checkpoint**: User Story 2 independently testable — create and edit flows work.

---

## Phase 5: User Story 3 – Execute Trip Workflow Transitions (Priority: P1)

**Goal**: Users advance trips through schedule, start, complete, and cancel via backend APIs with confirmation dialogs and refreshed status.

**Independent Test**: On eligible trip, run schedule → start → complete (or cancel from draft); verify status and lifecycle timestamps match API; failures show safe errors without client-invented transitions.

- [x] T078 [US3] Finalize Zod schemas in `src/features/trips/validation/trip-start.schema.ts`, `trip-complete.schema.ts`, and `trip-cancel.schema.ts` per API requirements.
- [x] T079 [US3] Implement `useScheduleTrip`, `useStartTrip`, `useCompleteTrip`, and `useCancelTrip` mutations in `src/features/trips/hooks/useTripWorkflowMutations.ts`.
- [x] T080 [US3] On mutation success in `useTripWorkflowMutations.ts`, invalidate `tripKeys.detail(id)` and list queries; show Sonner toast; close dialog via `useTripDialogStore`.
- [x] T081 [US3] Handle `403`/`409` in `useTripWorkflowMutations.ts` with lifecycle conflict messaging and detail refetch.
- [x] T082 [US3] Implement `ScheduleTripDialog` in `src/features/trips/components/ScheduleTripDialog.tsx` using `ConfirmDialog` pattern from Spec 006.
- [x] T083 [US3] Implement `StartTripDialog` in `src/features/trips/components/StartTripDialog.tsx` with RHF form for starting odometer when required.
- [x] T084 [US3] Implement `CompleteTripDialog` in `src/features/trips/components/CompleteTripDialog.tsx` with RHF form for ending odometer when required.
- [x] T085 [US3] Implement `CancelTripDialog` in `src/features/trips/components/CancelTripDialog.tsx` with optional/required cancellation reason per backend.
- [x] T086 [US3] Implement `TripWorkflowActions` in `src/features/trips/components/TripWorkflowActions.tsx` with `PermissionGate` per action and status display hints from `trip-workflow.ts`.
- [x] T087 [US3] Wire `useTripDialogStore` in `TripWorkflowActions` to open/close schedule/start/complete/cancel dialogs.
- [x] T088 [US3] Disable workflow action buttons and dialog confirms while mutations are pending in `TripWorkflowActions` and dialog components.
- [x] T089 [US3] Embed `TripWorkflowActions` in `TripDetailPage` header actions area in `src/features/trips/pages/TripDetailPage.tsx`.
- [x] T090 [US3] Hide workflow actions on terminal statuses (`COMPLETED`, `CANCELLED`) using display hints; never hardcode full transition matrix.
- [x] T091 [US3] Display `actualStartAt`, `actualCompletedAt`, and cancellation metadata on `TripDetailPage` when returned after workflow mutations.

**Checkpoint**: User Story 3 independently testable — full workflow happy path and cancel from detail.

---

## Phase 6: User Story 4 – Manage Trip Members (Priority: P2)

**Goal**: Assign, remove, and view trip members with employee labels and member status when supported.

**Independent Test**: Assign employees to eligible trip, view member list, remove member when permitted; assignment errors show backend message.

- [x] T092 [US4] Implement `useTripMembers(tripId)` in `src/features/trips/hooks/useTripMembers.ts` (or derive from `useTrip` when members embedded).
- [x] T093 [US4] Implement `useAddTripMembers` and `useRemoveTripMember` in `src/features/trips/hooks/useTripMemberMutations.ts` with query invalidation.
- [x] T094 [US4] Implement `TripMembersPanel` in `src/features/trips/components/TripMembersPanel.tsx` with member list, empty state, section skeleton, and section error.
- [x] T095 [US4] Resolve employee display names in `TripMembersPanel` via `useFormatRecordEmployee` from `src/features/employees/hooks/useFormatRecordEmployee.ts`.
- [x] T096 [US4] Display member status badge in `TripMembersPanel` when `TripMember.status` is present with safe unknown fallback.
- [x] T097 [US4] Implement `TripMemberAssignDialog` in `src/features/trips/components/TripMemberAssignDialog.tsx` with multi-select using `useEmployeeOptions`.
- [x] T098 [US4] Gate assign/remove actions in `TripMembersPanel` with `PermissionGate` (`trips.update`) and non-terminal status hints.
- [x] T099 [US4] Add remove-member confirmation in `TripMembersPanel` before calling `useRemoveTripMember`.
- [x] T100 [US4] Embed `TripMembersPanel` in `src/features/trips/pages/TripDetailPage.tsx` content area.
- [x] T101 [US4] Surface backend validation errors from member mutations in dialog toast/inline message without stale list state.

**Checkpoint**: User Story 4 independently testable — members panel complete on detail page.

---

## Phase 7: User Story 5 – Assign and Display Vehicle (Priority: P2)

**Goal**: Assign, change, and display trip vehicle; surface backend conflict validation (one active trip per vehicle).

**Independent Test**: Assign vehicle to trip, view on detail, change when allowed; conflict error from API displayed without false success.

- [x] T102 [US5] Implement `useAssignTripVehicle` mutation in `src/features/trips/hooks/useTripMutations.ts` or dedicated hook calling `TripService.assignVehicle`.
- [x] T103 [US5] Implement `TripVehiclePanel` in `src/features/trips/components/TripVehiclePanel.tsx` showing plate number, description, and empty state when unassigned.
- [x] T104 [US5] Implement `TripVehicleAssignDialog` in `src/features/trips/components/TripVehicleAssignDialog.tsx` with vehicle picker from `VehicleService.list` / existing vehicle hooks.
- [x] T105 [US5] Display vehicle availability hint in `TripVehicleAssignDialog` only when API provides availability field (no client-side availability calculation).
- [x] T106 [US5] Surface `409`/`400` vehicle conflict errors inline in `TripVehicleAssignDialog` per backend message.
- [x] T107 [US5] Gate assign/change vehicle actions with `PermissionGate` (`trips.update`) and editable status hints.
- [x] T108 [US5] Embed `TripVehiclePanel` in `src/features/trips/pages/TripDetailPage.tsx`.
- [x] T109 [US5] Refresh trip detail after successful vehicle assignment so `vehicleId` and embedded vehicle snapshot stay authoritative.

**Checkpoint**: User Story 5 independently testable — vehicle panel on detail page.

---

## Phase 8: User Story 6 – Link and Manage Transactions (Priority: P2)

**Goal**: View, assign, remove, and search linkable transactions on a trip using backend summaries only.

**Independent Test**: Link transaction to trip, view summary row (number, direction, status, amount from API), open transaction via deep link; outside-rule failure shows API error; no settlement UI on trip page.

- [x] T110 [US6] Implement `useTripTransactions(tripId)` in `src/features/trips/hooks/useTripTransactions.ts` calling `TripService.listLinkedTransactions`.
- [x] T111 [US6] Implement `useSearchLinkableTransactions(tripId, params)` in `src/features/trips/hooks/useTripTransactions.ts` for assign dialog search.
- [x] T112 [US6] Implement `useLinkTripTransaction` and `useUnlinkTripTransaction` in `src/features/trips/hooks/useTripTransactionMutations.ts`.
- [x] T113 [US6] Implement `TripTransactionsPanel` in `src/features/trips/components/TripTransactionsPanel.tsx` with linked transaction table/cards and empty state.
- [x] T114 [US6] Reuse `TransactionStatusBadge` and `TransactionDirectionBadge` from `src/features/transactions/components/` in `TripTransactionsPanel` for status and direction display.
- [x] T115 [US6] Display `totalAmount` from `LinkedTransactionSummary` only — no client-side recalculation in `TripTransactionsPanel`.
- [x] T116 [US6] Add row link to `buildRoute.transactionDetail(id)` from `TripTransactionsPanel` without embedding transaction editor or settlement actions.
- [x] T117 [US6] Implement `TripTransactionAssignDialog` in `src/features/trips/components/TripTransactionAssignDialog.tsx` with search/filter via backend linkable endpoint.
- [x] T118 [US6] Surface outside-transaction and linking validation errors from API in `TripTransactionAssignDialog` (no frontend-only linking rules).
- [x] T119 [US6] Implement unlink with confirmation in `TripTransactionsPanel` when backend allows removal.
- [x] T120 [US6] Gate link/unlink actions with `PermissionGate` (`trips.update`) and status hints.
- [x] T121 [US6] Embed `TripTransactionsPanel` in `src/features/trips/pages/TripDetailPage.tsx`.

**Checkpoint**: User Story 6 independently testable — transaction linking on detail page.

---

## Phase 9: User Story 7 – Route, Timeline, and Odometer Visibility (Priority: P3)

**Goal**: Trip detail shows route, workflow timeline, and odometer/distance from backend only.

**Independent Test**: Open trips in various statuses; timeline events chronological; odometer/distance displayed only when API provides values (no client distance math).

- [x] T122 [US7] Implement `useTripTimeline(tripId)` in `src/features/trips/hooks/useTripTimeline.ts` preferring `TripService.getHistory` with fallback to `buildTripTimeline(detail)`.
- [x] T123 [US7] Finalize `buildTripTimeline` in `src/features/trips/lib/trip-timeline.ts` mapping schedule/start/complete/cancel lifecycle fields to `TripTimelineEvent[]`.
- [x] T124 [US7] Implement `TripWorkflowTimeline` in `src/features/trips/components/TripWorkflowTimeline.tsx` mirroring accessible `<ol>` pattern from `TransactionSettlementTimeline.tsx`.
- [x] T125 [US7] Add loading skeleton, empty state, and section error with retry in `TripWorkflowTimeline`.
- [x] T126 [US7] Implement `TripOdometerSummary` in `src/features/trips/components/TripOdometerSummary.tsx` displaying starting/ending odometer and distance only from `TripDetail` fields.
- [x] T127 [US7] Ensure `TripOdometerSummary` does not compute distance from odometer readings on the client.
- [x] T128 [US7] Enhance `TripRouteSummary` to show scheduled vs actual start/completion with semantic `<time dateTime>` elements.
- [x] T129 [US7] Embed `TripWorkflowTimeline` and `TripOdometerSummary` sections in `src/features/trips/pages/TripDetailPage.tsx`.
- [x] T130 [US7] Resolve actor display names on timeline events via user/employee label helpers where `actorUserId` is returned.

**Checkpoint**: User Story 7 complete — operational visibility sections on detail page.

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Hardening, accessibility, quality gates, and Spec 008 readiness.

- [x] T131 Handle unknown `TripStatus` in list filters and `TripStatusBadge` with safe fallback label in `src/features/trips/lib/trip-status.ts`.
- [x] T132 On workflow/assignment `409 LIFECYCLE_CONFLICT`, toast and refetch trip detail across all mutation hooks in `src/features/trips/hooks/`.
- [x] T133 On `403 FORBIDDEN` from trip mutations, show safe toast and rely on permission gates to hide actions on next render.
- [x] T134 Verify deep links to `/trips/new`, `/trips/:id`, `/trips/:id/edit` for authorized and unauthorized users per `quickstart.md` scenario 1.
- [x] T135 [P] Optional: add trip link on `src/features/transactions/pages/TransactionDetailPage.tsx` when `tripId` is set using `buildRoute.tripDetail(tripId)` (additive polish only).
- [x] T136 Audit `src/features/trips/` exports and ensure no expense/analytics/report/activity-log routes or services were introduced.
- [x] T137 Verify Spec 005–006 transaction flows still pass `pnpm typecheck` after trips module integration.
- [x] T138 Run `pnpm typecheck`, `pnpm lint`, and `pnpm build` and fix any errors in `src/features/trips/` and touched shared files.
- [x] T139 [P] Responsive pass on `TripsListPage`, `TripDetailPage`, and workflow dialogs at mobile/tablet/desktop breakpoints.
- [x] T140 [P] Accessibility pass: keyboard navigation, dialog focus trap, table headers, and timeline `aria-label` on trip pages.
- [x] T141 [P] Dark mode spot-check on all trip pages and dialogs.
- [ ] T142 Execute manual validation checklist in `specs/007-trip-management/quickstart.md` against live Backend P006 and document any contract deltas in service comments only.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — **blocks all user stories**
- **Phase 3 (US1)**: Depends on Phase 2
- **Phase 4 (US2)**: Depends on Phase 3 (detail navigation target)
- **Phase 5 (US3)**: Depends on Phase 3; can parallel with Phase 4 after detail exists
- **Phase 6 (US4)**: Depends on Phase 3 — parallel with Phases 4–5 after detail shell
- **Phase 7 (US5)**: Depends on Phase 3 — parallel with Phases 4–6
- **Phase 8 (US6)**: Depends on Phase 3 — parallel with Phases 4–7
- **Phase 9 (US7)**: Depends on Phase 5 (lifecycle fields); partial route/odometer can start after Phase 3
- **Phase 10 (Polish)**: Depends on all desired user story phases complete

### User Story Dependencies

| Story | Depends on        | Can parallel with      |
| ----- | ----------------- | ---------------------- |
| US1   | Phase 2           | —                      |
| US2   | US1 (detail page) | US3 after US1          |
| US3   | US1               | US2, US4–US6 after US1 |
| US4   | US1               | US5, US6, US2, US3     |
| US5   | US1               | US4, US6, US2, US3     |
| US6   | US1               | US4, US5, US2, US3     |
| US7   | US3 (recommended) | US4–US6                |

### Parallel Opportunities

```text
Phase 1: T002–T021 all [P] in parallel after T001
Phase 2: T022–T027 types [P]; T029–T036 service sequential on trip.service.ts; T041–T049 wiring [P] after permissions defined
After US1 (Phase 3):
  Stream A: US2 create/edit (T067–T077)
  Stream B: US3 workflow (T078–T091)
  Stream C: US4 members (T092–T101)
  Stream D: US5 vehicle (T102–T109)
  Stream E: US6 transactions (T110–T121)
Then US7 timeline (T122–T130)
Phase 10: T139–T141 [P]
```

---

## Parallel Example: User Story 1

```bash
# After Phase 2, parallelize list vs detail components:
Task T053: TripStatusBadge in src/features/trips/components/TripStatusBadge.tsx
Task T054: TripRouteSummary in src/features/trips/components/TripRouteSummary.tsx
Task T055: TripsListPage in src/features/trips/pages/TripsListPage.tsx
Task T060: TripDetailPage in src/features/trips/pages/TripDetailPage.tsx
```

---

## Parallel Example: User Stories 4 + 5 + 6

```bash
# After Phase 3 detail layout exists, split panel work:
Developer A: T092–T101 TripMembersPanel + TripMemberAssignDialog
Developer B: T102–T109 TripVehiclePanel + TripVehicleAssignDialog
Developer C: T110–T121 TripTransactionsPanel + TripTransactionAssignDialog
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Complete Phase 1: Setup scaffolding
2. Complete Phase 2: Foundational (critical path)
3. Complete Phase 3: US1 — list, filter, open detail
4. **STOP and VALIDATE**: quickstart scenarios 1 and partial 7 (read-only route display)
5. Demo trip discovery MVP

### Incremental Delivery

1. Setup + Foundational → infrastructure ready
2. US1 List/detail → test browse and open
3. US2 Create/edit → test plan trips
4. US3 Workflow → test schedule/start/complete/cancel
5. US4 Members → test crew assignment
6. US5 Vehicle → test fleet assignment
7. US6 Transactions → test operational linking
8. US7 Timeline/odometer → full operational visibility
9. Phase 10 Polish → production ready for Spec 008

### Suggested MVP Scope

**Minimum**: Phase 1 + Phase 2 + Phase 3 (US1) — delivers protected `/trips` list and detail read UX.

**Core operations**: Add Phase 4 (US2) + Phase 5 (US3) — create trips and execute workflow.

**Full Spec 007**: All phases through T142.

---

## Notes

- All trip work lives under `src/features/trips/` — do not create duplicate modules
- Do not duplicate transaction settlement, pricing, or lifecycle logic from Specs 005–006
- Odometer distance must never be calculated on the frontend unless backend contract explicitly requires it
- Permission keys in T041/T043 must be reconciled against live Backend P006 during implementation
- Workflow eligibility is backend-authoritative; `trip-workflow.ts` is display hints only
- Commit after each task group or logical checkpoint
- `[P]` tasks = different files, no incomplete-task dependencies
