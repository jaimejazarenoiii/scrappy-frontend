# Feature Specification: Transaction Settlement Workflow

**Feature Branch**: `006-transaction-settlement-workflow`

**Created**: 2026-07-08

**Status**: Draft

**Input**: User description: Implement Specification 006 – Transaction Settlement Workflow for Scrappy Web (Backend P005). Covers Ready for Payment, Paid, Cancelled, Paid By/Paid At, Manager Approval, Owner Reopen, Receipt Generation, and Audit Trail. Extends Specification 005 foundation; excludes trips, expenses, analytics, reports, and activity logs.

## Purpose _(mandatory — Constitution Principle XXII)_

Enable authorized users to complete the business lifecycle of a transaction after it has been drafted: submit for payment, settle payment, cancel when needed, reopen when permitted, view settlement history, and retrieve receipts. This closes the operational gap between drafting (Specification 005) and financial completion without replacing creation, items, photos, or draft editing.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Submit a draft as Ready for Payment (Priority: P1)

An assigned employee (or other authorized actor) finishes operational entry on a draft and marks the transaction Ready for Payment. The system confirms the action, shows loading and outcome feedback, and updates status from backend data only.

**Why this priority**: Without submission, drafts never enter the payment queue; this is the primary forward transition after foundation work.

**Independent Test**: Open an eligible draft, confirm “Mark Ready for Payment,” and verify status becomes Ready for Payment with success feedback; failed eligibility shows a clear error without changing status.

**Acceptance Scenarios**:

1. **Given** a draft transaction the user is allowed to finish, **When** they choose Mark Ready for Payment and confirm, **Then** the transaction status updates to Ready for Payment and success feedback is shown.
2. **Given** the user starts Mark Ready for Payment, **When** the confirmation dialog is open, **Then** Cancel dismisses without changing status and Confirm is disabled while the request is in progress.
3. **Given** the backend rejects finish (validation, assignment, attendance, or lifecycle conflict), **When** the action fails, **Then** the user sees a safe error message, remains on the transaction, and status is unchanged.
4. **Given** a transaction is not eligible for finish, **When** the details/settlement view loads, **Then** the Ready for Payment action is not offered (or is clearly disabled with guidance from backend eligibility).

---

### User Story 2 - Settle payment and show Paid By / Paid At (Priority: P1)

A manager or owner reviews a Ready for Payment transaction, confirms settlement, marks it Paid, and sees Paid By and Paid At (and any payment summary) from the backend. Payment amounts and totals are never recalculated on the client.

**Why this priority**: Settlement is the core business outcome of this specification; Paid By / Paid At provide accountability.

**Independent Test**: From a Ready for Payment transaction, complete Mark as Paid with confirmation and verify Paid status, Paid By, Paid At, and payment summary match backend data.

**Acceptance Scenarios**:

1. **Given** a Ready for Payment transaction the user may settle, **When** they confirm Mark as Paid, **Then** status becomes Paid and Paid By / Paid At display from backend fields.
2. **Given** a Paid transaction, **When** the user opens details or settlement view, **Then** they see a payment summary derived from backend values (totals, party, items as provided) without client-side recalculation.
3. **Given** settle fails (permission, lifecycle, validation), **When** the error returns, **Then** status remains Ready for Payment and a recoverable error is shown.
4. **Given** the user is not authorized to settle, **When** they view the transaction, **Then** Mark as Paid is not available.

---

### User Story 3 - Cancel a transaction with confirmation (Priority: P2)

Authorized users cancel an eligible draft or ready-for-payment transaction, optionally providing a cancellation reason when the backend supports it, and the UI shows Cancelled status thereafter.

**Why this priority**: Cancellation is a common exceptional path and must be explicit and auditable; it is secondary to the happy path but still essential.

**Independent Test**: Cancel an eligible transaction with confirmation (and reason if required), verify Cancelled status and that edit/settlement actions appropriate to cancelled records are withheld.

**Acceptance Scenarios**:

1. **Given** an eligible transaction, **When** the user confirms Cancel, **Then** status becomes Cancelled and the UI clearly labels Cancelled.
2. **Given** cancellation supports a reason, **When** the dialog collects and submits a reason, **Then** the reason is sent to the backend and shown where returned by the API.
3. **Given** cancel is rejected, **When** the error returns, **Then** status is unchanged and the user can retry or dismiss.
4. **Given** a Cancelled transaction, **When** viewed, **Then** settlement actions that the backend forbids are not offered.

---

### User Story 4 - Manager review: return to draft or settle (Priority: P2)

Managers/owners work a Ready for Payment queue: they can return a transaction to Draft for correction (reject/revision path) or proceed to settle (approve via payment). Pending Ready for Payment items are visually distinct in lists and detail views.

**Why this priority**: Operational control after employee submission depends on manager review without inventing a separate product area outside Transactions.

