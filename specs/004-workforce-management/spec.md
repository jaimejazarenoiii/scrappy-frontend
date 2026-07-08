# Feature Specification: Workforce Management

**Feature Branch**: `004-workforce-management`

**Created**: 2026-07-08

**Status**: Draft

**Input**: User description: "Create Specification 004 – Workforce Management for Scrappy, corresponding to Backend P003 – Workforce Management (Attendance, Leave, Cash Advances, Payroll)."

## Purpose _(mandatory — Constitution Principle XXII)_

Scrappy must provide a complete workforce operations surface after company identity and
organization structure are in place. This specification delivers the frontend for
**Backend P003 — Workforce Management**, enabling authorized users to manage
**attendance**, **leave requests**, **cash advances**, and **payroll records** through a
responsive, production-ready interface.

Workforce records are operational data that sit on top of the employee and organization
foundations established earlier. Attendance captures day-to-day presence, leave records
planned or approved absences, cash advances track employee borrowing workflows, and payroll
surfaces compensation periods and payout summaries already computed by the backend. These
workflows support daily workforce administration without duplicating backend business rules.

This feature builds strictly on:

- **Specification 001** — routing, layouts, theme, Axios client, TanStack Query, Zustand,
  shared UI primitives, and list/table patterns.
- **Specification 002** — authentication, session bootstrap, tenant context, employee data,
  RBAC authorization guards, and permission-driven navigation.
- **Specification 003** — organization-aware patterns for server pagination, protected
  routes, archive/cancel confirmation flows, and shared list/detail/form UX.

It MUST NOT redesign or refactor those foundations. It corresponds directly to Backend P003
and MUST leave the codebase ready to begin **Specification 005 — Transaction Management
Foundation (Backend P004)** without architectural changes.

**In scope**: Attendance dashboard and attendance management views, leave request management,
cash advance management, payroll viewing, permission-gated navigation and routes,
relationship display as returned by the backend, backend-driven approval/status workflows,
and production-ready responsive UX across all workforce screens.

**Out of scope**: Transaction management, transaction settlement, trip management, expense
management, analytics, reports, activity logs, architectural refactors, frontend payroll
calculation logic, and any business logic not exposed by Backend P003 APIs.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Manage Attendance (Priority: P1)

As an owner, manager, or authorized workforce operator, I need to review attendance records,
see attendance status by employee, and perform supported manual attendance actions, so that I
can monitor workforce presence accurately.

**Why this priority**: Attendance is the most time-sensitive workforce workflow and delivers
immediate operational value. It also creates the baseline relationship between employees and
daily workforce activity.

**Independent Test**: With attendance endpoints available, open the attendance dashboard,
load the attendance list with pagination and sorting, search/filter by employee, date, or
status, view an attendance detail page, perform manual time-in/time-out or correction actions
when the backend supports them, and verify employee attendance history displays where
available.

**Acceptance Scenarios**:

1. **Given** the Attendance list page, **When** it loads, **Then** a paginated, sortable table
   (or responsive card list on mobile) of attendance records is displayed with skeleton
   loading beforehand.
2. **Given** the Attendance list page, **When** the user applies search or filters,
   **Then** the visible results update and the page distinguishes between "no attendance yet"
   and "no matches found".
3. **Given** an attendance detail page, **When** the user views it, **Then** employee,
   timestamps, status, related notes, and any backend-provided attendance history are shown.
4. **Given** the backend supports manual time-in or time-out, **When** an authorized user
   confirms the action, **Then** the attendance record updates, a success message appears,
   and the latest status is reflected in list and detail views.
5. **Given** the backend supports attendance correction, **When** an authorized user submits a
   valid correction request or edit, **Then** the updated attendance state is displayed and
   validation or permission errors are handled gracefully.

---

### User Story 2 - Manage Leave Requests (Priority: P1)

As an employee or manager, I need to create, review, approve, reject, cancel, and track leave
requests according to my permissions, so that planned absences are requested and processed in
an auditable way.

