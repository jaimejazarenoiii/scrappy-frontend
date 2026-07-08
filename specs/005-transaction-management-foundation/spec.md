# Feature Specification: Transaction Management Foundation

**Feature Branch**: `005-transaction-management-foundation`

**Created**: 2026-07-08

**Status**: Draft

**Input**: User description: Implement Transaction Management Foundation for Scrappy Web (Backend P004). Includes Transactions (inbound/outbound), Transaction Items, Transaction Photos, Draft workflow with auto-save and resume, and backend-powered material/price suggestions. Excludes payment/settlement/receipts and all later financial workflows.

## Purpose _(mandatory — Constitution Principle XXII)_

Enable authorized users to create, edit, and track inbound and outbound transactions through a responsive, production-ready interface that integrates with Backend P004. The module focuses on the transactional “foundation” layer: dashboards, lists, transaction details, draft creation/editing, draft recovery, transaction items, and transaction photos.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - View and manage transactions (Priority: P1)

Users access the Transaction area to view relevant transaction records, search and filter results, open transaction details, and start creating a new draft transaction when needed.

**Why this priority**: It provides immediate daily value by replacing manual tracking with structured transaction records and enables users to move forward from discovery to drafting.

**Independent Test**: Can be fully tested by navigating to the Transactions section, using search/filter/sort/pagination, and opening transaction details to confirm data is displayed correctly.

**Acceptance Scenarios**:

1. **Given** the user has access to the Transactions area, **When** the Transactions page loads, **Then** the user sees an interactive list with search, filtering, sorting, and pagination, and each row includes transaction type context (inbound/outbound) and status display.
2. **Given** the user searches for a term, **When** the search input is used, **Then** results update without losing the current pagination context and show only matching transactions.
3. **Given** the user selects a transaction from the list, **When** the transaction details page opens, **Then** the user sees supported transaction fields and relationship data (assigned employees, branch/warehouse/outside location, items summary, and photos summary if available).
4. **Given** the user is creating a new transaction, **When** they choose to start a transaction draft, **Then** the user lands in a draft editor with a visible draft indicator.

---

### User Story 2 - Create, resume, and auto-save drafts (Priority: P2)

Users create and edit draft transactions, resume saved drafts later, and rely on auto-save to persist in-progress changes to the draft.

**Why this priority**: Draft workflows reduce lost work and allow continuous transaction entry without forcing users to “finish everything” in one sitting.

**Independent Test**: Can be fully tested by creating a draft, making changes across supported fields, leaving and returning, and confirming the draft indicator and persisted data reflect the latest saved state.

**Acceptance Scenarios**:

1. **Given** a user is editing a draft transaction, **When** the user updates supported fields and waits for auto-save, **Then** the draft reflects the changes when re-opened.
2. **Given** the user has an existing draft in the Drafts area, **When** they select “Continue Draft”, **Then** the draft editor opens with the draft’s saved content and a “last saved” indicator.
3. **Given** the user navigates away with unsaved changes, **When** unsaved changes detection is triggered, **Then** the user receives a warning prompt that prevents accidental loss (unless a previous draft state can be recovered).
4. **Given** the draft editor is open, **When** the backend rejects an update (e.g., validation failure), **Then** the user sees a user-friendly error and can correct inputs without losing other valid content.

---

### User Story 3 - Manage items and photos with backend support (Priority: P3)

Users add and maintain transaction items and manage transaction photos, including preview and removal. Users can use backend-provided material and price suggestions during draft creation/editing.

**Why this priority**: Items and photos are core data for transactions; suggestions improve data quality and speed while keeping pricing logic server-driven.

**Independent Test**: Can be fully tested by adding/editing/removing transaction items and uploading/removing photos, and confirming all changes persist and display correctly.

**Acceptance Scenarios**:

1. **Given** a draft transaction is open, **When** the user adds a transaction item and saves, **Then** the item appears in the items section and the details page shows the updated item list.
2. **Given** a draft transaction has multiple items, **When** the user edits quantity/weight/unit/price/notes for an item, **Then** the updated item is persisted and the UI reflects the latest server state.
3. **Given** a draft transaction is open, **When** the user uploads one or more photos, **Then** photos appear in a preview gallery with a progress indicator and can be removed.
4. **Given** the user is adding items and requests material suggestions, **When** they type a query, **Then** the UI shows backend-provided suggestions and allows selection.
5. **Given** the user selected a material, **When** they request price suggestions (if available), **Then** the UI displays backend-provided suggested prices without calculating suggestions on the frontend.

---

### Edge Cases

