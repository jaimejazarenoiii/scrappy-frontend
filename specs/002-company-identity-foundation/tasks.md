---
description: 'Task list for Company & Identity Foundation (Specification 002)'
---

# Tasks: Company & Identity Foundation

**Input**: Design documents from `specs/002-company-identity-foundation/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Not requested in the specification — no automated test tasks are included.
Validation is via quickstart scenarios plus type check, lint, and production build gates.

**Organization**: Tasks are grouped by user story (US1–US5) to enable independent
implementation and testing. Builds strictly on the Specification 001 foundation; all edits
to existing files are additive (marked EXTEND) and MUST NOT refactor the foundation.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: US1–US5 (user story phase tasks only)
- Exact file paths are included in every task

## Path Conventions

Feature-based paths at repository root: feature code in `src/features/<feature>/`, shared UI
in `src/components/ui/` and `src/components/common/`, cross-cutting wiring in `src/app/`,
`src/lib/`, `src/store/`, `src/hooks/`, `src/constants/`, `src/types/`.

---

## Phase 1: Setup (Shared Scaffolding)

**Purpose**: Prepare feature folders and shared constants/types. The project itself was
initialized in Specification 001; no re-initialization is needed.

- [x] T001 Scaffold feature module folders (`components/`, `hooks/`, `pages/`, `services/`, `validation/`, `types/`) for `src/features/auth/`, `src/features/authorization/`, `src/features/company/`, `src/features/users/`, `src/features/employees/`; remove `src/features/.gitkeep`
- [x] T002 [P] EXTEND route path constants (`company`, `users`, `userNew`, `userDetail`, `userEdit`, `employees`, `employeeNew`, `employeeDetail`, `employeeEdit`, `forbidden`) in `src/constants/routes.ts`
- [x] T003 [P] Create permission key constants (string keys only, no rules) in `src/constants/permissions.ts`
- [x] T004 [P] Create shared list types (`ListQueryParams`, `PaginatedResponse<T>`) in `src/types/pagination.types.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Session/tenant/auth infrastructure and shared list/table/dialog primitives that
user stories build on.

**⚠️ CRITICAL**: The auth/session tasks (T005–T013) BLOCK all user stories. The shared list
infra (T014–T018) blocks the list-based stories (US3, US5).

### Auth / Session / Tenant infrastructure

- [x] T005 EXTEND auth store with `currentUser`, `permissions`, `tenant`, `rememberSession`, `status`, and `setSession`/`clearSession`/`setPermissions` actions in `src/store/auth.store.ts`
- [x] T006 [P] Create remember-session token storage abstraction (local vs session storage) in `src/lib/token-storage.ts`
- [x] T007 [P] Create auth types (`Credentials`, `AuthTokens`, `CurrentUser`, `TenantContext`, `Role`) in `src/features/auth/types/auth.types.ts`
- [x] T008 Create auth service (`login`, `logout`, `refresh`, `me`) in `src/features/auth/services/auth.service.ts` (depends on T005, T007)
- [x] T009 EXTEND Axios client with central tenant scoping and single-flight 401 refresh + auto-logout (replace Spec 001 TODO; exclude `/auth/login` and `/auth/refresh`) in `src/lib/axios.ts` (depends on T005, T006, T008)
- [x] T010 Create `SessionProvider` that bootstraps identity via `GET /auth/me` and sets `status` in `src/app/providers/SessionProvider.tsx` (depends on T008, T009)
- [x] T011 EXTEND provider composition to mount `SessionProvider` (after Query/Theme, before router) in `src/app/providers/AppProviders.tsx` (depends on T010)
- [x] T012 EXTEND `AuthGuard` with loading state, unauthenticated redirect to `/login`, and location preservation in `src/app/guards/AuthGuard.tsx` (depends on T005)
- [x] T013 Wire `queryClient.clear()` on logout and on identity/tenant change (cache reset for tenant isolation) in `src/store/auth.store.ts` and `src/features/auth/hooks/useLogout.ts` (depends on T005, T011)

### Shared list / table / dialog primitives