**Why this priority**: Leave is a core workforce workflow that impacts staffing, scheduling,
and payroll readiness. It provides standalone value even before cash advances or payroll views
are implemented.

**Independent Test**: With leave endpoints available, load the Leave list, search/filter/sort/
paginate, open a leave detail page, create a leave request, edit or cancel it when allowed,
and approve or reject it when permitted by role.

**Acceptance Scenarios**:

1. **Given** the Leave list page, **When** it loads, **Then** a paginated list of leave
   requests is displayed with skeleton loading and an empty state when there are no requests.
2. **Given** the Create Leave form, **When** the user submits valid request details,
   **Then** the leave request is created, a success notification appears, and the request is
   visible in the list.
3. **Given** a leave detail page, **When** the user views it, **Then** leave type, dates,
   status, requester, approver information, and approval notes/history are shown when
   provided by the backend.
4. **Given** a pending leave request that the current user is allowed to modify,
   **When** the user edits or cancels it, **Then** the change is persisted and the new status
   is reflected in the UI.
5. **Given** a pending leave request and a user with approval permission,
   **When** the user approves or rejects it, **Then** the request status updates, the decision
   is visible in detail/history, and unauthorized users do not see approval actions.

---

### User Story 3 - Manage Cash Advances (Priority: P2)

As an employee, manager, or authorized finance/workforce operator, I need to create, review,
approve, reject, edit, cancel, and track cash advance requests according to backend rules, so
that employee cash borrowing is managed consistently.

**Why this priority**: Cash advances are important workforce-finance workflows but usually
follow attendance and leave in day-to-day operational urgency.

**Independent Test**: With cash advance endpoints available, load the Cash Advances list,
search/filter/sort/paginate, create a request, edit or cancel it when allowed, open detail,
and complete any supported approval workflow.

**Acceptance Scenarios**:

1. **Given** the Cash Advances list page, **When** it loads, **Then** a paginated list of
   cash advance records is displayed with loading, empty, success, and error states.
2. **Given** the Create Cash Advance form, **When** the user submits valid data,
   **Then** the cash advance is created and immediately appears in the user-visible workflow.
3. **Given** a cash advance detail page, **When** the user opens it, **Then** amount,
   employee, status, reason, approval state, and any backend-provided approval history are
   displayed.
4. **Given** a cash advance in a backend-allowed editable state, **When** an authorized user
   edits or cancels it, **Then** the change is saved and reflected in list/detail pages.
5. **Given** a cash advance requiring approval, **When** a permitted approver approves or
   rejects it, **Then** the resulting status is visible and unauthorized users cannot perform
   the workflow action.

---

### User Story 4 - Review Payroll Information (Priority: P2)

As an owner, manager, payroll operator, or employee with payroll-view access, I need to
browse payroll periods, summaries, and payroll details returned by the backend, so that I can
review workforce compensation information without recalculating it in the frontend.

**Why this priority**: Payroll is essential for workforce visibility, but the frontend is a
consumer of computed payroll data rather than the source of payroll rules.

**Independent Test**: With payroll endpoints available, load the Payroll list, search/filter/
sort/paginate payroll periods or runs, open payroll details, and verify payroll summary data
matches backend responses without frontend recomputation.

**Acceptance Scenarios**:

1. **Given** the Payroll list page, **When** it loads, **Then** payroll periods or payroll
   records are displayed with pagination and filtering where supported.
2. **Given** a payroll detail page, **When** the user views it, **Then** the UI shows
   payroll period information, employee or run summaries, statuses, totals, and any
   backend-provided breakdowns.
3. **Given** payroll summary information from the backend, **When** it is shown in the UI,
   **Then** the frontend presents the values exactly as returned and does not perform its own
   payroll calculations unless explicitly required by the backend contract.
4. **Given** a user without payroll permission, **When** they attempt to access payroll
   routes, **Then** access is blocked and payroll navigation is hidden.

---

### User Story 5 - Navigate Workforce Modules Securely (Priority: P1)

