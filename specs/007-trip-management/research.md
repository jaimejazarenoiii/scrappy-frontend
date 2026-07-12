# Phase 0 Research: Trip Management

This research documents implementation decisions for Specification 007, aligned with the Scrappy Web Constitution and built strictly on Specifications 001–006. Trip Management is a new `src/features/trips/` module consuming Backend P006.

## R-001 — New feature module (not extension of transactions)

- **Decision**: Implement trips as `src/features/trips/` with its own types, services, hooks, components, and pages. Do not fold trip UI into `src/features/transactions/`.
- **Rationale**: Constitution roadmap lists Trip Management as Backend P006 with dedicated `/trips` routes and navigation; transactions module already handles P004/P005 scope.
- **Alternatives considered**: Extend transactions feature (rejected — violates module boundaries and navigation model).

## R-002 — Backend-driven workflow eligibility

- **Decision**: Workflow action visibility uses **trip status + permission gates + API responses**. Pure helpers in `trip-workflow.ts` answer display questions only (e.g., `status === 'DRAFT'`). Never implement a client-side transition matrix that overrides backend 403/409.
- **Rationale**: Spec FR-007/FR-008; same pattern as Spec 006 settlement.
- **Alternatives considered**: Full client state machine (rejected — duplicates business logic).

## R-003 — Workflow mutation pattern

- **Decision**: Dedicated service methods and TanStack Query mutations per backend action:
  - `POST /trips/:id/schedule`
  - `POST /trips/:id/start` (optional body: starting odometer)
  - `POST /trips/:id/complete` (optional body: ending odometer)
  - `POST /trips/:id/cancel` (optional body: reason)
- Invalidate `tripKeys.detail(id)` and list queries on success.
- **Rationale**: Matches `TransactionService` settlement methods and organization archive patterns; clear error mapping per endpoint.
- **Alternatives considered**: Generic `transition(status)` (rejected — obscures API contract).

## R-004 — Trip status enum

- **Decision**: `TripStatus = 'DRAFT' | 'SCHEDULED' | 'STARTED' | 'COMPLETED' | 'CANCELLED'`. Labels/tones in `trip-status.ts` with fallback for unknown values.
- **Rationale**: Spec FR-006 and user requirements; aligns with backend P006 canonical states.
- **Alternatives considered**: Numeric status codes (rejected — API uses string enums like other modules).

## R-005 — Trip identity and list shape

- **Decision**: Trip records expose `tripNumber` (e.g. `TRIP-YYYYMMDD-000001`) when returned by API. List endpoint returns `TripSummary`; detail returns `TripDetail` with nested members, vehicle, linked transactions (or parallel fetches if API splits resources).
- **Rationale**: Consistent with `transactionNumber` pattern from P004/P005.
- **Alternatives considered**: Client-generated display IDs (rejected — backend is source of truth).

## R-006 — Nested resources vs embedded detail

- **Decision**: `TripService.get` returns full detail when API embeds relationships. If backend uses separate endpoints for members/transactions, service methods call nested paths and hooks compose via `useQueries` or parallel `useQuery` — UI still sees unified detail shape via selectors or a `useTripDetailBundle` hook.
- **Rationale**: Avoids UI knowing whether data is embedded or nested; service layer normalizes.
- **Alternatives considered**: UI calls multiple services directly (rejected — violates service boundary).

## R-007 — Trip members

- **Decision**: Members managed via trip-scoped endpoints (`GET/POST/DELETE /trips/:id/members` or equivalent). Employee labels resolved with `useFormatRecordEmployee` / `useEmployeeLabelMap` from Spec 002/004.
- **Rationale**: Reuses workforce display infrastructure; member business rules stay on backend.
- **Alternatives considered**: Duplicate employee fetch logic in trips feature (rejected).

## R-008 — Vehicle assignment

- **Decision**: Vehicle assign/change via dedicated endpoint or `PATCH` trip `vehicleId`. Vehicle picker uses `VehicleService.list` with active filter. Conflict errors (one active trip per vehicle) displayed from API `VALIDATION_ERROR` or `LIFECYCLE_CONFLICT` — no client pre-check.
- **Rationale**: Spec FR-010; backend enforces fleet rules.
- **Alternatives considered**: Client-side filter excluding vehicles on active trips (rejected — stale without server data).

## R-009 — Transaction linking

- **Decision**: Link/unlink via trip-scoped transaction endpoints. Assign dialog searches linkable transactions through backend search endpoint (status/direction filters as query params). Display reuses `TransactionStatusBadge`, `TransactionDirectionBadge`, and amount fields from transaction types — no settlement actions on trip page.
- **Rationale**: Spec FR-011–FR-013; `TransactionDetail.tripId` already exists for reverse navigation.
- **Alternatives considered**: Client filter of full transaction list (rejected — scale and business rules).

