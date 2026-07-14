# Routes & Guards: Trip Load Management UI (P006 Addendum)

Trip Load does **not** introduce new routes. It extends existing trip routes from Specification 007.

## Routes (unchanged)

| Route constant      | Path              | Page             | Trip Load UI                           |
| ------------------- | ----------------- | ---------------- | -------------------------------------- |
| `ROUTES.tripsNew`   | `/trips/new`      | `TripCreatePage` | Prepare Trip Load toggle on form       |
| `ROUTES.tripDetail` | `/trips/:id`      | `TripDetailPage` | Trip Load section when enabled         |
| `ROUTES.tripEdit`   | `/trips/:id/edit` | `TripEditPage`   | No load toggle in v1 (unless API adds) |

Deep links: `/trips/{id}#trip-load` optional hash for accordion focus on mobile—implement if anchor navigation needed.

## Permission keys (additive)

Extend `PERMISSIONS.trips`:

| Key          | Purpose                    | OWNER | MANAGER | EMPLOYEE |
| ------------ | -------------------------- | ----- | ------- | -------- |
| `loadView`   | View Trip Load section     | yes   | yes     | yes*     |
| `loadManage` | Add/edit/delete load items | yes   | yes     | no       |

\*Employee view follows trip access rules (assigned member or company viewer per backend).

If backend reuses `trips.view` / `trips.update` only, map:

- `loadView` → `trips.view`
- `loadManage` → `trips.update`

Reconcile in `session.ts` during implementation.

## Guards

| Surface                  | Guard                                                            |
| ------------------------ | ---------------------------------------------------------------- |
| Trip create toggle       | `PermissionGate` `loadManage` or `trips.create`                  |
| Trip Load section (read) | `loadView` + `tripLoadEnabled`                                   |
| Add/Edit/Remove item     | `loadManage` + editable trip status                              |
| Transaction warnings     | No extra route guard; runs when user can edit/create transaction |

## Navigation

No new sidebar item. Trip Load is discovered within Trips module.

## Breadcrumbs

Unchanged trip breadcrumb trail. Section heading “Trip Load” is in-page only.

## Transaction routes (extension only)

| Route                     | Change                                              |
| ------------------------- | --------------------------------------------------- |
| `transactionNew` / `edit` | Inject `TripLoadValidationBanner` when `tripId` set |

No new transaction routes.
