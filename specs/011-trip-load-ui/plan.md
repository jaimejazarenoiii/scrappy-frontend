# Implementation Plan: Trip Load Management UI (P006 Addendum)

**Branch**: `011-trip-load-ui` | **Date**: 2026-07-14 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/011-trip-load-ui/spec.md`

**Note**: Extends Specification 007 (Trip Management) and integrates lightly with Specification 005 (Transactions). Backend Trip Load API is complete; this plan covers frontend technical architecture only—no implementation code in this document.

## Summary

Deliver Trip Load as an **optional, in-place extension** of the existing Trips module (`src/features/trips/`). Managers and owners can enable **Prepare Trip Load** at trip creation, define load items on draft trips, and view **Loaded / Sold / Remaining** progress after the trip starts. Employees view load and remaining quantities read-only. Transaction create/edit screens gain a **non-blocking validation banner** when linked to a trip with load enabled—form layout and manual entry unchanged.

Technical approach:

- Add trip-load types, service methods, Zod schemas, TanStack Query hooks, and UI components under `src/features/trips/`
- Extend `TripForm` / create flow with toggle; extend `TripDetailPage` with `TripLoadSection`
- Add transaction-side `TripLoadValidationBanner` + debounced validation hook in `src/features/transactions/`
- Reuse shared primitives: `DataTable`, `Card`, `ConfirmDialog`, `StatusBadge`, `MaterialSuggestionsPicker`, `PermissionGate`, skeleton/empty/error patterns from Specs 001–007
- No new routes or navigation entries; permission keys additive on `PERMISSIONS.trips`

## Technical Context

**Language/Version**: TypeScript (Strict Mode) on React 19+ with Vite

**Primary Dependencies**: React Router (Data Router), TanStack Query, Axios, Zustand, React Hook Form, Zod, Tailwind CSS v4, Lucide React, Sonner

**Storage**: N/A (frontend only; persistence via Backend P006 Trip Load REST APIs)

**Testing**: Manual quickstart validation + `pnpm typecheck`, `pnpm lint`, `pnpm build`

**Target Platform**: Modern browsers (mobile-first: 320px–1536px+); light and dark mode

**Performance Goals**: Section-level lazy fetch for load data; debounced transaction validation (300–500ms); memoized table columns; no refetch on unrelated trip detail fields

**Constraints**:

- No Axios in UI components (service layer only)
- No server state in Zustand
- No client calculation of sold/remaining/weight totals
- No transaction form layout changes or autofill from load
- No new top-level feature module or routes
- Extend Spec 007 architecture only—no refactor of unrelated features

**Scale/Scope**: ~15 new/modified files under `trips/`; ~3 under `transactions/`; additive permissions in constants/session

## Constitution Check

_GATE: Passed before Phase 0 research. Re-checked after Phase 1 design._

| Gate                                             | Status  | Notes                                                                |
| ------------------------------------------------ | ------- | -------------------------------------------------------------------- |
| API First (I, VIII)                              | ✅ Pass | `TripLoadService` + hooks; UI consumes hooks only                    |
| Type Safety (II, IX)                             | ✅ Pass | Strict TS; Zod for item forms; colocated types                       |
| Feature Architecture (III, XVII, XVIII)          | ✅ Pass | Extends `src/features/trips/`; transaction banner in transactions    |
| Routing (IV, V)                                  | ✅ Pass | No new routes; existing trip/transaction URLs                        |
| State (VII)                                      | ✅ Pass | TanStack Query for load/progress/validation; local dialog state only |
| UI & Styling (VI, X, XI, XII, XXIX–XXXIV, XXXIX) | ✅ Pass | Reuse shared primitives; responsive section wrapper                  |
| Auth & Security (XIV, XX)                        | ✅ Pass | PermissionGate on manage actions; backend 403 handling               |
| Accessibility (XV, XL)                           | ✅ Pass | Table semantics, dialog focus, banner `role="status"`                |
| Responsive Design (XXVII, XXXI)                  | ✅ Pass | Panel / collapsible / accordion by breakpoint                        |
| Page & Table Standards (XXXII, XXXVI)            | ✅ Pass | Trip Load table follows DataTable pattern                            |
| Forms & Dashboards (XXXVII, XXXVIII)             | ✅ Pass | RHF + Zod item dialog; toggle on create form                         |
| AI UI Standards (XXVIII, XL)                     | ✅ Pass | Reuse-first; no duplicate material picker                            |
| Performance (XVI, XXXV)                          | ✅ Pass | Debounced validation; targeted invalidation                          |
| API Contract (XXVI)                              | ✅ Pass | `contracts/api-endpoints.md`                                         |
| Documentation (XXII)                             | ✅ Pass | research, data-model, contracts, quickstart complete                 |

No violations. Complexity Tracking not required.

---

## 1. Feature Architecture

### Feature boundaries

| In scope                      | Out of scope                       |
| ----------------------------- | ---------------------------------- |
| Trip Load section on detail   | New `/trip-load` routes            |
| Prepare toggle on create      | Expense list on trip detail (v1)   |
| Load item CRUD (pre-start)    | Barcode/QR/scale integrations (v1) |
| Progress/remaining read-only  | Auto-fill transaction materials    |
| Transaction validation banner | Backend/API implementation         |
| Permission-gated actions      | Warehouse picking UI               |

### Dependencies

- **Specification 007**: `TripDetailPage`, `TripCreatePage`, `TripForm`, `TripService`, trip status/workflow helpers
- **Specification 005**: `MaterialSuggestionsPicker`, `ItemUnit`, transaction create/edit pages, items editor
- **Specification 002**: `PermissionGate`, role → permission mapping in `session.ts`
- **Shared UI**: `DataTable`, `Card`, `ConfirmDialog`, `StatusBadge`, `EmptyState`, `ErrorState`, skeletons

### Relationship with Trip Details, Transactions, Expenses

```text
TripDetailPage
├── Overview (existing)
├── Odometer (existing)
├── Members / Vehicle (existing)
├── TripLoadSection ← NEW (conditional on tripLoadEnabled)
├── TripTransactionsPanel (existing — deep links unchanged)
└── History (existing)

