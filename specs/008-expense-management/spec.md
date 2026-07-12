# Feature Specification: Expense Management

**Feature Branch**: `008-expense-management`

**Created**: 2026-07-09

**Status**: Draft

**Input**: User description: Implement Specification 008 – Expense Management for Scrappy Web (Backend P007). Complete frontend for operational expenses: dashboard, list, details, create, edit, delete/archive when supported, categories, dynamic reference types, receipt photos, search/filter/sort/pagination. Builds on Specifications 001–007 without architectural refactoring. Excludes Analytics, Reports, and Activity Logs.

## Purpose _(mandatory — Constitution Principle XXII)_

Enable authorized users to record, review, and monitor operational expenses across the organization through a production-ready Expense Management module that consumes Backend P007. Expenses capture what was spent, why, when, against which organizational context (company, branch, warehouse, vehicle, trip), and supporting receipt evidence. The frontend must enforce backend business rules and display backend-provided data without duplicating server logic.

This feature builds strictly on Specifications 001–007 and MUST NOT redesign or refactor the existing architecture. It corresponds directly to **Backend P007 — Expense Management** and MUST leave the codebase ready for **Specification 009 — Analytics (Backend P008)** without architectural changes.

**In scope**: Expense dashboard and list; expense details; create and edit expense; delete and/or archive when supported by the API; expense categories from backend; dynamic reference-type selectors; receipt photo upload, preview, and removal; search, filter, sort, and pagination; permission-gated navigation and routes; linked-entity display.

**Out of scope**: Analytics, Reports, Activity Logs, and any expense capabilities not exposed by Backend P007 APIs.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Discover and review expenses (Priority: P1)

Authorized users access the Expenses area to view a dashboard or summary (when provided) and a searchable, filterable, sortable, paginated list of expenses, then open expense details.

**Why this priority**: Expense visibility is the entry point for financial oversight; without list and detail views, recording and auditing cannot begin.

**Independent Test**: Navigate to Expenses, use search/filter/sort/pagination, open an expense detail page, and verify category, reference, amount, date, status, notes, and receipt summaries match backend data.

**Acceptance Scenarios**:

1. **Given** the user has access to Expenses, **When** the Expenses list loads, **Then** expenses appear in a responsive table or card layout with status indicators, search, filters, sorting, and pagination.
2. **Given** the user applies filters (e.g., category, reference type, date range, status, amount range if supported), **When** results update, **Then** only matching expenses are shown with a clear empty state when none match.
3. **Given** the user selects an expense, **When** the detail page opens, **Then** supported expense fields, category, reference entity, status, and receipt attachment summary display from backend data.
4. **Given** a dashboard summary is provided by the backend, **When** the Expenses area loads, **Then** summary metrics or recent activity reflect API data without client-side aggregation beyond display formatting.
5. **Given** the user lacks expense view permission, **When** they attempt to access Expenses routes, **Then** they are blocked by authorization with a safe recovery path.

---

### User Story 2 - Create and edit expenses (Priority: P1)

Authorized users create new expenses and edit eligible expenses through validated forms that capture category, reference type, linked reference entity, description, amount, expense date, and notes as supported by the API.

**Why this priority**: Recording expenses is the core operational task; users must capture spend accurately against the correct organizational context.

**Independent Test**: Create an expense with required fields, save successfully, reopen for edit, change supported fields, and verify persisted values match backend responses.

**Acceptance Scenarios**:

1. **Given** the user has create permission, **When** they complete the new-expense form with valid data and submit, **Then** an expense is created, success feedback is shown, and they can open the new expense detail.
2. **Given** an editable expense, **When** the user updates supported fields, **Then** changes persist via the backend and the detail view reflects the latest server state.
3. **Given** the user selects a reference type, **When** the form updates, **Then** the appropriate reference selector appears dynamically (e.g., branch, warehouse, vehicle, trip) populated from backend lookup APIs—never from hardcoded option lists.
4. **Given** invalid or incomplete input, **When** the user submits, **Then** inline validation and backend error messages appear without losing other valid field values.
5. **Given** an expense is not editable per backend rules, **When** the user views it, **Then** edit actions are hidden or disabled with clear guidance.

---

### User Story 3 - Manage expense categories (Priority: P1)

