# Route & Guard Contract: Company & Identity Foundation

Extends the Specification 001 Data Router (`src/app/router/routes.tsx`) additively. All
authenticated routes render under `AuthGuard` → `DashboardLayout`. Feature pages are
lazy-loaded (code splitting).

## Route paths (`src/constants/routes.ts`)

| Constant         | Path                  | Guard                                       | Page                                 |
| ---------------- | --------------------- | ------------------------------------------- | ------------------------------------ |
| `login`          | `/login`              | redirect-if-authenticated                   | `features/auth/pages/LoginPage`      |
| `dashboard`      | `/dashboard`          | Auth                                        | existing `DashboardPage` (unchanged) |
| `company`        | `/company`            | Auth + `PermissionGuard('company.view')`    | `features/company/pages/CompanyPage` |
| `users`          | `/users`              | Auth + `PermissionGuard('user.view')`       | `UsersListPage`                      |
| `userNew`        | `/users/new`          | Auth + `PermissionGuard('user.create')`     | `UserCreatePage`                     |
| `userDetail`     | `/users/:id`          | Auth + `PermissionGuard('user.view')`       | `UserDetailPage`                     |
| `userEdit`       | `/users/:id/edit`     | Auth + `PermissionGuard('user.update')`     | `UserEditPage`                       |
| `employees`      | `/employees`          | Auth + `PermissionGuard('employee.view')`   | `EmployeesListPage`                  |
| `employeeNew`    | `/employees/new`      | Auth + `PermissionGuard('employee.create')` | `EmployeeCreatePage`                 |
| `employeeDetail` | `/employees/:id`      | Auth + `PermissionGuard('employee.view')`   | `EmployeeDetailPage`                 |
| `employeeEdit`   | `/employees/:id/edit` | Auth + `PermissionGuard('employee.update')` | `EmployeeEditPage`                   |
| `forbidden`      | `/403`                | Auth                                        | `app/pages/ForbiddenPage`            |

Permission keys above are illustrative constants (`constants/permissions.ts`) reconciled
with backend keys; they are data, not hardcoded rules.

## AuthGuard contract (`src/app/guards/AuthGuard.tsx`)

**Current (Spec 001)**: renders `<Outlet />` unconditionally.

**This spec**:

- While `auth.store.status === 'loading'` (bootstrap in progress) → render a loading state
  (no unauthorized flash).
- If not authenticated → `<Navigate to="/login" replace state={{ from: location }} />`.
- If authenticated → `<Outlet />`.
- The `/login` route redirects to `/dashboard` when already authenticated.
- After successful login → redirect to `location.state.from ?? '/dashboard'`.

## PermissionGuard contract (`src/app/guards/PermissionGuard.tsx`)

- Props: `permission: string | string[]`, optional `mode: 'all' | 'any'` (default `all`).
- While permissions unresolved → loading state.
- If the user lacks the permission → render access-denied (or `<Navigate to="/403" />`).
- Otherwise → `<Outlet />`.

## PermissionGate contract (`features/authorization/components/PermissionGate.tsx`)

- Props: `permission: string | string[]`, `mode?`, `fallback?: ReactNode`,
  `children: ReactNode`.
- Renders `children` only when authorized; otherwise renders `fallback` (default: nothing).
- Used for menu items, action buttons (create/edit/activate/archive), and component-level
  visibility.

## Session bootstrap contract (`src/app/providers/SessionProvider.tsx`)

- On mount: if a persisted refresh token/session exists, set `status = 'loading'`, attempt
  `GET /auth/me`, then populate `currentUser`, `permissions`, and `tenant`; set `status`
  accordingly. On failure, clear session and set `unauthenticated`.
- Wraps the app inside `AppProviders` (after Query/Theme providers), before the router.

## Tenant isolation contract

- Request interceptor attaches tenant context if the backend requires an explicit header;
  otherwise the JWT carries tenant.
- On logout or identity/tenant change, `queryClient.clear()` runs to prevent cross-tenant
  cache reuse.
- No tenant-switching UI is exposed in this spec (future-ready only).
