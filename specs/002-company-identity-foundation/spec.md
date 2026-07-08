# Feature Specification: Company & Identity Foundation

**Feature Branch**: `002-company-identity-foundation`

**Created**: 2026-07-08

**Status**: Draft

**Input**: User description: "Create Specification 002 – Company & Identity Foundation for Scrappy, corresponding to Backend P001 (Company, Authentication, Authorization/RBAC, Users, Employees, Tenant Isolation)."

## Purpose _(mandatory — Constitution Principle XXII)_

Scrappy needs its first business capability: the identity and company foundation that
every later module depends on. This specification delivers the frontend for **Backend
P001 — Company & Identity Foundation**, enabling administrators to sign in securely,
operate within their company (tenant) context, manage who can access the system and what
they can do, and administer the people records (users and employees) the rest of the
product will build upon.

This feature is the frontend gateway to the entire application. Without authenticated
sessions, role-based authorization, tenant isolation, and user/employee administration,
no subsequent roadmap module (Organization Management onward) can function.

It builds strictly on the foundation established in Specification 001 (routing, layouts,
theme, Axios client, TanStack Query, Zustand, shared UI primitives) and MUST NOT redesign
or refactor that foundation. It corresponds directly to Backend P001 and MUST leave the
codebase ready to begin **Specification 003 — Organization Management (Backend P002)**
without architectural changes.

**In scope**: Company profile view/update, authentication (login/logout/session/refresh),
RBAC authorization, user management CRUD, employee management CRUD, tenant-aware API and
routing.

**Out of scope**: Organizations/branches, workforce scheduling, transactions, trips,
expenses, analytics, reports, activity logs (later specifications). Tenant **switching
UI** is out of scope unless the backend exposes it; the architecture is only made
future-ready.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Authenticate and Maintain a Secure Session (Priority: P1)

As an administrator, I need to log in with my credentials, stay signed in across page
reloads, have my access token refreshed automatically, and be safely redirected or logged
out when my session ends, so that I can access the application securely.

**Why this priority**: Nothing else in the application is reachable without
authentication. This is the true MVP slice — implementing only this delivers a usable,
secure entry point that lands the user on the dashboard.

**Independent Test**: With backend auth endpoints available, sign in with valid
credentials, confirm redirect to the originally requested (or default) protected page,
reload the browser and remain authenticated, let the access token expire and confirm it
refreshes transparently, then log out and confirm redirect to login and inability to
reach protected routes via back button.

**Acceptance Scenarios**:

1. **Given** a signed-out user on `/login`, **When** they submit valid credentials,
   **Then** a session is established and they are redirected to `/dashboard` (or the route
   they originally attempted to visit).
2. **Given** a signed-out user, **When** they submit invalid credentials, **Then** an
   inline, friendly error is shown without exposing backend exception details, and no
   session is created.
3. **Given** an authenticated user, **When** they reload the browser, **Then** their
   session is restored without requiring re-login (subject to "remember session").
4. **Given** an authenticated user whose access token has expired, **When** they perform
   an action requiring the API, **Then** the token is refreshed automatically and the
   original request succeeds without user-visible interruption.
5. **Given** an authenticated user whose refresh attempt fails (expired/invalid refresh
   token or 401), **When** the refresh fails, **Then** the session is cleared, a session
   expiration notice is shown, and the user is redirected to `/login` preserving the
   attempted location.
6. **Given** an authenticated user, **When** they choose Logout, **Then** the session and
   cached server state are cleared and they are redirected to `/login`.
7. **Given** a signed-out user, **When** they attempt to open a protected route directly,
   **Then** they are redirected to `/login` and returned to that route after successful
   login.

---

### User Story 2 - Role-Based Authorization Controls Access (Priority: P2)

As a system owner, I need access to features, routes, menu items, and UI actions to be
governed by the permissions and roles the backend assigns, so that users only see and do
what they are authorized to.

**Why this priority**: Authorization protects every administrative capability. It is
required before exposing user/employee management broadly, but the app is still usable
(as the signed-in owner) without it, so it ranks just below authentication.

**Independent Test**: Sign in as users with different permission sets returned by the
backend and confirm that guarded routes redirect or show "not authorized", unauthorized
menu items are hidden, and action buttons (create/edit/deactivate) render only when the
corresponding permission is present — all driven by backend-provided permissions with no
hardcoded rules.

