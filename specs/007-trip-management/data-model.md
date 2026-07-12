# Data Model: Trip Management (Backend P006)

Frontend types live in `src/features/trips/types/trip.types.ts`. Shapes mirror Backend P006; reconcile field names against Swagger during Phase 1.

## Entities

### Trip (summary — list)

Returned by `GET /trips`.

| Field                | Type           | Notes                           |
| -------------------- | -------------- | ------------------------------- |
| `id`                 | string         | UUID                            |
| `companyId`          | string         | Tenant scope                    |
| `tripNumber`         | string \| null | e.g. `TRIP-20260709-000001`     |
| `status`             | `TripStatus`   | See below                       |
| `origin`             | string         | Route start                     |
| `destination`        | string         | Route end                       |
| `scheduledStartAt`   | string \| null | ISO datetime                    |
| `actualStartAt`      | string \| null | Set when Started                |
| `actualCompletedAt`  | string \| null | Set when Completed              |
| `branchId`           | string \| null | Organizational context          |
| `warehouseId`        | string \| null | Optional                        |
| `vehicleId`          | string \| null | Assigned vehicle                |
| `startingOdometer`   | number \| null | After start                     |
| `endingOdometer`     | number \| null | After complete                  |
| `distance`           | number \| null | **Display only** — from backend |
| `notes`              | string \| null |                                 |
| `cancellationReason` | string \| null | When Cancelled                  |
| `cancelledAt`        | string \| null |                                 |
| `createdAt`          | string         |                                 |
| `updatedAt`          | string         |                                 |
| `deletedAt`          | string \| null | Soft archive if supported       |

**List-only fields** (optional):

- `memberCount` (number)
- `linkedTransactionCount` (number)
- `vehiclePlateNumber` (string) — denormalized for table display

### Trip (detail)

Extends summary with nested or joinable data:

| Field                | Type                         | Notes                                |
| -------------------- | ---------------------------- | ------------------------------------ |
| `members`            | `TripMember[]`               | Or fetched via members endpoint      |
| `vehicle`            | `TripVehicleSummary` \| null | Embedded vehicle snapshot            |
| `linkedTransactions` | `LinkedTransactionSummary[]` | Or fetched via transactions endpoint |
| `scheduledByUserId`  | string \| null               | Lifecycle actor                      |
| `startedByUserId`    | string \| null               |                                      |
| `completedByUserId`  | string \| null               |                                      |
| `cancelledByUserId`  | string \| null               |                                      |

### TripStatus

| Value       | UI label  | Typical editability                    |
| ----------- | --------- | -------------------------------------- |
| `DRAFT`     | Draft     | Full edit; schedule/cancel             |
| `SCHEDULED` | Scheduled | Limited edit; start/cancel per backend |
| `STARTED`   | Started   | Complete only; odometer visible        |
| `COMPLETED` | Completed | Read-only terminal                     |
| `CANCELLED` | Cancelled | Read-only terminal                     |

Unknown status → `StatusBadge` fallback label; no workflow buttons unless API allows.

### TripMember

| Field              | Type                         | Notes                |
| ------------------ | ---------------------------- | -------------------- |
| `id`               | string                       | Membership record id |
| `tripId`           | string                       |                      |
| `employeeId`       | string                       |                      |
| `status`           | `TripMemberStatus` \| string | If backend supports  |
| `assignedAt`       | string                       |                      |
| `assignedByUserId` | string \| null               |                      |

**TripMemberStatus** (when provided): `INVITED` | `CONFIRMED` | `ACTIVE` | `REMOVED` — reconcile with OpenAPI.

**UI rules**: Display employee name via `useFormatRecordEmployee({ employeeId })`; never invent member status.

### TripVehicleSummary

Embedded on detail or resolved from `vehicleId`:

| Field         | Type           |
| ------------- | -------------- |
| `id`          | string         |
| `plateNumber` | string         |
| `description` | string \| null |
| `status`      | string         |

### LinkedTransactionSummary