**Independent Test**: From Ready for Payment, perform Return to Draft and separately Settle; verify status transitions and pending indicators using only backend-permitted actions.

**Acceptance Scenarios**:

1. **Given** a Ready for Payment transaction, **When** an authorized manager/owner confirms Return to Draft (with optional reason if supported), **Then** status becomes Draft and assignees can edit again per foundation rules.
2. **Given** company transaction lists, **When** filters or status badges include Ready for Payment, **Then** pending settlement items are identifiable without a separate Settlement module.
3. **Given** the user lacks return or settle permission, **When** they open the transaction, **Then** those actions are hidden or blocked consistently with authorization.
4. **Given** return-to-draft or settle fails, **When** the backend responds with conflict or validation error, **Then** the UI surfaces a safe message and refreshes status from the server.

---

### User Story 5 - Owner reopen and receipt (Priority: P3)

Owners reopen a Paid transaction when the backend allows (returning it to a settlement-capable state), and any authorized user views/prints (and downloads/shares if supported) a backend-generated receipt for Paid transactions.

**Why this priority**: Reopen and receipts are post-settlement needs; critical but less frequent than day-to-day finish/settle.

**Independent Test**: Reopen an eligible Paid transaction with confirmation; open receipt for a Paid transaction and verify print/view uses backend receipt data only.

**Acceptance Scenarios**:

1. **Given** a Paid transaction the owner may reopen, **When** they confirm Reopen with a required reason (if required by backend), **Then** status follows the backend transition and Paid markers clear per server response.
2. **Given** reopen is not allowed for Cancelled or other states, **When** the user views those records, **Then** Reopen is not offered unless the backend later exposes eligibility.
3. **Given** a Paid transaction, **When** the user opens View Receipt, **Then** receipt content (party, items, totals, paid metadata) reflects backend receipt payload without frontend math.
4. **Given** receipt view is open, **When** the user chooses Print (and Download/Share if provided), **Then** the action uses the same backend receipt data; unsupported actions are omitted.

---

### User Story 6 - Settlement timeline / audit trail (Priority: P3)

Users reviewing a transaction see a chronological settlement history of backend-provided events (e.g., Ready for Payment, Paid, Cancelled, Returned to Draft, Reopened) with actor, timestamp, action, and notes when available.

**Why this priority**: Transparency and dispute resolution after money moves; depends on settled lifecycle events existing first.

**Independent Test**: After performing at least one transition, open the transaction settlement/timeline section and verify events match backend history (or derived lifecycle fields when a dedicated history endpoint is unavailable).

**Acceptance Scenarios**:

1. **Given** a transaction with settlement events, **When** the timeline loads, **Then** each event shows action, user, timestamp, and notes when returned by the backend.
2. **Given** no history yet (e.g., new draft), **When** timeline is shown, **Then** an empty state explains that settlement events appear after workflow actions.
3. **Given** history fails to load, **When** the section errors, **Then** a recoverable error appears without breaking the rest of the transaction page.

---

### Edge Cases

- Backend returns unknown status: show a safe fallback label; never invent transitions.
- Concurrent updates (another user settles/cancels first): show lifecycle conflict messaging and refresh to latest status.
- User navigates to receipt for a non-Paid transaction: show clear ineligibility, not a broken receipt.
- Finish without timed-in / assignment: show backend business-rule message; do not fake eligibility.
- Soft-archived transaction: follow list/detail rules from foundation; settlement actions follow backend conflicts.
- Deep link to `/transactions/:id/settlement` or `/transactions/:id/receipt` without permission: authorization gate with recovery to list or details.
- Reopen of Cancelled: only if backend allows; otherwise Cancelled remains terminal in the UI.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: Authorized users can mark an eligible Draft transaction Ready for Payment with confirmation, loading, success, and error handling driven by backend responses.
- **FR-002**: Ready for Payment eligibility and action visibility MUST reflect backend permissions and business-rule outcomes; the UI MUST NOT hardcode who may finish.
- **FR-003**: Authorized users can mark an eligible Ready for Payment transaction as Paid with confirmation and feedback.
- **FR-004**: Paid transactions MUST display Paid By and Paid At (and related paid metadata) from backend fields when present.
- **FR-005**: Payment summary and receipt totals MUST use backend-provided values only; the client MUST NOT compute settlement amounts.
- **FR-006**: Authorized users can cancel eligible transactions with confirmation and optional/required cancellation reason when the backend supports it.
- **FR-007**: Cancelled status MUST be clearly displayed; post-cancel actions MUST follow backend-allowed transitions only.
- **FR-008**: Managers/owners can return a Ready for Payment transaction to Draft when the backend supports return-to-draft (manager correction / reject path).
- **FR-009**: Lists and detail views MUST surface pending Ready for Payment indicators so settlement work is discoverable inside Transactions (no separate Settlement product module).
- **FR-010**: Owners can reopen Paid transactions when the backend allows, with confirmation and reason fields as required by the API.
- **FR-011**: Users can view a receipt for Paid transactions using backend receipt data; print MUST be supported; download/share ONLY if the product/backend supports them.
- **FR-012**: Settlement/audit timeline MUST display backend-provided workflow events (Ready for Payment, Paid, Cancelled, Returned to Draft, Reopened, and any approval-related events the API returns) with user, timestamp, action, and notes when available.
- **FR-013**: The UI MUST support backend status values including at least Draft, Ready for Payment, Paid, and Cancelled, with clear visual status communication and safe fallbacks for unknown values.
- **FR-014**: Status changes MUST occur only through backend workflow APIs; client state MUST refresh from authoritative server results after each mutation.
- **FR-015**: Routing extends the Transactions experience (e.g., transaction detail, settlement view, receipt view) with deep linking and history, nested within existing layout/auth patterns—not a standalone Settlement app section.
- **FR-016**: Navigation remains under existing Transactions navigation and Spec 002 authorization gates.
- **FR-017**: Specification 005 draft creation, editing, items, photos, auto-save, and suggestions MUST be reused unchanged in purpose; this spec MUST NOT redesign those flows.
- **FR-018**: Out of scope: Trip Management, Expense Management, Analytics, Reports, Activity Logs, and any new financial modules beyond settlement/receipt/audit for transactions.
- **FR-019**: Confirmation dialogs, disabled submit while processing, toast/inline success and error feedback apply to all settlement mutations.
- **FR-020**: Settlement screens MUST meet production quality: responsive, accessible dialogs/timelines/forms, light/dark compatible, loading/empty/error states, keyboard operable.