Authorized users select expense categories when creating or editing expenses and filter the expense list by category. Categories are loaded entirely from backend APIs.

**Why this priority**: Categories classify spend for review and downstream analytics; they must remain authoritative from the backend.

**Independent Test**: Open create expense form, verify category options load from the API, select a category, save, and filter the list by that category with matching results.

**Acceptance Scenarios**:

1. **Given** category options are available, **When** the create or edit form loads, **Then** categories are presented from backend data with loading and empty states when none exist.
2. **Given** categories support labels or grouping in the API, **When** displayed, **Then** the UI reflects backend structure without inventing category hierarchies.
3. **Given** the list supports category filter, **When** the user selects a category, **Then** results update per backend query parameters.
4. **Given** category fetch fails, **When** the form loads, **Then** the user sees an actionable error and cannot submit without valid category data unless the backend allows optional categories.

---

### User Story 4 - Attach and manage receipt photos (Priority: P2)

Authorized users upload one or more receipt images to an expense, preview them in a gallery, monitor upload progress, and remove images when permitted.

**Why this priority**: Receipt evidence supports audit and reconciliation; it depends on an expense existing first.

**Independent Test**: On an eligible expense, upload multiple receipt images, preview them, remove one when allowed, and verify attachment list matches backend data after refresh.

**Acceptance Scenarios**:

1. **Given** an editable expense, **When** the user uploads supported image files, **Then** upload progress is shown and successful uploads appear in a preview gallery from backend attachment data.
2. **Given** receipt attachments exist, **When** the user opens the gallery, **Then** images display using backend-provided access patterns (e.g., authenticated download URLs) without exposing raw storage paths inappropriately.
3. **Given** the user removes a receipt (if allowed), **When** removal succeeds, **Then** the gallery updates per backend response.
4. **Given** upload fails (unsupported type, size limit, max count), **When** the error returns, **Then** the user sees an actionable message and already-uploaded receipts remain intact.
5. **Given** multi-file selection, **When** one file fails and others succeed, **Then** partial success is communicated clearly with retry for failed files.

---

### User Story 5 - View expense relationships and references (Priority: P2)

Users reviewing an expense see the linked reference entity (company, branch, warehouse, vehicle, or trip) with navigable labels when deep linking to related modules is supported and permitted.

**Why this priority**: Expenses must be understood in organizational context; relationships come from the backend, not client inference.

**Independent Test**: Create expenses with different reference types, open each detail page, and verify the correct reference label and link (when available) match API relationship payloads.

**Acceptance Scenarios**:

1. **Given** an expense linked to a branch, warehouse, vehicle, or trip, **When** detail loads, **Then** reference type and entity display using backend-provided identifiers and labels.
2. **Given** the user has permission to view the linked module, **When** they follow a reference link, **Then** navigation opens the existing detail route for that entity without reimplementing organization or trip logic.
3. **Given** reference labels require lookup enrichment, **When** detail loads, **Then** labels are resolved via existing organization, vehicle, or trip services—not hardcoded mappings.
4. **Given** a reference entity was archived or is inaccessible, **When** detail loads, **Then** the UI shows a safe fallback label without breaking the page.

---

### User Story 6 - Delete or archive expenses (Priority: P3)

Authorized users remove expenses from active use through delete and/or archive actions when supported by Backend P007, with confirmation and clear post-action navigation.

**Why this priority**: Correction and lifecycle management are important but secondary to recording and review.

**Independent Test**: On an eligible expense, confirm delete or archive, verify list/detail behavior per backend rules, and confirm archived expenses appear only when filters allow.

**Acceptance Scenarios**:

1. **Given** delete is supported and permitted, **When** the user confirms deletion, **Then** the expense is removed per backend rules and the user returns to list or sees a not-found state on detail.
2. **Given** archive is supported and permitted, **When** the user confirms archive, **Then** status or visibility updates per backend rules and list filters respect archived inclusion settings.
3. **Given** delete or archive is not supported for the expense state, **When** the user views it, **Then** those actions are hidden or disabled.
4. **Given** the backend rejects removal (e.g., locked or settled expense), **When** the action fails, **Then** an actionable error is shown without a false success state.

---

### Edge Cases