Lightweight row for trip detail — **not** full `TransactionDetail`.

| Field               | Type                | Notes                    |
| ------------------- | ------------------- | ------------------------ |
| `id`                | string              | Transaction id           |
| `transactionNumber` | string \| null      |                          |
| `direction`         | `Direction`         | From transaction types   |
| `directionLabel`    | `DirectionLabel`    |                          |
| `status`            | `TransactionStatus` | Reuse Spec 005/006 enum  |
| `partyName`         | string              |                          |
| `transactionDate`   | string              |                          |
| `totalAmount`       | number              | Server-computed          |
| `locationType`      | `LocationType`      | For outside rule context |

**UI rules**: Amount and status from API only; link to `/transactions/:id` for full detail/settlement.

### Trip Workflow Action (mutation)

Not persisted client-side; reflected in refreshed `TripDetail`.

| Action   | Endpoint            | From → To               | Body                      |
| -------- | ------------------- | ----------------------- | ------------------------- |
| Schedule | `POST .../schedule` | `DRAFT` → `SCHEDULED`   | — or confirm payload      |
| Start    | `POST .../start`    | `SCHEDULED` → `STARTED` | `{ startingOdometer? }`   |
| Complete | `POST .../complete` | `STARTED` → `COMPLETED` | `{ endingOdometer? }`     |
| Cancel   | `POST .../cancel`   | eligible → `CANCELLED`  | `{ cancellationReason? }` |

### Trip Timeline Event (view model)

Normalized for `TripWorkflowTimeline` — built from history API or detail lifecycle fields.

| Field              | Type           |
| ------------------ | -------------- |
| `id`               | string         | Synthetic stable key        |
| `action`           | string         | e.g. `SCHEDULED`, `STARTED` |
| `actionLabel`      | string         | Human-readable              |
| `actorUserId`      | string \| null |
| `actorDisplayName` | string \| null |
| `occurredAt`       | string         |
| `notes`            | string \| null |

## Relationships

```text
Company
  └── Trip
        ├── Branch (optional)
        ├── Warehouse (optional)
        ├── Vehicle (optional, 0..1)
        ├── TripMember[] → Employee
        └── LinkedTransaction[] → Transaction
```

- **Trip → Transaction**: Many-to-many or one-to-many per backend; `TransactionDetail.tripId` on transaction side for reverse link (Spec 005 field).
- **Trip → Vehicle**: At most one active assignment per trip; backend enforces one active trip per vehicle.
- **Trip → Employee**: Many members via `TripMember`.

## Validation (Zod — UX layer)

### CreateTripInput / UpdateTripInput

- `origin`: required string, max length per API
- `destination`: required string
- `scheduledStartAt`: required ISO datetime for create (if backend requires)
- `branchId`: optional/required per API
- `warehouseId`: optional
- `vehicleId`: optional on create if assign later
- `notes`: optional string

### StartTripInput

- `startingOdometer`: positive number when required by API

### CompleteTripInput

- `endingOdometer`: positive number when required; must be ≥ starting if backend validates (server enforces)

### CancelTripInput

- `cancellationReason`: required when API returns validation on empty reason

### AssignMembersInput

- `employeeIds`: non-empty array of UUIDs

### LinkTransactionInput

- `transactionId`: required UUID

Server remains authoritative for all business rules.

## Query Keys

```text
tripKeys.all
tripKeys.lists()
tripKeys.list(params)
tripKeys.details()
tripKeys.detail(id)
tripKeys.members(id)
tripKeys.transactions(id)
tripKeys.timeline(id)
tripKeys.linkableTransactions(id, params)
```

## State Transitions (backend authority)

```text
DRAFT ──schedule──► SCHEDULED ──start──► STARTED ──complete──► COMPLETED
  │
  └──cancel──► CANCELLED
```

Other transitions (e.g. schedule → cancel) only if Backend P006 exposes them. UI enables actions based on permissions + current status + API outcome — not a hardcoded graph beyond display hints.
