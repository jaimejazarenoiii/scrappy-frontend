# Data Model: Expense Management (Backend P007)

Frontend types live in `src/features/expenses/types/expense.types.ts`. Shapes mirror Backend P007; reconcile field names against Swagger during Phase 1.

## Entities

### Expense (summary — list)

Returned by `GET /expenses`.

| Field            | Type                   | Notes                                                     |
| ---------------- | ---------------------- | --------------------------------------------------------- |
| `id`             | string                 | UUID                                                      |
| `companyId`      | string                 | Tenant scope                                              |
| `expenseNumber`  | string \| null         | Server-assigned if supported (e.g. `EXP-YYYYMMDD-000001`) |
| `status`         | `ExpenseStatus`        | See below                                                 |
| `categoryId`     | string                 | FK to expense category                                    |
| `categoryName`   | string \| null         | Denormalized for list display                             |
| `referenceType`  | `ExpenseReferenceType` | See below                                                 |
| `referenceId`    | string \| null         | Entity id for reference type                              |
| `referenceLabel` | string \| null         | Denormalized display label when API provides              |
| `description`    | string                 | Short title / purpose                                     |
| `amount`         | number                 | **Display only** — from backend (2 dp PHP)                |
| `expenseDate`    | string                 | ISO date or datetime                                      |
| `notes`          | string \| null         |                                                           |
| `receiptCount`   | number \| null         | Optional list-only attachment count                       |
| `createdAt`      | string                 |                                                           |
| `updatedAt`      | string                 |                                                           |
| `deletedAt`      | string \| null         | Soft archive if supported                                 |

### Expense (detail)

Extends summary with nested or joinable data:

| Field             | Type                               | Notes                                          |
| ----------------- | ---------------------------------- | ---------------------------------------------- |
| `attachments`     | `ExpenseAttachment[]`              | Or fetched via attachments endpoint            |
| `category`        | `ExpenseCategory` \| null          | Embedded category snapshot                     |
| `reference`       | `ExpenseReferenceSnapshot` \| null | Embedded branch/warehouse/vehicle/trip summary |
| `createdByUserId` | string \| null                     | Audit                                          |
| `updatedByUserId` | string \| null                     |                                                |

### ExpenseStatus

Reconcile with OpenAPI. Typical values:

| Value      | UI label | Notes                           |
| ---------- | -------- | ------------------------------- |
| `ACTIVE`   | Active   | Default visible in lists        |
| `ARCHIVED` | Archived | Hidden unless `includeArchived` |

Unknown status → `StatusBadge` fallback; actions per API only.

### ExpenseReferenceType

Reconcile with OpenAPI. Expected values:

| Value       | Reference picker             | Deep link target             |
| ----------- | ---------------------------- | ---------------------------- |
| `COMPANY`   | Implicit / read-only company | Company settings (if routed) |
| `BRANCH`    | Branch select                | `buildRoute.branchDetail`    |
| `WAREHOUSE` | Warehouse select             | `buildRoute.warehouseDetail` |
| `VEHICLE`   | Vehicle select               | Vehicle detail route         |
| `TRIP`      | Trip search/select           | `buildRoute.tripDetail`      |

**UI rules**: When `referenceType` changes, clear `referenceId`. Never show multiple reference pickers simultaneously.

### ExpenseCategory

Returned by category list endpoint.

| Field         | Type           | Notes                                          |
| ------------- | -------------- | ---------------------------------------------- |
| `id`          | string         |                                                |
| `name`        | string         | Display label                                  |
| `code`        | string \| null | Optional short code                            |
| `description` | string \| null |                                                |
| `status`      | string \| null | e.g. `ACTIVE` — filter inactive if API returns |
| `sortOrder`   | number \| null | Preserve API order in selects                  |

**UI rules**: Categories MUST NOT be hardcoded. Empty category list → guided empty state on create form.

### ExpenseReferenceSnapshot

Optional embedded object on detail for display without extra fetch:

| Field      | Type                            | Notes                                                  |
| ---------- | ------------------------------- | ------------------------------------------------------ |
| `type`     | `ExpenseReferenceType`          |                                                        |
| `id`       | string                          |                                                        |
| `label`    | string                          | Human-readable (plate, branch name, trip number, etc.) |
| `metadata` | Record<string, unknown> \| null | API-specific extras                                    |

### ExpenseAttachment

Mirror `TransactionAttachment` shape where possible.

| Field              | Type                  | Notes                                   |
| ------------------ | --------------------- | --------------------------------------- |
| `id`               | string                |                                         |
| `expenseId`        | string                |                                         |
| `attachmentType`   | `'RECEIPT'` \| string | Reconcile with API                      |
| `fileName`         | string                |                                         |
| `mimeType`         | string                | `image/jpeg`, `image/png`, `image/webp` |
| `fileSize`         | number                | Bytes                                   |
| `uploadedByUserId` | string                |                                         |
| `downloadUrl`      | string                | Use with `?access_token=` for `<img>`   |
| `createdAt`        | string                |                                         |

### ExpenseDashboardSummary (optional)

If `GET /expenses/dashboard` exists:

| Field            | Type                                                    | Notes                     |
| ---------------- | ------------------------------------------------------- | ------------------------- |
| `totalAmount`    | number \| null                                          | Period total from backend |
| `expenseCount`   | number \| null                                          |                           |
| `byCategory`     | `{ categoryId, categoryName, amount, count }[]` \| null | Pre-aggregated            |
| `byStatus`       | `{ status, count }[]` \| null                           |                           |
| `recentExpenses` | `ExpenseSummary[]` \| null                              | Optional recent list      |

**UI rules**: Display dashboard fields only when returned; no client aggregation.

## Input types (mutations)

### CreateExpenseInput

| Field           | Type                   | Required       |
| --------------- | ---------------------- | -------------- |
| `categoryId`    | string                 | yes            |
| `referenceType` | `ExpenseReferenceType` | yes            |
| `referenceId`   | string                 | per type rules |
| `description`   | string                 | yes            |
| `amount`        | number                 | yes            |
| `expenseDate`   | string                 | yes            |
| `notes`         | string                 | no             |

### UpdateExpenseInput

`Partial<CreateExpenseInput>` plus nullable clears per API contract.

## Relationships

```text
Company (tenant)
  └── Expense (many)
        ├── ExpenseCategory (many-to-one)
        ├── Branch | Warehouse | Vehicle | Trip (optional reference)
        └── ExpenseAttachment (one-to-many)
```

**Frontend rules**:

- Display relationships from API payloads only
- Resolve missing labels via existing organization/trip hooks — do not infer reference type from id alone
- Trip reference links to Spec 007 routes; branch/warehouse to Spec 003

## Validation (Zod — UX only)

| Field           | Rule                                                       |
| --------------- | ---------------------------------------------------------- |
| `categoryId`    | Required non-empty string                                  |
| `referenceType` | Required enum from API-fed options                         |
| `referenceId`   | Required when reference type requires entity (superRefine) |
| `description`   | Required, max length per API                               |
| `amount`        | Positive number, max 2 decimal places for display input    |
| `expenseDate`   | Valid date string                                          |
| `notes`         | Optional, max length                                       |

Server remains authoritative for reference eligibility (e.g., archived trip, inactive branch).

## State transitions

Expense lifecycle is simpler than trips — no multi-step workflow UI unless backend exposes status transitions beyond archive:

| Action  | Typical API                                  | UI                    |
| ------- | -------------------------------------------- | --------------------- |
| Create  | `POST /expenses`                             | Form → detail         |
| Update  | `PATCH /expenses/:id`                        | Edit form             |
| Archive | `POST /expenses/:id/archive` or status patch | Confirm dialog        |
| Delete  | `DELETE /expenses/:id`                       | Confirm dialog → list |

Edit/delete/archive availability MUST follow backend rules for current status.