## R-010 — Outside transaction validation

- **Decision**: On link failure, surface normalized API error message in dialog/toast. Do not duplicate outside-location rules from transaction forms.
- **Rationale**: Spec FR-013; backend owns cross-entity validation.
- **Alternatives considered**: Frontend mirror of outside rules (rejected).

## R-011 — Odometer and distance

- **Decision**: Display `startingOdometer`, `endingOdometer`, `distance` only when present on `TripDetail`. Start/complete dialogs collect odometer when API body requires it. **Do not** compute `ending - starting` on client.
- **Rationale**: Spec FR-015.
- **Alternatives considered**: Auto-calculate distance for UX (rejected unless backend documents requirement).

## R-012 — Trip timeline

- **Decision**: Prefer `GET /trips/:id/history` if Backend P006 provides it. Otherwise compose timeline from lifecycle timestamps on detail (`scheduledAt`, `startedAt`, `completedAt`, `cancelledAt`, actor IDs, notes). Mirror `transaction-timeline.ts` approach from Spec 006.
- **Rationale**: Spec FR-014; no invented events.
- **Alternatives considered**: Timeline from mutation toasts only (rejected).

## R-013 — Dashboard vs list

- **Decision**: `TripsDashboardPage` wraps `TripsListPage` (same pattern as `TransactionsDashboardPage`). Optional summary KPI cards render when dashboard endpoint or list `meta` provides counts by status.
- **Rationale**: Spec requests dashboard + list; minimal duplication; matches existing codebase convention.
- **Alternatives considered**: Separate dashboard route (rejected — unnecessary route surface for v1).

## R-014 — Permissions

- **Decision**: Add `PERMISSIONS.trips` keys: `view`, `create`, `update`, `schedule`, `start`, `complete`, `cancel`. Map to OWNER/MANAGER/EMPLOYEE in `session.ts` pending backend reconciliation (OWNER/MANAGER typically full set; EMPLOYEE subset for field execution).
- **Rationale**: Matches transactions and organization permission patterns; navigation uses `trips.view`.
- **Alternatives considered**: Single `trips.manage` key (rejected — inconsistent with granular gates elsewhere).

## R-015 — Zustand usage

- **Decision**: `useTripListStore` for filter persistence and view preferences (table vs cards if implemented). `useTripDialogStore` for active workflow/assign dialog type. No trip entity data in Zustand.
- **Rationale**: Constitution Principle VII; matches `useSettlementDialogStore` from Spec 006.
- **Alternatives considered**: React state only for filters (rejected — loses preference persistence within session).

## R-016 — UI reuse map

- **Decision**: Reuse without duplication:
  - Layout: `PageContainer`, `PageHeader`, `DescriptionList`
  - List: `DataTable`, `FilterBar`, `Pagination`, `useListQuery`
  - Feedback: `PageSkeleton`, `EmptyState`, `ErrorState`, Sonner toasts
  - Auth: `PermissionGuard`, `PermissionGate`
  - Forms: RHF + Zod + `applyApiValidationErrors`
  - Dialogs: `ConfirmDialog`, shadcn `Dialog`/`Sheet` for mobile
  - Timeline: pattern from `TransactionSettlementTimeline`
  - Transaction display: `TransactionStatusBadge`, `TransactionDirectionBadge`
- **Rationale**: Spec FR-019; UI UX Pro Max enterprise quality via existing design system.
- **Alternatives considered**: Trip-specific table primitive (rejected).

## R-017 — Out of scope enforcement

- **Decision**: No routes, services, or nav entries for expenses, analytics, reports, or activity logs. Quality gate task explicitly audits `src/features/trips/` exports.
- **Rationale**: Spec scope boundary; Spec 008+ roadmap.
- **Alternatives considered**: Placeholder stubs (rejected — Constitution deprecates premature module stubs in business areas).

## Open Items (resolve during implementation against Swagger)

| Item                                      | Resolution approach                                        |
| ----------------------------------------- | ---------------------------------------------------------- |
| Exact permission strings from backend     | Reconcile `PERMISSIONS.trips.*` during Phase 2             |
| Member status enum values                 | Type as `string` union when OpenAPI known; fallback label  |
| Linkable transaction search endpoint path | Confirm in `contracts/api-endpoints.md` vs live `/docs`    |
| Archive vs cancel semantics               | Implement archive only if endpoint exists; cancel per spec |

All items have a default documented in contracts sufficient to start implementation without architecture changes.