TransactionCreatePage / TransactionEditPage
├── Existing header/location/items (unchanged)
└── TripLoadValidationBanner ← NEW (when locationType=TRIP && trip load enabled)

Expenses
└── No UI change in v1; expenses may reference tripId via Expenses module filters (future link optional)
```

### Routing

No new routes. Trip Load is rendered on:

- `ROUTES.tripsNew` — toggle only
- `ROUTES.tripDetail` — full section

Optional hash `#trip-load` for mobile deep focus.

### Data flow

```text
TripCreatePage
  → TripForm (prepareTripLoad)
  → TripService.create
  → navigate TripDetailPage

TripDetailPage
  → useTrip(id)
  → if trip.tripLoadEnabled: useTripLoad(id) | useTripLoadProgress(id) by status
  → TripLoadSection → TripLoadSummary + TripLoadTable | TripLoadProgressTable
  → mutations → TripLoadService → invalidate tripLoadKeys + tripKeys.detail

TransactionEditPage
  → watch tripId + items
  → useTripLoadTransactionWarnings (debounced)
  → TripLoadValidationBanner (warnings only)
```

### Component hierarchy

```text
TripDetailPage
└── TripLoadSection (visibility: tripLoadEnabled)
    ├── TripLoadSectionHeader
    │   ├── title + description
    │   └── TripLoadToolbar [Add item] (+ future scanner slot)
    ├── TripLoadSummaryCard
    ├── TripLoadEditableTable | TripLoadProgressTable  (by status)
    │   └── TripLoadItemRow | TripLoadProgressRow
    │       └── RemainingQuantityBadge
    ├── TripLoadEmptyState | TripLoadSectionError | TripLoadSectionSkeleton
    ├── TripLoadItemDialog (add/edit)
    └── ConfirmDialog (delete)

TransactionEditPage / TransactionCreatePage
└── TripLoadValidationBanner
```

### Why Trip Load lives on Trip Details (not a separate module)

1. **Single operational context** — load plan is meaningless without trip status, vehicle, members, and linked transactions.
2. **Optional section** — hiding/showing a panel is simpler than a separate route users must discover.
3. **Shared cache** — trip id, permissions, and workflow state already loaded on detail.
4. **Constitution alignment** — extends Backend P006 trip domain without inventing a new product module on the roadmap.

---

## 2. Screen Architecture

### Trip Details — section order (target)

| Order | Section         | Visibility                 |
| ----- | --------------- | -------------------------- |
| 1     | Overview        | always                     |
| 2     | Odometer        | always                     |
| 3     | Members/Vehicle | always                     |
| 4     | **Trip Load**   | `tripLoadEnabled === true` |
| 5     | Transactions    | always                     |
| 6     | History         | always                     |