As any authenticated user, I need workforce menu items and routes to appear only when I am
authorized, and I need deep links to workforce pages to work correctly, so that I can access
workforce data safely across devices.

**Why this priority**: Navigation and route protection are required for every workforce
screen and must work from day one alongside attendance and leave.

**Independent Test**: Sign in as users with different roles or permissions and confirm
Attendance, Leave, Cash Advances, and Payroll appear only when allowed; direct URLs work
when authorized and show access denied when not; browser back/forward navigation behaves
correctly.

**Acceptance Scenarios**:

1. **Given** an authenticated user with attendance view permission, **When** the sidebar
   renders, **Then** the Attendance menu entry is visible and navigates to `/attendance`.
2. **Given** an authenticated user lacking payroll view permission, **When** they navigate
   directly to `/payroll`, **Then** they are shown an access-denied experience and cannot
   view payroll data.
3. **Given** an authenticated user, **When** they use browser back/forward after visiting
   workforce pages, **Then** the correct page and state are restored without breaking the
   dashboard layout.

---

### Edge Cases

- **Unsupported manual actions**: If manual time-in, time-out, correction, edit, cancel, or
  approval actions are not provided by the backend for the current state, the UI hides or
  disables the action rather than inventing the workflow.
- **State transition conflicts**: If a leave request or cash advance is approved, rejected,
  cancelled, or edited by someone else before the user submits, the UI shows a friendly
  conflict message and refreshes the latest record.
- **Payroll is read-only by contract**: Payroll pages never permit frontend recalculation or
  mutation unless the backend contract explicitly supports it.
- **Approval history absent**: If the backend does not provide approval history or notes,
  the UI omits those sections or shows a clear empty placeholder rather than inferring data.
- **Empty vs. no results**: List pages distinguish between "no records yet" and
  "no records match your search or filters".
- **Duplicate submission**: Forms disable submit while a request is in flight.
- **Partial employee relationship data**: If the backend returns employee IDs without expanded
  employee details, the UI shows only the identifiers or fields actually returned.
- **Slow or failed list load**: Skeleton on load; retryable error state on failure; never a
  blank screen.
- **Deep links to stale records**: If an attendance, leave, cash advance, or payroll record
  no longer exists, detail views show a not-found state with recovery navigation.
- **Tenant isolation**: Workforce data is always scoped to the authenticated company; no
  cross-tenant leakage in cache or display.

## Requirements _(mandatory)_

### Functional Requirements

**Attendance (US1)**

- **FR-001**: System MUST display a paginated, sortable, searchable, and filterable list of
  attendance records for the current company.
- **FR-002**: System MUST provide an attendance dashboard that summarizes backend-provided
  workforce attendance information relevant to the current user or tenant.
- **FR-003**: Users MUST be able to view a single attendance record's details, including
  employee association, timestamps, attendance status, and related notes or metadata returned
  by the backend.
- **FR-004**: If supported by the backend, authorized users MUST be able to perform manual
  time-in actions through a validated confirmation or form flow.
- **FR-005**: If supported by the backend, authorized users MUST be able to perform manual
  time-out actions through a validated confirmation or form flow.
- **FR-006**: If supported by the backend, authorized users MUST be able to submit or apply
  attendance corrections through a validated form or workflow.
- **FR-007**: If provided by the backend, the UI MUST display attendance history per employee
  without computing or fabricating missing history records client-side.
- **FR-008**: Attendance statuses and timestamps MUST be displayed exactly according to the
  backend contract, including any late, absent, partial, or corrected states the backend
  exposes.

**Leave (US2)**

- **FR-009**: System MUST display a paginated, sortable, searchable, and filterable list of
  leave requests for the current company.
- **FR-010**: Users MUST be able to view a single leave request's details, including employee
  association, leave dates, leave type, status, and backend-provided approval information.
- **FR-011**: Authorized users MUST be able to create a leave request via a validated form.
- **FR-012**: If allowed by the backend for the request state and current user, authorized
  users MUST be able to edit an existing leave request.
