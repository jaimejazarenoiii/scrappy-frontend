# Phase 0 Research: Transaction Settlement Workflow

This research documents implementation decisions for Specification 006, aligned with the Scrappy Web Constitution and built strictly on Specifications 001–005. Settlement extends the existing `src/features/transactions/` module additively.

## R-001 — Extend Spec 005 module (no new feature folder)

- **Decision**: Implement settlement inside `src/features/transactions/` by extending types, services, hooks, components, and pages. Do not create a separate `settlement` feature or navigation module.
- **Rationale**: Spec 006 requires settlement as part of the transaction experience; Constitution Principle III and Spec 005 plan explicitly prepared for this attachment point.
- **Alternatives considered**: Standalone `src/features/settlement/` (rejected — violates “integrated into Transactions” requirement).

## R-002 — Backend-driven workflow eligibility

- **Decision**: Action visibility is derived from **transaction status + user role/permissions + API error responses**. Never hardcode role→action matrices beyond Spec 002 permission gates; defer final eligibility to backend 403/409 responses when ambiguous.
- **Rationale**: Spec and API docs state workflow rules come from backend; prevents client drift when P005 rules change.
- **Alternatives considered**: Full client-side state machine (rejected — duplicates business logic).

## R-003 — Workflow mutation pattern

- **Decision**: Add service methods and TanStack Query mutations for:
  - `POST /transactions/:id/finish` (Ready for Payment)
  - `POST /transactions/:id/settle` (Paid)
  - `POST /transactions/:id/cancel` (Cancelled)
  - `POST /transactions/:id/return-to-draft` (manager correction)
  - `POST /transactions/:id/reopen` (owner reopen)
  - `GET /transactions/:id/receipt` (receipt payload)
- Each mutation invalidates `transactionKeys.detail(id)` and list queries on success.
- **Rationale**: Matches existing `TransactionService` + `useTransactionMutations` patterns from Spec 005.
- **Alternatives considered**: Single generic `transition(status)` helper (rejected — obscures API contract and error handling).

## R-004 — Status enum extension

- **Decision**: Extend `TransactionStatus` to include `READY_FOR_PAYMENT` and `PAID` alongside existing `DRAFT` and `CANCELLED`. Update `transaction-status.ts` labels/tones for all four values with safe fallback for unknown statuses.
- **Rationale**: Backend P005 canonical statuses; Spec 005 types were intentionally draft-only pending this spec.
- **Alternatives considered**: Separate settlement status field (rejected — API uses single `status`).

## R-005 — Settlement metadata on TransactionDetail

- **Decision**: Extend `TransactionBase` with backend lifecycle fields when present:
  - `transactionNumber`
  - `submittedAt`, `submittedByUserId`
  - `paidAt`, `paidByUserId`
  - `cancelledByUserId` (alongside existing `cancelledAt`, `cancellationReason`)
  - `reopenedAt`, `reopenedByUserId`, `reopenReason`
- Display names resolved via existing user/employee display helpers where IDs are returned; show raw ID fallback only when lookup unavailable.
- **Rationale**: Paid By / Paid At and audit display require server fields; no client invention.
- **Alternatives considered**: Separate settlement detail endpoint only (rejected unless backend requires it — primary source remains `GET /transactions/:id`).

## R-006 — Manager approval mapping

- **Decision**: “Manager Approval” is implemented as review of `READY_FOR_PAYMENT` transactions via:
  - **Approve path**: `settle` → `PAID`
  - **Reject/correction path**: `return-to-draft` → `DRAFT`
- No dedicated approve/reject endpoints unless Backend P005 adds them later.
- **Rationale**: Matches Spec 006 assumptions and published API reference (finish/settle/return-to-draft).
- **Alternatives considered**: Custom approval queue module (rejected — out of scope).

## R-007 — Audit trail / settlement timeline