**Acceptance Scenarios**:

1. **Given** an authenticated user lacking a required permission, **When** they navigate
   to a permission-gated route, **Then** they are shown an "access denied" state (or
   redirected to a safe page) and cannot view the protected content.
2. **Given** an authenticated user, **When** the sidebar/menu renders, **Then** only the
   menu entries permitted by their backend permissions are visible.
3. **Given** an authenticated user without the "create user" permission, **When** they
   view the Users list, **Then** the "Create User" action is not rendered.
4. **Given** backend permission rules change for a user, **When** their permissions are
   refetched, **Then** the UI reflects the new permissions without a code change.

---

### User Story 3 - Manage Users (Priority: P2)

As an administrator, I need to list, search, filter, sort, paginate, view, create, edit,
activate, and deactivate users, so that I can control who has access to the system.

**Why this priority**: User administration is the core identity capability of P001 and
the primary reason the module exists after authentication and authorization.

**Independent Test**: With users endpoints available, load the Users list with pagination
and sorting, search and filter the results, open a user detail, create a new user via a
validated form, edit an existing user, and toggle a user's active state — each with
loading, empty, success, and error states on desktop, tablet, and mobile.

**Acceptance Scenarios**:

1. **Given** the Users page, **When** it loads, **Then** a paginated, sortable table (or
   responsive card list on mobile) of users is displayed with skeleton loading beforehand.
2. **Given** the Users page, **When** the administrator types in search or applies a
   filter, **Then** the list updates to matching results, showing an empty state when none
   match.
3. **Given** the Create User form, **When** the administrator submits valid data, **Then**
   the user is created, a success toast appears, and the list reflects the new user.
4. **Given** the Create/Edit User form, **When** required fields are missing or invalid,
   **Then** inline validation messages appear, the first invalid field is focused, and
   submission is blocked.
5. **Given** a user row, **When** the administrator activates or deactivates the user,
   **Then** a confirmation dialog is shown, the change is persisted on confirm, and the
   status updates optimistically with rollback on failure.

---

### User Story 4 - Manage Company Profile (Priority: P3)

As a company administrator, I need to view and update my company's profile, details, and
settings, so that the organization's core information is accurate for the rest of the
system.

**Why this priority**: Company information is important but changes infrequently and is
not a blocker for authenticating or administering users; it is a single-record view/edit
rather than a full CRUD workload.

**Independent Test**: With the company endpoint available, open `/company`, view the
current company information, edit it via a validated form, save, and confirm the updated
values persist and display, including loading/error states.

**Acceptance Scenarios**:

1. **Given** an authenticated user with access, **When** they open `/company`, **Then**
   the current company profile, details, and settings are displayed with skeleton loading
   beforehand.
2. **Given** the company edit form, **When** valid changes are submitted, **Then** the
   company information is updated, a success toast is shown, and the view reflects the new
   values.
3. **Given** the company edit form, **When** the update fails, **Then** a friendly error
   is shown and the previously saved values remain intact.

---

### User Story 5 - Manage Employees (Priority: P3)

As an administrator, I need to list, search, filter, paginate, view, create, edit, and
archive employees — optionally linked to user accounts — so that I can maintain accurate
personnel records.

**Why this priority**: Employee records support later workforce features but are not
required for authentication, authorization, or basic user administration, so they rank
last within this feature.

**Independent Test**: With employees endpoints available, load the paginated Employees
list, search/filter it, view an employee, create and edit employees via validated forms,
link an employee to a user where appropriate, and archive an employee — each with full UI
states across breakpoints.

**Acceptance Scenarios**:

1. **Given** the Employees page, **When** it loads, **Then** a paginated list of employees
   is displayed with skeleton loading and an empty state when there are none.
2. **Given** the Create/Edit Employee form, **When** valid data is submitted, **Then** the
   employee is saved, a success toast is shown, and the list reflects the change.
3. **Given** an employee that can be associated with a user, **When** the administrator
   links or selects a related user, **Then** the association is saved and reflected in the
   employee detail.