- [x] T014 [P] EXTEND shared `DataTable` with optional sorting, an optional server-pagination slot, and a responsive card mode (all new props optional; no breaking change) in `src/components/common/DataTable.tsx`
- [x] T015 [P] Create shared `Pagination` control in `src/components/common/Pagination.tsx`
- [x] T016 [P] Create shared `FilterBar` (search + filter container) in `src/components/common/FilterBar.tsx`
- [x] T017 [P] Create shared `ConfirmDialog` (built on `components/ui/dialog` + `sheet`) in `src/components/common/ConfirmDialog.tsx`
- [x] T018 [P] Create `useListQuery` hook (URL-synced search/filter/sort/page state) in `src/hooks/useListQuery.ts` (depends on T004)

**Checkpoint**: Authenticated, tenant-scoped client + guards + shared list infra ready — user stories can begin.

---

## Phase 3: User Story 1 - Authenticate and Maintain a Secure Session (Priority: P1) 🎯 MVP

**Goal**: Users can log in, stay signed in across reloads, get transparent token refresh, be
redirected appropriately, and log out; protected routes require authentication.

**Independent Test**: Attempt a protected URL while signed out (redirect to `/login`), sign
in (redirect back), reload (still signed in), expire access token (transparent refresh),
fail refresh (session cleared + redirect), and log out (cannot return via back button).

### Implementation for User Story 1

- [x] T019 [P] [US1] Create login Zod schema (identifier, password, remember) in `src/features/auth/validation/login.schema.ts`
- [x] T020 [US1] Create auth hooks `useLogin`, `useCurrentUser`, `useSessionBootstrap` in `src/features/auth/hooks/` (depends on T008, T010)
- [x] T021 [US1] Create `useLogout` hook (clears session, resets cache, redirects) in `src/features/auth/hooks/useLogout.ts` (depends on T005, T013)
- [x] T022 [US1] Build `LoginForm` (React Hook Form + Zod, remember toggle, inline errors, disabled-while-pending, focus first error, server-error mapping) in `src/features/auth/components/LoginForm.tsx` (depends on T019, T020)
- [x] T023 [US1] Build `LoginPage` using `AuthLayout` styling in `src/features/auth/pages/LoginPage.tsx` (depends on T022)
- [x] T024 [US1] EXTEND router to import the feature `LoginPage`, redirect authenticated users away from `/login`, and honor post-login `location.state.from` in `src/app/router/routes.tsx` (depends on T023, T012); delete obsolete `src/app/pages/LoginPage.tsx`
- [x] T025 [US1] EXTEND `Header` with an authenticated user menu and Logout action in `src/components/common/Header.tsx` (depends on T021)
- [x] T026 [US1] Add session-expiration toast + redirect on refresh failure (Sonner) wired from the Axios auto-logout path in `src/features/auth/hooks/useLogout.ts` and `src/lib/axios.ts` (depends on T009, T021)

**Checkpoint**: US1 is fully functional — secure login/logout, session persistence, refresh, and protected routing.

---

## Phase 4: User Story 2 - Role-Based Authorization Controls Access (Priority: P2)

**Goal**: Routes, menu items, and UI actions are governed by backend-provided permissions,
with no hardcoded rules.

**Independent Test**: Sign in with differing permission sets and confirm gated routes
redirect/deny, unauthorized menu entries are hidden, and action buttons render only with the
required permission — all driven by backend data.

### Implementation for User Story 2

- [x] T027 [P] [US2] Create authorization types (`Permission`, `PermissionCheck`, gate props) in `src/features/authorization/types/authorization.types.ts`
- [x] T028 [US2] Implement `usePermissions` and `useHasPermission(key|keys, mode)` hooks (read from `auth.store`) in `src/features/authorization/hooks/` (depends on T005, T027)
- [x] T029 [US2] Implement route-level `PermissionGuard` (loading → deny/redirect `/403` → `Outlet`) in `src/app/guards/PermissionGuard.tsx` (depends on T028)
- [x] T030 [P] [US2] Implement `PermissionGate` component (children/fallback by permission) in `src/features/authorization/components/PermissionGate.tsx` (depends on T028)
- [x] T031 [P] [US2] Create `ForbiddenPage` (403 access-denied) in `src/app/pages/ForbiddenPage.tsx`
- [x] T032 [US2] EXTEND navigation types with an optional `permission` field in `src/types/navigation.types.ts`
- [x] T033 [US2] EXTEND navigation config with permission-gated Company, Users, and Employees entries in `src/constants/navigation.ts` (depends on T003, T032)
- [x] T034 [US2] EXTEND `Sidebar` to filter menu items by permission via `PermissionGate`/`useHasPermission` in `src/components/common/Sidebar.tsx` (depends on T030, T033)
- [x] T035 [US2] EXTEND router to register the `/403` route and prepare `PermissionGuard` wrappers in `src/app/router/routes.tsx` (depends on T029, T031)