- Backend returns unknown expense status: show a safe fallback label; never invent status transitions.
- Category list empty: guided empty state on create; explain that categories must be configured on the backend.
- Reference type changed mid-edit: clear incompatible reference selection; revalidate before submit.
- Reference entity deleted or archived after expense creation: show fallback on detail; do not break edit unless backend allows.
- Receipt upload at max attachment limit: block further uploads with clear message from backend or documented limit.
- Concurrent edit (another user updated expense): show conflict messaging and refresh to latest data.
- Deep link to `/expenses/:id` or `/expenses/:id/edit` without permission: authorization gate with recovery to list.
- Filter combination returns zero results: empty state with filter reset guidance.
- Soft-archived expenses: list behavior follows backend `includeArchived` or equivalent query rules.
- Large receipt images on slow networks: progressive loading and non-blocking upload feedback.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: Authorized users can view an Expenses dashboard or summary (when provided) and a paginated expense list with search, filtering, sorting, and pagination driven by backend query capabilities.
- **FR-002**: Authorized users can open expense details and view category, reference type, reference entity, description, amount, expense date, notes, status, and receipt attachment summary as returned by the API.
- **FR-003**: Authorized users can create new expenses through a validated form with loading, disabled submit while processing, and success/error feedback.
- **FR-004**: Authorized users can edit eligible expenses; edit availability MUST follow backend rules for the current status or lifecycle.
- **FR-005**: Authorized users can delete expenses when the backend supports and permits deletion, with confirmation.
- **FR-006**: Authorized users can archive expenses when the backend supports and permits archiving, with confirmation.
- **FR-007**: Expense categories MUST be loaded from backend category APIs for selection, display, and filtering; categories MUST NOT be hardcoded in the frontend.
- **FR-008**: Reference type selection MUST dynamically determine which reference entity picker is shown (e.g., company, branch, warehouse, vehicle, trip); reference options MUST come from existing organization, vehicle, and trip lookup APIs as appropriate.
- **FR-009**: Reference relationships MUST be consumed from backend expense payloads; the frontend MUST NOT infer reference links client-side.
- **FR-010**: Expense amounts and totals displayed MUST use backend-provided values; the client MUST NOT recalculate expense totals beyond display formatting.
- **FR-011**: The UI MUST support backend expense statuses with clear visual indicators and safe fallbacks for unknown values.
- **FR-012**: Receipt photo upload MUST use backend-supported multipart or attachment endpoints with progress, preview, gallery, and remove-when-permitted flows.
- **FR-013**: Receipt images MUST be fetched and displayed using backend-provided access patterns consistent with other attachment modules (e.g., authenticated URLs).
- **FR-014**: Protected routes MUST exist for Expenses list, new expense, expense detail, and expense edit with deep linking, browser history, nested layouts, and lazy loading per established application patterns.
- **FR-015**: Application navigation MUST include Expenses; visibility MUST respect backend authorization and permissions without hardcoded role-based menu rules.
- **FR-016**: All expense data fetching and mutations MUST use TanStack Query; UI-only state (filters, dialog visibility, view preferences) MAY use Zustand without duplicating server data.
- **FR-017**: All API communication MUST occur through feature service classes; UI components MUST NOT call the HTTP client directly.
- **FR-018**: All forms MUST use React Hook Form and Zod with inline validation, loading indicators, disabled submit while processing, and success/error feedback aligned with backend rules where possible.
- **FR-019**: Shared list, form, dialog, upload, gallery, badge, skeleton, empty, and error patterns from prior specifications MUST be reused; feature-specific components are created only when necessary.
- **FR-020**: Linked entity display SHOULD provide deep links to Organization, Vehicle, and Trip modules when permissions allow, reusing existing routes from Specifications 003 and 007.
- **FR-021**: Out of scope: Analytics, Reports, Activity Logs, and architectural refactoring of Specifications 001–007.
- **FR-022**: Expense screens MUST meet production quality: responsive layouts, accessible tables/forms/dialogs/uploads, light and dark mode, keyboard operable actions, and complete loading/empty/error states.

### API Dependencies _(mandatory — Constitution Principle XXII)_

Aligned with Backend P007 / Expense Management (tenant-scoped `/api/v1`):

