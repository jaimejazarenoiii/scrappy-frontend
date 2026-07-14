# Tasks: Specification 011 – Trip Load Management UI (P006 Addendum)

**Input**: Design documents from `/specs/011-trip-load-ui/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Not requested in Specification 011 (manual quickstart validation required).

**Organization**: Tasks grouped by user story for independent implementation and testing. Extends `src/features/trips/` in place; light touch on `src/features/transactions/` for validation banner only. **No new routes.**

## Phase 1: Setup (Trip Load Scaffolding)

**Purpose**: Create new files and placeholders under the existing trips feature so foundational work can proceed without import errors.

- [x] T001 Create trip-load file placeholders under `src/features/trips/`: `types/trip-load.types.ts`, `services/trip-load.service.ts`, `validation/trip-load-item.schema.ts`, `lib/trip-load-eligibility.ts`.
- [x] T002 [P] Extend `src/features/trips/hooks/trip-keys.ts` with placeholder `tripLoadKeys` factory (`detail`, `progress`).
- [x] T003 [P] Create placeholder hooks `src/features/trips/hooks/useTripLoad.ts` and `src/features/trips/hooks/useTripLoadMutations.ts` with stub exports.
- [x] T004 [P] Create placeholder components in `src/features/trips/components/`: `TripLoadSection.tsx`, `TripLoadSummaryCard.tsx`, `TripLoadEditableTable.tsx`, `TripLoadProgressTable.tsx`, `TripLoadItemDialog.tsx`, `RemainingQuantityBadge.tsx`, `TripLoadEmptyState.tsx`, `TripLoadSectionSkeleton.tsx`, `TripLoadToolbar.tsx`.
- [x] T005 [P] Create placeholder transaction files: `src/features/transactions/components/TripLoadValidationBanner.tsx` and `src/features/transactions/hooks/useTripLoadTransactionWarnings.ts`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Types, service layer, permissions, query keys, and eligibility helpers. **No user story work until this phase completes.**

- [x] T006 Define `TripLoadSummary`, `TripLoadItem`, `TripLoadProgressRow`, `TripLoadIndicatorStatus`, and `TripLoadValidationWarning` in `src/features/trips/types/trip-load.types.ts` per `data-model.md`.
- [x] T007 Extend `src/features/trips/types/trip.types.ts`: add `tripLoadEnabled` on `TripDetail`/`TripBase`; add `prepareTripLoad?: boolean` on `CreateTripInput`.
- [x] T008 Implement `TRIP_LOAD_ENDPOINTS` and `TripLoadService` in `src/features/trips/services/trip-load.service.ts` per `contracts/api-endpoints.md`: `getLoad`, `getProgress`, `addItem`, `updateItem`, `deleteItem`, `validateTransaction`.
- [x] T009 Implement `src/features/trips/lib/trip-load-eligibility.ts` with `isTripLoadEditable(trip)`, `shouldShowTripLoadSection(trip)`, and `shouldShowProgressView(trip)` (pure display/eligibility — not authorization).
- [x] T010 Implement full `tripLoadKeys` in `src/features/trips/hooks/trip-keys.ts` and export from feature hooks index if present.
- [x] T011 Implement `useTripLoad(tripId, enabled)` in `src/features/trips/hooks/useTripLoad.ts` using TanStack Query and `TripLoadService.getLoad`.
- [x] T012 Implement `useTripLoadProgress(tripId, enabled)` in `src/features/trips/hooks/useTripLoad.ts` using `TripLoadService.getProgress` (enabled when trip started/completed/cancelled and load enabled).
- [x] T013 Implement mutations in `src/features/trips/hooks/useTripLoadMutations.ts`: `useAddTripLoadItem`, `useUpdateTripLoadItem`, `useDeleteTripLoadItem` with invalidation of `tripLoadKeys`, `tripKeys.detail`.
- [x] T014 Extend `src/features/trips/validation/trip.schema.ts` with `prepareTripLoad: z.boolean().optional().default(false)` on create form values.
- [x] T015 Implement `tripLoadItemSchema` in `src/features/trips/validation/trip-load-item.schema.ts` (materialName, quantity, unit, notes) reusing `ItemUnit` from transaction types.
- [x] T016 Update `src/constants/permissions.ts` additively with `PERMISSIONS.trips.loadView` and `PERMISSIONS.trips.loadManage` (or document mapping to `trips.view`/`trips.update` if backend omits distinct keys).
- [x] T017 Update `PermissionKey` union in `src/constants/permissions.ts` for new trip load permission keys.
- [x] T018 Update `src/features/auth/lib/session.ts` `ROLE_PERMISSIONS`: OWNER/MANAGER get `loadView` + `loadManage`; EMPLOYEE gets `loadView` only.
- [x] T019 Reconcile `TripService.create` in `src/features/trips/services/trip.service.ts` to pass `prepareTripLoad` when present on `CreateTripInput`.
- [x] T020 Run `pnpm typecheck` after foundational changes and fix compile errors in `src/features/trips/` and updated constants.

**Checkpoint**: Data layer and permissions ready — user story implementation can begin.

---

## Phase 3: User Story 1 – Optionally Enable Trip Load (Priority: P1) 🎯 MVP

**Goal**: Prepare Trip Load toggle on create (default OFF); Trip Detail shows Trip Load section only when `tripLoadEnabled === true`.

**Independent Test**: Create trip with toggle OFF → no Trip Load section on detail. Create trip with toggle ON → section visible with empty-state guidance.

- [x] T021 [US1] Add **Prepare Trip Load** toggle + helper text to `src/features/trips/components/TripForm.tsx` (default `false`, `aria-describedby` for helper).
- [x] T022 [US1] Gate toggle visibility in `TripForm` with `PermissionGate` (`PERMISSIONS.trips.loadManage` or `trips.create`) in `src/features/trips/components/TripForm.tsx`.
- [x] T023 [US1] Wire `prepareTripLoad` from form through `src/features/trips/pages/TripCreatePage.tsx` into `TripService.create` payload.
- [x] T024 [US1] Implement visibility gate in `src/features/trips/components/TripLoadSection.tsx`: render `null` when `!trip.tripLoadEnabled`.
- [x] T025 [US1] Integrate `TripLoadSection` into `src/features/trips/pages/TripDetailPage.tsx` after members/vehicle grid and before `TripTransactionsPanel`.
- [x] T026 [US1] Show `TripLoadEmptyState` in `TripLoadSection` when enabled but zero items (editable path stub OK until US2 completes).
- [x] T027 [US1] Verify manual flow per `quickstart.md` sections 1–2 (OFF hidden, ON shows section).

**Checkpoint**: User Story 1 independently testable — opt-in enablement complete.

---

## Phase 4: User Story 2 – Manage Trip Load Items (Priority: P1)

**Goal**: Owners/managers add, edit, and remove load items on draft/pre-start trips; summary card shows backend totals and last updated.

**Independent Test**: On enabled draft trip, add two items, edit one, remove one; summary and table match API after each mutation.

- [x] T028 [P] [US2] Implement `TripLoadSummaryCard` in `src/features/trips/components/TripLoadSummaryCard.tsx` (total items, loaded weight, remaining weight, last updated from API).
- [x] T029 [P] [US2] Implement `TripLoadSectionSkeleton` in `src/features/trips/components/TripLoadSectionSkeleton.tsx`.
- [x] T030 [P] [US2] Implement `TripLoadEmptyState` in `src/features/trips/components/TripLoadEmptyState.tsx` with Add item CTA when editable.
- [x] T031 [P] [US2] Implement `TripLoadToolbar` in `src/features/trips/components/TripLoadToolbar.tsx` with Add item button and `data-slot="trip-load-tools"` for future scanner slot.
- [x] T032 [US2] Implement material/quantity fields reusing `MaterialSuggestionsPicker` in `TripLoadItemDialog` within `src/features/trips/components/TripLoadItemDialog.tsx` (RHF + `tripLoadItemSchema`).
- [x] T033 [US2] Implement `TripLoadEditableTable` in `src/features/trips/components/TripLoadEditableTable.tsx` using `DataTable` with columns Material, Quantity, Unit price N/A, Total N/A, actions Edit/Remove; mobile cards via `renderMobileCard`.
- [x] T034 [US2] Wire add/edit dialog open state and delete `ConfirmDialog` in `src/features/trips/components/TripLoadSection.tsx`.
- [x] T035 [US2] Connect `useTripLoadMutations` to dialog submit and delete confirm in `src/features/trips/components/TripLoadSection.tsx` with toast feedback.
- [x] T036 [US2] Hide Add/Edit/Remove when `!isTripLoadEditable(trip)` or missing `loadManage` permission in `src/features/trips/components/TripLoadSection.tsx`.
- [x] T037 [US2] Add section-level `ErrorState` with retry for failed `useTripLoad` fetch in `src/features/trips/components/TripLoadSection.tsx`.
- [x] T038 [US2] Apply `applyApiValidationErrors` on 400 responses in `src/features/trips/components/TripLoadItemDialog.tsx`.

**Checkpoint**: User Story 2 independently testable — item CRUD on draft trips.

---

## Phase 5: User Story 3 – View Remaining Quantities (Priority: P1)

**Goal**: Started/completed trips show read-only Loaded / Sold / Remaining per material with Normal / Warning / Exceeded indicators; employees view-only.

**Independent Test**: Start a trip with load items and linked transaction activity; progress rows and badges match backend; employee sees no edit controls.

- [x] T039 [P] [US3] Implement `RemainingQuantityBadge` in `src/features/trips/components/RemainingQuantityBadge.tsx` mapping `NORMAL` | `WARNING` | `EXCEEDED` to `StatusBadge` tones.
- [x] T040 [US3] Implement `TripLoadProgressTable` in `src/features/trips/components/TripLoadProgressTable.tsx` with Loaded/Sold/Remaining columns and badge per row; mobile stacked cards.
- [x] T041 [US3] Switch `TripLoadSection` content: editable table when `isTripLoadEditable(trip)` else `TripLoadProgressTable` when `shouldShowProgressView(trip)` in `src/features/trips/components/TripLoadSection.tsx`.
- [x] T042 [US3] Enable `useTripLoadProgress` when progress view active in `src/features/trips/components/TripLoadSection.tsx`.
- [x] T043 [US3] Invalidate `tripLoadKeys.progress` on trip workflow start mutation in `src/features/trips/hooks/useTripWorkflowMutations.ts` (or equivalent workflow hook).
- [x] T044 [US3] Show read-only empty copy (“No trip load was defined”) on started trips with zero items in `src/features/trips/components/TripLoadEmptyState.tsx`.
- [x] T045 [US3] Verify employee role: manage actions absent from DOM on `TripDetailPage` trip load section per `quickstart.md` section 5.

**Checkpoint**: User Story 3 independently testable — progress/remaining visibility complete.

---

## Phase 6: User Story 4 – Transaction Validation Warnings (Priority: P2)

**Goal**: Non-blocking validation banner on transaction create/edit when `locationType === 'TRIP'` and trip has load enabled; form layout unchanged.

**Independent Test**: TRIP transaction with over-quantity or unknown material shows banner; no autofill; form fields unchanged.

- [x] T046 [US4] Implement `useTripLoadTransactionWarnings` in `src/features/transactions/hooks/useTripLoadTransactionWarnings.ts` with debounced call to `TripLoadService.validateTransaction` when `tripId` and draft line items present.
- [x] T047 [US4] Implement `TripLoadValidationBanner` in `src/features/transactions/components/TripLoadValidationBanner.tsx` (`role="status"`, grouped warnings, dismissible until inputs change).
- [x] T048 [US4] Integrate banner above items section in `src/features/transactions/pages/TransactionCreatePage.tsx` when trip location selected (no new form fields).
- [x] T049 [US4] Integrate banner above items section in `src/features/transactions/pages/TransactionEditPage.tsx` when `locationType === 'TRIP'`.
- [x] T050 [US4] Skip validation query when trip load disabled or no `tripId` in `useTripLoadTransactionWarnings.ts`.
- [x] T051 [US4] Verify manual flow per `quickstart.md` section 6.

**Checkpoint**: User Story 4 independently testable — advisory warnings on transactions.

---

## Phase 7: User Story 5 – Responsive Trip Load (Priority: P2)

**Goal**: Desktop panel, tablet collapsible, mobile accordion; readable at 375px without horizontal scroll.

**Independent Test**: Same trip at 375px, 768px, and 1280px — layout modes match spec; progress cards readable.

- [x] T052 [US5] Implement responsive wrapper in `src/features/trips/components/TripLoadSection.tsx`: `Card` panel at `lg+`, `Collapsible` at `md`, `Accordion` item at default/mobile.
- [x] T053 [US5] Auto-expand collapsible/accordion when any progress row has `WARNING` or `EXCEEDED` in `src/features/trips/components/TripLoadSection.tsx`.
- [x] T054 [US5] Ensure `TripLoadEditableTable` and `TripLoadProgressTable` use `renderMobileCard` with touch targets ≥44px on primary actions.
- [x] T055 [US5] Verify responsive behavior per `quickstart.md` section 7 (no horizontal scroll on progress cards at 375px).

**Checkpoint**: User Story 5 complete — responsive layouts verified.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Quality gates and documentation alignment across all stories.

- [x] T056 [P] Accessibility pass: table headers, dialog focus trap, toggle labels, banner semantics in `src/features/trips/components/TripLoadSection.tsx` and `src/features/trips/components/TripLoadItemDialog.tsx`.
- [x] T057 [P] Dark mode spot-check on summary card, badges, and empty states (use semantic tokens only).
- [x] T058 [P] Invalidate `tripLoadKeys.progress` from transaction item mutations when transaction is trip-linked (hook into existing transaction mutation success handlers or document deferral if backend pushes updates only on settle).
- [x] T059 Run full `specs/011-trip-load-ui/quickstart.md` validation checklist (sections 1–9).
- [x] T060 Run `pnpm typecheck`, `pnpm lint`, and `pnpm build`; fix any errors in touched files.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1 — **BLOCKS all user stories**.
- **Phase 3 (US1)**: Depends on Phase 2 — MVP enablement.
- **Phase 4 (US2)**: Depends on Phase 2 + US1 section shell (T024–T025).
- **Phase 5 (US3)**: Depends on Phase 2; integrates with US2 section (T041 switches views).
- **Phase 6 (US4)**: Depends on Phase 2 (`validateTransaction` service); independent of US2/US3 UI.
- **Phase 7 (US5)**: Depends on US2/US3 tables existing in `TripLoadSection`.
- **Phase 8 (Polish)**: Depends on desired user stories being complete.

### User Story Dependencies

| Story | Depends on                 | Can parallelize after                                                            |
| ----- | -------------------------- | -------------------------------------------------------------------------------- |
| US1   | Foundational               | Phase 2 complete                                                                 |
| US2   | US1 section shell          | T025 merged                                                                      |
| US3   | Foundational + section     | Phase 2 (progress UI parallel to US2 table with coordination on TripLoadSection) |
| US4   | Foundational               | Phase 2 (parallel to US2/US3)                                                    |
| US5   | US2 + US3 table components | T033, T040 complete                                                              |

### Within Each User Story

- Types/schemas before components that consume them ( covered in Phase 2 for shared types).
- Service/hooks before UI wiring.
- Section shell before CRUD/progress tables.

### Parallel Opportunities

- **Phase 1**: T002–T005 all [P] in parallel after T001.
- **Phase 2**: T006–T015 can partially parallelize types (T006–T007) vs permissions (T016–T018) after types land.
- **Phase 4**: T028–T031 [P] component shells in parallel.
- **Phase 5**: T039 [P] badge parallel to US2 table work if different owners.
- **Phase 6**: Can start T046–T047 as soon as T008 `validateTransaction` exists (Phase 2).
- **Phase 8**: T056–T058 [P] in parallel.

---

## Parallel Example: User Story 2

```bash
# Parallel component shells (after Phase 2):
Task: "Implement TripLoadSummaryCard in src/features/trips/components/TripLoadSummaryCard.tsx"
Task: "Implement TripLoadSectionSkeleton in src/features/trips/components/TripLoadSectionSkeleton.tsx"
Task: "Implement TripLoadEmptyState in src/features/trips/components/TripLoadEmptyState.tsx"
Task: "Implement TripLoadToolbar in src/features/trips/components/TripLoadToolbar.tsx"