- What happens when the backend returns an unsupported or unknown transaction status value? The UI should display a safe fallback status label and avoid breaking page layout.
- What happens when an auto-save update fails (network/server error)? The UI should show a non-blocking error, preserve the user’s current form inputs, and allow retry.
- What happens when photo upload fails for one file in a multi-photo selection? The UI should indicate which photos failed and allow retry without losing already uploaded previews.
- What happens when a draft has zero items or photos? The UI should show meaningful empty states that guide the next action.
- What happens when the user tries to resume a draft that no longer exists? The UI should show an error state with a recovery action (e.g., return to Drafts list).

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: Users with appropriate permissions can view a transaction dashboard and understand inbound vs outbound distribution and transaction status context.
- **FR-002**: Users with appropriate permissions can view a transaction list supporting search, filtering, sorting, and pagination.
- **FR-003**: Users can open a transaction details page and view supported transaction fields (branch, warehouse, outside transaction info, assigned employees, transaction direction/type, party name/contact, notes, and reference information).
- **FR-004**: Users can create a new inbound or outbound transaction draft.
- **FR-005**: Users can edit a draft transaction and persist changes to the backend.
- **FR-006**: Users can continue an existing draft transaction from the Drafts area.
- **FR-007**: The UI includes a draft indicator and unsaved changes detection to prevent accidental data loss.
- **FR-008**: Auto-save persists supported draft changes automatically and updates the “last saved” indicator when successful.
- **FR-009**: Users can add, edit, and remove transaction items within a draft transaction.
- **FR-010**: Transaction item editing supports: material/description, quantity inputs represented by supported measurement fields, unit, unit price, weight, and notes (when supported by the backend).
- **FR-011**: Users can upload, preview, and remove multiple photos associated with a draft transaction.
- **FR-012**: The UI displays upload progress and provides safe handling for upload failures.
- **FR-013**: Material suggestions and material selection are supported using backend-provided suggestions (no frontend-only suggestion logic).
- **FR-014**: Price suggestions (and price history if available) are supported using backend-provided suggestions (no frontend price calculation for suggestions).
- **FR-015**: Relationship data is displayed by consuming backend responses for items, photos, branch/warehouse context, and assigned employees.
- **FR-016**: The UI supports pagination and responsive table/cards layouts for list views.
- **FR-017**: The Transaction module provides permission-driven navigation visibility and protects routes according to the authorization infrastructure established previously.
- **FR-018**: The module must not implement payment, ready-for-payment, paid, cancelled workflow actions, receipt generation, settlement workflows, manager approval, audit trail, trip management, expenses, analytics, reports, or activity logs.

### API Dependencies _(mandatory — Constitution Principle XXII)_

- **Transactions (Backend P004)**: List/search/filter/paginate transactions; retrieve transaction details; create transaction drafts; retrieve and update draft transactions; archive/cancel where applicable; list assigned transactions for context.
- **Transaction Items (Backend P004)**: Add/edit/remove transaction items for a draft transaction; persist item fields including notes when supported.
- **Transaction Photos / Attachments (Backend P004)**: Upload/list/delete photo attachments for a draft transaction; show upload state and previews.
- **Material Suggestions (Backend P004)**: Search materials for autocomplete/selection.
- **Price Suggestions (Backend P004)**: Retrieve suggested prices based on selected materials (and price history if available).

### UI States _(mandatory — Constitution Principle XXII)_

- **Transactions Dashboard**: Loading — skeleton cards and table placeholders; Empty — guidance to start a draft or check filters; Success — dashboard cards and summary; Error — user-friendly error with retry.
- **Transactions List**: Loading — table skeleton rows; Empty — “no transactions found” with actions to adjust filters; Success — table/card representation with status and type; Error — error state and retry.
- **Transaction Details**: Loading — page skeleton; Empty — “transaction not found or inaccessible”; Success — supported fields plus items/photos summaries; Error — error state with recovery navigation.
- **Draft Editor (New/Edit/Resume)**: Loading — form skeleton; Empty — new draft form initialization; Success — draft indicator, auto-save status, and editable sections; Error — actionable error state with user-safe recovery.
- **Items Editor**: Loading — skeleton for item list; Empty — item guidance and add-item CTA; Success — item editing controls; Error — item-level error feedback.
- **Photo Manager**: Loading — upload placeholders; Empty — “no photos yet” state; Success — preview gallery and remove controls; Error — upload error feedback with retry.
- **Suggestions UI**: Loading — suggestion spinner; Empty — no results message; Success — selectable suggestions; Error — suggestions error message without breaking item editor.

### Responsive Behavior _(mandatory — Constitution Principle XXVII)_

- **Transactions Dashboard**: Navigation — uses existing protected module navigation; Layout — KPI cards on mobile stacking, summary tiles on desktop; Tables — not required on mobile; Cards — used for responsive cards; Modals — used for confirmation only.
- **Transactions List**: Navigation — persistent filters/search; Layout — responsive table on desktop and card-based rows on mobile; Tables — horizontally constrained or converted to cards; Forms — stack fields vertically; Pagination — accessible pagination controls.
- **Transaction Details**: Layout — stacked sections on mobile, two-column sections on larger screens; Photos — responsive gallery grid.
- **Draft Editor**: Layout — stacked editor panels on mobile; Sections — items and photos editors separated into cards/panels across breakpoints; Forms — inline field validation and step-friendly grouping.
- **Items Editor**: Layout — each item editor as collapsible panel on mobile; editor fields arranged in grid on desktop.
- **Photo Manager**: Layout — preview thumbnails in responsive grid; upload controls accessible and usable on touch.