**Expenses**: not on trip detail in v1; document cross-link to Expenses filtered by `tripId` as future enhancement.

### Trip Create

- Existing form sections unchanged
- Insert **Prepare Trip Load** toggle after planning fields (vehicle, schedule, route), before members
- Helper: “Optional — define materials expected on this trip before departure.”

### Visibility rules

| Condition                       | Trip Load section |
| ------------------------------- | ----------------- |
| `tripLoadEnabled === false`     | hidden            |
| `tripLoadEnabled === true`      | visible           |
| Draft + manage permission       | editable table    |
| Started / Completed / Cancelled | progress table    |
| Load fetch error                | error state       |
| Employee                        | view only         |

---

## 3. UI Components

| Component                  | Responsibility                               | Reuse base                           |
| -------------------------- | -------------------------------------------- | ------------------------------------ |
| `TripLoadSection`          | Orchestrates fetch, layout mode, empty/error | `Card` / `Collapsible` / `Accordion` |
| `TripLoadSummaryCard`      | Total items, weight, remaining, last updated | `DescriptionList` or stat grid       |
| `TripLoadEditableTable`    | Plan items CRUD table                        | `DataTable` + mobile cards           |
| `TripLoadProgressTable`    | Loaded/Sold/Remaining columns                | `DataTable` + mobile cards           |
| `TripLoadItemRow`          | Single plan row actions                      | table cell / card                    |
| `TripLoadProgressRow`      | Progress metrics + badge                     | table cell / card                    |
| `RemainingQuantityBadge`   | Normal / Warning / Exceeded visual           | `StatusBadge` tones                  |
| `TripLoadValidationBanner` | Non-blocking transaction warnings            | alert/banner pattern                 |
| `TripLoadEmptyState`       | No items / no progress                       | `EmptyState`                         |
| `TripLoadSectionSkeleton`  | Section loading                              | `Skeleton`                           |
| `TripLoadItemDialog`       | Add/edit form                                | `Dialog` + RHF                       |
| `TripLoadMaterialField`    | Material input                               | wraps `MaterialSuggestionsPicker`    |
| `TripLoadQuantityField`    | Quantity + unit                              | `Input` + `Select`                   |
| `TripLoadToolbar`          | Primary actions + future tool slot           | `Button` group                       |

---

## 4. User Experience Flow

### Manager

```text
Open Trips → Trip Detail (draft)
  → [if enabled] Trip Load section
  → Add items → Save dialogs
  → Start Trip (workflow)
  → View Loaded / Sold / Remaining (read-only)
Create path:
  New Trip → Enable Prepare Trip Load → Create → Detail with empty load
```

### Employee

```text
Open assigned Trip
  → Trip Load section (read-only)
  → View remaining quantities / indicators
  → No Add/Edit/Remove
```

### Transaction (unchanged entry + warning)

```text
Create/Edit Transaction (TRIP location, trip selected)
  → Enter materials manually (same as today)
  → Debounced validation → banner if warnings
  → Submit per existing flow (backend may allow or reject)
```

---

## 5. State Management Strategy

| Concern              | Approach                                                                |
| -------------------- | ----------------------------------------------------------------------- |
| Load items/summary   | TanStack Query `useTripLoad(tripId)`                                    |
| Progress rows        | TanStack Query `useTripLoadProgress(tripId)` enabled when started+      |
| Item mutations       | `useMutation` → invalidate load + progress + trip detail                |
| Transaction warnings | `useQuery` with debounced inputs; `enabled` when tripId + items present |
| Dialog open/item id  | Local `useState` in `TripLoadSection`                                   |
| Prepare toggle       | RHF field on create form (`prepareTripLoad`)                            |
| Optimistic updates   | Off by default (research R-011)                                         |
| Zustand              | Not used for load data                                                  |

**Cache invalidation**: see `contracts/api-endpoints.md`.

**Form state**: `TripLoadItemDialog` uses RHF + Zod; `applyApiValidationErrors` on 400 responses.

---

## 6. API Integration Strategy

Service: `src/features/trips/services/trip-load.service.ts` (or extend `trip.service.ts`).