- **FR-013**: If allowed by the backend for the request state and current user, authorized
  users MUST be able to cancel an existing leave request.
- **FR-014**: If supported by the backend and permitted by role, authorized users MUST be able
  to approve leave requests.
- **FR-015**: If supported by the backend and permitted by role, authorized users MUST be able
  to reject leave requests.
- **FR-016**: Leave statuses, approval workflow state, and approval notes/history MUST be
  displayed only as returned by the backend.

**Cash Advances (US3)**

- **FR-017**: System MUST display a paginated, sortable, searchable, and filterable list of
  cash advance records for the current company.
- **FR-018**: Users MUST be able to view a single cash advance record's details, including
  employee association, amount, reason, status, and backend-provided approval information.
- **FR-019**: Authorized users MUST be able to create a cash advance request via a validated
  form.
- **FR-020**: If allowed by the backend for the record state and current user, authorized
  users MUST be able to edit an existing cash advance request.
- **FR-021**: If allowed by the backend for the record state and current user, authorized
  users MUST be able to cancel an existing cash advance request.
- **FR-022**: If supported by the backend and permitted by role, authorized users MUST be able
  to approve or reject cash advance requests.
- **FR-023**: Current status and approval history MUST be displayed where available in backend
  responses.

**Payroll (US4)**

- **FR-024**: System MUST display a paginated, sortable, searchable, and filterable payroll
  list for the current company when supported by the backend contract.
- **FR-025**: Users MUST be able to view payroll details, including payroll period, summary
  values, employee or run associations, and backend-provided statuses or breakdowns.
- **FR-026**: System MUST present payroll periods and payroll summary information returned by
  the backend in a readable review-oriented interface.
- **FR-027**: Frontend payroll views MUST NOT calculate payroll totals, deductions, or net pay
  unless the backend contract explicitly requires a client-side input or preview step.

**Navigation & Routing (US5)**

- **FR-028**: System MUST provide protected routes for attendance (`/attendance`,
  `/attendance/:id`), leave (`/leave`, `/leave/new`, `/leave/:id`, `/leave/:id/edit`), cash
  advances (`/cash-advances`, `/cash-advances/new`, `/cash-advances/:id`,
  `/cash-advances/:id/edit`), and payroll (`/payroll`, `/payroll/:id`).
- **FR-029**: System MUST extend application navigation with Attendance, Leave, Cash Advances,
  and Payroll entries, visible only when the user has the corresponding view permission.
- **FR-030**: Workforce routes MUST support deep linking, browser navigation, and nested
  dashboard layouts without full-page reloads.

**Relationships (cross-cutting)**

- **FR-031**: System MUST display workforce relationships (employee → attendance, employee →
  leave, employee → cash advances, employee → payroll) only as provided by backend API
  responses; the frontend MUST NOT duplicate or infer workforce business rules independently.
- **FR-032**: Where selection of a related employee or period is required in a form, the
  frontend MUST populate available choices from backend endpoints rather than hardcoded data.

**Authorization (cross-cutting)**

- **FR-033**: Workforce create, edit, cancel, approve, reject, and manual attendance actions
  MUST be restricted to roles or permissions permitted by the backend.
- **FR-034**: Permission guards MUST hide unauthorized actions and block unauthorized routes
  using the authorization infrastructure from Specification 002.

**Cross-cutting UX & Architecture**

- **FR-035**: All API communication MUST occur through feature service classes under
  `src/features/`; components MUST NOT call the HTTP client directly.
- **FR-036**: All server state, list caching, pagination, and mutations MUST use TanStack
  Query; Zustand MUST hold only client/UI state and MUST NOT duplicate server state.
- **FR-037**: All forms MUST use React Hook Form with Zod validation, inline errors,
  disabled submit while pending, and first-invalid-field focus.
- **FR-038**: All list, detail, dashboard, and form screens MUST implement loading
  (skeleton), empty, success, and error states.
