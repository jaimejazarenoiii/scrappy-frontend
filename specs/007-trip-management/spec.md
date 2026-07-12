# Feature Specification: Trip Management

**Feature Branch**: `007-trip-management`

**Created**: 2026-07-09

**Status**: Draft

**Input**: User description: Implement Specification 007 – Trip Management for Scrappy Web (Backend P006). Complete frontend for Trips and Trip Members: plan, manage, execute, and monitor trips with vehicle, employee, branch, warehouse, and transaction integration. Workflow states Draft → Scheduled → Started → Completed (or Draft → Cancelled). Excludes expense management, analytics, reports, and activity logs.

## Purpose _(mandatory — Constitution Principle XXII)_

Enable authorized users to plan, schedule, execute, and monitor company trips through a production-ready Trip Management module that consumes Backend P006. Trips coordinate people (employees), assets (vehicles), locations (branches/warehouses), and operational work (linked transactions) in one place. The frontend must enforce backend business rules and display backend-provided data without duplicating server logic.

This feature builds strictly on Specifications 001–006 and MUST NOT redesign or refactor the existing architecture. It corresponds directly to **Backend P006 — Trip Management** and MUST leave the codebase ready for **Specification 008 — Expense Management (Backend P007)** without architectural changes.

**In scope**: Trip dashboard and list; trip details; create/edit/cancel trip; search, filter, sort, pagination; workflow transitions (Draft, Scheduled, Started, Completed, Cancelled); trip members (assign/remove/view); vehicle assignment; transaction assignment and summaries; route information and timeline; odometer display; permission-gated navigation and routes.

**Out of scope**: Expense Management, Analytics, Reports, Activity Logs, and any trip capabilities not exposed by Backend P006 APIs.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Discover and open trips (Priority: P1)

Authorized users access the Trips area to view a dashboard or list of trips, search and filter by status and related criteria, sort and paginate results, and open trip details.

**Why this priority**: Trip visibility is the entry point for all trip operations; without list and detail views, planning and execution cannot begin.

**Independent Test**: Navigate to Trips, use search/filter/sort/pagination, open a trip detail page, and verify status, route summary, assigned vehicle, members, and linked transactions display data returned by the backend.

**Acceptance Scenarios**:

1. **Given** the user has access to Trips, **When** the Trips list loads, **Then** trips appear in a responsive table or card layout with status indicators, search, filters, sorting, and pagination.
2. **Given** the user applies filters (e.g., status, date range, vehicle, branch), **When** results update, **Then** only matching trips are shown with a clear empty state when none match.
3. **Given** the user selects a trip, **When** the detail page opens, **Then** supported trip fields, relationships (vehicle, members, branch/warehouse, transactions), and workflow status are shown from backend data.
4. **Given** the user lacks trip view permission, **When** they attempt to access Trips routes, **Then** they are blocked by authorization with a safe recovery path.

---

### User Story 2 - Create and edit trip plans (Priority: P1)

Authorized users create new trips and edit eligible trips (typically drafts or other backend-permitted states), capturing route information, scheduling, organizational context, and initial assignments as supported by the API.

**Why this priority**: Planning is the foundation of trip management; users must define where, when, and with whom a trip will occur before execution.

**Independent Test**: Create a trip with required fields, save successfully, reopen for edit, change supported fields, and verify persisted values match backend responses.

**Acceptance Scenarios**:

1. **Given** the user has create permission, **When** they complete the new-trip form with valid data and submit, **Then** a trip is created (typically in Draft), success feedback is shown, and they can open the new trip detail.
2. **Given** an editable trip, **When** the user updates supported fields (origin, destination, scheduled start, branch/warehouse context, notes), **Then** changes persist via the backend and the detail view reflects the latest server state.
3. **Given** invalid or incomplete input, **When** the user submits, **Then** inline validation and backend error messages appear without losing other valid field values.
4. **Given** a trip is not editable per backend rules, **When** the user views it, **Then** edit actions are hidden or disabled with clear guidance.

---

### User Story 3 - Execute trip workflow transitions (Priority: P1)

Authorized users advance trips through backend-defined workflow states: Draft → Scheduled → Started → Completed, or cancel from eligible states (e.g., Draft → Cancelled). The UI never hardcodes which transitions are allowed; it reflects backend eligibility and error responses.

**Why this priority**: Workflow execution is the operational core of trip management; status drives what actions and data are visible.

**Independent Test**: On eligible trips, perform schedule, start, complete, and cancel actions with confirmation; verify status updates and timeline fields (scheduled/actual start/completion) match backend data.