| Hook                             | Service method        | When                                  |
| -------------------------------- | --------------------- | ------------------------------------- |
| `useTripLoad`                    | `getLoad(tripId)`     | `tripLoadEnabled && detail open       |
| `useTripLoadProgress`            | `getProgress(tripId)` | started/completed/cancelled + enabled |
| `useAddTripLoadItem`             | `addItem`             | dialog submit                         |
| `useUpdateTripLoadItem`          | `updateItem`          | dialog submit                         |
| `useDeleteTripLoadItem`          | `deleteItem`          | confirm dialog                        |
| `useTripLoadTransactionWarnings` | `validateTransaction` | transaction pages with trip context   |

**Request flow (add item)**:

```text
User submit dialog
  → mutation POST item
  → onSuccess: invalidate queries, toast, close dialog
  → onError: inline errors + toast
```

Create trip with toggle:

```text
TripForm prepareTripLoad
  → POST /trips { ..., prepareTripLoad: true }
  → response tripLoadEnabled true
  → detail shows section
```

---

## 7. Validation Strategy

### Client-side (UX)

- Material required, trimmed, max length
- Quantity positive number
- Unit required enum
- Notes optional max length
- Soft duplicate warning: same material+unit already in table (allow submit—backend decides)

### Server-side

- Display via `applyApiValidationErrors` and toast
- 409 trip started → “Trip load can’t be changed after the trip has started”
- 403 → permission message

### Transaction warnings

- Display-only list from validate endpoint
- Group by code; primary message + optional detail list
- Dismissible per session or until inputs change

---

## 8. Authorization Strategy

| Role     | Prepare toggle | View load | Manage items | View progress |
| -------- | -------------- | --------- | ------------ | ------------- |
| Owner    | yes            | yes       | yes          | yes           |
| Manager  | yes            | yes       | yes          | yes           |
| Employee | no             | yes*      | no           | yes*          |

\*When trip visible per Spec 007 employee rules.

**UI behavior**: hide manage buttons entirely (not disabled-with-tooltip) when unauthorized. Use `PermissionGate` + `isTripLoadEditable(trip)`.

---

## 9. Responsive Design

| Breakpoint | Trip Load presentation                                      |
| ---------- | ----------------------------------------------------------- |
| `< md`     | Accordion; stacked cards; full-width Add button             |
| `md–lg`    | Collapsible section; summary chips in header when collapsed |
| `≥ lg`     | Dedicated panel (`Card`); full table columns                |

Sticky action: on mobile, optional sticky footer **Add item** when section expanded and editable—only if scroll hides toolbar (evaluate during implementation).

---

## 10. Loading & Empty States

| State                | UX                                                       |
| -------------------- | -------------------------------------------------------- |
| Initial section load | `TripLoadSectionSkeleton` (summary + 3 row placeholders) |
| Saving item          | Dialog submit disabled + spinner                         |
| Deleting             | Confirm dialog loading                                   |
| Empty editable       | Package icon, “No items on this load yet”, Add CTA       |
| Empty read-only      | “No trip load was defined”                               |
| No warnings          | Banner absent (not “empty banner”)                       |
| Progress loading     | Skeleton rows with badge placeholders                    |

---

## 11. Error Handling

| Scenario               | UX                                                          |
| ---------------------- | ----------------------------------------------------------- |
| API fetch failure      | Section `ErrorState` + retry; page usable                   |
| Permission denied      | Hide section or show forbidden message per backend          |
| Validation 400         | Inline field errors in dialog                               |
| Network offline        | Toast + retry on mutation                                   |
| Trip cancelled         | Read-only; mutations hidden                                 |
| Trip completed         | Read-only progress                                          |
| Validate endpoint fail | Omit banner or generic “Could not verify against trip load” |

Never expose raw exception strings (Principle XIII).

---

## 12. Accessibility

- Section titled with `h2` + `aria-labelledby`
- Data tables use `<table>`, `<th scope="col">`; mobile cards use list semantics
- Indicator badges include text labels (not color-only)
- Dialogs: focus trap, return focus to trigger on close
- Validation banner: `role="status"` or `role="alert"` for critical exceeded warnings
- Toggle: associated `<label>` + helper text linked via `aria-describedby`
- Touch targets ≥ 44px on mobile actions
- Reduced motion: no required animations for indicators

---

## 13. Acceptance Criteria (Engineering)

- **AC-001**: Prepare Trip Load defaults OFF; when OFF, zero Trip Load DOM sections on detail.
- **AC-002**: When ON at create, detail shows summary + table/progress within one navigation.
- **AC-003**: CRUD mutations refresh summary and table from server within one query cycle.
- **AC-004**: Started trip hides all manage affordances in DOM (not merely `disabled`).
- **AC-005**: Progress table matches backend quantities in manual QA fixture (100/35/65 case).
- **AC-006**: Transaction pages: no new fields; banner appears when warnings returned; no autofill.
- **AC-007**: Employee session: Playwright/manual confirms no manage buttons in accessibility tree.
- **AC-008**: 375px viewport: accordion usable without horizontal scroll on progress cards.
- **AC-009**: Section error retry refetches without full page reload.
- **AC-010**: `pnpm typecheck`, `pnpm lint`, `pnpm build` pass.

---

## 14. Future Extensibility

Stable extension points (v1):

1. **`TripLoadToolbar` `data-slot="trip-load-tools"`** — scanner/scale buttons slot in header
2. **Modular row component** — add columns (picked qty, return qty) without new page
3. **Summary card metrics grid** — add vehicle inventory link tile
4. **Validation banner** — append warning codes for warehouse picking conflicts
5. **Trip detail section order** — Trip Load remains independent panel; Expenses panel can insert below without moving Transactions

Do not embed scanner UI in v1; do not redesign trip header/workflow.

---

## Project Structure

### Documentation (this feature)

```text
specs/011-trip-load-ui/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
└── contracts/
    ├── api-endpoints.md
    └── routes-and-guards.md
