# Routes and Guards: Trip Management (Spec 007)

Maps to Backend P006. New top-level **Trips** navigation item (unlike Spec 006 settlement which stayed under Transactions).

## Protected Routes

### Trips dashboard / list

- **Route**: `/trips`
- **Guard**: `PermissionGuard` with `PERMISSIONS.trips.view`
- **Lazy**: `TripsDashboardPage` (wraps list + optional summary)
- **Notes**: Search, filter, sort, pagination; primary CTA “New trip” when `trips.create`

### Create trip

- **Route**: `/trips/new`
- **Guard**: `PermissionGuard` with `PERMISSIONS.trips.create`
- **Lazy**: `TripCreatePage`
- **Breadcrumb**: Trips → New trip

### Trip detail

- **Route**: `/trips/:id`
- **Guard**: `PermissionGuard` with `PERMISSIONS.trips.view`
- **Lazy**: `TripDetailPage`
- **Notes**: Workflow actions, members, vehicle, transactions, timeline, odometer
- **Breadcrumb**: Trips → {tripNumber or origin → destination}

### Edit trip

- **Route**: `/trips/:id/edit`
- **Guard**: `PermissionGuard` with `PERMISSIONS.trips.update`
- **Lazy**: `TripEditPage`
- **Gate**: Route entry and Edit button only when backend allows edit (typically `DRAFT`)
- **Breadcrumb**: Trips → {trip} → Edit

## Action Visibility Matrix (PermissionGate + status hints)

Backend 403 is authoritative when client gating is optimistic.

| Action             | Min permission (proposed) | Status hint (display only)     |
| ------------------ | ------------------------- | ------------------------------ |
| New trip           | `trips.create`            | —                              |
| Edit trip          | `trips.update`            | `DRAFT` (confirm via API)      |
| Schedule           | `trips.schedule`          | `DRAFT`                        |
| Start              | `trips.start`             | `SCHEDULED`                    |
| Complete           | `trips.complete`          | `STARTED`                      |
| Cancel             | `trips.cancel`            | `DRAFT`, `SCHEDULED` (per API) |
| Assign members     | `trips.update`            | non-terminal statuses per API  |
| Assign vehicle     | `trips.update`            | non-terminal statuses per API  |
| Link transaction   | `trips.update`            | per API                        |
| Unlink transaction | `trips.update`            | per API                        |

## Route Constants (extend `src/constants/routes.ts`)

```text
ROUTES.trips: '/trips'
ROUTES.tripsNew: '/trips/new'
ROUTES.tripDetail: '/trips/:id'
ROUTES.tripEdit: '/trips/:id/edit'

buildRoute.tripDetail(id)
buildRoute.tripEdit(id)
```

## Router Registration (`src/app/router/routes.tsx`)

- Add lazy imports for all trip pages
- Register as children under `DashboardLayout` + `AuthGuard` (same pattern as branches, transactions)
- Preserve code splitting per page

Example structure:

```text
{
  path: 'trips',
  children: [
    { index: true, element: <PermissionGuard permission={trips.view}><TripsDashboardPage /></PermissionGuard> },
    { path: 'new', element: <PermissionGuard permission={trips.create}><TripCreatePage /></PermissionGuard> },
    { path: ':id', element: <PermissionGuard permission={trips.view}><TripDetailPage /></PermissionGuard> },
    { path: ':id/edit', element: <PermissionGuard permission={trips.update}><TripEditPage /></PermissionGuard> },
  ],
}
```

Exact structure must match existing `routes.tsx` conventions (nested `RouteObject` arrays).

## Navigation (`src/constants/navigation.ts`)

```text
{
  id: 'trips',
  label: 'Trips',
  href: ROUTES.trips,
  icon: Route, // or MapPin / Truck from lucide — pick distinct from Vehicles
  anyOf: [PERMISSIONS.trips.view],
}
```

Insert after Transactions item to match roadmap order (workforce → transactions → trips).

## Breadcrumbs

Extend `src/lib/breadcrumb.ts` and `useBreadcrumbTrail`:

| Segment | Label source                                             |
| ------- | -------------------------------------------------------- |
| `trips` | "Trips"                                                  |
| `new`   | "New trip"                                               |
| `:id`   | `tripNumber` or truncated route summary from query cache |
| `edit`  | "Edit"                                                   |

## Cross-module deep links

| From                              | To                 | Route                                                        |
| --------------------------------- | ------------------ | ------------------------------------------------------------ |
| Trip detail → transaction row     | Transaction detail | `buildRoute.transactionDetail(id)`                           |
| Transaction detail (`tripId` set) | Trip detail        | `buildRoute.tripDetail(tripId)` (optional polish — additive) |

## Forbidden / not found

- No permission: `PermissionGuard` redirects to `/403` or shows forbidden per existing app behavior
- Unknown trip id: `TripDetailPage` empty/not-found state with link back to `/trips`

## Out of scope routes

Do not add: `/expenses/*`, `/analytics/*`, `/reports/*`, `/activity-logs/*`

## Spec 008 readiness

- Trip routes stable under `/trips/*`
- No shared layout refactor required for Expense Management
- Permission namespace `trips.*` isolated from `transactions.*`
