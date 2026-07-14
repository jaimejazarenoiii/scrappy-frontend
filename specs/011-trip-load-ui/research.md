# Phase 0 Research: Trip Load Management UI (P006 Addendum)

Research for Specification 011 — extends `src/features/trips/` in place. Backend Trip Load API is assumed complete; reconcile paths against Swagger during implementation.

## R-001 — Extend trips feature in place (not a separate module)

- **Decision**: Implement Trip Load under `src/features/trips/` as components, hooks, validation, and service methods colocated with existing trip code. No new top-level feature folder, routes, or navigation entries.
- **Rationale**: Trip Load is an optional section on Trip Create and Trip Detail; it shares trip identity, status, permissions, and cache keys. A separate module would duplicate trip context fetching and fragment UX.
- **Alternatives considered**: `src/features/trip-load/` (rejected — artificial boundary for UI that only exists on trip screens).

## R-002 — Section visibility driven by backend flag

- **Decision**: Render Trip Load section only when `tripLoadEnabled` (or equivalent) is `true` on trip detail/create payload. When `false`, omit the section entirely—no placeholder card.
- **Rationale**: Spec FR-002; optional feature must not nag users.
- **Alternatives considered**: Always show collapsed “Enable trip load” promo (rejected — feels mandatory).

## R-003 — Prepare Trip Load on create only (v1)

- **Decision**: Add `prepareTripLoad: boolean` to create trip form (default `false`); send as part of `POST /trips` body when backend supports it. Do not expose toggle on edit unless backend documents `PATCH` support—follow API eligibility.
- **Rationale**: Spec user story 1; avoids edit-time scope creep until backend confirms.
- **Alternatives considered**: Enable on detail after create (deferred—implement if API adds endpoint).

## R-004 — Editability tied to trip status + permissions

- **Decision**: Trip Load item CRUD allowed when `tripLoadEnabled && canManageTripLoad && isPreStartEditable(trip.status)`. Use `isDraftStatus` / extended helper `isTripLoadEditable(status)` where pre-start includes `DRAFT` only unless backend adds `SCHEDULED`. Started, completed, cancelled → read-only remaining view.
- **Rationale**: Spec FR-007; aligns with current codebase `TripStatus` (`DRAFT` | `STARTED` | `COMPLETED` | `CANCELLED`).
- **Alternatives considered**: Allow edit until start action (same as pre-start); confirm with backend lifecycle.

## R-005 — Remaining quantities from backend only

- **Decision**: Display `loaded`, `sold`, `remaining`, and `indicatorStatus` (`NORMAL` | `WARNING` | `EXCEEDED`) per material from `GET /trips/{id}/load/progress` or embedded detail—never compute sold/remaining on client.
- **Rationale**: Spec FR-008/FR-009; transaction totals and unit normalization are server concerns.
- **Alternatives considered**: Client sum from linked transactions (rejected — duplicates P004/P005 logic).

## R-006 — Transaction validation: advisory hook, unchanged form layout

- **Decision**: Add `useTripLoadTransactionWarnings({ tripId, lineItems })` (debounced) calling backend validation endpoint when `locationType === 'TRIP'` and trip has load enabled. Render `TripLoadValidationBanner` above items editor—no autofill, no new fields on transaction form.
- **Rationale**: Spec FR-012/FR-013; minimal intrusion into Spec 005 transaction pages.
- **Alternatives considered**: Inline per-row warnings only (accepted as supplement inside banner + optional row hints if API returns line indexes).

## R-007 — Reuse transaction item UX primitives

- **Decision**: Trip Load item form reuses `MaterialSuggestionsPicker`, unit enum from `ItemUnit`, and quantity patterns from `TransactionItemsEditor`. Extract shared presentational inputs only if duplication exceeds ~30 lines; prefer thin wrappers `TripLoadMaterialField`, `TripLoadQuantityField` wrapping existing pickers.
- **Rationale**: Consistent material naming and units across trip load and transactions; constitution reuse-first.
- **Alternatives considered**: Duplicate material autocomplete (rejected).

## R-008 — Permission keys

- **Decision**: Add `PERMISSIONS.trips.loadView` and `PERMISSIONS.trips.loadManage` (or reuse `trips.view` + `trips.update` if backend uses same keys—reconcile in Phase 1). Owners and managers get manage; employees get view only on assigned/visible trips per existing trip access rules.
- **Rationale**: Spec authorization section; explicit keys allow menu/action gating if backend exposes them.
- **Alternatives considered**: Hardcode role checks (rejected — constitution XIV).

## R-009 — Responsive section wrapper

- **Decision**: Single `TripLoadSection` component switches layout via CSS/container:
  - Desktop (`lg+`): static `Card` panel
  - Tablet (`md–lg`): `Collapsible` (Radix/shadcn pattern) default open when any `EXCEEDED`/`WARNING`
  - Mobile: `Accordion` item with id `trip-load`
- **Rationale**: Spec responsive requirements; one data source, three presentations.
- **Alternatives considered**: Separate mobile page (rejected — breaks deep link model).

## R-010 — Query keys and invalidation

- **Decision**: Extend `tripKeys` with `load: (tripId) => [...]` and `loadProgress: (tripId) => [...]`. On item mutations invalidate `load`, `loadProgress`, and `tripKeys.detail(tripId)`. Transaction validation query independent with short stale time (30s).
- **Rationale**: Targeted invalidation; trip detail header counts stay fresh if backend embeds load summary on detail later.
- **Alternatives considered**: Single mega trip detail query only (acceptable if API embeds all load data—still define keys for nested fetches).

## R-011 — Optimistic updates: off by default

- **Decision**: Pessimistic refresh after item add/edit/delete; show inline progress on dialog submit. Optional optimistic row insert only if UX testing shows lag—default off for v1.
- **Rationale**: Load totals and remaining weights are aggregate-sensitive; wrong optimistic totals confuse yard staff.
- **Alternatives considered**: Optimistic summary card (deferred).

## R-012 — Future extensibility slot

- **Decision**: `TripLoadSection` header toolbar reserves `TripLoadToolbar` with primary actions (Add item) and a `data-slot="trip-load-tools"` container for future scanner/scale buttons—empty in v1, no disabled fake buttons.
- **Rationale**: Spec future considerations; avoids layout refactor when hardware integrations ship.
- **Alternatives considered**: Hidden feature flags with ghost icons (rejected — false affordances).

## R-013 — Expenses relationship

- **Decision**: No Expenses section on Trip Detail in v1. Trip Load UI documents relationship: expenses with `contextType: TRIP` remain in Expenses module; optional future link from Trip Load summary to filtered expenses list (`/expenses?tripId=`)—out of scope for initial delivery unless quick win.
- **Rationale**: Current `TripDetailPage` has no expenses panel; Spec 011 out of scope includes expense UI changes.
- **Alternatives considered**: Embed expense list on trip detail (rejected — scope creep).

## R-014 — API contract reconciliation

- **Decision**: Implement against `contracts/api-endpoints.md` in this spec; verify paths on `GET /docs` before coding. Expected resource prefix: `/trips/{tripId}/load`.
- **Rationale**: Backend spec complete per user; frontend contract is planning artifact until Swagger confirm.
- **Alternatives considered**: Wait for OpenAPI codegen (optional enhancement—not blocking).