### Page Layout _(mandatory — Constitution Principle XXXII)_

- **Transactions Dashboard**: Header — page title, description, breadcrumbs, and primary actions (create draft); Content — filters/search if applicable, KPI/summary, recent activity where available (transaction foundation only), and error/empty states.
- **Transactions List**: Header — title, breadcrumbs, and search/filter controls; Content — paginated list in table/card format, status/type indicators, and row actions.
- **Transaction Details**: Header — title identifying transaction type and direction; Content — supported field list, items section, photo section, and draft-only actions limited to foundation scope.
- **Draft Editor (New/Edit/Resume)**: Header — title with inbound/outbound context and draft indicator; Content — editable form sections, items manager, photo manager, auto-save state, and disabled submit during processing.
- **Drafts List**: Header — title and guidance; Content — draft-only list with continue/resume actions.

### Empty State Design _(mandatory — Constitution Principle XXXIV)_

- **Transactions List**: Icon/illustration — transactions; Message — “No transactions found”; Primary action — “Create draft” (when permitted) or “Adjust filters”; Guidance — suggests clearing filters or entering different search terms.
- **Drafts List**: Icon/illustration — draft; Message — “No drafts available”; Primary action — “Start a new draft” (when permitted); Guidance — explains that drafts appear here when saved.
- **Items Editor**: Icon/illustration — item; Message — “No items added yet”; Primary action — “Add Item”; Guidance — prompts users to select a material and enter weight/unit/price.
- **Photo Manager**: Icon/illustration — photo; Message — “No photos added yet”; Primary action — “Upload Photos”; Guidance — explains photos help confirm transaction details.

### Production Quality Checklist _(mandatory — Constitution Principle XL)_

Deliverables must be responsive, accessible, consistent with the UI/UX design system, and include complete loading/empty/error states. Draft workflows must clearly communicate save status. Forms must support keyboard navigation and accessible validation messaging. The module must remain production-ready and integrated with the existing authorization patterns.

### Validation Rules _(mandatory — Constitution Principle XXII)_

- Draft editor fields: Required inputs must be validated according to backend expectations (e.g., direction/type, location information, party details, and at least one assigned employee where required).
- Items: Each item must provide required supported fields (material name/identifier, weight, unit, and unit price), and notes must accept null/empty when supported.
- Photos: Upload actions must validate file selection (e.g., only supported attachment type) and handle backend errors gracefully.
- Suggestions: Suggestion lists must handle empty results and backend errors without blocking form submission.

### Error Scenarios _(mandatory — Constitution Principle XXII)_

- Draft save/update fails: User-facing message indicates the draft could not be saved; user can retry; do not expose raw backend exceptions.
- Auto-save fails while editing: UI indicates temporary save issue; user edits are preserved; retry occurs on demand or on next change.
- Item CRUD fails: UI shows item-specific error and allows the user to correct and retry.
- Photo upload fails: UI shows which uploads failed; user can retry and remove failed items.
- Transaction details retrieval fails: UI shows “transaction not found or inaccessible” with a recovery action back to list/drafts.

### Key Entities _(include if feature involves data)_

- **Transaction**: A record representing an inbound or outbound transaction, including direction/type, status (including draft state), party details, location context (branch/warehouse/outside), notes/reference info, assigned employees, and total amount computed by the backend.
- **Transaction Item**: A line item attached to a draft transaction with material name, weight, unit, unit price, notes, and backend-persisted total.
- **Transaction Photo (Attachment)**: A photo attachment associated with a draft transaction, stored and served by the backend.
- **Draft Transaction**: A Transaction in draft state that supports incremental saving, auto-save updates, and editing of items/photos.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can create a complete draft transaction (with at least one item and optional photos) and see it persist correctly after leaving and returning within 2 minutes of workflow time.
- **SC-002**: At least 95% of draft edits result in successfully persisted updates after the user corrects any validation errors highlighted by the UI.
- **SC-003**: Auto-save results in a saved draft within a short, user-perceivable time window after changes (users can confirm “last saved” reflects the latest edit).
- **SC-004**: Photo uploads show progress and completion for each file; failures are reported clearly so users can successfully recover within the same editing session.

## Assumptions

- Users have permission to access the Transactions module based on the authorization infrastructure established previously.
- Backend P004 supports draft creation and incremental draft updates, including draft lists/resume flows.
- Backend provides material suggestions and price suggestions (including any “history” fields if available) and the frontend displays them without calculating suggestions.
- Draft transactions use backend-provided status values, and the UI supports safe fallbacks for any unknown status labels.
