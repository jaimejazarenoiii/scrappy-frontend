# Data Model: Transaction Management Foundation (Backend P004)

This document defines the entities, key fields, and relationships used by the Transaction Management Foundation UI in Specification 005.

## Entities

### Transaction

Represents a single inbound or outbound transaction record.

Key fields (as supported by frontend types aligned to Backend P004):

- `id` (string)
- `companyId` (string)
- `createdByUserId` (string)
- `updatedByUserId` (string | null)
- `direction` (INBOUND | OUTBOUND)
- `directionLabel` (BUY | SELL)
- `status` (DRAFT | CANCELLED)
- `partyName` (string)
- `partyContactNumber` (string | null)
- `transactionDate` (string)
- `locationType` (BRANCH | WAREHOUSE | OUTSIDE)
- `branchId` (string | null)
- `warehouseId` (string | null)
- `outsideLocationName` (string | null)
- `outsideAddress` (string | null)
- `tripId` (string | null) (shown if supported by backend payload)
- `notes` (string | null)
- `cancellationReason` (string | null)
- `cancelledAt` (string | null)
- `createdAt` (string)
- `updatedAt` (string)
- `deletedAt` (string | null) (non-null indicates archived/soft deleted)
- `totalAmount` (number)
- `assignedEmployeeIds` (string[])

Relationships:

- Has `assignments` (employeeId, assignedAt)
- Has `items` (transaction items)
- Has `attachments` (transaction photos/attachments)

UI notes:

- This specification must not implement payment/settlement/receipt workflows.
- UI renders only foundation actions. Any cancelled state is displayed read-only.

### Transaction Item

Represents an item line attached to a transaction draft.

Key fields:

- `id` (string)
- `transactionId` (string)
- `materialName` (string)
- `weight` (number)
- `unit` (KG | G | TON | LB | PIECE | BUNDLE | SACK)
- `price` (number)
- `total` (number; server-computed)
- `notes` (string | null)
- `createdAt` (string)
- `updatedAt` (string)

### Transaction Attachment (Transaction Photo)

Represents a photo uploaded for a transaction draft.

Key fields:

- `id` (string)
- `transactionId` (string)
- `attachmentType` (PHOTO)
- `fileName` (string)
- `filePath` (string)
- `mimeType` (string)
- `fileSize` (number)
- `uploadedByUserId` (string)
- `createdAt` (string)

## Relationships Summary

- Transaction → Items
- Transaction → Photos/Attachments
- Transaction → Assigned Employees (via `assignedEmployeeIds` and `assignments`)
- Transaction → Branch (optional by `locationType`)
- Transaction → Warehouse (optional by `locationType`)

## State Transitions (UI-relevant)

Backend status supported by frontend types:

- `DRAFT`: editable surfaces for foundation workflows (items, photos, supported transaction fields)
- `CANCELLED`: displayed read-only; no settlement/payment workflows are implemented in this spec.

## Draft Workflow State

Draft workflow UX relies on backend persistence:

- “Auto Save” writes updated transaction fields to the backend draft record.
- “Resume Draft” reloads persisted draft state from backend for the selected draft id.
- Unsaved changes detection blocks navigation when local edits have not been successfully persisted since the last edit.