# Then sequential integration:
Task: "Wire add/edit dialog and delete ConfirmDialog in TripLoadSection.tsx"
```

---

## Parallel Example: User Story 4 (while US2 in progress)

```bash
# After T008 validateTransaction exists:
Task: "Implement useTripLoadTransactionWarnings in src/features/transactions/hooks/useTripLoadTransactionWarnings.ts"
Task: "Implement TripLoadValidationBanner in src/features/transactions/components/TripLoadValidationBanner.tsx"
# Does not require TripLoadSection UI to be complete
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (**critical**)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE** quickstart sections 1–2
5. Demo opt-in Trip Load visibility

### Incremental Delivery

1. Setup + Foundational → data layer ready
2. US1 → opt-in toggle and conditional section (**MVP**)
3. US2 → item CRUD on draft trips
4. US3 → remaining quantities after start
5. US4 → transaction warnings
6. US5 → responsive polish
7. Polish → quickstart + CI

### Suggested MVP Scope

**User Story 1 only** (Phases 1–3): proves optional Trip Load without item management.  
**Production MVP**: US1 + US2 + US3 (Phases 1–5) — full trip load lifecycle before transaction warnings.

---

## Notes

- Reconcile API paths with Swagger (`GET /docs`) before implementing `TripLoadService`; update `contracts/api-endpoints.md` if paths differ.
- Do not add new routes or navigation entries.
- Do not change transaction form field order or add autofill from load plan.
- `[P]` tasks = different files, no incomplete-task dependencies.
- Commit after each task or logical group.
- Stop at any **Checkpoint** to validate story independently.