- **FR-039**: All new pages MUST reuse Specification 001 shared components (PageHeader,
  PageContainer, DataTable, FilterBar, Pagination, Dialog/Drawer patterns, EmptyState,
  ErrorState, ConfirmDialog, and form controls); feature-specific components MUST be created
  only when necessary.
- **FR-040**: All workforce routes MUST be lazy-loaded for code splitting.
- **FR-041**: Destructive or state-changing actions (manual attendance, cancel, approve,
  reject, correction, or similar supported workflows) MUST use confirmation dialogs or
  equivalent explicit confirmation UX and surface results via toast notifications.
- **FR-042**: All workforce pages MUST support responsive layouts (mobile through large
  desktop) and light/dark mode.
- **FR-043**: All workforce interactions MUST meet accessibility expectations: semantic HTML,
  keyboard navigation, accessible tables and forms, dialog focus trapping, and WCAG-friendly
  feedback.

### API Dependencies _(mandatory — Constitution Principle XXII)_

All endpoints are tenant-scoped via the access token; exact paths, payloads, and workflow
transitions MUST be reconciled with the Backend P003 OpenAPI contract during `/speckit-plan`.
Assumed conventions below express dependencies on Backend P003, not implementation freedom to
invent alternate contracts.

**Attendance**

- `GET /attendance` — paginated attendance list (search, filters, sort, pagination); US1, US5
- `GET /attendance/{attendanceId}` — attendance detail; US1
- `GET /attendance/dashboard` — attendance dashboard summary if provided separately; US1
- `POST /attendance/{attendanceId}/time-in` or equivalent supported action — manual time in;
  US1
- `POST /attendance/{attendanceId}/time-out` or equivalent supported action — manual time out;
  US1
- `POST /attendance/{attendanceId}/corrections` or equivalent supported action — attendance
  correction workflow; US1
- `GET /employees/{employeeId}/attendance` or equivalent relationship endpoint — employee
  attendance history when provided; US1

**Leave**

- `GET /leave` or `GET /leave-requests` — paginated leave request list; US2, US5
- `POST /leave` or `POST /leave-requests` — create leave request; US2
- `GET /leave/{leaveId}` or `GET /leave-requests/{leaveId}` — leave detail; US2
- `PATCH /leave/{leaveId}` or equivalent update endpoint — edit leave request when allowed;
  US2
- `POST /leave/{leaveId}/cancel` or equivalent workflow endpoint — cancel leave when allowed;
  US2
- `POST /leave/{leaveId}/approve` or equivalent workflow endpoint — approve leave; US2
- `POST /leave/{leaveId}/reject` or equivalent workflow endpoint — reject leave; US2

**Cash Advances**

- `GET /cash-advances` — paginated cash advance list; US3, US5
- `POST /cash-advances` — create cash advance; US3
- `GET /cash-advances/{cashAdvanceId}` — cash advance detail; US3
- `PATCH /cash-advances/{cashAdvanceId}` or equivalent update endpoint — edit cash advance
  when allowed; US3
- `POST /cash-advances/{cashAdvanceId}/cancel` or equivalent workflow endpoint — cancel cash
  advance when allowed; US3
- `POST /cash-advances/{cashAdvanceId}/approve` and `/reject` or equivalent supported
  workflow endpoints — approval actions; US3

**Payroll**

- `GET /payroll` or equivalent payroll listing endpoint — payroll periods or payroll runs;
  US4, US5
- `GET /payroll/{payrollId}` — payroll detail; US4
- `GET /payroll/periods` or equivalent helper endpoint when payroll periods are exposed
  separately; US4
- `GET /payroll/summary` or equivalent summary endpoint when payroll aggregates are exposed
  separately; US4

**Shared infrastructure (Specifications 002–003)**

- Authentication session, tenant context, employees, and shared organization references come
  from existing foundations; all workforce requests use the shared API client with bearer
  token and envelope handling.
- **OpenAPI reference**: Backend P003 (Workforce Management) and the project Scrappy API
  reference (`specs/_shared/backend/` when published); types and service methods generated or
  verified during `/speckit-plan`.