4. **Given** an employee row, **When** the administrator archives the employee, **Then** a
   confirmation dialog is shown and, on confirm, the employee is archived and removed from
   the default active list.

---

### Edge Cases

- **Token refresh race**: Multiple concurrent requests receive 401 simultaneously — only a
  single refresh call is made and queued requests retry after it resolves.
- **Refresh loop prevention**: A failed refresh MUST NOT trigger another refresh attempt;
  the session is cleared once and the user is redirected to login.
- **Direct deep link while signed out**: The originally requested URL is preserved and
  restored after login.
- **Permissions not yet loaded**: Guarded UI renders a loading state (not a flash of
  unauthorized content) until permissions resolve.
- **Cross-tenant access attempt**: A request or route referencing another tenant's resource
  is rejected/blocked; no cross-tenant data is displayed or cached.
- **Deactivated user session**: An authenticated user who is deactivated server-side is
  logged out on the next 401/403 with a clear message.
- **Self-deactivation / self-delete**: The current user cannot deactivate or remove their
  own active account through the UI (guarded action).
- **Duplicate submission**: Forms disable submit while a mutation is in flight to prevent
  duplicate creates.
- **Empty search / no results**: List views show a distinct empty state for "no data yet"
  versus "no results for filter".
- **Slow/failed list load**: Skeleton on load; retryable error state on failure; never a
  blank screen.

## Requirements _(mandatory)_

### Functional Requirements

**Authentication (US1)**

- **FR-001**: System MUST provide a login screen that authenticates users through the
  backend and establishes an authenticated session on success.
- **FR-002**: System MUST support logout that clears the session, tokens, and cached
  server state, then redirects to `/login`.
- **FR-003**: System MUST persist the session across page reloads and support a "remember
  session" option that controls session longevity.
- **FR-004**: System MUST attach the access token to authenticated API requests via the
  shared Axios client (request interceptor), never per-component.
- **FR-005**: System MUST automatically refresh an expired access token using the refresh
  token and transparently retry the original request, making at most one refresh call for
  concurrent 401s.
- **FR-006**: System MUST handle unauthorized (401) and session-expiration by clearing the
  session, notifying the user, and redirecting to `/login`, without entering a refresh
  loop.
- **FR-007**: System MUST protect designated routes so unauthenticated users are redirected
  to `/login`, preserving the attempted location for post-login redirect.
- **FR-008**: System MUST redirect authenticated users away from `/login` to `/dashboard`.

**Authorization / RBAC (US2)**

- **FR-009**: System MUST retrieve the current user's roles and permissions from the
  backend and MUST NOT hardcode permission rules in the frontend.
- **FR-010**: System MUST provide permission-checking hooks/utilities used to gate routes,
  menu items, components, and actions.
- **FR-011**: System MUST guard routes by required permission, showing an access-denied
  state or redirect when the permission is absent.
- **FR-012**: System MUST render navigation/menu entries only when the user is authorized
  to access them (menu authorization).
- **FR-013**: System MUST conditionally render feature actions and components (e.g.,
  create/edit/activate buttons) based on the user's permissions (component visibility).
- **FR-014**: System MUST reflect updated permissions when they are refetched, without
  requiring code changes.

**Company (US4)**

- **FR-015**: System MUST display the current company profile, details, and settings on a
  `/company` screen.
- **FR-016**: Users with the appropriate permission MUST be able to update company
  information through a validated form, with success and error feedback.

**Users (US3)**

- **FR-017**: System MUST display a paginated, sortable, searchable, and filterable list of
  users.
- **FR-018**: Users MUST be able to view a single user's details.
- **FR-019**: Users MUST be able to create a user via a validated form.
- **FR-020**: Users MUST be able to edit an existing user via a validated form.
- **FR-021**: Users MUST be able to activate and deactivate a user, guarded by a
  confirmation dialog.
- **FR-022**: System MUST prevent the current user from deactivating or deleting their own
  account through the UI.

**Employees (US5)**

- **FR-023**: System MUST display a paginated, searchable, and filterable list of
  employees.
- **FR-024**: Users MUST be able to view a single employee's details.
- **FR-025**: Users MUST be able to create and edit employees via validated forms.
- **FR-026**: Users MUST be able to archive an employee, guarded by a confirmation dialog,
  excluding archived employees from the default active list.