**Checkpoint**: US1 and US2 both work — authenticated access is now permission-governed.

---

## Phase 5: User Story 3 - Manage Users (Priority: P2)

**Goal**: List, search, filter, sort, paginate, view, create, edit, activate, and deactivate
users, with full UI states and permission-gated actions.

**Independent Test**: Load the paginated/sortable Users list, search/filter it, view a user,
create and edit via validated forms, and toggle status with confirmation — across mobile,
tablet, and desktop.

### Implementation for User Story 3

- [x] T036 [P] [US3] Create user types (`User`, `CreateUserInput`, `UpdateUserInput`) in `src/features/users/types/user.types.ts` (depends on T004)
- [x] T037 [P] [US3] Create user Zod schema in `src/features/users/validation/user.schema.ts`
- [x] T038 [US3] Implement user service (`list`, `get`, `create`, `update`, `activate`, `deactivate`) in `src/features/users/services/user.service.ts` (depends on T036)
- [x] T039 [US3] Implement user hooks (`useUsers`, `useUser`, `useCreateUser`, `useUpdateUser`, `useUserStatus`) with TanStack Query keys + invalidation in `src/features/users/hooks/` (depends on T038)
- [x] T040 [P] [US3] Build `userColumns` (TanStack Table column defs) in `src/features/users/components/userColumns.tsx` (depends on T036)
- [x] T041 [P] [US3] Build `UserFilters` (search + status/role filters) in `src/features/users/components/UserFilters.tsx` (depends on T016)
- [x] T042 [P] [US3] Build `UserStatusDialog` (activate/deactivate confirmation) in `src/features/users/components/UserStatusDialog.tsx` (depends on T017)
- [x] T043 [US3] Build `UsersListPage` (FilterBar + DataTable + Pagination, loading/empty/error states, URL-synced query) in `src/features/users/pages/UsersListPage.tsx` (depends on T039, T040, T041, T014, T015, T018)
- [x] T044 [US3] Build `UserForm` (React Hook Form + Zod, role selection, server-error mapping) in `src/features/users/components/UserForm.tsx` (depends on T037, T039)
- [x] T045 [US3] Build `UserDetailPage` in `src/features/users/pages/UserDetailPage.tsx` (depends on T039)
- [x] T046 [US3] Build `UserCreatePage` and `UserEditPage` in `src/features/users/pages/` (depends on T044)
- [x] T047 [US3] Implement activate/deactivate with optimistic update + rollback and self-deactivation guard in `src/features/users/hooks/useUserStatus.ts` and `UsersListPage` (depends on T039, T042)
- [x] T048 [US3] EXTEND router to register `/users`, `/users/new`, `/users/:id`, `/users/:id/edit` as lazy routes wrapped in `PermissionGuard` in `src/app/router/routes.tsx` (depends on T043, T045, T046, T029)

**Checkpoint**: US1–US3 functional — full user administration under RBAC.

---

## Phase 6: User Story 4 - Manage Company Profile (Priority: P3)

**Goal**: View and update company profile, details, and settings via a permission-gated
validated form.

**Independent Test**: Open `/company`, view current info, edit and save valid changes
(persisted after reload), and confirm a failed save preserves prior values.

### Implementation for User Story 4

- [x] T049 [P] [US4] Create company types (`Company`, `UpdateCompanyInput`) in `src/features/company/types/company.types.ts`
- [x] T050 [P] [US4] Create company Zod schema in `src/features/company/validation/company.schema.ts`
- [x] T051 [US4] Implement company service (`get`, `update`) in `src/features/company/services/company.service.ts` (depends on T049)
- [x] T052 [US4] Implement company hooks (`useCompany`, `useUpdateCompany`) in `src/features/company/hooks/` (depends on T051)
- [x] T053 [P] [US4] Build `CompanyProfileCard` (read view) in `src/features/company/components/CompanyProfileCard.tsx` (depends on T052)
- [x] T054 [US4] Build `CompanySettingsForm` (React Hook Form + Zod) in `src/features/company/components/CompanySettingsForm.tsx` (depends on T050, T052)
- [x] T055 [US4] Build `CompanyPage` (view + edit, permission-gated edit, loading/error states) in `src/features/company/pages/CompanyPage.tsx` (depends on T053, T054, T030)
- [x] T056 [US4] EXTEND router to register `/company` as a lazy route wrapped in `PermissionGuard` in `src/app/router/routes.tsx` (depends on T055, T029)

