# Quickstart: Trip Management (Spec 007)

Manual validation guide for Backend P006 integration. Run after implementation phases complete.

## Prerequisites

- Node.js 20+, pnpm 9+
- Scrappy Backend running with P006 Trip Management enabled
- `VITE_API_BASE_URL` pointing to backend (e.g. `http://localhost:3000/api/v1`)
- Seed accounts with OWNER, MANAGER, and EMPLOYEE roles
- At least one branch, warehouse, vehicle, employee, and draft transaction available

## Setup

```bash
pnpm install
pnpm dev
```

Log in as **OWNER** or **MANAGER** for full workflow coverage.

## Quality gates (automated)

```bash
pnpm typecheck
pnpm lint
pnpm build
```

All must pass before manual sign-off.

## Scenario 1 — Navigation and list (User Story 1)

1. Confirm **Trips** appears in sidebar when user has `trips.view`.
2. Navigate to `/trips`.
3. Verify list loads with skeleton then data (or empty state).
4. Apply status filter → results update.
5. Search by trip number or origin → results update.
6. Change sort and pagination → URL/query params behave correctly.
7. Log in as user **without** `trips.view` → nav hidden; direct `/trips` → forbidden.

**Expected**: Responsive table/cards; status badges; no console errors.

## Scenario 2 — Create and edit trip (User Story 2)

1. Click **New trip** → `/trips/new`.
2. Submit empty form → inline validation errors.
3. Fill origin, destination, scheduled start, branch → submit.
4. **Expected**: Success toast; redirect to detail; status `DRAFT`.
5. Open **Edit** → change destination → save.
6. **Expected**: Detail reflects updated destination from API.

## Scenario 3 — Workflow (User Story 3)

On a draft trip with vehicle and members assigned (if required by backend):

1. **Schedule** → confirm → status `SCHEDULED`.
2. **Start** → enter starting odometer if prompted → status `STARTED`; `actualStartAt` visible.
3. **Complete** → enter ending odometer if prompted → status `COMPLETED`; odometer/distance from API only.
4. On a separate draft trip, **Cancel** with reason → status `CANCELLED`.

**Failure path**: Start without odometer when required → backend error message; status unchanged.

## Scenario 4 — Trip members (User Story 4)

1. On eligible trip, open **Assign employees** → select employees → confirm.
2. **Expected**: Members list shows names from employee API.
3. Remove a member (if allowed) → list refreshes.
4. Attempt duplicate assign → backend error surfaced.

## Scenario 5 — Vehicle assignment (User Story 5)

1. Assign vehicle to draft trip → vehicle panel shows plate number.
2. Change vehicle (if allowed) → new vehicle displayed.
3. Assign vehicle already on another **Started** trip → conflict error from API (no false success).

## Scenario 6 — Transaction linking (User Story 6)

1. Open **Assign transactions** → search linkable transactions.
2. Link a transaction → summary row shows number, direction, status, amount from API.
3. Click row → navigates to `/transactions/:id` (existing module).
4. Attempt invalid link (e.g. outside rule) → backend validation message shown.
5. Unlink (if allowed) → row removed after refresh.

**Expected**: No settlement buttons on trip page; amounts match transaction API.

## Scenario 7 — Timeline and route (User Story 7)

1. Open completed trip → route section shows origin, destination, scheduled/actual times.
2. Timeline shows schedule/start/complete events with timestamps from backend.
3. Odometer section shows values only when API provides them (no client-calculated distance).

## Scenario 8 — Responsive and accessibility

1. Resize to mobile width → list cards stack; detail sections stack; dialogs usable.
2. Tab through create form and workflow dialog → focus visible; Escape closes dialog.
3. Toggle dark mode → trip pages readable.

## Scenario 9 — Out of scope audit

Confirm **none** of the following exist under `src/features/trips/`:

- Expense routes or services
- Analytics/report/activity-log UI

## Scenario 10 — Spec 008 readiness smoke check

1. `src/features/transactions/` settlement flows still work (open a paid transaction receipt).
2. No architectural changes required in `app/router` beyond trip routes.
3. `pnpm build` bundle includes lazy trip chunks (not in main bundle).

## Troubleshooting

| Issue                  | Check                                                     |
| ---------------------- | --------------------------------------------------------- |
| 404 on `/trips`        | Backend P006 deployed; base URL correct                   |
| Actions missing        | Permission keys in `session.ts` vs backend role           |
| Workflow 409           | Refresh detail; another user may have changed status      |
| Empty employee labels  | `useEmployeeOptions` / label map cache (Spec 005 pattern) |
| Link transaction fails | Outside-location rules — read API error message           |

## References

- [spec.md](./spec.md) — requirements and acceptance criteria
- [data-model.md](./data-model.md) — entity shapes
- [contracts/api-endpoints.md](./contracts/api-endpoints.md) — service methods
- [contracts/routes-and-guards.md](./contracts/routes-and-guards.md) — routing matrix
- [plan.md](./plan.md) — implementation phases