- **List / search expenses**: Paginated expense list with filters (category, reference type, reference id, status, date range, search, amount if supported); powers User Stories 1 and 3.
- **Expense dashboard summary** (if provided): Aggregate metrics or recent expenses; powers User Story 1.
- **Get expense detail**: Full expense with category, reference, status, attachments; powers User Stories 1, 2, and 5.
- **Create expense**: New expense record; powers User Story 2.
- **Update expense**: Edit supported fields; powers User Story 2.
- **Delete expense** (if supported): Remove expense; powers User Story 6.
- **Archive expense** (if supported): Soft-delete or archive transition; powers User Story 6.
- **Expense categories — list**: Category options for forms and filters; powers User Story 3.
- **Receipt attachments — list / upload / delete**: Receipt images on an expense; powers User Story 4.
- **Supporting lookups**: Branches, warehouses, vehicles, trips, and company context via existing organization and trip APIs for reference pickers and labels; powers User Stories 2 and 5.

### UI States _(mandatory — Constitution Principle XXII)_

- **Expenses Dashboard / List**: Loading — skeleton table/cards and optional summary cards; Empty — “No expenses found” with filter guidance; Success — paginated list with status and category badges; Error — retry and safe message.
- **Expense Detail**: Loading — page skeleton; Empty — not found; Success — fields, reference link, receipt gallery; Error — recovery to list.
- **Create / Edit Expense**: Loading — form skeleton and category/reference option loading; Empty — new form defaults; Success — saved expense with feedback; Error — inline field and form-level errors.
- **Receipt upload gallery**: Loading — thumbnail skeletons; Empty — “No receipts attached” with upload CTA when permitted; Success — image grid with remove actions; Error — per-file or section-level error with retry.
- **Delete / Archive confirmation**: Loading — confirm disabled; Success — close dialog, toast, navigate or refresh; Error — actionable message, retry allowed.

### Responsive Behavior _(mandatory — Constitution Principle XXVII)_

- **Expenses List**: Mobile — card rows, stacked filters; Tablet — compact table or two-column filters; Desktop — full table, filter bar, pagination toolbar.
- **Expense Detail**: Mobile — stacked sections (summary, reference, receipts); Desktop — two-column layout with receipt gallery beside or below summary.
- **Create / Edit forms**: Mobile — single-column stacked fields with reference picker sheets; Desktop — grouped sections in grid; dynamic reference field appears inline when type changes.
- **Receipt gallery**: Mobile — horizontal scroll or stacked thumbnails; Desktop — grid gallery with lightbox or modal preview.
- **Upload control**: Mobile — full-width drop zone; Desktop — compact upload button with drag-and-drop area.

### Page Layout _(mandatory — Constitution Principle XXXII)_

- **Expenses List**: Header — title, breadcrumbs, primary “New expense” when permitted; Content — optional dashboard KPIs, search, filters (category, reference type, status, dates), data table/cards, pagination.
- **Expense Detail**: Header — expense identifier or description summary, status badge, breadcrumbs, edit/delete/archive actions when permitted; Content — amount and date prominence, category, reference block, notes, receipt gallery.
- **Create Expense**: Header — “New expense”, breadcrumbs; Content — form sections for category, reference type and entity, amount, date, description, notes, receipt upload when supported on create.
- **Edit Expense**: Header — expense identity, edit indicator; Content — same form patterns as create with fields disabled per backend rules.

### Empty State Design _(mandatory — Constitution Principle XXXIV)_

- **Expenses List**: Icon — receipt/wallet; Message — “No expenses yet” or “No expenses match your filters”; Primary action — “New expense” when permitted; Guidance — adjust filters or record the first expense.
- **Expense Categories (form)**: Icon — tag; Message — “No categories available”; Guidance — contact administrator or configure categories on the backend.
- **Reference picker**: Icon — link; Message — “No matching references”; Guidance — select a different reference type or create the entity in its module first.
- **Receipt gallery**: Icon — image; Message — “No receipt photos”; Primary action — “Upload receipt” when permitted.
- **Dashboard summary** (if no data): Message — “No expense activity yet”; Guidance — expenses appear here once recorded.

### Production Quality Checklist _(mandatory — Constitution Principle XL)_

