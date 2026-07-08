# Feature Specification: Organization Management

**Feature Branch**: `003-organization-management`

**Created**: 2026-07-08

**Status**: Draft

**Input**: User description: "Create Specification 003 – Organization Management for Scrappy, corresponding to Backend P002 – Organization Management (Branches, Warehouses, Vehicles)."

## Purpose _(mandatory — Constitution Principle XXII)_

Scrappy must model the physical and logistical structure of a junkshop business before
workforce scheduling, transactions, trips, and financial workflows can operate correctly.
This specification delivers the frontend for **Backend P002 — Organization Management**,
enabling authorized users to administer **branches**, **warehouses**, and **vehicles**
within their company through a responsive, production-ready interface.

Organization records are foundational master data: branches represent operating locations,
warehouses represent storage sites (often associated with branches), and vehicles represent
mobile assets used in collection and delivery operations. Accurate organization data ensures
later modules (workforce attendance, transactions, trips) can reference the correct
locations and assets.

This feature builds strictly on:

- **Specification 001** — routing, layouts, theme, Axios client, TanStack Query, Zustand,
  shared UI primitives, and list/table patterns.
- **Specification 002** — authentication, session bootstrap, tenant context, RBAC
  authorization guards, and permission-driven navigation.

It MUST NOT redesign or refactor those foundations. It corresponds directly to Backend P002
and MUST leave the codebase ready to begin **Specification 004 — Workforce Management
(Backend P003)** without architectural changes.

**In scope**: Branch management (list, view, create, edit, archive, search, filter, sort,
pagination), warehouse management (same capabilities), vehicle management (same
capabilities), permission-gated navigation and routes, relationship display as returned by
the backend.

**Out of scope**: Workforce, transactions, trips, expenses, analytics, reports, activity logs,
user/employee administration (Specification 002), company profile (Specification 002), and
any organization data not exposed by Backend P002 APIs.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Manage Branches (Priority: P1)

As an owner or manager, I need to list, search, filter, sort, paginate, view, create,
edit, and archive branches within my company, so that operating locations are accurately
recorded for the rest of the system.

**Why this priority**: Branches are the top-level organizational unit. Warehouses and
vehicles often relate to branches; establishing branch management first delivers a
standalone, valuable MVP slice.

**Independent Test**: With branch endpoints available, load the Branches list with
pagination and sorting, search and filter by status, open a branch detail page, create a
new branch via a validated form, edit an existing branch, and archive a branch — each with
loading, empty, success, and error states on desktop, tablet, and mobile.

**Acceptance Scenarios**:

1. **Given** the Branches page, **When** it loads, **Then** a paginated, sortable table (or
   responsive card list on mobile) of branches is displayed with skeleton loading beforehand.
2. **Given** the Branches page, **When** the user types in search or applies a status
   filter, **Then** the list updates to matching results, showing an empty state when none
   match.
3. **Given** the Create Branch form, **When** the user submits valid data, **Then** the
   branch is created, a success notification appears, and the list reflects the new branch.
4. **Given** the Create/Edit Branch form, **When** required fields are missing or invalid,
   **Then** inline validation messages appear, the first invalid field is focused, and
   submission is blocked.
5. **Given** a branch detail page, **When** the user views it, **Then** basic information,
   address, contact information, status, and company association (as provided by the backend)
   are displayed.
6. **Given** a branch row, **When** an authorized user archives the branch, **Then** a
   confirmation dialog is shown, the branch is archived on confirm, and it is excluded from
   the default active list.
7. **Given** a user without branch-management permission, **When** they attempt to access
   create, edit, or archive actions, **Then** those actions are not available and guarded
   routes redirect or show access denied.

---

### User Story 2 - Manage Warehouses (Priority: P2)

As an owner or manager, I need to list, search, filter, sort, paginate, view, create,
edit, and archive warehouses within my company, so that storage locations are accurately
recorded and associated with the organizational structure.

**Why this priority**: Warehouses depend on organizational context (often branch
relationships) but are independently manageable once branches exist. This story delivers
complete warehouse administration without requiring vehicle management.

**Independent Test**: With warehouse endpoints available, load the Warehouses list,
search/filter/sort/paginate, view warehouse details including any branch association
returned by the backend, create and edit warehouses via validated forms, and archive a
warehouse — with full UI states across breakpoints.

