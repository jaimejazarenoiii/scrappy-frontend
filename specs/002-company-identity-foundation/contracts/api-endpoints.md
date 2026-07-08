# API Contract: Backend P001 (Company & Identity)

Consumed exclusively through service classes over the shared `apiClient`
(`src/lib/axios.ts`). Components MUST NOT call Axios directly (Constitution VIII). Paths and
payloads below are the assumed P001 conventions and MUST be reconciled with the published
OpenAPI contract; generate types from OpenAPI where available (Principle XXVI).

Conventions: JSON; `Authorization: Bearer <accessToken>` on authenticated requests (added by
the request interceptor); tenant scoping applied centrally; list endpoints accept
`search`, `filter[...]`, `sort`, `page`, `pageSize` and return `PaginatedResponse<T>`.

## Auth service (`features/auth/services/auth.service.ts`)

| Method    | Endpoint             | Request                              | Response                                     | Notes                                  |
| --------- | -------------------- | ------------------------------------ | -------------------------------------------- | -------------------------------------- |
| `login`   | `POST /auth/login`   | `{ identifier, password, remember }` | `{ accessToken, refreshToken?, expiresIn? }` | Establishes session (US1)              |
| `logout`  | `POST /auth/logout`  | —                                    | `204`                                        | Invalidates refresh/session            |
| `refresh` | `POST /auth/refresh` | `{ refreshToken? }` (or cookie)      | `{ accessToken, refreshToken?, expiresIn? }` | Single-flight; excluded from 401 retry |
| `me`      | `GET /auth/me`       | —                                    | `CurrentUser` (roles, permissions, tenant)   | Bootstraps session + RBAC              |

## Company service (`features/company/services/company.service.ts`)

| Method   | Endpoint                    | Request            | Response  |
| -------- | --------------------------- | ------------------ | --------- |
| `get`    | `GET /company`              | —                  | `Company` |
| `update` | `PUT /company` (or `PATCH`) | `Partial<Company>` | `Company` |

## User service (`features/users/services/user.service.ts`)

| Method       | Endpoint                      | Request           | Response                  |
| ------------ | ----------------------------- | ----------------- | ------------------------- |
| `list`       | `GET /users`                  | `ListQueryParams` | `PaginatedResponse<User>` |
| `get`        | `GET /users/:id`              | —                 | `User`                    |
| `create`     | `POST /users`                 | `CreateUserInput` | `User`                    |
| `update`     | `PUT /users/:id` (or `PATCH`) | `UpdateUserInput` | `User`                    |
| `activate`   | `PATCH /users/:id/activate`   | —                 | `User`                    |
| `deactivate` | `PATCH /users/:id/deactivate` | —                 | `User`                    |

## Employee service (`features/employees/services/employee.service.ts`)

| Method    | Endpoint                          | Request               | Response                      |
| --------- | --------------------------------- | --------------------- | ----------------------------- |
| `list`    | `GET /employees`                  | `ListQueryParams`     | `PaginatedResponse<Employee>` |
| `get`     | `GET /employees/:id`              | —                     | `Employee`                    |
| `create`  | `POST /employees`                 | `CreateEmployeeInput` | `Employee`                    |
| `update`  | `PUT /employees/:id` (or `PATCH`) | `UpdateEmployeeInput` | `Employee`                    |
| `archive` | `PATCH /employees/:id/archive`    | —                     | `Employee`                    |

## Error contract

Errors are normalized by the response interceptor into `{ message, status, code? }`
(existing Spec 001 behavior). Frontend mapping:

| Status        | Handling                                                           |
| ------------- | ------------------------------------------------------------------ |
| 401           | Attempt single-flight refresh; on failure clear session → `/login` |
| 403           | Show access-denied / `ForbiddenPage`; never expose backend detail  |
| 404           | Record-not-found UX with link back to list                         |
| 400 / 422     | Map field errors to form; summary toast; focus first invalid field |
| 5xx / network | Friendly retryable error; log centrally                            |

## TanStack Query keys

| Key                     | Query                                   |
| ----------------------- | --------------------------------------- |
| `['auth','me']`         | current identity                        |
| `['company']`           | company record                          |
| `['users', params]`     | users list (params = `ListQueryParams`) |
| `['users', id]`         | single user                             |
| `['employees', params]` | employees list                          |
| `['employees', id]`     | single employee                         |

Mutations invalidate the relevant list/detail keys; status/archive use optimistic updates
with rollback. All keys are cleared on logout/identity change (tenant isolation).