- **FR-027**: System MUST allow associating an employee with a user account where the
  backend supports the relationship.

**Tenant Isolation (cross-cutting)**

- **FR-028**: System MUST scope all authenticated API requests to the active tenant/company
  context (e.g., via the shared client), with no per-component tenant handling.
- **FR-029**: System MUST expose the current tenant/company context to the application for
  use by guards, services, and UI.
- **FR-030**: System MUST NOT leak or cache cross-tenant data; cached server state MUST be
  cleared on logout and on tenant/identity change.
- **FR-031**: System MUST keep the architecture ready for future tenant switching without
  implementing a tenant-switching UI in this specification.

**Cross-cutting UX & Architecture**

- **FR-032**: All API communication MUST occur through service classes; components MUST NOT
  call Axios directly.
- **FR-033**: All server state, caching, pagination, and mutations MUST use TanStack Query;
  Zustand MUST hold only client state (auth/session, theme, UI) and MUST NOT duplicate
  server state.
- **FR-034**: All forms MUST use React Hook Form with Zod validation, inline errors,
  disabled submit while pending, and first-invalid-field focus.
- **FR-035**: All list, detail, and form screens MUST implement loading (skeleton), empty,
  success, and error states, and MUST NOT display blank screens.
- **FR-036**: All new pages MUST reuse Specification 001 shared components and layouts;
  feature-specific components MUST be created only when necessary (no duplication).
- **FR-037**: All feature routes MUST use React Router's Data Router and be lazy-loaded /
  code-split.
- **FR-038**: Destructive or state-changing actions (activate/deactivate, archive) MUST use
  confirmation dialogs and surface results via toast notifications.

### API Dependencies _(mandatory — Constitution Principle XXII)_

Consumed via service classes over the shared Axios client; types and clients SHOULD be
generated from the Backend P001 OpenAPI contract where available (Principle XXVI). Paths
below are the assumed RESTful conventions for Backend P001 and MUST be reconciled with the
published contract during planning.

- **Auth — Login**: `POST /auth/login` → issues access + refresh tokens (US1).
- **Auth — Logout**: `POST /auth/logout` → invalidates the session/refresh token (US1).
- **Auth — Refresh**: `POST /auth/refresh` → exchanges a refresh token for a new access
  token (US1).
- **Auth — Current identity**: `GET /auth/me` (or `/users/me`) → current user profile,
  roles, permissions, and tenant/company context (US1, US2).
- **Company — Read**: `GET /company` → current company profile, details, settings (US4).
- **Company — Update**: `PATCH/PUT /company` → update company information (US4).
- **Users — List**: `GET /users?search&filter&sort&page&pageSize` → paginated users (US3).
- **Users — Read**: `GET /users/:id` (US3).
- **Users — Create**: `POST /users` (US3).
- **Users — Update**: `PATCH/PUT /users/:id` (US3).
- **Users — Status**: `PATCH /users/:id/activate` and `/deactivate` (or a status field)
  (US3).
- **Employees — List**: `GET /employees?search&filter&page&pageSize` → paginated employees
  (US5).
- **Employees — Read**: `GET /employees/:id` (US5).
- **Employees — Create**: `POST /employees` (US5).
- **Employees — Update**: `PATCH/PUT /employees/:id` (US5).
- **Employees — Archive**: `PATCH /employees/:id/archive` (or status field) (US5).
- **OpenAPI reference**: Backend P001 (Company & Identity Foundation) contract — used to
  generate/verify request and response models.

### UI States _(mandatory — Constitution Principle XXII)_

- **Login**: Loading — submit button spinner, inputs disabled during request; Empty —
  clean form; Success — redirect to target/`/dashboard`; Error — inline credential error +
  field-level validation.
- **Company**: Loading — skeleton of profile/settings sections; Empty — N/A (single record;
  show "not available" only on fetch failure); Success — populated read view / editable
  form; Error — retryable error state, preserve last-known values on failed save.
- **Users list**: Loading — table/card skeletons; Empty — "no users yet" vs "no results";
  Success — paginated table (desktop) / cards (mobile); Error — retryable error state.
- **User detail/form**: Loading — skeleton; Empty — N/A; Success — details / validated
  form; Error — inline + toast; mutation pending disables submit.
