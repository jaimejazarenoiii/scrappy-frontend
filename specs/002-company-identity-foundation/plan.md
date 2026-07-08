# Implementation Plan: Company & Identity Foundation

**Branch**: `002-company-identity-foundation` | **Date**: 2026-07-08 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-company-identity-foundation/spec.md`

**Note**: First business feature (maps to Backend P001). Builds strictly on the
Specification 001 foundation and MUST NOT redesign or refactor it. Enhancements to shared
infrastructure (Axios interceptors, `auth.store`, shared `DataTable`, navigation) are
additive and backward-compatible. Leaves the codebase ready for Specification 003 —
Organization Management (Backend P002) without architectural refactoring.

## Summary

Deliver the frontend for Company & Identity: secure JWT authentication with automatic
refresh and protected routes; backend-driven RBAC (permission hooks + route/menu/component
guards); tenant-aware API and routing; company profile view/update; and full user and
employee management (list, search, filter, sort, paginate, view, create, edit, and
status/archive actions).

Technical approach: reuse the Specification 001 shell (Data Router, `AuthLayout`/
`DashboardLayout`, TanStack Query, Zustand, shared `components/ui/` and `components/common/`,
`lib/axios.ts`). Add feature modules under `src/features/` (`auth`, `authorization`,
`company`, `users`, `employees`) plus a small session/tenant layer. All server state flows
through TanStack Query via service classes; Zustand holds only client/session state; forms
use React Hook Form + Zod. Design follows **UI UX Pro Max** (Linear/GitHub/Vercel/Stripe/
Notion/Claude quality), fully responsive and dark-mode compatible.

Design reference: **UI UX Pro Max** for modern SaaS quality. All UI MUST be
responsive-first, accessible, dark-mode compatible, and constitution-compliant.

## Technical Context

**Language/Version**: TypeScript (Strict Mode) on React 19+ with Vite

**Primary Dependencies**: React Router (Data Router), TanStack Query, Axios, Zustand, React
Hook Form, Zod, Tailwind CSS v4, Lucide React, TanStack Table, Sonner, Motion (all already
installed in Specification 001; no new dependencies required)

**Storage**: N/A (frontend only; all persistence via Scrappy Backend P001 REST API). Client
holds only session/token state and cached server data (TanStack Query).

**Testing**: Manual quickstart validation + type check, lint, and production build gates.
Unit/integration tests optional and additive; architecture keeps logic in hooks/services
for testability.

**Target Platform**: Modern browsers (mobile-first responsive web: 320px–1536px+)

**Project Type**: Administrative web application (Scrappy frontend)

**Performance Goals**: Lazy-loaded, code-split feature routes; cached lists with
server-driven pagination; optimistic updates for status/archive actions; single-flight
token refresh

**Constraints**: No direct database access; no Axios in components; no server state in
Zustand; no `any` types; no hardcoded roles/permissions; no cross-tenant data leakage; do
not refactor the Specification 001 foundation

**Scale/Scope**: Company & Identity module only — Company, Authentication, Authorization
(RBAC), Users, Employees, Tenant Isolation. Later roadmap modules (Organization Management
→ Activity Logs) are out of scope.

## Constitution Check

_GATE: Passed before Phase 0. Re-checked after Phase 1 design — all gates satisfied._

| Gate                                             | Status  | Notes                                                                                                              |
| ------------------------------------------------ | ------- | ------------------------------------------------------------------------------------------------------------------ |
| API First (I, VIII)                              | ✅ Pass | All access via `features/*/services/*.service.ts` over shared `apiClient`; no Axios in components                  |
| Type Safety (II, IX)                             | ✅ Pass | Strict TS; Zod schemas per form; types generated/verified from P001 OpenAPI where available; no `any`              |
| Feature Architecture (III, XVII, XVIII)          | ✅ Pass | `src/features/{auth,authorization,company,users,employees}` with `@/` aliases and standard naming                  |
| Routing (IV, V)                                  | ✅ Pass | `createBrowserRouter` extended with company/users/employees routes; nested under `AuthGuard` + `DashboardLayout`   |
| State (VII)                                      | ✅ Pass | TanStack Query for all server state/pagination/mutations; Zustand only for session/theme/UI                        |
| UI & Styling (VI, X, XI, XII, XXIX–XXXIV, XXXIX) | ✅ Pass | Reuse `components/ui/` + `components/common/`; skeletons, empty/error states; visual consistency                   |
| Auth & Security (XIV, XX)                        | ✅ Pass | JWT access+refresh, auto-refresh, protected routes, auto-logout; no secrets; sanitized input; secure token storage |
| Accessibility (XV, XL)                           | ✅ Pass | Labeled forms, keyboard nav, accessible dialogs/focus, 44×44 touch targets                                         |
| Responsive Design (XXVII, XXXI)                  | ✅ Pass | Mobile-first; tables → cards on mobile; forms stack/grid                                                           |
| Page & Table Standards (XXXII, XXXVI)            | ✅ Pass | Standard PageHeader/PageContainer; shared `DataTable` enhanced (additively) for sort/pagination/responsive         |
| Forms & Dashboards (XXXVII, XXXVIII)             | ✅ Pass | RHF + Zod, inline validation, disabled-while-pending, focus first error; dashboard unchanged (placeholder)         |
| AI UI Standards (XXVIII, XL)                     | ✅ Pass | Reuse-first; no duplicate primitives; no new deps; production checklist per screen                                 |
| Performance (XVI, XXXV)                          | ✅ Pass | Lazy routes/code splitting; optimistic updates; animations 150–250ms                                               |
| API Contract (XXVI)                              | ✅ Pass | Consume/generate from Backend P001 OpenAPI; no manual model duplication where contract exists                      |
| Documentation (XXII)                             | ✅ Pass | Spec documents purpose, requirements, API deps, UI states, validation, errors                                      |

No violations. Complexity Tracking not required.

## Project Structure

### Documentation (this feature)

```text
specs/002-company-identity-foundation/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (API + route/guard contracts)
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created here)
```

### Source Code (repository root)

New/extended paths for this feature. **Existing Specification 001 files are extended
additively, not rewritten.**

```text
src/
├── app/
│   ├── guards/
│   │   ├── AuthGuard.tsx           # EXTEND: real auth redirect + location preservation
│   │   └── PermissionGuard.tsx     # NEW: route-level permission gate
│   ├── providers/
│   │   └── SessionProvider.tsx     # NEW: bootstrap session (fetch current identity)
│   ├── pages/
│   │   └── ForbiddenPage.tsx       # NEW: 403 access-denied page
│   └── router/
│       └── routes.tsx              # EXTEND: company/users/employees routes (lazy)
│
├── features/
│   ├── auth/
│   │   ├── components/LoginForm.tsx
│   │   ├── hooks/{useLogin,useLogout,useCurrentUser,useSessionBootstrap}.ts
│   │   ├── pages/LoginPage.tsx      # replaces app/pages/LoginPage shell
│   │   ├── services/auth.service.ts
│   │   ├── validation/login.schema.ts
│   │   └── types/auth.types.ts
│   ├── authorization/
│   │   ├── components/{PermissionGate,RoleGate}.tsx
│   │   ├── hooks/{usePermissions,useHasPermission,useAuthorizedNavigation}.ts
│   │   └── types/authorization.types.ts
│   ├── company/
│   │   ├── components/{CompanyProfileCard,CompanySettingsForm}.tsx
│   │   ├── hooks/{useCompany,useUpdateCompany}.ts
│   │   ├── pages/CompanyPage.tsx
│   │   ├── services/company.service.ts
│   │   ├── validation/company.schema.ts
│   │   └── types/company.types.ts
│   ├── users/
│   │   ├── components/{UserForm,UserFilters,UserStatusDialog,userColumns}.tsx
│   │   ├── hooks/{useUsers,useUser,useCreateUser,useUpdateUser,useUserStatus}.ts
│   │   ├── pages/{UsersListPage,UserDetailPage,UserCreatePage,UserEditPage}.tsx
│   │   ├── services/user.service.ts
│   │   ├── validation/user.schema.ts
│   │   └── types/user.types.ts
│   └── employees/
│       ├── components/{EmployeeForm,EmployeeFilters,EmployeeArchiveDialog,employeeColumns}.tsx
│       ├── hooks/{useEmployees,useEmployee,useCreateEmployee,useUpdateEmployee,useArchiveEmployee}.ts
│       ├── pages/{EmployeesListPage,EmployeeDetailPage,EmployeeCreatePage,EmployeeEditPage}.tsx
│       ├── services/employee.service.ts
│       ├── validation/employee.schema.ts
│       └── types/employee.types.ts
│
├── components/
│   └── common/
│       ├── DataTable.tsx            # EXTEND: sorting, pagination, responsive card mode
│       ├── Pagination.tsx           # NEW: shared pagination control
│       ├── ConfirmDialog.tsx        # NEW: shared confirmation dialog
│       └── FilterBar.tsx            # NEW: shared search + filter container
│
├── lib/
│   ├── axios.ts                     # EXTEND: 401 refresh (single-flight) + tenant scoping
│   └── token-storage.ts            # NEW: remember-session token persistence
│
├── store/
│   ├── auth.store.ts                # EXTEND: currentUser, permissions, tenant/company context
│   └── session.store.ts            # NEW (optional): session/tenant client state
│
├── constants/
│   ├── routes.ts                    # EXTEND: company/users/employees route paths
│   ├── navigation.ts                # EXTEND: permission-driven items
│   └── permissions.ts               # NEW: permission KEY constants (strings only, not rules)
│
├── services/
│   └── http.ts                      # NEW (optional): typed request helpers over apiClient
│
└── types/
    └── pagination.types.ts          # NEW: shared list/pagination/query param types
```

**Structure Decision**: Feature-based layout per Constitution Principle III. Each feature
owns its pages, components, hooks, services, validation, and types. Cross-cutting session/
tenant/auth wiring lives in `app/`, `lib/`, and `store/`. Shared UI stays in
`components/ui/` and `components/common/`.

## Implementation Phases

### Phase 0 — Research & Contract Reconciliation

- **Objective**: Resolve open technical decisions and align to the Backend P001 contract.
- **Scope**: Token storage strategy; refresh single-flight; RBAC representation; tenant
  scoping mechanism; list/query param conventions; shared DataTable enhancement approach.
- **Tasks**: Produce `research.md` decisions; confirm/annotate endpoint paths and payloads
  in `contracts/`; decide OpenAPI generation vs hand-written types.
- **Deliverables**: `research.md`, `contracts/` drafts, `data-model.md`, `quickstart.md`.
- **Dependencies**: Specification 002 approved.
- **Validation**: No unresolved NEEDS CLARIFICATION; decisions traceable to constitution.
- **Risks**: Backend contract drift → mitigate by centralizing types and generating from
  OpenAPI where possible.
- **Exit Criteria**: Design artifacts complete; Constitution re-check passes.

### Phase 1 — Session, Tenant & Auth Infrastructure (Foundation Wiring)

- **Objective**: Establish authenticated, tenant-scoped session infrastructure.
- **Scope**: Extend `auth.store` (currentUser, permissions, tenant/company context);
  `token-storage.ts` with remember-session; extend `lib/axios.ts` request (token + tenant
  header) and response (single-flight 401 refresh, auto-logout, error normalization
  reused); `SessionProvider` to bootstrap identity via `/auth/me`; cache reset on
  logout/identity change.
- **Tasks**: Auth service (login/logout/refresh/me); session bootstrap hook; token storage;
  axios refresh queue; wire providers in `AppProviders`.
- **Deliverables**: `features/auth/services/auth.service.ts`, extended store/axios,
  `SessionProvider`, `token-storage.ts`.
- **Dependencies**: Phase 0.
- **Validation**: Manual: token attached; expired token refreshes once for concurrent 401s;
  failed refresh logs out; no cross-tenant caching.
- **Risks**: Refresh loops/races → single-flight queue + refresh-endpoint exclusion.
- **Exit Criteria**: FR-004, FR-005, FR-006, FR-028, FR-029, FR-030 met at infra level.

### Phase 2 — Authentication UX (US1)

- **Objective**: Deliver login/logout, protected routing, and redirects.
- **Scope**: `LoginForm` (RHF + Zod), `LoginPage` in `features/auth`, real `AuthGuard`
  (redirect + preserve location), redirect-authenticated-away-from-login, logout action in
  `Header`, session-expiration toast.
- **Tasks**: Login mutation + error mapping; guard logic; header user menu + logout; route
  wiring; remember-session toggle.
- **Deliverables**: Working end-to-end auth flow.
- **Dependencies**: Phase 1.
- **Validation**: US1 acceptance scenarios 1–7.
- **Risks**: Flash of protected content → gate render until session resolves.
- **Exit Criteria**: FR-001, FR-002, FR-003, FR-007, FR-008 met; US1 demoable.

### Phase 3 — Authorization / RBAC (US2)

- **Objective**: Enforce backend-driven permissions across routes, menu, and components.
- **Scope**: `usePermissions`/`useHasPermission` hooks; `PermissionGuard` route wrapper;
  `PermissionGate` component; permission-driven `navigation.ts`; `ForbiddenPage`;
  `permissions.ts` key constants (strings only).
- **Tasks**: Read permissions from identity; guard + gate implementation; menu filtering;
  action-level gating in Users/Employees/Company; access-denied UX.
- **Deliverables**: Reusable authorization primitives applied app-wide.
- **Dependencies**: Phase 1 (identity/permissions available). Can start in parallel with
  Phase 2 once identity is loaded.
- **Validation**: US2 acceptance scenarios 1–4; no hardcoded rules.
- **Risks**: Permission flash → loading state until permissions resolve.
- **Exit Criteria**: FR-009–FR-014 met.

### Phase 4 — Shared List/Table/Dialog Enhancements

- **Objective**: Provide reusable, standardized list building blocks (Principle XXXVI).
- **Scope**: Extend `DataTable` (sorting, server pagination hooks, responsive card mode);
  add `Pagination`, `FilterBar`, `ConfirmDialog`; `pagination.types.ts`; a `useListQuery`
  helper for search/filter/sort/page state synced to the URL.
- **Tasks**: Additive DataTable enhancements (no breaking changes); shared components;
  query-state hook.
- **Deliverables**: Shared list infrastructure used by Users and Employees.
- **Dependencies**: Phase 0. Parallelizable with Phases 2–3.
- **Validation**: DataTable renders sortable/paginated on desktop and cards on mobile; no
  regression to Specification 001 usage.
- **Risks**: Breaking existing DataTable consumers → keep new props optional.
- **Exit Criteria**: Shared components ready; existing build still green.

### Phase 5 — Company Management (US4)

- **Objective**: View and update company profile/details/settings.
- **Scope**: `company.service.ts`, `useCompany`/`useUpdateCompany`, `CompanyPage`, profile
  card + settings form (RHF + Zod), permission-gated edit.
- **Tasks**: Fetch/display company; edit form with validation; success/error UX.
- **Deliverables**: `/company` screen.
- **Dependencies**: Phases 1, 3, 4.
- **Validation**: US4 acceptance scenarios 1–3.
- **Risks**: Partial settings schema → validate per backend, format-only client rules.
- **Exit Criteria**: FR-015, FR-016 met.

### Phase 6 — User Management (US3)

- **Objective**: Full user CRUD + status + list controls.
- **Scope**: `user.service.ts`, hooks (`useUsers`/`useUser`/`useCreateUser`/`useUpdateUser`/
  `useUserStatus`), pages (list/detail/create/edit), `UserForm`, `UserFilters`,
  `UserStatusDialog`, `userColumns`; optimistic status toggle; self-deactivation guard.
- **Tasks**: List with search/filter/sort/pagination; detail; create/edit forms;
  activate/deactivate with confirm; permission-gated actions.
- **Deliverables**: `/users`, `/users/new`, `/users/:id`, `/users/:id/edit`.
- **Dependencies**: Phases 1, 3, 4.
- **Validation**: US3 acceptance scenarios 1–5.
- **Risks**: Optimistic failure → rollback + error toast.
- **Exit Criteria**: FR-017–FR-022 met.

### Phase 7 — Employee Management (US5)

- **Objective**: Full employee CRUD + archive + optional user link.
- **Scope**: `employee.service.ts`, hooks, pages (list/detail/create/edit), `EmployeeForm`,
  `EmployeeFilters`, `EmployeeArchiveDialog`, `employeeColumns`; optional user association.
- **Tasks**: List with search/filter/pagination; detail; create/edit; archive with confirm;
  user-link control where supported.
- **Deliverables**: `/employees`, `/employees/new`, `/employees/:id`, `/employees/:id/edit`.
- **Dependencies**: Phases 1, 3, 4, and Phase 6 (reuse user-link patterns).
- **Validation**: US5 acceptance scenarios 1–4.
- **Risks**: Employee↔User coupling → expose link only where backend supports it.
- **Exit Criteria**: FR-023–FR-027 met.

### Phase 8 — Polish, Validation & Readiness

- **Objective**: Production-quality pass and Specification 003 readiness.
- **Scope**: Responsive/dark-mode/accessibility audit per screen; empty/loading/error state
  verification; toast consistency; run type check, lint, and production build; quickstart
  walkthrough; update navigation.
- **Tasks**: Fix lints/types; verify all UI states across breakpoints; confirm no
  cross-tenant leakage; finalize docs.
- **Deliverables**: Green build; completed production checklist; readiness confirmed.
- **Dependencies**: Phases 2–7.
- **Validation**: SC-001–SC-009; Production Quality Checklist (Principle XL).
- **Risks**: Scope creep into Spec 003 → enforce out-of-scope boundary.
- **Exit Criteria**: All spec acceptance criteria met; ready for `/speckit-tasks` and Spec 003.

## Parallelization

```text
Phase 0 (Research)
    ↓
Phase 1 (Session/Tenant/Auth infra)
    ↓
    ├─ Phase 2 (Auth UX) ─┐
    ├─ Phase 3 (RBAC) ────┤   (2 & 3 overlap once identity loads)
    └─ Phase 4 (Shared list infra)  ← can start right after Phase 0/1, parallel to 2 & 3
                          ↓
    ┌─────────────────────┼─────────────────────┐
    Phase 5 (Company)   Phase 6 (Users)   → Phase 7 (Employees, after 6)
                          ↓
                    Phase 8 (Polish & Readiness)
```

- **Maximum parallelism**: Phase 4 (shared list infra) runs alongside Phases 2–3. Company
  (5) and Users (6) can proceed in parallel once Phases 1/3/4 land; Employees (7) follows
  Users to reuse patterns.

## Specification 003 Readiness Checklist

After Phase 8, the following MUST exist for Organization Management (Backend P002) without
refactoring:

- [ ] Authenticated, tenant-scoped `apiClient` with working refresh + auto-logout
- [ ] `auth.store` exposing currentUser, permissions, and tenant/company context
- [ ] Reusable authorization primitives (`usePermissions`, `PermissionGuard`,
      `PermissionGate`) applied via data, not hardcoded rules
- [ ] Permission-driven navigation ready to receive new module entries
- [ ] Enhanced shared `DataTable` + `Pagination` + `FilterBar` + `ConfirmDialog` reusable
      by new CRUD modules
- [ ] `useListQuery` (URL-synced search/filter/sort/page) reusable
- [ ] Feature-module scaffold pattern (`features/<module>/{components,hooks,pages,services,validation,types}`)
      demonstrated by users/employees
- [ ] Service-class + TanStack Query pattern demonstrated end-to-end

## Complexity Tracking

No constitution violations; no complexity deviations to justify.

## Artifacts

| Artifact   | Path                             | Status                   |
| ---------- | -------------------------------- | ------------------------ |
| Research   | [research.md](./research.md)     | Complete                 |
| Data Model | [data-model.md](./data-model.md) | Complete                 |
| Contracts  | [contracts/](./contracts/)       | Complete                 |
| Quickstart | [quickstart.md](./quickstart.md) | Complete                 |
| Tasks      | tasks.md                         | Pending `/speckit-tasks` |
