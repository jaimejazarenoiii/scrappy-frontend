# Quickstart & Validation: Company & Identity Foundation

Validation guide for Specification 002. Builds on the Specification 001 foundation; uses
**pnpm** only. Implementation details live in `tasks.md` (Phase 2) — this is a run/validate
guide.

## Prerequisites

- Specification 001 foundation present and building (`pnpm build` green).
- Backend P001 reachable; set `VITE_API_BASE_URL` in `.env` to its base URL.
- Valid test credentials and at least one seeded company/tenant.

## Setup

```bash
pnpm install
cp .env.example .env   # set VITE_API_BASE_URL to the Backend P001 URL
pnpm dev
```

## Validation scenarios

### 1. Authentication (US1)

- Visit a protected URL (e.g. `/users`) while signed out → redirected to `/login`.
- Sign in with valid credentials → redirected back to `/users` (or `/dashboard`).
- Reload the browser → still signed in (with "remember session").
- Let the access token expire, trigger an API call → transparent refresh, request succeeds.
- Invalidate/expire the refresh token → session cleared, "session expired" toast, redirect
  to `/login`.
- Log out → session cleared, redirected to `/login`; back button cannot reach protected
  pages.

### 2. Authorization / RBAC (US2)

- Sign in as a user missing `user.view` → `/users` shows access-denied / redirects to `/403`.
- Confirm the sidebar hides menu entries the user is not permitted to see.
- Confirm "Create User" / "Edit" / "Deactivate" actions are hidden without their
  permissions.
- Change permissions on the backend, refetch identity → UI updates with no code change.

### 3. Company (US4)

- Open `/company` → skeleton, then company profile/details/settings.
- Edit and save valid changes → success toast; values persist after reload.
- Force a save failure → friendly error; previous values intact.

### 4. Users (US3)

- `/users` → skeleton then paginated, sortable table (desktop) / cards (mobile).
- Search and filter → list updates; distinct empty states for "no users" vs "no results".
- Create a user with valid data → success toast; appears in list.
- Submit an invalid form → inline errors; first invalid field focused; submit disabled while
  pending.
- Deactivate a user → confirmation dialog → optimistic status change (rolls back on failure).
- Attempt to deactivate your own account → blocked.

### 5. Employees (US5)

- `/employees` → skeleton then paginated list; empty state when none.
- Create/edit an employee with valid data → success toast.
- Link an employee to a user (where supported) → association saved and shown.
- Archive an employee → confirmation → removed from default active list.

### 6. Responsive & theme

- Verify each screen at 320px, 768px, 1024px, 1280px+, and 1536px+ — no horizontal overflow,
  tables become cards on mobile, dialogs become sheets where appropriate.
- Toggle light/dark/system theme on every screen.

## Quality gates

```bash
pnpm typecheck   # zero errors
pnpm lint        # zero errors
pnpm build       # production build succeeds
```

## Specification 003 readiness

Confirm before starting Organization Management (Backend P002):

- [ ] Authenticated, tenant-scoped `apiClient` with working refresh + auto-logout
- [ ] `auth.store` exposes currentUser, permissions, tenant/company context
- [ ] `usePermissions` / `PermissionGuard` / `PermissionGate` reusable and data-driven
- [ ] Permission-driven navigation ready for new module entries
- [ ] Enhanced `DataTable` + `Pagination` + `FilterBar` + `ConfirmDialog` reusable
- [ ] `useListQuery` (URL-synced search/filter/sort/page) reusable
- [ ] Feature-module scaffold pattern demonstrated by users/employees

## Troubleshooting

| Issue                              | Resolution                                                                            |
| ---------------------------------- | ------------------------------------------------------------------------------------- |
| Infinite redirect to `/login`      | Ensure refresh endpoint is excluded from 401 retry; check bootstrap `status` handling |
| Unauthorized flash before redirect | Gate rendering on `auth.store.status !== 'loading'`                                   |
| Cross-tenant data after re-login   | Ensure `queryClient.clear()` runs on logout/identity change                           |
| 401 loop on refresh                | Single-flight refresh promise; do not refresh on `/auth/refresh` failures             |
| CORS/network errors                | Verify `VITE_API_BASE_URL` and backend CORS config                                    |