**Acceptance Scenarios**:

1. **Given** the Warehouses page, **When** it loads, **Then** a paginated list of
   warehouses is displayed with skeleton loading and an empty state when there are none.
2. **Given** the Create/Edit Warehouse form, **When** valid data is submitted, **Then** the
   warehouse is saved, a success notification is shown, and the list reflects the change.
3. **Given** a warehouse detail page, **When** the user views it, **Then** warehouse
   information, status, and any backend-provided branch association are displayed without
   frontend-invented relationship logic.
4. **Given** a warehouse row, **When** an authorized user archives the warehouse, **Then** a
   confirmation dialog is shown and, on confirm, the warehouse is archived and removed from
   the default active list.

---

### User Story 3 - Manage Vehicles (Priority: P3)

As an owner or manager, I need to list, search, filter, sort, paginate, view, create,
edit, and archive vehicles within my company, so that fleet assets are accurately tracked
for operational use in later modules.

**Why this priority**: Vehicle management completes the organization module but does not
block branch or warehouse administration; it is the final slice of Backend P002.

**Independent Test**: With vehicle endpoints available, load the Vehicles list,
search/filter/sort/paginate, view vehicle details (plate number, description, status, and
any backend-provided associations), create and edit vehicles via validated forms, and
archive a vehicle — with full UI states across breakpoints.

**Acceptance Scenarios**:

1. **Given** the Vehicles page, **When** it loads, **Then** a paginated list of vehicles is
   displayed with skeleton loading and an empty state when there are none.
2. **Given** the Create/Edit Vehicle form, **When** valid data is submitted, **Then** the
   vehicle is saved, a success notification is shown, and the list reflects the change.
3. **Given** a vehicle detail page, **When** the user views it, **Then** vehicle
   information, plate number, status, and any backend-provided associations (branch,
   warehouse, vehicle type, or other supported fields) are displayed.
4. **Given** a vehicle row, **When** an authorized user archives the vehicle, **Then** a
   confirmation dialog is shown and, on confirm, the vehicle is archived and removed from
   the default active list.

---

### User Story 4 - Navigate Organization Modules Securely (Priority: P1)

As any authenticated user, I need organization menu items and routes to appear only when
I am authorized, and deep links to organization pages to work correctly, so that I can
access organization data safely across devices.

**Why this priority**: Navigation and route protection are required for every organization
screen and must work from day one alongside branch management.

**Independent Test**: Sign in as users with different roles/permissions and confirm
Branches, Warehouses, and Vehicles appear in navigation only when permitted; direct URLs
work when authorized and show access denied when not; browser back/forward navigation
behaves correctly.

**Acceptance Scenarios**:

1. **Given** an authenticated user with branch view permission, **When** the sidebar renders,
   **Then** the Branches menu entry is visible and navigates to `/branches`.
2. **Given** an authenticated user lacking warehouse view permission, **When** they navigate
   directly to `/warehouses`, **Then** they are shown an access-denied state and cannot
   view warehouse data.
3. **Given** an authenticated user, **When** they use browser back/forward after visiting
   organization pages, **Then** the correct page and state are restored without breaking
   the layout.

---

### Edge Cases

- **Archived records**: Archived branches, warehouses, and vehicles are hidden from
  default lists but remain retrievable by direct ID when the backend supports it; archiving
  twice shows a friendly conflict message.
- **Empty vs. no results**: List views distinguish "no records yet" from "no matches for
  search/filter".
- **Duplicate submission**: Forms disable submit while a mutation is in flight.
- **Optimistic update rollback**: Archive and edit mutations roll back UI state on failure.
- **Relationship fields absent**: If the backend does not return a branch/warehouse
  association on a warehouse or vehicle, the UI omits or shows "—" rather than inferring
  relationships client-side.
- **Status changes**: Status is managed through create/edit forms per backend rules; there
  is no separate activate/deactivate endpoint unless the backend provides one.
- **Employee read-only access**: Users with view-only access can browse lists and details
  but cannot create, edit, or archive.
- **Slow/failed list load**: Skeleton on load; retryable error state on failure; never a
  blank screen.
- **Tenant isolation**: Organization data is always scoped to the authenticated company;
  no cross-tenant leakage in cache or display.

## Requirements _(mandatory)_

### Functional Requirements

**Branches (US1)**