**Acceptance Scenarios**:

1. **Given** a Draft trip the user may schedule, **When** they confirm the schedule action, **Then** status becomes Scheduled (or backend-equivalent) and success feedback is shown.
2. **Given** a Scheduled trip the user may start, **When** they confirm start (including odometer or other required fields if the API requires them), **Then** status becomes Started and actual start metadata displays when returned.
3. **Given** a Started trip the user may complete, **When** they confirm completion (including ending odometer if required), **Then** status becomes Completed and actual completion metadata displays when returned.
4. **Given** an eligible trip, **When** the user confirms cancel, **Then** status becomes Cancelled and post-cancel actions follow backend rules.
5. **Given** the backend rejects a transition (e.g., vehicle conflict, missing members, invalid odometer), **When** the action fails, **Then** a safe error message is shown, status remains unchanged, and the user can retry or correct inputs.
6. **Given** a trip in a terminal or non-actionable state, **When** the detail view loads, **Then** only backend-permitted actions are offered.

---

### User Story 4 - Manage trip members (Priority: P2)

Authorized users assign employees to a trip, remove members when allowed, and view assigned members with status information when the backend provides it.

**Why this priority**: Trips require crew coordination; member management is essential but depends on a trip existing first.

**Independent Test**: On an eligible trip, add one or more employees, view the member list, remove a member when permitted, and verify the list matches backend membership data.

**Acceptance Scenarios**:

1. **Given** an eligible trip, **When** the user assigns employees from backend-provided options, **Then** assigned members appear in the trip detail with names/identifiers from the API.
2. **Given** assigned members, **When** the user removes a member (if allowed), **Then** the member is removed per backend rules and the list refreshes.
3. **Given** member status is supported (e.g., invited, confirmed, active), **When** members are displayed, **Then** status labels reflect backend values with safe fallbacks for unknown values.
4. **Given** assignment fails (e.g., employee unavailable, duplicate member), **When** the error returns, **Then** the user sees an actionable message without a stale member list.

---

### User Story 5 - Assign and display vehicle (Priority: P2)

Authorized users assign a vehicle to a trip, change the vehicle when the backend allows, and view the assigned vehicle. Vehicle availability or conflict rules are enforced by the backend (e.g., one active trip per vehicle).

**Why this priority**: Vehicle assignment links trips to organization assets and is required for field operations.

**Independent Test**: Assign a vehicle to a draft or scheduled trip, view vehicle details on the trip, attempt change when permitted, and verify backend validation messages on conflicts.

**Acceptance Scenarios**:

1. **Given** an eligible trip without a vehicle, **When** the user selects a vehicle from backend options, **Then** the assignment persists and vehicle details display on the trip.
2. **Given** a trip with an assigned vehicle, **When** the user changes the vehicle (if allowed), **Then** the new assignment replaces the prior one per backend rules.
3. **Given** the backend reports a vehicle conflict (e.g., already on an active trip), **When** assignment fails, **Then** the UI shows the backend validation message and does not show a false success state.
4. **Given** vehicle availability hints are returned by the API, **When** the user selects a vehicle, **Then** availability information is displayed without client-side availability calculation.

---

### User Story 6 - Link and manage transactions on a trip (Priority: P2)

Authorized users view transactions linked to a trip, assign transactions when permitted, remove links when allowed, and search/filter transaction candidates. Transaction summaries use backend data only; transaction business logic is not duplicated.

**Why this priority**: Trips operationalize collection/delivery work tied to transactions; linking connects trip execution to commercial records.

**Independent Test**: On an eligible trip, assign one or more transactions, view summaries on the trip detail, remove a link when allowed, and verify totals/status come from the backend.

**Acceptance Scenarios**:

1. **Given** an eligible trip, **When** the user assigns transactions from searchable/filterable backend results, **Then** linked transactions appear with summaries (e.g., number, direction, party, status, amount) from API data.
2. **Given** linked transactions, **When** the user removes a link (if allowed), **Then** the trip’s transaction list updates per backend response.
3. **Given** outside-transaction rules apply, **When** assignment or validation fails, **Then** backend validation messages are displayed without frontend-only rules.
4. **Given** linked transactions, **When** the user opens a transaction, **Then** navigation to the existing Transactions module works via deep link without reimplementing transaction detail logic.

---

### User Story 7 - Route, timeline, and odometer visibility (Priority: P3)

Users reviewing a trip see origin, destination, scheduled start, actual start, actual completion, a workflow timeline when available, and odometer readings (starting, ending, distance if provided by the backend).