- **Decision**: Primary timeline builder composes events from authoritative transaction lifecycle fields on `TransactionDetail`. If Backend P005 exposes `GET /transactions/:id/history` (or similar), prefer that endpoint and fall back to field composition only when absent.
- Event types: `READY_FOR_PAYMENT`, `PAID`, `CANCELLED`, `RETURNED_TO_DRAFT`, `REOPENED` (and any API-provided approval events).
- **Rationale**: Spec forbids inventing audit records; lifecycle fields are always returned on detail.
- **Alternatives considered**: Client-only timeline from mutation toasts (rejected — not authoritative).

## R-008 — Receipt rendering

- **Decision**: Fetch receipt via `GET /transactions/:id/receipt` into a dedicated `TransactionReceipt` type. Render read-only receipt page; print via `window.print()` with print-specific CSS. Download/share only if backend provides URL or browser print-to-PDF is sufficient (document as print in quickstart).
- **Rationale**: Receipt calculations must be backend-generated; API returns `grandTotal`, items, `paidByDisplayName`, `paidAt`.
- **Alternatives considered**: Client PDF generation from transaction detail (rejected — violates no frontend calculation rule).

## R-009 — Editability after settlement states

- **Decision**:
  - `DRAFT`: reuse Spec 005 edit flow (items, photos, auto-save)
  - `READY_FOR_PAYMENT`: managers/owners may `PATCH` per API; employees read-only except cancel if permitted
  - `PAID`: read-only except owner reopen + receipt
  - `CANCELLED`: read-only (terminal unless backend later allows reopen)
- Gate edit route (`/transactions/:id/edit`) to `DRAFT` only unless backend PATCH on ready-for-payment is exposed via separate correction UX (manager inline edit on settlement view, not draft editor).
- **Rationale**: API editability matrix; avoids breaking Spec 005 draft editor assumptions.
- **Alternatives considered**: Reuse draft editor for ready-for-payment (rejected — different editability rules).

## R-010 — Confirmation dialogs and forms

- **Decision**: Use existing `ConfirmDialog` for simple confirmations; use RHF + Zod dialogs for reason-required actions (`cancel`, `reopen`, `return-to-draft`, optional `settle` note).
- Zustand store (`useSettlementDialogStore` or extend draft store pattern) for dialog open state and active action only — not server data.
- **Rationale**: Constitution forms standard; keeps mutation payloads validated before submit.
- **Alternatives considered**: Inline forms without Zod (rejected — inconsistent with Spec 001–005).

## R-011 — Routing additions

- **Decision**: Add lazy routes:
  - `/transactions/:id/settlement` — settlement summary, actions, timeline
  - `/transactions/:id/receipt` — receipt view (Paid only)
- Extend `buildRoute` helpers; extend breadcrumbs for settlement and receipt segments.
- **Rationale**: Spec-required deep links; detail page links into settlement/receipt without separate nav item.
- **Alternatives considered**: Settlement as tabs only on detail (rejected — spec explicitly lists settlement and receipt routes).

## R-012 — Permissions extension

- **Decision**: Extend `PERMISSIONS.transactions` additively with keys reconciled to backend (proposed):
  - `transactions.finish` (employee finish)
  - `transactions.settle` (manager/owner settle)
  - `transactions.cancel` (cancel)
  - `transactions.returnToDraft` (manager/owner)
  - `transactions.reopen` (owner)
  - `transactions.receipt` (view receipt; may alias `transactions.view` if backend uses same gate)
- Map roles in `session.ts` consistent with API: employees finish assigned; managers settle/return; owners reopen.
- **Rationale**: Spec 002 permission-driven UI; exact strings reconciled during implementation against backend.
- **Alternatives considered**: Reuse only `transactions.update` for all actions (rejected — too coarse for action gating).

## Summary of resolved unknowns

All Technical Context items are resolved. Permission key strings and optional dedicated history endpoint are reconciled during Phase 1 implementation against live Backend P005. No architectural changes required before Spec 007.