```

### Source Code (additive)

```text
src/features/trips/
├── types/
│   └── trip-load.types.ts              # NEW
├── services/
│   └── trip-load.service.ts            # NEW
├── validation/
│   └── trip-load-item.schema.ts        # NEW
├── lib/
│   └── trip-load-eligibility.ts        # NEW (isTripLoadEditable, etc.)
├── hooks/
│   ├── useTripLoad.ts                  # NEW
│   ├── useTripLoadMutations.ts         # NEW
│   └── trip-keys.ts                    # EXTEND load keys
├── components/
│   ├── TripLoadSection.tsx             # NEW
│   ├── TripLoadSummaryCard.tsx         # NEW
│   ├── TripLoadEditableTable.tsx       # NEW
│   ├── TripLoadProgressTable.tsx       # NEW
│   ├── TripLoadItemDialog.tsx          # NEW
│   ├── RemainingQuantityBadge.tsx      # NEW
│   ├── TripLoadEmptyState.tsx          # NEW
│   ├── TripLoadSectionSkeleton.tsx     # NEW
│   └── TripLoadToolbar.tsx             # NEW
├── components/TripForm.tsx             # EXTEND prepareTripLoad toggle
├── pages/TripDetailPage.tsx            # EXTEND insert TripLoadSection
└── types/trip.types.ts                 # EXTEND tripLoadEnabled on detail

src/features/transactions/
├── components/TripLoadValidationBanner.tsx   # NEW
├── hooks/useTripLoadTransactionWarnings.ts   # NEW
├── pages/TransactionCreatePage.tsx           # EXTEND banner
└── pages/TransactionEditPage.tsx             # EXTEND banner

src/constants/permissions.ts            # EXTEND trips.loadView / loadManage
src/features/auth/lib/session.ts        # EXTEND role mapping
```

**Structure Decision**: Extend trips feature in place per research R-001; minimal transaction feature touch for validation banner only.

---

## Implementation Phases

### Phase 0 — Research & Contracts ✅

Deliverables: `research.md`, `data-model.md`, `contracts/*`, `quickstart.md`

### Phase 1 — Data layer

- Types, `TripLoadService`, query keys, eligibility helpers
- Extend `CreateTripInput` + `TripForm` schema with `prepareTripLoad`
- Reconcile Swagger paths

### Phase 2 — Trip Load UI on detail

- `TripLoadSection` and child components
- Wire into `TripDetailPage` after members/vehicle grid
- CRUD dialogs + delete confirm
- Loading/empty/error states

### Phase 3 — Create flow toggle

- Toggle UI on `TripForm` / `TripCreatePage`
- Permission gate on toggle
- Verify hidden section when OFF

### Phase 4 — Progress / remaining view

- `TripLoadProgressTable` + `RemainingQuantityBadge`
- Switch editable vs progress by `trip.status`
- Auto-expand section on WARNING/EXCEEDED (tablet/mobile)

### Phase 5 — Transaction validation banner

- `useTripLoadTransactionWarnings` + banner on create/edit
- Debounce; no layout changes to items editor

### Phase 6 — Permissions & QA

- `permissions.ts`, `session.ts`
- Execute `quickstart.md`
- Typecheck/lint/build

---

## Complexity Tracking

Not required — all constitution gates pass.