**Why this priority**: Operational transparency supports dispatch, reconciliation, and audit; it depends on trips existing and progressing through workflow.

**Independent Test**: Open trips in various statuses and verify route fields, timeline ordering, and odometer/distance values match backend payloads without client-side distance calculation unless explicitly required by product rules.

**Acceptance Scenarios**:

1. **Given** a trip with route fields, **When** detail loads, **Then** origin, destination, and schedule/actual timestamps display as returned by the backend.
2. **Given** odometer data exists, **When** the trip is Started or Completed, **Then** starting/ending odometer and distance (if provided) are shown without frontend calculation of distance.
3. **Given** workflow events or lifecycle timestamps exist, **When** the timeline section loads, **Then** events appear chronologically with status/action labels and timestamps from backend data.
4. **Given** timeline or odometer data is unavailable, **When** the section loads, **Then** an appropriate empty state is shown without breaking the page.

---

### Edge Cases

- Backend returns unknown trip status: show a safe fallback label; never invent transitions.
- Concurrent workflow update (another user starts/completes/cancels first): show conflict messaging and refresh to latest status.
- Vehicle already assigned to another active trip: display backend validation; do not assign optimistically.
- Transaction link rejected (outside location, status, or trip rules): show backend message; preserve trip state.
- Member assignment when employee is inactive or unavailable: show backend error; list remains accurate after refresh.
- Cancelled or Completed trips: edit and workflow actions follow backend terminal rules only.
- Deep link to `/trips/:id` or `/trips/:id/edit` without permission: authorization gate with recovery to list.
- Empty trip list, no members, no vehicle, no linked transactions: each section has guided empty states.
- Soft-archived or filtered-out trips: follow backend list rules; detail access per API authorization.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: Authorized users can view a Trips dashboard or list with search, filtering, sorting, and pagination driven by backend query capabilities.
- **FR-002**: Authorized users can open trip details and view trip identity, status, route information, organizational relationships, vehicle, members, linked transactions, and odometer data as returned by the API.
- **FR-003**: Authorized users can create new trips through a validated form with loading, disabled submit while processing, and success/error feedback.
- **FR-004**: Authorized users can edit eligible trips; edit availability MUST follow backend rules for the current status.
- **FR-005**: Authorized users can cancel eligible trips with confirmation and optional/required reason when the backend supports it.
- **FR-006**: The UI MUST support backend trip statuses including at least Draft, Scheduled, Started, Completed, and Cancelled, with clear visual indicators and safe fallbacks for unknown values.
- **FR-007**: Workflow transitions (schedule, start, complete, cancel, and any other transitions exposed by Backend P006) MUST be triggered only through backend workflow APIs; the UI MUST NOT hardcode allowed transitions.
- **FR-008**: After each workflow mutation, trip state MUST refresh from authoritative server responses.
- **FR-009**: Authorized users can assign employees to trips, remove members when permitted, and view assigned members including member status when supported.
- **FR-010**: Authorized users can assign a vehicle to a trip, change the vehicle when permitted, and view assigned vehicle details; vehicle conflict and availability rules MUST come from the backend.
- **FR-011**: Authorized users can view linked transactions on a trip, assign transactions, remove links when permitted, and search/filter transaction candidates using backend endpoints.
- **FR-012**: Transaction summaries on trips MUST use backend-provided values only; the client MUST NOT duplicate transaction pricing, settlement, or lifecycle logic from Specifications 005–006.
- **FR-013**: Outside-transaction rules and validation messages MUST be displayed from backend responses; the frontend MUST NOT implement parallel business validation for transaction–trip linking.
- **FR-014**: Route fields (origin, destination, scheduled start, actual start, actual completion) MUST display backend values; a workflow timeline SHOULD present lifecycle events when the API provides them.
- **FR-015**: Odometer fields (starting, ending, distance) MUST display backend values; distance MUST NOT be calculated on the client unless explicitly required by a documented backend contract gap (default: do not calculate).
- **FR-016**: Relationships among trips, vehicles, employees, transactions, branches, and warehouses MUST be consumed from backend APIs, not inferred client-side.
- **FR-017**: Protected routes MUST exist for Trips list, new trip, trip detail, and trip edit with deep linking, browser history, nested layouts, and lazy loading per established application patterns.
- **FR-018**: Application navigation MUST include Trips; visibility MUST respect backend authorization and permissions without hardcoded role-based menu rules.
- **FR-019**: Shared list, form, dialog, timeline, badge, skeleton, empty, and error patterns from prior specifications MUST be reused; feature-specific components are created only when necessary.
- **FR-020**: All trip forms MUST support inline validation, loading indicators, disabled submit while processing, and success/error feedback aligned with backend rules where possible.
- **FR-021**: Out of scope: Expense Management, Analytics, Reports, Activity Logs, and architectural refactoring of Specifications 001–006.
- **FR-022**: Trip screens MUST meet production quality: responsive layouts, accessible tables/forms/dialogs/timelines, light and dark mode, keyboard operable actions, and complete loading/empty/error states.