Expense Management UX must be responsive, accessible (semantic HTML, keyboard navigation, focus management in dialogs and upload flows, accessible tables and forms), dark-mode compatible, with complete loading/error/empty states, mobile-friendly touch targets, and production-ready feedback—without architectural refactor ahead of Specification 009.

### Validation Rules _(mandatory — Constitution Principle XXII)_

- Expense create/edit: required fields per backend (category, reference type and entity when required, description, amount, expense date); amount must be positive; inline Zod validation for UX; server remains source of truth.
- Reference type change: clear invalid reference selection; require re-selection before submit.
- Receipt upload: enforce supported file types and size limits as documented by backend; block submit during active uploads when appropriate.
- Delete/archive: confirmation required; optional reason when backend requires it.
- Frontend validation is UX-only; lifecycle, reference eligibility, and amount rules are enforced by the backend.

### Error Scenarios _(mandatory — Constitution Principle XXII)_

- Unauthorized expense action: safe forbidden messaging; hide or disable action.
- Edit conflict (expense changed elsewhere): explain and refresh detail.
- Invalid reference (entity not found or wrong type): show backend validation; preserve other form values.
- Category or reference lookup failure: section-level error with retry.
- Receipt upload failure: per-file message; allow retry without removing successful uploads.
- Delete/archive rejected (locked expense): show backend message; no false removal state.
- List or detail fetch failure: page/section error with retry.
- Network failure mid-mutation: preserve form or dialog inputs where applicable; allow retry.

### Key Entities _(include if feature involves data)_

- **Expense**: An operational spend record with category, reference type, linked reference entity, description, amount, expense date, notes, status, and optional receipt attachments.
- **Expense Category**: A backend-defined classification for expenses, used in forms, display, and list filters.
- **Expense Reference**: The organizational or operational context for an expense (company, branch, warehouse, vehicle, or trip), determined by reference type and entity id from the API.
- **Expense Receipt Attachment**: An image file linked to an expense for audit evidence, with metadata and access URL from the backend.
- **Expense Status**: A lifecycle or visibility state (e.g., active, archived) defined by Backend P007; exact values come from the API.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: An authorized user can record a new expense with category, reference, amount, and date in under 2 minutes from the Expenses list without leaving the module.
- **SC-002**: An authorized user can attach at least one receipt photo and view it in the gallery within 1 minute of creating or opening an editable expense.
- **SC-003**: After successful create, edit, delete, or archive actions, 100% of expense detail views show amounts, dates, and reference data that match the backend response, with zero client-invented totals or statuses.
- **SC-004**: Users can find an expense via search or filter and open its detail page in under 30 seconds from the Expenses list on desktop and under 45 seconds on mobile.
- **SC-005**: At least 95% of confirmed expense mutations either succeed with refreshed data or fail with an actionable message without leaving the expense in an ambiguous client-only state.
- **SC-006**: Category and reference selectors always reflect live backend data—zero hardcoded category or reference option lists in the delivered module.

## Assumptions

- Specifications 001–007 foundations (routing, auth, organization, workforce, transactions, trips) remain unchanged in architecture; this spec adds an `expenses` feature module only.
- Backend P007 exposes expense CRUD, categories, reference types, receipt attachments, delete and/or archive, and relationship payloads consistent with the Scrappy API envelope and tenant isolation.
- Exact expense status values, category shapes, and reference type enums are defined by the backend contract; the UI displays labels from API responses with safe fallbacks for unknown values.
- Delete and archive are optional capabilities; the frontend implements only what Backend P007 exposes, hiding actions when endpoints or permissions are absent.
- Receipt upload limits (file types, max size, max count per expense) follow backend documentation; the frontend surfaces limits in validation messages without inventing stricter rules unless required for UX safety.
- Reference pickers reuse existing branch, warehouse, vehicle, and trip list/option services from Specifications 003 and 007 rather than duplicating lookup logic.
- Analytics, reports, and activity-log products remain out of scope until Specifications 009–011.
- Authorization continues via Spec 002 permission gates plus backend 403 enforcement; menu visibility uses permission keys derived from role mapping until the API returns explicit permissions.
- Dashboard summary widgets are included only if Backend P007 provides a dashboard endpoint; otherwise the list page serves as the primary entry with filter-driven insight.