### API Dependencies _(mandatory — Constitution Principle XXII)_

Aligned with Backend P005 / Transaction Settlement Workflow (consuming the shared Transactions API surface evolved from P004):

- **Finish (Ready for Payment)**: Submit draft → Ready for Payment; powers User Story 1.
- **Settle (Mark Paid)**: Ready for Payment → Paid; powers User Story 2.
- **Cancel**: Draft/Ready → Cancelled (per backend rules); powers User Story 3.
- **Return to Draft**: Ready for Payment → Draft; powers User Story 4 (manager correction).
- **Reopen**: Paid → settlement-capable state per backend; powers User Story 5.
- **Receipt**: Retrieve receipt payload for Paid transactions; powers User Story 5.
- **Transaction Detail / List**: Status, Paid By/At, cancellation metadata, filters for Ready for Payment; powers all stories.
- **Settlement / audit history**: Prefer dedicated history if provided; otherwise compose timeline from backend lifecycle fields and mutation responses without inventing events client-side.

### UI States _(mandatory — Constitution Principle XXII)_

- **Transaction Detail (settlement-aware)**: Loading — page skeleton; Empty — not found; Success — status, actions, summary, timeline entry points; Error — retry / back to list.
- **Settlement View**: Loading — skeleton for actions + timeline; Empty — no settlement events yet; Success — permitted actions + history; Error — section error with retry.
- **Ready for Payment / Settle / Cancel / Reopen / Return dialogs**: Loading — confirm disabled + progress; Empty — N/A; Success — dialog closes, toast, refreshed status; Error — inline/safe toast, dialog may stay open for retry.
- **Receipt View**: Loading — receipt skeleton; Empty — not available / not Paid; Success — printable receipt content; Error — recovery to detail.
- **Transactions List (settlement filters)**: Loading — table skeleton; Empty — no matching statuses; Success — status badges including Ready for Payment / Paid / Cancelled; Error — list error with retry.

### Responsive Behavior _(mandatory — Constitution Principle XXVII)_

- **Transaction Detail / Settlement**: Mobile — stacked status, primary actions, timeline; Tablet — two-column summary + actions; Desktop — actions toolbar, side-by-side summary and timeline.
- **Dialogs**: Mobile — full-screen or sheet-style confirmations; Desktop — centered modal; focus trapped; Escape cancels when safe.
- **Receipt**: Mobile — single-column printable layout; Desktop — constrained width suitable for print preview; Print CSS friendly.
- **Lists**: Preserve Spec 005 responsive table/card patterns; status filters usable on touch targets.

### Page Layout _(mandatory — Constitution Principle XXXII)_

- **Transaction Detail (extended)**: Header — transaction identity, status badge, breadcrumbs, primary settlement actions by eligibility; Content — foundation fields, settlement summary (Paid By/At when Paid), timeline, link to receipt when Paid.
- **Settlement View** (if routed separately): Header — title “Settlement”, status, actions; Content — payment summary, action panel, audit timeline.
- **Receipt View**: Header — receipt title, print (and download/share if supported), back to transaction; Content — backend receipt sections only.
- **Transactions List**: Existing layout plus clearer Ready for Payment / Paid / Cancelled filtering and badges for settlement work.