**Checkpoint**: US1–US4 functional — company profile management added.

---

## Phase 7: User Story 5 - Manage Employees (Priority: P3)

**Goal**: List, search, filter, paginate, view, create, edit, and archive employees, with an
optional link to a user account.

**Independent Test**: Load the paginated Employees list, search/filter, view an employee,
create/edit via validated forms, link to a user where supported, and archive with
confirmation.

### Implementation for User Story 5

- [x] T057 [P] [US5] Create employee types (`Employee`, `CreateEmployeeInput`, `UpdateEmployeeInput`) in `src/features/employees/types/employee.types.ts` (depends on T004)
- [x] T058 [P] [US5] Create employee Zod schema in `src/features/employees/validation/employee.schema.ts`
- [x] T059 [US5] Implement employee service (`list`, `get`, `create`, `update`, `archive`) in `src/features/employees/services/employee.service.ts` (depends on T057)
- [x] T060 [US5] Implement employee hooks (`useEmployees`, `useEmployee`, `useCreateEmployee`, `useUpdateEmployee`, `useArchiveEmployee`) in `src/features/employees/hooks/` (depends on T059)
- [x] T061 [P] [US5] Build `employeeColumns` in `src/features/employees/components/employeeColumns.tsx` (depends on T057)
- [x] T062 [P] [US5] Build `EmployeeFilters` in `src/features/employees/components/EmployeeFilters.tsx` (depends on T016)
- [x] T063 [P] [US5] Build `EmployeeArchiveDialog` in `src/features/employees/components/EmployeeArchiveDialog.tsx` (depends on T017)
- [x] T064 [US5] Build `EmployeesListPage` (FilterBar + DataTable + Pagination, states, URL-synced query) in `src/features/employees/pages/EmployeesListPage.tsx` (depends on T060, T061, T062, T014, T015, T018)
- [x] T065 [US5] Build `EmployeeForm` including optional user-account association (reuse user lookup) in `src/features/employees/components/EmployeeForm.tsx` (depends on T058, T060, T039)
- [x] T066 [US5] Build `EmployeeDetailPage` in `src/features/employees/pages/EmployeeDetailPage.tsx` (depends on T060)
- [x] T067 [US5] Build `EmployeeCreatePage` and `EmployeeEditPage` in `src/features/employees/pages/` (depends on T065)
- [x] T068 [US5] Implement archive with optimistic update + rollback and exclusion from default active list in `src/features/employees/hooks/useArchiveEmployee.ts` and `EmployeesListPage` (depends on T060, T063)
- [x] T069 [US5] EXTEND router to register `/employees`, `/employees/new`, `/employees/:id`, `/employees/:id/edit` as lazy routes wrapped in `PermissionGuard` in `src/app/router/routes.tsx` (depends on T064, T066, T067, T029)

**Checkpoint**: All user stories (US1–US5) independently functional.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Production-quality pass and Specification 003 readiness.