- **FR-001**: System MUST display a paginated, sortable, searchable, and filterable list
  of branches for the current company.
- **FR-002**: Users MUST be able to view a single branch's details, including basic
  information, address, contact information, status, and company association as returned by
  the backend.
- **FR-003**: Authorized users MUST be able to create a branch via a validated form.
- **FR-004**: Authorized users MUST be able to edit an existing branch via a validated form.
- **FR-005**: Authorized users MUST be able to archive a branch via a confirmation dialog;
  archived branches MUST be excluded from the default active list.
- **FR-006**: Branch status (e.g., active/inactive) MUST be manageable through create/edit
  when supported by the backend.

**Warehouses (US2)**

- **FR-007**: System MUST display a paginated, sortable, searchable, and filterable list
  of warehouses for the current company.
- **FR-008**: Users MUST be able to view a single warehouse's details, including warehouse
  information, status, and any backend-provided branch association.
- **FR-009**: Authorized users MUST be able to create a warehouse via a validated form.
- **FR-010**: Authorized users MUST be able to edit an existing warehouse via a validated
  form.
- **FR-011**: Authorized users MUST be able to archive a warehouse via a confirmation
  dialog; archived warehouses MUST be excluded from the default active list.

**Vehicles (US3)**

- **FR-012**: System MUST display a paginated, sortable, searchable, and filterable list of
  vehicles for the current company.
- **FR-013**: Users MUST be able to view a single vehicle's details, including plate
  number, description, status, and any backend-provided associations or type fields.
- **FR-014**: Authorized users MUST be able to create a vehicle via a validated form.
- **FR-015**: Authorized users MUST be able to edit an existing vehicle via a validated
  form.
- **FR-016**: Authorized users MUST be able to archive a vehicle via a confirmation dialog;
  archived vehicles MUST be excluded from the default active list.

**Navigation & Routing (US4)**

- **FR-017**: System MUST provide protected routes for branches (`/branches`, `/branches/new`,
  `/branches/:id`, `/branches/:id/edit`), warehouses (`/warehouses`, `/warehouses/new`,
  `/warehouses/:id`, `/warehouses/:id/edit`), and vehicles (`/vehicles`, `/vehicles/new`,
  `/vehicles/:id`, `/vehicles/:id/edit`).
- **FR-018**: System MUST extend application navigation with Branches, Warehouses, and
  Vehicles entries, visible only when the user has the corresponding view permission.
- **FR-019**: Organization routes MUST support deep linking, browser navigation, and nested
  dashboard layouts without full-page reloads.

**Entity Relationships (cross-cutting)**

- **FR-020**: System MUST display organizational relationships (e.g., branch → warehouses,
  branch → vehicles) only as provided by backend API responses; the frontend MUST NOT
  duplicate or infer relationship logic independently of the API.
- **FR-021**: When selecting a related entity in a form (e.g., branch for a warehouse), the
  frontend MUST populate choices from backend list endpoints, not hardcoded data.

**Authorization (cross-cutting)**

- **FR-022**: Organization create, edit, and archive actions MUST be restricted to roles
  permitted by the backend (typically owner and manager); view actions MUST be available to
  all authenticated roles when the backend allows.
- **FR-023**: Permission guards MUST hide unauthorized actions and block unauthorized
  routes using the authorization infrastructure from Specification 002.

**Cross-cutting UX & Architecture**

- **FR-024**: All API communication MUST occur through feature service classes under
  `src/features/`; components MUST NOT call the HTTP client directly.
- **FR-025**: All server state, list caching, pagination, and mutations MUST use TanStack
  Query; Zustand MUST hold only client/UI state and MUST NOT duplicate server state.
- **FR-026**: All forms MUST use React Hook Form with Zod validation, inline errors,
  disabled submit while pending, and first-invalid-field focus.
- **FR-027**: All list, detail, and form screens MUST implement loading (skeleton), empty,
  success, and error states.
- **FR-028**: All new pages MUST reuse Specification 001 shared components (PageHeader,
  PageContainer, DataTable, FilterBar, Pagination, ConfirmDialog, EmptyState, ErrorState,
  etc.); feature-specific components MUST be created only when necessary.
- **FR-029**: All organization routes MUST be lazy-loaded for code splitting.
- **FR-030**: Destructive or state-changing actions (archive) MUST use confirmation dialogs
  and surface results via toast notifications.