### API Dependencies _(mandatory — Constitution Principle XXII)_

Aligned with Backend P006 / Trip Management (tenant-scoped `/api/v1`):

- **List / search trips**: Paginated trip list with filters (status, dates, vehicle, branch, search); powers User Story 1.
- **Trip dashboard summary** (if provided): Aggregate or recent-trip metrics; powers User Story 1.
- **Get trip detail**: Full trip with relationships; powers User Stories 1–7.
- **Create trip**: New trip (typically Draft); powers User Story 2.
- **Update trip**: Edit supported fields; powers User Story 2.
- **Cancel trip**: Eligible → Cancelled; powers User Story 3.
- **Schedule trip**: Draft → Scheduled (or equivalent); powers User Story 3.
- **Start trip**: Scheduled → Started; may accept starting odometer; powers User Stories 3 and 7.
- **Complete trip**: Started → Completed; may accept ending odometer; powers User Stories 3 and 7.
- **Trip members — list / assign / remove**: Employee membership on a trip; powers User Story 4.
- **Vehicle assignment**: Assign or change vehicle; vehicle options and availability per backend; powers User Story 5.
- **Transaction linking — list / assign / remove / search**: Linked transactions and assignable candidates; powers User Story 6.
- **Supporting lookups**: Branches, warehouses, vehicles, employees, and transactions via existing organization, workforce, and transaction APIs as needed for pickers and labels.

### UI States _(mandatory — Constitution Principle XXII)_

- **Trips Dashboard / List**: Loading — skeleton table/cards; Empty — “No trips found” with filter guidance; Success — paginated list with status badges; Error — retry and safe message.
- **Trip Detail**: Loading — page skeleton; Empty — not found; Success — status, relationships, workflow actions, timeline, transaction summaries; Error — recovery to list.
- **Create / Edit Trip**: Loading — form skeleton; Empty — new form defaults; Success — saved trip with feedback; Error — inline field and form-level errors.
- **Workflow dialogs** (schedule, start, complete, cancel): Loading — confirm disabled; Success — close dialog, toast, refreshed trip; Error — actionable message, retry allowed.
- **Members / vehicle / transaction panels**: Loading — section skeleton; Empty — guided CTA when actions permitted; Success — lists from API; Error — section-level error without breaking page.

### Responsive Behavior _(mandatory — Constitution Principle XXVII)_

- **Trips List**: Mobile — card rows, stacked filters; Tablet — compact table or two-column filters; Desktop — full table, filter bar, pagination toolbar.
- **Trip Detail**: Mobile — stacked sections (status, actions, route, members, vehicle, transactions, timeline); Desktop — multi-column summary with side panels for assignments.
- **Create / Edit forms**: Mobile — single-column stacked fields; Desktop — grouped sections in grid where appropriate.
- **Workflow dialogs**: Mobile — sheet or full-screen confirmation; Desktop — centered modal with focus trap.
- **Transaction picker on trip**: Mobile — drawer/sheet list; Desktop — dialog with searchable table.

### Page Layout _(mandatory — Constitution Principle XXXII)_

- **Trips List**: Header — title, breadcrumbs, primary “New trip” when permitted; Content — search, filters, status badges, data table/cards, pagination.
- **Trip Detail**: Header — trip number/identity, status badge, breadcrumbs, primary workflow actions by eligibility; Content — route summary, schedule/actual times, vehicle card, members list, linked transactions, odometer block, timeline.
- **Create Trip**: Header — “New trip”, breadcrumbs; Content — form sections for route, schedule, organization context, initial assignments as supported.
- **Edit Trip**: Header — trip identity, draft/edit indicator; Content — same form patterns as create with fields disabled per backend rules.

### Empty State Design _(mandatory — Constitution Principle XXXIV)_

- **Trips List**: Icon — route/map; Message — “No trips yet” or “No trips match your filters”; Primary action — “New trip” when permitted; Guidance — adjust filters or create a trip.
- **Trip Members**: Icon — users; Message — “No members assigned”; Primary action — “Assign employees” when permitted.
- **Assigned Vehicle**: Icon — truck; Message — “No vehicle assigned”; Primary action — “Assign vehicle” when permitted.
- **Linked Transactions**: Icon — receipt; Message — “No transactions linked”; Primary action — “Assign transactions” when permitted.
- **Timeline**: Icon — history; Message — “No trip events yet”; Guidance — events appear after scheduling, starting, or completing the trip.