- **Employees list**: Loading — skeletons; Empty — "no employees yet" vs "no results";
  Success — paginated list; Error — retryable error.
- **Employee detail/form**: Loading — skeleton; Empty — N/A; Success — details / validated
  form; Error — inline + toast.
- **Guarded views (any)**: Loading — permission-resolving skeleton (no unauthorized flash);
  Denied — access-denied state; Success — content renders.

### Responsive Behavior _(mandatory — Constitution Principle XXVII)_

- **Login**: Navigation — minimal `AuthLayout`, no sidebar; Layout — centered card (desktop),
  full-width stack (mobile); Forms — vertical stack, touch-friendly inputs; Modals — N/A.
- **Company**: Navigation — `DashboardLayout` sidebar/drawer; Layout — sectioned cards in a
  responsive grid (1 col mobile, 2+ desktop); Forms — stacked (mobile) / grid (desktop);
  Modals — confirmation as centered dialog (desktop) / sheet (mobile).
- **Users**: Navigation — `DashboardLayout`; Layout — data table with sticky header and
  horizontal scroll or responsive column visibility on desktop/tablet, card list on mobile;
  Forms — stacked (mobile) / grid (desktop); Modals — dialog (desktop) / full-screen or
  sheet (mobile).
- **Employees**: Same responsive pattern as Users.

### Page Layout _(mandatory — Constitution Principle XXXII)_

- **Company**: Header — "Company" title, description, breadcrumbs (Home / Company), "Edit"
  primary action (permission-gated); Content — profile/details/settings sections; no
  pagination.
- **Users**: Header — "Users" title, description, breadcrumbs, "Create User" action
  (permission-gated); Content — search, filters, users table/cards, pagination.
- **User Create/Edit**: Header — "New User" / "Edit User", breadcrumbs, Save/Cancel;
  Content — validated form sections.
- **Employees**: Header — "Employees" title, description, breadcrumbs, "Create Employee"
  action (permission-gated); Content — search, filters, employees list, pagination.
- **Employee Create/Edit**: Header — "New Employee" / "Edit Employee", breadcrumbs,
  Save/Cancel; Content — validated form including optional user association.

### Empty State Design _(mandatory — Constitution Principle XXXIV)_

- **Users**: Icon — users/identity icon; Message — "No users yet"; Primary action — "Create
  User" (if permitted); Guidance — "Add your first user to grant access to Scrappy."
- **Users (filtered)**: Icon — search icon; Message — "No users match your filters";
  Primary action — "Clear filters"; Guidance — "Try adjusting your search or filters."
- **Employees**: Icon — employee/ID icon; Message — "No employees yet"; Primary action —
  "Create Employee" (if permitted); Guidance — "Add your first employee record."
- **Employees (filtered)**: Icon — search icon; Message — "No employees match your
  filters"; Primary action — "Clear filters"; Guidance — "Try adjusting your search."

### Production Quality Checklist _(mandatory — Constitution Principle XL)_

Each deliverable MUST be: responsive; accessible (labels, keyboard nav, accessible dialogs,
focus management); type-safe (no `any`); reusable (shared components first); dark mode
compatible; complete with loading/error/empty states; mobile-friendly (44×44 touch
targets); keyboard accessible; and production-ready (builds, lints, and type-checks pass).

### Validation Rules _(mandatory — Constitution Principle XXII)_

- **Login form** (`auth/login.schema.ts`): identifier (email/username) required and
  well-formed; password required (non-empty, min length per backend); "remember session"
  boolean.
- **User form** (`user.schema.ts`): name required; email required + valid format; role(s)
  required (from backend-provided roles); status boolean; optional fields validated per
  backend; uniqueness/collision errors surfaced from server response.
- **Employee form** (`employee.schema.ts`): name required; contact fields validated for
  format when present; optional linked user id validated as a known user; archive is an
  action, not a form field.
- **Company form** (`company.schema.ts`): company name required; settings/detail fields
  validated per backend rules; format-only client validation.
- Server-side validation MUST be assumed authoritative; frontend validation is UX-only
  (Principle XX). Backend field errors MUST map to the corresponding form fields.

### Error Scenarios _(mandatory — Constitution Principle XXII)_

