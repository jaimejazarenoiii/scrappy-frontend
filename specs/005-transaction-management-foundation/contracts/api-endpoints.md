# API Endpoints: Transaction Management Foundation (Backend P004)

This document enumerates the backend API endpoints consumed by the Transaction Management Foundation frontend (Specification 005).

Endpoints are aligned with the existing feature service scaffolding in:

- `src/features/transactions/services/transaction.service.ts`

## Base Paths

- Transaction base: `GET/POST/PATCH/DELETE /transactions`

## Transactions

### List Transactions

- **GET** `/transactions`
- **Purpose**: Retrieve paginated list of transactions for dashboard/list views.
- **Query parameters** (as supported by frontend types):
  - `page`, `limit`
  - `sortBy`, `sortOrder`
  - `search`
  - `direction`
  - `status`
  - `locationType`
  - `branchId`, `warehouseId`
  - `fromDate`, `toDate`
  - `includeArchived`

### List Assigned Transactions (Context)

- **GET** `/transactions/assigned`
- **Purpose**: Retrieve transactions assigned to the current user (if used for personal dashboard views).
- **Query parameters**: same as list endpoint.

### Transaction Details

- **GET** `/transactions/:id`
- **Purpose**: Retrieve full transaction details including items and attachments when returned by backend.

### Create Transaction Draft

- **POST** `/transactions`
- **Purpose**: Create a new draft transaction (inbound/outbound) with initial supported fields.

### Update Transaction (Draft Auto Save / Edit)

- **PATCH** `/transactions/:id`
- **Purpose**: Persist draft transaction field updates via `UpdateTransactionInput` (partial auto-save updates).

### Cancel Transaction (If Supported by Backend Contract)

- **POST** `/transactions/:id/cancel`
- **Purpose**: Cancel transactions if backend supports it. This spec does not implement settlement/payment workflows.

### Archive Transaction (If Supported by Backend Contract)

- **POST** `/transactions/:id/archive`
- **Purpose**: Soft delete/archive a transaction if supported by backend.

## Transaction Items (Draft-only per spec scope)

### List Items for Transaction

- **GET** `/transactions/:id/items`
- **Purpose**: Retrieve draft transaction items.

### Add Item

- **POST** `/transactions/:id/items`
- **Purpose**: Add a transaction item to a draft.

### Update Item

- **PATCH** `/transactions/:id/items/:itemId`
- **Purpose**: Update fields for a transaction item in a draft.

### Delete Item

- **DELETE** `/transactions/:id/items/:itemId`
- **Purpose**: Remove a transaction item from a draft.

## Transaction Photos (Attachments; Draft-only per spec scope)

### List Attachments

- **GET** `/transactions/:id/attachments`
- **Purpose**: Retrieve existing attachments/photos for a draft transaction.

### Upload Attachment

- **POST** `/transactions/:id/attachments`
- **Purpose**: Upload one attachment (multipart).
- **Body**: multipart/form-data with `file` field.

### Delete Attachment

- **DELETE** `/transactions/:id/attachments/:attachmentId`
- **Purpose**: Remove an attachment.

## Suggestions

### Material Suggestions

- **GET** `/transactions/suggestions/materials`
- **Purpose**: Autocomplete materials for draft transaction item creation.
- **Query parameters**:
  - `q` (search query)
  - `limit`

### Price Suggestions

- **GET** `/transactions/suggestions/prices`
- **Purpose**: Provide suggested prices for a selected material.
- **Query parameters**:
  - `materialName`
  - `limit`

## Non-goals

This specification must not implement settlement/payment/receipts/approvals or any financial workflow beyond the draft foundation.
