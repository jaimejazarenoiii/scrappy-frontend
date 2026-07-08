# Phase 1 Data Model: Company & Identity Foundation

Frontend-facing models consumed from Backend P001. Field names are the assumed contract and
MUST be reconciled with the published OpenAPI schema. Types live in each feature's `types/`
(or generated from OpenAPI); shared list types live in `src/types/pagination.types.ts`.

## Client/Session State (Zustand — `auth.store`)

Extends the Specification 001 placeholder store. **Client state only** — server entities
stay in TanStack Query.

| Field             | Type                                                          | Description                                                            |
| ----------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `accessToken`     | `string \| null`                                              | In-memory JWT access token                                             |
| `refreshToken`    | `string \| null`                                              | Refresh token (mirrors secure storage; may be null if httpOnly cookie) |
| `isAuthenticated` | `boolean`                                                     | Derived from valid session                                             |
| `rememberSession` | `boolean`                                                     | Controls persistence backend (local vs session storage)                |
| `currentUser`     | `CurrentUser \| null`                                         | Hydrated once at bootstrap from `/auth/me`                             |
| `permissions`     | `string[]`                                                    | Backend-provided permission keys (opaque)                              |
| `tenant`          | `TenantContext \| null`                                       | Active tenant/company context                                          |
| `status`          | `'idle' \| 'loading' \| 'authenticated' \| 'unauthenticated'` | Bootstrap/guard state to avoid unauthorized flashes                    |

**Actions**: `setSession(payload)`, `setTokens(access, refresh)`, `clearSession()` (also
resets Query cache), `setCurrentUser(user)`, `setPermissions(list)`.

## Shared List Types (`src/types/pagination.types.ts`)

```text
ListQueryParams {
  search?: string
  filters?: Record<string, string | string[]>
  sort?: { field: string; direction: 'asc' | 'desc' }
  page: number
  pageSize: number
}

PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}
```

## Server Entities (TanStack Query)

### CurrentUser (Identity) — `GET /auth/me`

| Field         | Type                     | Notes                     |
| ------------- | ------------------------ | ------------------------- |
| `id`          | `string`                 | User id                   |
| `name`        | `string`                 | Display name              |
| `email`       | `string`                 | Login identifier          |
| `roles`       | `Role[]`                 | Assigned roles            |
| `permissions` | `string[]`               | Effective permission keys |
| `tenant`      | `TenantContext`          | Company/tenant context    |
| `status`      | `'active' \| 'inactive'` | Account status            |

### TenantContext

| Field         | Type     | Notes                    |
| ------------- | -------- | ------------------------ |
| `companyId`   | `string` | Active company/tenant id |
| `companyName` | `string` | Display name             |

### Company (Tenant) — `GET/PUT /company`

| Field                     | Type     | Notes                                                |
| ------------------------- | -------- | ---------------------------------------------------- |
| `id`                      | `string` | Company id (tenant)                                  |
| `name`                    | `string` | Company name (required)                              |
| `profile`                 | `object` | Profile details (address, contact, etc. per backend) |
| `settings`                | `object` | Company settings (per backend)                       |
| `createdAt` / `updatedAt` | `string` | ISO timestamps                                       |

### User — `/users`

| Field                     | Type                     | Notes                                  |
| ------------------------- | ------------------------ | -------------------------------------- |
| `id`                      | `string`                 | User id                                |
| `name`                    | `string`                 | Required                               |
| `email`                   | `string`                 | Required, unique (server-enforced)     |
| `roleIds`                 | `string[]`               | Assigned role ids (from backend roles) |
| `status`                  | `'active' \| 'inactive'` | Toggled via activate/deactivate        |
| `employeeId?`             | `string \| null`         | Optional link to an Employee           |
| `createdAt` / `updatedAt` | `string`                 | ISO timestamps                         |

**State transitions**: `active ⇄ inactive` via `PATCH /users/:id/activate|deactivate`.
Current user cannot deactivate/delete self (FR-022).

### Employee — `/employees`

| Field                     | Type                     | Notes                                                |
| ------------------------- | ------------------------ | ---------------------------------------------------- |
| `id`                      | `string`                 | Employee id                                          |
| `name`                    | `string`                 | Required                                             |
| `contact?`                | `object`                 | Phone/email/etc. (validated for format when present) |
| `position?`               | `string`                 | Role/title (informational; not RBAC)                 |
| `userId?`                 | `string \| null`         | Optional association to a User account               |
| `status`                  | `'active' \| 'archived'` | Archive action                                       |
| `createdAt` / `updatedAt` | `string`                 | ISO timestamps                                       |

**State transitions**: `active → archived` via `PATCH /employees/:id/archive`; archived
excluded from default active list.

### Role

| Field         | Type       | Notes                   |
| ------------- | ---------- | ----------------------- |
| `id`          | `string`   | Role id                 |
| `name`        | `string`   | Display name            |
| `permissions` | `string[]` | Permission keys granted |

### AuthTokens — `/auth/login`, `/auth/refresh`

| Field           | Type     | Notes                                  |
| --------------- | -------- | -------------------------------------- |
| `accessToken`   | `string` | Short-lived JWT                        |
| `refreshToken?` | `string` | Present unless httpOnly cookie is used |
| `expiresIn?`    | `number` | Optional access token TTL (seconds)    |

## Relationships

- **Company (1) ── (N) User**: all users belong to the active company/tenant.
- **Company (1) ── (N) Employee**: all employees belong to the tenant.
- **Employee (0..1) ── (0..1) User**: optional association where backend supports it.
- **User (N) ── (N) Role**; **Role (N) ── (N) Permission**: RBAC source of truth is the
  backend; frontend consumes effective `permissions` on `CurrentUser`.

## Validation (Zod schemas)

| Schema   | File                                               | Key rules                                                                  |
| -------- | -------------------------------------------------- | -------------------------------------------------------------------------- |
| Login    | `features/auth/validation/login.schema.ts`         | identifier required/valid; password required; remember boolean             |
| Company  | `features/company/validation/company.schema.ts`    | name required; profile/settings per backend; format-only                   |
| User     | `features/users/validation/user.schema.ts`         | name required; email required+valid; roleIds required; optional employeeId |
| Employee | `features/employees/validation/employee.schema.ts` | name required; contact format when present; optional userId                |

Server validation is authoritative; client validation is UX-only (Principle XX). Server
field errors map back to form fields.
