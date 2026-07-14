# API Endpoints: Trip Load Management (Backend P006 Addendum)

Consumed through `src/features/trips/services/trip-load.service.ts` (or methods on `TripService`). Components MUST NOT call Axios directly (Constitution VIII).

**Base path**: `/api/v1` (via `VITE_API_BASE_URL`).

**Conventions**: JSON; Bearer auth; tenant scoping via JWT; envelope `{ success, data, meta, error }`.

Reconcile exact paths against Swagger (`GET /docs`) during implementation. Paths below follow Trip Load addendum conventions.

## Trip create extension

| Method   | Endpoint      | Change                                                  |
| -------- | ------------- | ------------------------------------------------------- |
| `create` | `POST /trips` | Add optional `prepareTripLoad: boolean` (default false) |

**Response**: `TripDetail` includes `tripLoadEnabled: boolean` when supported.

## Trip load resource (`TripLoadService`)

| Method        | Endpoint                                     | Roles (typical) | Request                   | Response                          |
| ------------- | -------------------------------------------- | --------------- | ------------------------- | --------------------------------- |
| `get`         | `GET /trips/{tripId}/load`                   | trip viewers    | —                         | `{ summary, items }`              |
| `getProgress` | `GET /trips/{tripId}/load/progress`          | trip viewers    | —                         | `{ rows: TripLoadProgressRow[] }` |
| `addItem`     | `POST /trips/{tripId}/load/items`            | OWNER, MANAGER  | `CreateTripLoadItemInput` | `TripLoadItem` (201)              |
| `updateItem`  | `PATCH /trips/{tripId}/load/items/{itemId}`  | OWNER, MANAGER  | `UpdateTripLoadItemInput` | `TripLoadItem`                    |
| `deleteItem`  | `DELETE /trips/{tripId}/load/items/{itemId}` | OWNER, MANAGER  | —                         | `{ deleted: true }`               |

### Combined shape (`GET /trips/{tripId}/load`)

```json
{
  "summary": {
    "totalItems": 3,
    "totalLoadedWeight": 1250.5,
    "remainingWeight": 800.0,
    "weightUnit": "KG",
    "lastUpdatedAt": "2026-07-14T09:30:00.000Z"
  },
  "items": [
    {
      "id": "uuid",
      "tripId": "uuid",
      "materialName": "Copper",
      "quantity": 500,
      "unit": "KG",
      "notes": null,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

### Progress shape (`GET /trips/{tripId}/load/progress`)

Used when `trip.status` is `STARTED` or `COMPLETED` (and optionally during draft preview if backend supports).

```json
{
  "rows": [
    {
      "materialName": "Copper",
      "unit": "KG",
      "loadedQuantity": 100,
      "soldQuantity": 35,
      "remainingQuantity": 65,
      "indicatorStatus": "NORMAL"
    }
  ]
}
```

## Transaction validation (advisory)

| Method     | Endpoint                                         | Roles      | Request                                       | Response                                    |
| ---------- | ------------------------------------------------ | ---------- | --------------------------------------------- | ------------------------------------------- |
| `validate` | `POST /trips/{tripId}/load/validate-transaction` | authorized | `{ items: [{ materialName, weight, unit }] }` | `{ warnings: TripLoadValidationWarning[] }` |

Alternative: validation warnings embedded in transaction create/update responses when `tripId` present—service layer normalizes to `TripLoadValidationWarning[]`.

**Behavior**:

- Warnings are non-blocking unless backend returns hard validation error (400/409)—surface via existing form error handling.
- Frontend does not call validate until at least one item line has material + quantity.

## Error codes (typical)

| HTTP | When                                 |
| ---- | ------------------------------------ |
| 403  | Employee attempts item mutation      |
| 404  | Trip or item not found               |
| 409  | Trip started—load no longer editable |
| 400  | Invalid quantity/unit/material       |

## Cache invalidation map

| Mutation               | Invalidate                                                                                |
| ---------------------- | ----------------------------------------------------------------------------------------- |
| add/update/delete item | `tripLoadKeys.detail(tripId)`, `tripLoadKeys.progress(tripId)`, `tripKeys.detail(tripId)` |
| start trip             | `tripLoadKeys.*`, `tripKeys.detail`                                                       |
| transaction settle     | `tripLoadKeys.progress(tripId)` (if linked)                                               |

## Supporting lookups (existing)

- Material suggestions: `GET /transactions/suggestions/materials` (reuse transaction picker)
- Item units: shared `ItemUnit` enum in frontend types aligned with P004
