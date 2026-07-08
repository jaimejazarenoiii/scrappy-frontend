# Data Model: Transaction Settlement Workflow (Backend P005)

Extends the Transaction Management Foundation data model (Spec 005) with settlement statuses, payment metadata, receipt payload, and audit timeline entries.

## Entities

### Transaction (settlement-extended)

Extends `Transaction` / `TransactionDetail` with Backend P005 lifecycle fields.

**Status** (`TransactionStatus`):

| Value               | UI label          | Typical editability                                                                |
| ------------------- | ----------------- | ---------------------------------------------------------------------------------- |
| `DRAFT`             | Draft             | Assigned employees, managers, owners (Spec 005 editor)                             |
| `READY_FOR_PAYMENT` | Ready for Payment | Managers/owners: PATCH + settle/return; employees: read-only (cancel if permitted) |
| `PAID`              | Paid              | Read-only; owner may reopen; receipt available                                     |
| `CANCELLED`         | Cancelled         | Read-only (terminal unless backend allows reopen)                                  |

**Additional header fields** (when returned by API):

- `transactionNumber` (string) — e.g. `IN-20260708-000001`
- `submittedAt` (string | null) — when marked Ready for Payment
- `submittedByUserId` (string | null)
- `paidAt` (string | null)
- `paidByUserId` (string | null)
- `cancelledAt` (string | null) — existing in Spec 005
- `cancelledByUserId` (string | null)
- `cancellationReason` (string | null) — existing in Spec 005
- `reopenedAt` (string | null)
- `reopenedByUserId` (string | null)
- `reopenReason` (string | null)

**Unchanged from Spec 005**: direction, party, location, items, attachments, assignments, `totalAmount` (server-computed).

**UI rules**:

- Display `totalAmount` and item totals as returned; never recompute for settlement summary or receipt.
- Paid By display: prefer `paidByDisplayName` from receipt; on detail use user lookup from `paidByUserId` when available.

### Settlement Action (mutation input/output)

Represents a workflow transition triggered by the user. Not persisted client-side; reflected in refreshed `TransactionDetail`.

| Action          | Endpoint                   | From → To                                    | Body (optional)           |
| --------------- | -------------------------- | -------------------------------------------- | ------------------------- |
| Finish          | `POST .../finish`          | `DRAFT` → `READY_FOR_PAYMENT`                | —                         |
| Settle          | `POST .../settle`          | `READY_FOR_PAYMENT` → `PAID`                 | `{ settlementNote? }`     |
| Cancel          | `POST .../cancel`          | `DRAFT` \| `READY_FOR_PAYMENT` → `CANCELLED` | `{ cancellationReason? }` |
| Return to draft | `POST .../return-to-draft` | `READY_FOR_PAYMENT` → `DRAFT`                | `{ reason? }`             |
| Reopen          | `POST .../reopen`          | `PAID` → `READY_FOR_PAYMENT`                 | `{ reason }` (required)   |

### Transaction Receipt

Returned by `GET /transactions/:id/receipt` for Paid transactions only.

Key fields (per API reference):

- `transactionNumber` (string)
- `company` (object — name and related display fields)
- `direction`, `directionLabel`
- `partyName` (string)
- `transactionDate` (string)
- `items` (array — line items with backend totals)
- `grandTotal` (number)
- `paidByDisplayName` (string)
- `paidAt` (string)

**UI rules**: Render-only; print layout uses these fields exclusively.

### Settlement Event (audit timeline entry)

Normalized view model for timeline UI (built from API history or composed from transaction lifecycle fields).

- `id` (string) — synthetic key for React list (e.g. `paid`, `submitted`)
- `action` (`READY_FOR_PAYMENT` | `PAID` | `CANCELLED` | `RETURNED_TO_DRAFT` | `REOPENED` | string)
- `actionLabel` (string) — human-readable
- `actorUserId` (string | null)
- `actorDisplayName` (string | null) — resolved via lookup when possible
- `occurredAt` (string)
- `notes` (string | null) — cancellation reason, reopen reason, settlement note, return reason

**Composition rules** (when no dedicated history endpoint):

1. If `submittedAt` → event Ready for Payment
2. If `paidAt` → event Paid
3. If `cancelledAt` → event Cancelled (notes from `cancellationReason`)
4. If `reopenedAt` → event Reopened (notes from `reopenReason`)
5. Return-to-draft may only appear if backend exposes explicit fields or history API

Sort events by `occurredAt` descending (newest first) or ascending (oldest first) — **Decision**: ascending (chronological story) for timeline UX.

## State Transitions

```text
DRAFT ──finish──► READY_FOR_PAYMENT ──settle──► PAID
  │                      │                        │
  │                      │                        └──reopen──► READY_FOR_PAYMENT
  │                      │
  │                      └──return-to-draft──► DRAFT
  │
  └──cancel──► CANCELLED
       ▲
       └──cancel── READY_FOR_PAYMENT
```

All transitions are initiated only via backend POST endpoints. UI enables buttons based on current `status` + permissions; backend enforces final authority.

## Relationships Summary

Unchanged from Spec 005. Settlement views read the same `TransactionDetail` graph (items, attachments, assignments).

## Validation Rules (forms)

| Form                   | Fields               | Zod rules                                        |
| ---------------------- | -------------------- | ------------------------------------------------ |
| Cancel dialog          | `cancellationReason` | Optional unless API requires; max length per API |
| Reopen dialog          | `reason`             | Required, min 1 char, max per API                |
| Return to draft dialog | `reason`             | Optional unless API requires                     |
| Settle dialog          | `settlementNote`     | Optional string                                  |

Frontend validation is UX-only; server errors mapped via `applyApiValidationErrors`.