- **FR-031**: All organization pages MUST support responsive layouts (mobile through large
  desktop) and light/dark mode.
- **FR-032**: All organization interactions MUST meet accessibility expectations: semantic
  HTML, keyboard navigation, accessible tables and forms, dialog focus trapping, and
  WCAG-friendly feedback.

### API Dependencies _(mandatory — Constitution Principle XXII)_

All endpoints are tenant-scoped via the access token; exact paths and payloads MUST be
reconciled with the Backend P002 OpenAPI contract during `/speckit-plan`. Assumed
conventions below map to the Scrappy API reference.

**Branches**

- `GET /branches` — paginated list (search, status filter, sort, pagination); all roles;
  US1, US4
- `POST /branches` — create branch; owner/manager; US1
- `GET /branches/{branchId}` — branch detail; all roles; US1
- `PATCH /branches/{branchId}` — update branch; owner/manager; US1
- `POST /branches/{branchId}/archive` — soft-delete branch; owner/manager; US1

**Warehouses**

- `GET /warehouses` — paginated list; all roles; US2, US4
- `POST /warehouses` — create warehouse; owner/manager; US2
- `GET /warehouses/{warehouseId}` — warehouse detail; all roles; US2
- `PATCH /warehouses/{warehouseId}` — update warehouse; owner/manager; US2
- `POST /warehouses/{warehouseId}/archive` — soft-delete warehouse; owner/manager; US2

**Vehicles**

- `GET /vehicles` — paginated list; all roles; US3, US4
- `POST /vehicles` — create vehicle; owner/manager; US3
- `GET /vehicles/{vehicleId}` — vehicle detail; all roles; US3
- `PATCH /vehicles/{vehicleId}` — update vehicle; owner/manager; US3
- `POST /vehicles/{vehicleId}/archive` — soft-delete vehicle; owner/manager; US3

**Shared infrastructure (Specification 002)**

- Authentication session and tenant context from existing auth bootstrap; all organization
  requests use the shared API client with bearer token.

- **OpenAPI reference**: Backend P002 (Organization Management) and the project Scrappy API
  reference (`specs/_shared/backend/` when published); types and service methods generated
  or verified during `/speckit-plan`.

### UI States _(mandatory — Constitution Principle XXII)_

- **Branches List**: Loading — page skeleton and table skeleton; Empty — illustration with
  "No branches yet" and create CTA when permitted; Success — table/cards with pagination;
  Error — retryable error state with friendly message.
- **Branch Detail**: Loading — page skeleton; Empty — N/A (404 if not found); Success —
  description list of branch fields; Error — not-found or retryable error state.
- **Branch Create/Edit**: Loading — form skeleton on edit while fetching; Empty — N/A;
  Success — redirect to detail or list with toast; Error — inline field errors and form-level
  API error banner.
- **Warehouses List / Detail / Create/Edit**: Same patterns as branches.
- **Vehicles List / Detail / Create/Edit**: Same patterns as branches.

### Responsive Behavior _(mandatory — Constitution Principle XXVII)_

- **Organization list pages (all modules)**: Mobile — stacked FilterBar, card list via
  DataTable `renderMobileCard`, full-width actions; Tablet — filter row with table; Desktop
  — full table with sortable columns and inline row actions; Large desktop — unchanged with
  comfortable max-width container.
- **Organization detail pages**: Mobile — single-column description list; Tablet/Desktop —
  two-column description grid where appropriate.
- **Organization forms**: Mobile — single-column stacked fields; Tablet/Desktop — two-column
  grid for related fields; modals use full-screen sheet on mobile when applicable.

### Page Layout _(mandatory — Constitution Principle XXXII)_

- **List pages**: Header — title, description, primary "New …" action (permission-gated);
  Content — FilterBar (search, status filter), DataTable, Pagination footer.
- **Detail pages**: Header — entity name, status badge, edit and archive actions
  (permission-gated); Content — Card with DescriptionList of fields and relationships.
- **Create/Edit pages**: Header — "New …" or "Edit …" title; Content — Card-wrapped form
  with cancel and submit actions.

### Empty State Design _(mandatory — Constitution Principle XXXIV)_

- **Branches List**: Icon — building/location motif; Message — "No branches yet"; Primary
  action — "New branch" (when permitted); Guidance — "Add your first operating location."
