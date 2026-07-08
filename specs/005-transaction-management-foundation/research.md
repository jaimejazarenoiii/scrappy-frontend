# Phase 0 Research: Transaction Management Foundation

This research documents implementation decisions for Specification 005, aligned with the Scrappy Web Constitution and built strictly on the architecture patterns established in Specifications 001–004.

No out-of-scope financial workflows are introduced. Settlement/payment/receipts/approvals/audit/trips/expenses/analytics/reports/activity logs are excluded by design.

## R-001 — Feature module layout (service → hooks → pages → UI)

- **Decision**: Implement the Transaction Management Foundation as a feature-local module under `src/features/transactions/` with `types/`, `services/`, `validation/`, `hooks/`, `components/`, and `pages/`.
- **Rationale**: Constitution Principle III/XVIII and proven “workforce” module approach from Spec 004.
- **Alternatives considered**: A monolithic `src/features/workforce/transactions` (rejected — violates feature ownership boundaries).

## R-002 — Endpoint source of truth

- **Decision**: All API paths used by the UI must be centralized in feature service classes. The UI never hardcodes paths or makes direct Axios calls.
- **Rationale**: Constitution Principle I/VIII, isolates contract drift to services.
- **Alternatives considered**: Path constants in components (rejected — architecture violation).

## R-003 — Draft representation

- **Decision**: Draft workflow is implemented using backend transaction draft semantics:
  - draft status is represented using the backend-supported transaction status value (`DRAFT` in frontend types)
  - draft updates use the existing `TransactionService.update` + `UpdateTransactionInput` shape
  - “Drafts list / Continue Draft / Resume Draft” uses a list query filtered by draft status (exact endpoint behavior verified during implementation)
- **Rationale**: Keeps business rules backend-driven and compatible with the “no duplicate business rules” requirement.
- **Alternatives considered**: Separate draft endpoints only if explicitly provided by backend (optional during contract reconciliation).

## R-004 — Auto-save mechanics

- **Decision**: Auto-save uses a debounced mutation that persists supported transaction draft fields whenever the user edits form state.
- **Rationale**: Meets “draft indicator + unsaved changes detection” UX while minimizing backend write frequency.
- **Alternatives considered**: Auto-save on every keystroke without debounce (rejected — unnecessary traffic and higher failure rate).

## R-005 — Unsaved changes detection + recovery

- **Decision**: Unsaved changes detection is tracked as local UI state (dirty/lastSaved flags) and triggers navigation confirmation when changes exist that haven’t been successfully persisted.
- **Recovery**:
  - if backend supports restoring saved drafts, recovery routes to resume draft UI
  - otherwise the UI reloads persisted draft state and warns the user that unsaved changes may be lost
- **Rationale**: Avoids client-side business rules while providing user safety.

## R-006 — Transaction Items CRUD

- **Decision**: Items editor uses the existing service calls:
  - `listItems` to load item list
  - `addItem` to create items in a draft
  - `updateItem` to edit items
  - `deleteItem` to remove items
- **Rationale**: Backend remains source of truth. UI reflects server state.

## R-007 — Transaction Photos (attachments)

- **Decision**: Photo manager is implemented as a backend attachment workflow:
  - `listAttachments` to load existing attachments for a draft transaction
  - `uploadAttachment` for multipart upload
  - `deleteAttachment` to remove attachments
- **Upload progress**:
  - progress must be tracked without inventing a protocol; progress tracking is implemented through Axios request configuration in the service layer if backend upload supports it
- **Rationale**: Aligns to existing `TransactionService` scaffolding and isolates multipart complexity.

## R-008 — Material + Price suggestions

- **Decision**:
  - Material suggestions call `TransactionService.materialSuggestions`
  - Price suggestions call `TransactionService.priceSuggestions`
  - The UI must never calculate suggested prices on the client
- **Rationale**: “Never calculate suggested pricing on the frontend” requirement.

## R-009 — Status-driven UI (in-scope only)

- **Decision**: The UI renders only foundation actions allowed by backend state:
  - Draft actions exist in draft editing flows
  - Any out-of-scope workflow actions (settlement/payment/approvals/audit/reopen) are not implemented, and in addition any accidental UI affordance is avoided by status gating.
- **Rationale**: Prevents accidental scope creep and duplicates.

## Summary of resolved unknowns

This plan relies on existing frontend scaffolding in `src/features/transactions/services/transaction.service.ts` and `src/features/transactions/types/transaction.types.ts`. All remaining uncertainties (especially permission key naming and exact query params) are resolved during implementation contract reconciliation and documented as changes to contracts.