### UI States _(mandatory — Constitution Principle XXII)_

- **Attendance Dashboard**: Loading — KPI cards and summary skeletons; Empty — guidance when
  no attendance data exists; Success — summary cards, recent attendance, and quick actions as
  supported; Error — retryable error state with friendly message.
- **Attendance List**: Loading — page skeleton and table skeleton; Empty — "No attendance
  records yet" with guidance; Success — table/cards with pagination; Error — retryable error
  state.
- **Attendance Detail**: Loading — page skeleton; Empty — N/A (404 if not found); Success —
  detail view of status, timestamps, employee, and history; Error — not-found or retryable
  error state.
- **Leave List / Detail / Create/Edit**: Loading — list or form skeletons; Empty — no leave
  requests yet; Success — list/detail/form flow with status and history; Error — inline field
  errors and retryable page errors.
- **Cash Advances List / Detail / Create/Edit**: Same pattern as leave, with workflow state
  and amount details.
- **Payroll List / Detail**: Loading — payroll list/detail skeletons; Empty — no payroll data
  yet; Success — payroll periods, summaries, and details; Error — retryable error state.

### Responsive Behavior _(mandatory — Constitution Principle XXVII)_

- **Attendance dashboard**: Mobile — stacked summary cards and vertical sections; Tablet —
  two-column summary layout; Desktop/Large desktop — multi-column summary cards with summary
  panels and recent-record sections.
- **Workforce list pages (all modules)**: Mobile — stacked FilterBar, card list via
  responsive table/card presentation, full-width actions; Tablet — filter row with compact
  table; Desktop — full table with sortable columns and inline row actions; Large desktop —
  same layout with comfortable max-width containers and denser data visibility.
- **Workforce detail pages**: Mobile — single-column description and workflow sections;
  Tablet/Desktop — two-column layout where summary and history can sit side by side.
- **Workforce forms**: Mobile — single-column stacked fields; Tablet/Desktop — two-column
  grids for related fields; dialogs use full-screen sheet behavior on smaller devices when
  appropriate.

### Page Layout _(mandatory — Constitution Principle XXXII)_

- **Attendance Dashboard**: Header — title, description, breadcrumbs, quick actions when
  permitted; Content — KPI cards, filter/date controls if supported, recent attendance or
  summary sections.
- **List pages**: Header — title, description, primary action when permitted; Content —
  FilterBar (search + state filters), DataTable, Pagination footer.
- **Detail pages**: Header — entity name or identifier, status badge, workflow actions
  (permission-gated); Content — summary card, relationship details, workflow/history sections.
- **Create/Edit pages**: Header — "New …" or "Edit …" title; Content — Card-wrapped form
  with cancel and submit actions.

### Empty State Design _(mandatory — Constitution Principle XXXIV)_

- **Attendance Dashboard/List**: Icon — clock/check-in motif; Message — "No attendance data
  yet"; Primary action — context-sensitive workforce action only when supported; Guidance —
  "Attendance will appear here as records are captured."
- **Leave List**: Icon — calendar/leave motif; Message — "No leave requests yet"; Primary
  action — "New leave request" when permitted; Guidance — "Create and track employee leave
  requests here."
- **Cash Advances List**: Icon — wallet/cash motif; Message — "No cash advances yet";
  Primary action — "New cash advance" when permitted; Guidance — "Track employee cash
  advance requests and approvals."
- **Payroll List**: Icon — payslip/money motif; Message — "No payroll records yet";
  Primary action — none unless the backend supports a discoverable action; Guidance —
  "Payroll periods and summaries will appear here when available."
- **Filtered empty results (all lists)**: Message — "No results match your search";
  Guidance — "Try adjusting filters or search terms."

### Production Quality Checklist _(mandatory — Constitution Principle XL)_

Confirm each deliverable meets: responsive, accessible, type-safe, reusable, dark mode
compatible, loading/error/empty states, mobile-friendly, keyboard accessible,
production-ready.

### Validation Rules _(mandatory — Constitution Principle XXII)_