- **Invalid credentials**: "The email or password is incorrect."; stay on login, allow
  retry; log client-side event without sensitive data.
- **Session expired / refresh failed**: "Your session has expired. Please sign in again.";
  clear session and redirect to `/login`; log centrally.
- **Forbidden (403)**: "You don't have permission to do that."; keep user on a safe view;
  do not expose backend detail.
- **Not found (404) for a record**: "This record could not be found."; offer navigation
  back to the list.
- **Validation (422/400)**: Map field errors inline; show a summary toast; focus first
  invalid field.
- **Network/timeout/5xx**: "Something went wrong. Please try again."; provide retry; never
  expose raw backend exception messages (Principle XIII).
- **Optimistic update failure**: Roll back the UI to the prior state and show an error
  toast.

### Key Entities _(include if feature involves data)_

- **Session/AuthState**: Current authentication status, access/refresh token references,
  "remember session" preference, and the authenticated user reference. Client state
  (Zustand), tenant-isolation aware; cleared on logout.
- **CurrentUser (Identity)**: The signed-in user's profile plus roles, permissions, and
  tenant/company context. Drives authorization decisions. Sourced from the backend.
- **Company (Tenant)**: The company/tenant record — profile, details, settings. One active
  company provides the tenant context for all requests.
- **User**: An account that can access the system — identity attributes, assigned role(s),
  active/inactive status. Managed via CRUD + status changes.
- **Employee**: A personnel record — identity/contact attributes, archive status, and an
  optional association to a User account.
- **Role**: A named set of permissions assigned to users (backend-defined).
- **Permission**: A backend-defined capability string checked by frontend guards/hooks.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: A user can sign in and reach the dashboard in under 30 seconds on a first
  attempt with valid credentials.
- **SC-002**: Authenticated sessions survive a full page reload with no re-login in 100% of
  cases where "remember session" is enabled and the refresh token is valid.
- **SC-003**: Expired access tokens are refreshed transparently, with at most one refresh
  request per burst of concurrent 401s and zero user-visible failures for otherwise valid
  sessions.
- **SC-004**: Unauthorized users can never view protected content — 100% of permission-gated
  routes and actions are hidden or blocked when the backing permission is absent.
- **SC-005**: An administrator can create, edit, and change the status of a user end-to-end
  in under 2 minutes, with validation preventing invalid submissions.
- **SC-006**: All list, detail, and form screens render correct loading, empty, success,
  and error states at 320px, 768px, and 1280px+ with no horizontal overflow and no blank
  screens.
- **SC-007**: No cross-tenant data is ever displayed or retained; cached server state is
  cleared on logout/identity change in 100% of cases.
- **SC-008**: Production build, type check, and lint complete with zero errors.
- **SC-009**: Specification 003 (Organization Management) can begin with no architectural
  refactoring — auth, RBAC, tenant context, service, and UI patterns are reusable as-is.

## Assumptions

- **Backend availability**: Backend P001 exposes REST endpoints for auth, company, users,
  and employees; exact paths/payloads are reconciled against its OpenAPI contract during
  planning. The RESTful paths listed above are reasonable defaults.
- **Token model**: JWT access + refresh tokens per the Constitution. Default storage:
  access token held in memory with refresh handled via the most secure mechanism the
  backend supports (httpOnly cookie preferred; otherwise persisted storage gated by
  "remember session"). Finalized in planning against backend capabilities.
- **Authorization source**: Roles and permissions are provided by the backend on the
  current-identity endpoint; the frontend treats permission strings as opaque and never
  hardcodes rules.
- **Tenant model**: A single active company represents the tenant; tenant scoping is applied
  centrally by the shared client/session context. Multi-tenant switching is future-ready
  only and not surfaced in the UI unless the backend supports it.
- **Employee↔User link**: The backend may support an optional association between an
  employee and a user account; the UI exposes it only where supported.
- **Foundation reuse**: Specification 001's routing, layouts, theme, Axios client, TanStack
  Query, Zustand, and shared UI primitives are reused without refactoring.
- **Package manager**: pnpm remains the sole package manager (`pnpm install`, `pnpm <script>`).
- **Dashboard**: The existing dashboard placeholder remains; building out dashboard
  analytics is out of scope for this specification.