- [x] T070 [P] Responsive verification of all screens at 320px, 768px, 1024px, 1280px+, and 1536px+ (tables → cards on mobile; dialogs → sheets) — Login, Company, Users (list/detail/form), Employees (list/detail/form)
- [x] T071 [P] Light/dark/system theme verification across all new screens and components
- [x] T072 [P] Accessibility audit (labels, keyboard nav, accessible dialogs/focus management, 44×44 touch targets) across all new screens
- [x] T073 [P] Verify loading (skeleton), empty ("no data" vs "no results"), success, and error states on every list, detail, and form
- [x] T074 [P] Design-system audit — no duplicate UI; reuse `components/ui/` and `components/common/` (Principles XXIX, XXXIX)
- [x] T075 [P] Toast + confirmation-dialog consistency for all destructive/state-changing actions (activate/deactivate, archive)
- [x] T076 Tenant-isolation verification — confirm `queryClient.clear()` on logout/identity change and no cross-tenant data displayed or cached (FR-028–FR-031)
- [x] T077 Performance review — lazy routes/code splitting, optimistic updates, animations 150–250ms, no unnecessary re-renders
- [x] T078 Security review — no secrets, sanitized input, no raw backend exception messages surfaced (Principles XIII, XX)
- [x] T079 Run `pnpm typecheck`, `pnpm lint`, and `pnpm build` — all must complete with zero errors
- [ ] T080 Execute `specs/002-company-identity-foundation/quickstart.md` validation scenarios (US1–US5) — requires a running Backend P001 instance (deferred: no backend available in this environment)
- [x] T081 Verify the Specification 003 Readiness Checklist in `specs/002-company-identity-foundation/plan.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately.
- **Foundational (Phase 2)**: Depends on Setup. Auth/session tasks (T005–T013) BLOCK all user
  stories; shared list infra (T014–T018) blocks US3 and US5.
- **User Stories (Phases 3–7)**: Depend on Foundational. US1 (auth) is the MVP and is a
  practical prerequisite for meaningfully testing the others (all require a session). US2
  (RBAC) provides `PermissionGuard`/`PermissionGate` consumed by US3/US4/US5 route/action
  gating.
- **Polish (Phase 8)**: Depends on all targeted user stories.

### User Story Dependencies

- **US1 (P1)**: After Foundational. No dependency on other stories. 🎯 MVP.
- **US2 (P2)**: After Foundational. Independent, but its guard/gate primitives are reused by
  US3/US4/US5 (register routes without gates first if building a story in isolation).
- **US3 (P2)**: After Foundational (+ shared list infra). Uses `PermissionGuard`/`PermissionGate`
  from US2 for gating.
- **US4 (P3)**: After Foundational. Uses `PermissionGate` from US2.
- **US5 (P3)**: After Foundational (+ shared list infra). Reuses US3 user lookup for optional
  employee↔user linking.

### Within Each User Story

- Types and Zod schemas before services.
- Services before hooks.
- Hooks before pages/components.
- Routes registered (lazy + guarded) before the story is considered complete.

### Parallel Opportunities

- Setup: T002, T003, T004 in parallel.
- Foundational: T006 & T007 in parallel; shared list infra T014–T018 in parallel with auth
  tasks T008–T013 (different files).
- US2: T027, T030, T031 in parallel.
- US3: T036, T037, T040, T041, T042 in parallel before assembling pages.
- US4: T049, T050, T053 in parallel.
- US5: T057, T058, T061, T062, T063 in parallel.
- Polish: T070–T075, T078 in parallel.
- Across teams: after Foundational, US4 and US3 can proceed in parallel; US5 follows US3.

---

## Parallel Example: User Story 3 (Users)

```bash
# After Foundational + US2 primitives, launch US3 building blocks in parallel:
Task: "Create user types in src/features/users/types/user.types.ts"
Task: "Create user Zod schema in src/features/users/validation/user.schema.ts"
Task: "Build userColumns in src/features/users/components/userColumns.tsx"
Task: "Build UserFilters in src/features/users/components/UserFilters.tsx"
Task: "Build UserStatusDialog in src/features/users/components/UserStatusDialog.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 Setup → Phase 2 Foundational (auth/session tasks are critical).
2. Phase 3 US1 — authentication.
3. **STOP and VALIDATE**: Sign in/out, session persistence, refresh, protected routes.
4. Demo the secure shell.

### Incremental Delivery

1. Setup + Foundational → authenticated, tenant-scoped shell.
2. US1 (auth) → validate → demo (MVP).
3. US2 (RBAC) → validate → demo.
4. US3 (Users) → validate → demo.
5. US4 (Company) → validate → demo.
6. US5 (Employees) → validate → demo.
7. Polish → production-quality pass + Spec 003 readiness.

### Parallel Team Strategy

1. Whole team completes Setup + Foundational.
2. Then: Dev A → US1; Dev B starts US2 primitives; once done, Dev B → US4, Dev C → US3, then
   US5 after US3.
3. Stories integrate independently under the shared foundation.

---

## Notes

- No new dependencies are introduced; everything reuses the Specification 001 stack.
- EXTEND tasks modify existing files additively and MUST NOT refactor the foundation.
- `[P]` tasks touch different files and have no incomplete dependencies.
- All server state flows through service classes + TanStack Query; Zustand holds only
  session/theme/UI state; no server state duplicated in Zustand.
- Commit after each task or logical group; stop at any checkpoint to validate a story.