- **Attendance action forms**: Required fields depend on the backend-supported manual action or
  correction workflow; timestamp, note, or reason fields are validated according to contract.
- **Leave form**: Leave type, date range, and reason are required when mandated by the
  backend; optional notes follow backend limits.
- **Cash advance form**: Amount and justification are required when mandated by the backend;
  optional attachments or notes are validated only when the backend contract includes them.
- **Payroll filters/view controls**: Filter and period selectors validate only user input used
  for querying; payroll values themselves are backend-authored and not recalculated client-side.
- Server-side validation MUST be assumed authoritative; frontend validation is UX-only.

### Error Scenarios _(mandatory — Constitution Principle XXII)_

- **Validation error (400)**: Show field-level messages from API `details` when available;
  recovery — correct fields and resubmit.
- **Unauthorized (401)**: Session cleared per Specification 002; redirect to login.
- **Forbidden (403)**: Access-denied page or hidden action; message — "You don't have
  permission to perform this action."
- **Not found (404)**: Detail page shows a not-found state; recovery — return to list.
- **Workflow conflict (409)**: Friendly message when the record has already transitioned to a
  different state; recovery — refresh the latest status.
- **Unsupported action**: If the backend no longer supports a visible action for the current
  state, the UI refreshes and removes the stale action affordance.
- **Network/unknown error**: Generic retry message; recovery — retry button on list/error
  states.
- MUST NOT expose raw backend exception messages.

### Key Entities _(include if feature involves data)_

- **Attendance Record**: A workforce presence record for an employee containing backend-defined
  attendance status, timestamps, notes, and optional correction metadata.
- **Leave Request**: An employee leave submission with date range, leave type, status, and
  approval workflow information.
- **Cash Advance**: An employee cash advance request with amount, reason, status, and approval
  workflow information.
- **Payroll Record / Payroll Period**: A backend-authored payroll summary or payroll run entry
  for an employee, pay period, or payroll batch, including totals and statuses returned by the
  backend.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: An authorized user can load any workforce list page and see usable results,
  skeletons, or a clear empty/error state within 3 seconds perceived wait time under normal
  conditions.
- **SC-002**: An authorized user can create a leave request or cash advance request and see
  it reflected in the corresponding workflow within 30 seconds of submission on a standard
  connection.
- **SC-003**: Users with view-only permissions can browse all workforce modules they are
  allowed to access without seeing unauthorized create, edit, cancel, approve, reject, or
  manual attendance controls.
- **SC-004**: 100% of workforce pages display loading, empty, success, and error states — no
  blank screens during normal or failed loads.
- **SC-005**: All workforce routes are reachable by direct URL when authorized and blocked
  with a clear access-denied experience when not.
- **SC-006**: Payroll screens present backend-provided payroll data without introducing
  frontend-only payroll calculations or requiring architectural refactoring before
  Specification 005 begins.

## Assumptions

- Backend P003 exposes paginated list endpoints for attendance, leave, cash advances, and
  payroll using query conventions compatible with the Scrappy API envelope
  (`success`, `data`, `meta`, `error`) and shared list behavior from earlier specifications.
- Manual time-in, manual time-out, attendance corrections, leave edit/cancel, leave approval,
  cash advance edit/cancel, and cash advance approval are implemented only if the backend
  contract provides those actions for the current record state.
- Employee relationships displayed on workforce records come from backend responses or related
  endpoints already made available through the employee foundation from Specification 002.
- Payroll is primarily a read-oriented workflow in this specification; calculations,
  generation rules, and payroll business logic remain backend responsibilities unless the
  contract explicitly defines a client-side input requirement later.
- Permission keys for workforce modules follow the same opaque string pattern as earlier
  modules (for example `attendance.view`, `leave.create`, `cashAdvance.approve`,
  `payroll.view`) and continue using the authorization infrastructure from Specification 002.
- Specification 001, 002, and 003 foundations are complete and stable; this feature extends
  them only with new feature folders, routes, navigation items, permission constants, and
  workforce-specific screens.