### Production Quality Checklist _(mandatory — Constitution Principle XL)_

Trip Management UX must be responsive, accessible (semantic HTML, keyboard navigation, focus management in dialogs, accessible tables and timelines), dark-mode compatible, with complete loading/error/empty states, mobile-friendly touch targets, and production-ready feedback—without architectural refactor ahead of Specification 008.

### Validation Rules _(mandatory — Constitution Principle XXII)_

- Trip create/edit: required fields per backend (e.g., origin, destination, scheduled start, branch/warehouse when required); inline Zod validation for UX; server remains source of truth.
- Start/complete: odometer and other required workflow fields validated before submit when the API requires them.
- Cancel: reason required when backend requires it.
- Member/vehicle/transaction assignment: block double-submit; show backend validation for conflicts.
- Frontend validation is UX-only; lifecycle and linking rules are enforced by the backend.

### Error Scenarios _(mandatory — Constitution Principle XXII)_

- Unauthorized trip action: safe forbidden messaging; hide or disable action.
- Workflow conflict (status changed elsewhere): explain and refresh detail.
- Vehicle conflict (one active trip per vehicle): show backend message; no false assignment UI state.
- Transaction linking rejected (outside rules): show backend validation; preserve trip.
- Member assignment failure: actionable error; refresh member list.
- List or detail fetch failure: page/section error with retry.
- Network failure mid-mutation: preserve dialog inputs where applicable; allow retry.

### Key Entities _(include if feature involves data)_

- **Trip**: A planned or executed company journey with status (Draft, Scheduled, Started, Completed, Cancelled), route fields (origin, destination), schedule and actual timestamps, odometer readings, and relationships to vehicle, members, branch, warehouse, and transactions.
- **Trip Member**: An employee assigned to a trip, optionally with membership status from the backend.
- **Trip Vehicle Assignment**: The vehicle linked to a trip, subject to backend availability and one-active-trip rules.
- **Linked Transaction**: A transaction associated with a trip for operational tracking; summaries and eligibility come from the transaction APIs without reimplementing settlement logic.
- **Trip Workflow Action**: A user-triggered transition (schedule, start, complete, cancel) authorized and enforced by Backend P006.
- **Trip Timeline Event**: A chronological lifecycle entry (status change, timestamps, actor, notes) provided or derived solely from backend data.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: An authorized user can create a trip, assign at least one member and a vehicle (when required), and advance it through Scheduled and Started to Completed (or cancel from an eligible state) in under 5 minutes of guided UI time without leaving the Trips module.
- **SC-002**: After successful workflow actions, 100% of trip detail views show status and lifecycle timestamps that match the backend response, with zero client-invented status transitions.
- **SC-003**: At least 95% of confirmed trip workflow or assignment actions either succeed with refreshed data or fail with an actionable message without leaving the trip in an ambiguous client-only state.
- **SC-004**: Users can find a trip via search or filter and open its detail page in under 30 seconds from the Trips list on desktop and under 45 seconds on mobile.
- **SC-005**: Linked transaction summaries on trip detail display backend-provided amounts and statuses without client-side recalculation of transaction totals or settlement figures.

## Assumptions

- Specifications 001–006 foundations (routing, auth, organization, workforce, transactions) remain unchanged in architecture; this spec adds a `trips` feature module only.
- Backend P006 exposes trip CRUD, workflow transitions, members, vehicle assignment, transaction linking, and relationship payloads consistent with the Scrappy API envelope and tenant isolation.
- Trip number format (e.g., `TRIP-YYYYMMDD-000001`) and exact field names are defined by the backend contract; the UI displays identifiers and labels from API responses.
- Workflow eligibility (which buttons appear) is determined by combining permission gates with successful or failed backend responses; the UI does not maintain a parallel state machine.
- Vehicle “one active trip per vehicle” and outside-transaction linking rules are enforced by the backend; the frontend surfaces validation messages only.
- Odometer distance is displayed only when the backend provides it; the frontend does not compute distance from start/end readings unless a future backend contract explicitly requires it.
- Expense, analytics, reports, and activity-log products remain out of scope until Specifications 008–011.
- Authorization continues via Spec 002 permission gates plus backend 403 enforcement; menu visibility uses permission keys derived from role mapping until the API returns explicit permissions.