### Empty State Design _(mandatory — Constitution Principle XXXIV)_

- **Settlement Timeline**: Icon — history/timeline; Message — “No settlement events yet”; Primary action — none or “Finish draft” when Draft and permitted; Guidance — events appear after Ready for Payment, payment, cancel, or reopen.
- **Receipt unavailable**: Icon — document; Message — “Receipt available after payment”; Primary action — Back to transaction; Guidance — settle the transaction first.
- **Ready for Payment queue (filtered list)**: Icon — inbox; Message — “No transactions waiting for payment”; Guidance — finish drafts or clear filters.

### Production Quality Checklist _(mandatory — Constitution Principle XL)_

Settlement UX must be responsive, accessible (dialogs, timelines, forms, focus management), type-safe at implementation time, dark-mode compatible, with complete loading/error/empty states, mobile-friendly targets, keyboard accessible confirmations, and production-ready feedback—without architectural refactor ahead of Specification 007.

### Validation Rules _(mandatory — Constitution Principle XXII)_

- Cancel reason: required when backend/business rules require it; otherwise optional; length/content validated for UX and aligned with API constraints.
- Reopen reason: required when the API requires it; block submit until valid.
- Return-to-draft reason: optional unless backend requires it.
- Confirm dialogs: no submit while request pending; no double-submit.
- Frontend validation is UX-only; server remains source of truth for lifecycle.

### Error Scenarios _(mandatory — Constitution Principle XXII)_

- Unauthorized workflow action: safe forbidden messaging; hide or disable action; no raw backend dumps.
- Lifecycle conflict (already paid/cancelled/changed): explain that status changed; refresh detail.
- Business rule violation (e.g., not timed in, not assigned): clear guidance from normalized API error message.
- Receipt fetch fails: error state with retry and back navigation.
- Timeline fetch fails: section-level error without blanking the whole page.
- Network failure mid-mutation: preserve dialog inputs where applicable; allow retry.

### Key Entities _(include if feature involves data)_

- **Transaction (settlement-extended)**: Extends foundation transaction with settlement statuses (Ready for Payment, Paid, Cancelled), payment metadata (Paid By, Paid At), submission/cancellation/reopen metadata when returned by the backend.
- **Settlement Action**: A user-triggered workflow transition (finish, settle, cancel, return to draft, reopen) authorized and enforced by the backend.
- **Receipt**: Backend-generated settlement artifact for a Paid transaction (party, items, totals, payer display, paid time).
- **Settlement Event / Audit Entry**: A historical workflow event (action, actor, timestamp, notes) provided or derived solely from backend data for timeline display.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: An authorized user can take an eligible Draft through Ready for Payment to Paid (or Cancel from Draft/Ready) in under 3 minutes of guided UI time without leaving the Transactions area.
- **SC-002**: After successful settlement, 100% of Paid detail views show Paid By and Paid At when the backend provides them, with zero client-invented payment figures.
- **SC-003**: At least 95% of confirmed workflow actions either succeed with refreshed status or fail with an actionable message without leaving the transaction in an ambiguous client-only state.
- **SC-004**: Users can open and print a receipt for a Paid transaction in under 1 minute from the transaction detail entry point.
- **SC-005**: Settlement timeline shows every backend-provided lifecycle event for a multi-step transaction (finish → settle or finish → return → finish → settle) without missing displayed server fields for actor/time/action when those fields exist.

## Assumptions

- Specification 005 transaction foundation (list, detail, draft editor, items, photos, suggestions) remains the base UI; this spec only adds settlement workflow, receipt, and audit surfaces.
- Backend P005 exposes finish, settle, cancel, return-to-draft, reopen, and receipt behaviors consistent with the Scrappy Transaction APIs; the frontend enables only transitions the backend accepts.
- “Manager Approval” in product language maps to reviewing Ready for Payment transactions: settle (accept/pay) and return-to-draft (send back for correction). Dedicated approve/reject endpoints are used only if the backend provides them; otherwise these two transitions constitute the approval workflow.
- Owner reopen applies to Paid transactions when the backend allows; Cancelled reopen is supported in the UI only if the backend later permits it—Cancelled is otherwise treated as terminal.
- Settlement history may come from a dedicated audit/history API or from authoritative lifecycle fields on the transaction; the UI never fabricates missing events.
- Download/Share receipt appear only when practically supported (e.g., printable page, browser print-to-PDF, or backend download URL); Print and View are baseline.
- Authorization continues via Spec 002 role/permission gates plus backend 403 enforcement; employees remain constrained to assigned transactions where the API requires it.
- Trip, expense, analytics, reports, and activity-log products remain out of scope until later roadmap specs.
