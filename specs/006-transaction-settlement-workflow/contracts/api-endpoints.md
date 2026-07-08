# API Endpoints: Transaction Settlement Workflow (Backend P005)

Extends the Transaction Management API surface documented in Spec 005. All paths are relative to `/api/v1` and tenant-scoped via JWT.

Service implementation target: `src/features/transactions/services/transaction.service.ts` (extend additively).

## Base Paths

- Transaction base: `/transactions` (unchanged from Spec 005)

## Settlement Workflow Actions

### Finish (Mark Ready for Payment)

- **POST** `/transactions/:id/finish`
- **Purpose**: Transition `DRAFT` → `READY_FOR_PAYMENT`
- **Roles**: Assigned employee (and others per backend); requires timed-in linked employee for employees
- **Body**: none required
- **Response**: `TransactionDetail` with updated `status`, `submittedAt`, `submittedByUserId`
- **Errors**: `403` not assigned; `409` lifecycle/business rule (e.g. validation, not timed in)

### Settle (Mark Paid)

- **POST** `/transactions/:id/settle`
- **Purpose**: Transition `READY_FOR_PAYMENT` → `PAID`
- **Roles**: OWNER, MANAGER
- **Body** (optional): `{ "settlementNote": "..." }`
- **Response**: `TransactionDetail` with `status=PAID`, `paidAt`, `paidByUserId`
- **Errors**: `403` forbidden; `409` lifecycle conflict

### Cancel

- **POST** `/transactions/:id/cancel`
- **Purpose**: Transition eligible states → `CANCELLED`
- **Roles**: Per backend (assigned employee, manager, owner)
- **Body** (optional): `{ "cancellationReason": "..." }`
- **Response**: `TransactionDetail` with cancellation metadata
- **Note**: Endpoint existed in Spec 005 scaffolding; Spec 006 wires UI and confirmation

### Return to Draft (Manager correction / reject path)

- **POST** `/transactions/:id/return-to-draft`
- **Purpose**: Transition `READY_FOR_PAYMENT` → `DRAFT`
- **Roles**: OWNER, MANAGER
- **Body** (optional): `{ "reason": "..." }`
- **Response**: `TransactionDetail` with `status=DRAFT`

### Reopen

- **POST** `/transactions/:id/reopen`
- **Purpose**: Transition `PAID` → `READY_FOR_PAYMENT` (clears paid markers per backend)
- **Roles**: OWNER
- **Body** (required): `{ "reason": "..." }`
- **Response**: `TransactionDetail` with reopen metadata

## Receipt

### Get Receipt

- **GET** `/transactions/:id/receipt`
- **Purpose**: Retrieve receipt artifact for Paid transaction
- **Roles**: Users with transaction access (assigned employee or manager/owner per backend)
- **Response** `data`:

```json
{
  "transactionNumber": "IN-20260708-000001",
  "company": { "name": "..." },
  "direction": "INBOUND",
  "directionLabel": "BUY",
  "partyName": "...",
  "transactionDate": "...",
  "items": [],
  "grandTotal": 2500,
  "paidByDisplayName": "...",
  "paidAt": "..."
}
```

- **Errors**: `404` / business rule if not Paid

## Read Surfaces (extended from Spec 005)

### Transaction Detail

- **GET** `/transactions/:id`
- **Purpose**: Full detail including settlement fields (`transactionNumber`, `submittedAt`, `paidAt`, etc.)
- **Used by**: Detail page, settlement page, action eligibility

### Transaction List

- **GET** `/transactions`
- **Purpose**: Company list with `status` filter including `READY_FOR_PAYMENT`, `PAID`, `CANCELLED`
- **Query**: `status`, `transactionNumber`, existing Spec 005 params

### Assigned List

- **GET** `/transactions/assigned`
- **Purpose**: Employee-assigned transactions including settlement statuses

### Update (correction while Ready for Payment)

- **PATCH** `/transactions/:id`
- **Purpose**: Manager/owner correction on `READY_FOR_PAYMENT` (and `DRAFT` per Spec 005)
- **Note**: Do not use draft auto-save editor for ready-for-payment unless explicitly scoped; prefer settlement-aware correction if backend differentiates

## Optional: Settlement History

If Backend P005 provides a dedicated endpoint (reconcile during implementation):

- **GET** `/transactions/:id/history` (or equivalent)
- **Purpose**: Ordered audit events for timeline
- **Fallback**: Compose timeline from lifecycle fields on `TransactionDetail` (see `data-model.md`)

## Non-goals

This contract does not include:

- Trip, expense, analytics, reports, activity log endpoints
- Client-side payment calculation or receipt generation
- New transaction creation/items/photos endpoints (Spec 005)

## Error Handling (frontend service layer)

Map normalized API errors:

| Code                            | UI behavior                                 |
| ------------------------------- | ------------------------------------------- |
| `403`                           | Hide/disable action; show forbidden message |
| `409` `LIFECYCLE_CONFLICT`      | Refresh transaction; explain status changed |
| `409` `BUSINESS_RULE_VIOLATION` | Show backend message (e.g. not timed in)    |
| `400` `VALIDATION_ERROR`        | Map field errors to dialog forms            |
