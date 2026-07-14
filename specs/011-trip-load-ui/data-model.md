# Data Model: Trip Load Management UI (P006 Addendum)

Frontend types extend `src/features/trips/types/trip.types.ts` (and optionally `trip-load.types.ts` if file size warrants). Shapes mirror Backend P006 Trip Load addendum; reconcile against Swagger.

## Entities

### Trip (extended fields)

Add to `TripBase` / detail responses when backend embeds load metadata:

| Field             | Type    | Notes                                     |
| ----------------- | ------- | ----------------------------------------- |
| `tripLoadEnabled` | boolean | `true` when Prepare Trip Load was enabled |
| `tripLoadSummary` | object? | Optional embedded summary (see below)     |

If not embedded, fetch via dedicated load endpoints.

### TripLoadSummary

Aggregates for summary card.

| Field               | Type           | Notes                               |
| ------------------- | -------------- | ----------------------------------- |
| `totalItems`        | number         | Count of load lines                 |
| `totalLoadedWeight` | number \| null | Backend-normalized weight aggregate |
| `remainingWeight`   | number \| null | Shown when progress API provides it |
| `weightUnit`        | string \| null | e.g. `KG` when aggregate has unit   |
| `lastUpdatedAt`     | string         | ISO datetime                        |

### TripLoadItem (editable plan line)

| Field          | Type           | Notes                          |
| -------------- | -------------- | ------------------------------ |
| `id`           | string         | UUID                           |
| `tripId`       | string         | Parent trip                    |
| `materialName` | string         | Required                       |
| `quantity`     | number         | > 0                            |
| `unit`         | `ItemUnit`     | Same enum as transaction items |
| `notes`        | string \| null | Optional                       |
| `createdAt`    | string         |                                |
| `updatedAt`    | string         |                                |

### TripLoadProgressRow (started/completed trips)

Per-material progress for read-only table.

| Field               | Type                      | Notes                               |
| ------------------- | ------------------------- | ----------------------------------- |
| `materialName`      | string                    |                                     |
| `unit`              | `ItemUnit`                |                                     |
| `loadedQuantity`    | number                    |                                     |
| `soldQuantity`      | number                    | From trip-linked sales              |
| `remainingQuantity` | number                    | Backend computed                    |
| `indicatorStatus`   | `TripLoadIndicatorStatus` | `NORMAL` \| `WARNING` \| `EXCEEDED` |

### TripLoadIndicatorStatus

| Value      | UI treatment                       |
| ---------- | ---------------------------------- |
| `NORMAL`   | Neutral/muted badge                |
| `WARNING`  | Amber/warning tone (`StatusBadge`) |
| `EXCEEDED` | Destructive or strong warning tone |

### TripLoadValidationWarning (transaction context)

| Field          | Type    | Notes                                             |
| -------------- | ------- | ------------------------------------------------- |
| `code`         | string  | e.g. `INSUFFICIENT_REMAINING`, `UNKNOWN_MATERIAL` |
| `message`      | string  | User-facing copy from backend                     |
| `materialName` | string? | Target material                                   |
| `requestedQty` | number? | From transaction line                             |
| `remainingQty` | number? | From load progress                                |
| `unit`         | string? |                                                   |

### CreateTripInput (extended)

| Field             | Type    | Default | Notes                 |
| ----------------- | ------- | ------- | --------------------- |
| `prepareTripLoad` | boolean | `false` | Sent on `POST /trips` |

## Input DTOs (forms)

### CreateTripLoadItemInput / UpdateTripLoadItemInput

| Field          | Required | Validation (Zod UX)  |
| -------------- | -------- | -------------------- |
| `materialName` | yes      | trim, min 1, max 200 |
| `quantity`     | yes      | positive number      |
| `unit`         | yes      | enum `ItemUnit`      |
| `notes`        | no       | max 500              |

### TripLoadValidationRequest (client → service)

| Field    | Notes                                          |
| -------- | ---------------------------------------------- |
| `tripId` | Required when transaction uses TRIP location   |
| `items`  | `{ materialName, weight, unit }[]` draft lines |

## State transitions (UI eligibility)

| Trip status | Trip Load section | Item CRUD | Progress view      |
| ----------- | ----------------- | --------- | ------------------ |
| `DRAFT`     | if enabled        | yes*      | plan table         |
| `STARTED`   | if enabled        | no        | Loaded/Sold/Remain |
| `COMPLETED` | if enabled        | no        | Loaded/Sold/Remain |
| `CANCELLED` | if enabled        | no        | read-only/archive  |

\*Requires `trips.loadManage` (or `trips.update`) permission.

When `tripLoadEnabled === false`: no section regardless of status.

## Relationships

```text
Trip 1 — 0..1 TripLoad (enabled flag)
TripLoad 1 — * TripLoadItem (plan lines)
Trip 1 — * TripLoadProgressRow (derived at runtime for started+)
Transaction (locationType=TRIP, tripId) — triggers validation against TripLoadProgress
Expense (contextType=TRIP) — no direct UI coupling in v1
```

## Duplicate material handling

- **Client UX**: Warn when add form material+unit matches existing row (soft warning); backend enforces merge or reject.
- **Display**: If backend returns duplicate lines separately, show as separate rows; if backend merges, show merged quantity—do not client-merge.
