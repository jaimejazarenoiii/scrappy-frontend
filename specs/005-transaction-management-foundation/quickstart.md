# Quickstart Validation: Transaction Management Foundation (Spec 005)

This guide validates Specification 005 end-to-end in a local dev environment.

## Prerequisites

- Scrappy Web dev server running
- Backend P004 Transaction endpoints available
- A user account that has the required transaction module permissions

## Validation Scenarios

### 1) Navigate to Transactions

1. Open the app and sign in.
2. Navigate to `/transactions`.
3. Verify:
   - page loads without errors
   - inbound/outbound and status context is visible as supported by backend
   - search/filter/sort/pagination controls work (no broken empty states)

### 2) Open a Transaction Detail

1. From the transactions list, open a transaction detail.
2. Verify:
   - transaction details display only backend-supported fields
   - relationships show assigned employees and items/photos summaries where available
   - out-of-scope workflows (payment/settlement/receipts/approvals) do not appear

### 3) Create a New Draft

1. Navigate to `/transactions/new`.
2. Verify:
   - draft editor loads and shows a draft indicator
   - required draft fields validate inline (RHF + Zod)

### 4) Auto Save + Unsaved Changes Protection

1. Change supported draft fields (e.g., party name/notes/date/location info when available).
2. Verify:
   - “saving” state and “last saved” indicator update after a successful write
3. Attempt to navigate away with unsaved changes.
4. Verify:
   - confirmation prompt appears and prevents accidental loss (unless recovery is possible)

### 5) Resume Draft

1. Navigate to `/transactions/drafts`.
2. Select a draft and open it.
3. Verify:
   - persisted draft state is restored
   - draft editor indicator matches persisted save status

### 6) Transaction Items (Draft)

1. In a draft editor, add an item using backend material suggestions.
2. Verify:
   - item appears in the item list immediately after save
   - edit item fields (weight/unit/price/notes) persist
   - remove item removes it from UI and backend

### 7) Transaction Photos (Draft)

1. Upload one or more photos.
2. Verify:
   - progress indicator displays
   - images preview in a gallery
   - removal deletes the selected photo from backend and UI

### 8) Suggestions (Backend-driven)

1. Use material suggestions and select a material.
2. Verify:
   - suggested prices (and price history if available) display from backend responses
   - UI does not compute suggested pricing using frontend calculations

## Exit Criteria

- All scenarios above pass without UI scope violations.
- No out-of-scope financial workflows appear.
- No TypeScript/ESLint issues in the implementation.