- **Warehouses List**: Icon — warehouse/storage motif; Message — "No warehouses yet";
  Primary action — "New warehouse"; Guidance — "Register storage locations for your
  company."
- **Vehicles List**: Icon — vehicle/truck motif; Message — "No vehicles yet"; Primary
  action — "New vehicle"; Guidance — "Add fleet assets used in daily operations."
- **Filtered empty results (all lists)**: Message — "No results match your search";
  Guidance — "Try adjusting filters or search terms."

### Production Quality Checklist _(mandatory — Constitution Principle XL)_

Confirm each deliverable meets: responsive, accessible, type-safe, reusable, dark mode
compatible, loading/error/empty states, mobile-friendly, keyboard accessible,
production-ready.

### Validation Rules _(mandatory — Constitution Principle XXII)_

- **Branch form**: Name required; address and contact number optional unless backend
  requires them; status optional on create with backend default.
- **Warehouse form**: Same core rules as branch; branch association required only when
  backend mandates it.
- **Vehicle form**: Plate number required; description optional; status optional on create
  with backend default; vehicle type and association fields validated per backend contract.
- Server-side validation MUST be assumed authoritative; frontend validation is UX-only.

### Error Scenarios _(mandatory — Constitution Principle XXII)_

- **Validation error (400)**: Show field-level messages from API `details` when available;
  recovery — correct fields and resubmit.
- **Unauthorized (401)**: Session cleared per Specification 002; redirect to login.
- **Forbidden (403)**: Access-denied page or hidden action; message — "You don't have
  permission to perform this action."
- **Not found (404)**: Entity detail shows not-found state; recovery — return to list.
- **Lifecycle conflict (409)**: Archiving an already-archived record — friendly message;
  recovery — refresh list.
- **Network/unknown error**: Generic retry message; recovery — retry button on list/error
  states.
- MUST NOT expose raw backend exception messages.

### Key Entities _(include if feature involves data)_

- **Branch**: A company operating location with name, address, contact number, status, and
  company association; may have related warehouses and vehicles per backend responses.
- **Warehouse**: A storage location belonging to the company; mirrors branch-style fields;
  may reference an assigned branch when the backend provides that relationship.
- **Vehicle**: A fleet asset with plate number, description, operational status, and optional
  associations to branch or warehouse and vehicle type when supported by the backend.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: An authorized owner or manager can create a new branch, warehouse, or vehicle
  and see it in the corresponding list within 30 seconds of submission on a standard
  connection.
- **SC-002**: 100% of organization list pages display loading, empty, success, and error
  states — no blank screens during normal or failed loads.
- **SC-003**: Users with view-only permissions can browse all three organization modules
  without seeing create, edit, or archive controls.
- **SC-004**: 95% of organization search/filter operations return updated results within 2
  seconds perceived wait time under normal load.
- **SC-005**: All organization routes are reachable via direct URL when authorized and
  blocked with a clear access-denied experience when not.
- **SC-006**: The module ships without requiring architectural changes to authentication,
  authorization, routing, or shared component layers before Specification 004 can begin.

## Assumptions

- Backend P002 exposes paginated list endpoints for branches, warehouses, and vehicles with
  `page`, `limit`, `sortBy`, `sortOrder`, `search`, and `status` query parameters consistent
  with the Scrappy API envelope (`success`, `data`, `meta`, `error`).
- Archive is implemented as soft-delete via `POST …/archive`; archived records have a
  non-null `deletedAt` and are excluded from default lists unless `includeArchived` or
  equivalent is supported later.
- Branch and warehouse share a similar field shape (name, address, contact number, status);
  vehicles use plate number, description, and operational status values
  (`AVAILABLE`, `IN_USE`, `MAINTENANCE`, `INACTIVE`).
- Warehouse-to-branch and vehicle-to-branch/warehouse relationships are displayed only when
  returned by the backend; optional association fields on forms follow the OpenAPI contract
  discovered during planning.
- Permission keys for organization modules follow the same opaque string pattern as
  Specification 002 (e.g., `branch.view`, `branch.create`, `warehouse.view`) and are
  derived from role until the backend returns explicit permission lists.
- OWNER and MANAGER roles can create, edit, and archive; EMPLOYEE can view lists and details
  when permitted by the backend.
- Specification 001 and 002 foundations are complete and stable; this feature extends them
  only with new feature folders, routes, navigation items, and permission constants.
