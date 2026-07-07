# Data Model: Initialize Scrappy Web

**Feature**: 001-initialize-scrappy-web
**Date**: 2026-07-07

This feature has no business entities or backend data. The data model covers **client-side
structural types** and **store shapes** that form the application foundation.

---

## Client State Entities

### ThemePreference

Represents the user's visual theme choice.

| Field           | Type                            | Description                            | Validation         |
| --------------- | ------------------------------- | -------------------------------------- | ------------------ |
| `mode`          | `'light' \| 'dark' \| 'system'` | Active theme mode                      | Required; enum     |
| `resolvedTheme` | `'light' \| 'dark'`             | Computed theme after system resolution | Derived; read-only |

**Persistence**: `localStorage` key `scrappy-theme`

**State transitions**:

```text
light ←→ dark ←→ system
         ↓
  resolvedTheme updates via matchMedia when mode === 'system'
```

---

### UIState

Ephemeral layout UI state (Zustand `ui.store`).

| Field              | Type      | Description                               | Default |
| ------------------ | --------- | ----------------------------------------- | ------- |
| `sidebarCollapsed` | `boolean` | Tablet/desktop sidebar collapsed to icons | `false` |
| `mobileNavOpen`    | `boolean` | Mobile drawer navigation open             | `false` |

**Actions**:

- `toggleSidebar()` — flip `sidebarCollapsed`
- `setSidebarCollapsed(value)` — explicit set
- `openMobileNav()` / `closeMobileNav()` / `toggleMobileNav()`

**Persistence**: None (session-only)

---

### AuthState (Structure Only)

Placeholder store for Specification 002 (Company & Identity Foundation). **No logic in
this phase.**

| Field             | Type             | Description                 | Default |
| ----------------- | ---------------- | --------------------------- | ------- |
| `accessToken`     | `string \| null` | JWT access token            | `null`  |
| `refreshToken`    | `string \| null` | JWT refresh token           | `null`  |
| `isAuthenticated` | `boolean`        | Derived from token presence | `false` |

**Actions** (stubs only):

- `setTokens(access, refresh)` — store tokens; set `isAuthenticated: true`
- `clearTokens()` — reset to defaults

**Persistence**: Deferred to Specification 002 (likely `sessionStorage` or secure cookie
pattern; must be tenant-isolation ready)

---

## Configuration Entities

### NavigationItem

Sidebar and header navigation entry.

| Field      | Type                | Description               |
| ---------- | ------------------- | ------------------------- |
| `id`       | `string`            | Unique identifier         |
| `label`    | `string`            | Display text              |
| `href`     | `string`            | Route path                |
| `icon`     | `LucideIcon`        | Icon component reference  |
| `children` | `NavigationItem[]?` | Nested items for sections |
| `disabled` | `boolean?`          | Coming-soon items         |
| `badge`    | `string?`           | Optional count label      |

**Initial navigation tree**:

```text
Dashboard          → /dashboard (active)
Administration     → /coming-soon (placeholder)
  (future children in later specs)
Settings           → /coming-soon
```

Only the Dashboard entry is active in this phase. Roadmap modules (Company & Identity,
Organization Management, Workforce Management, Transaction Management, Transaction
Settlement, Trip Management, Expense Management, Analytics, Reports, Activity Logs) are
added by their respective specifications and MUST NOT link to business pages now.

---

### RouteDefinition

Internal route metadata (not React Router types).

| Field    | Type                              | Description                      |
| -------- | --------------------------------- | -------------------------------- |
| `path`   | `string`                          | URL path                         |
| `layout` | `'auth' \| 'dashboard' \| 'none'` | Layout wrapper                   |
| `lazy`   | `boolean`                         | Code-split page component        |
| `guard`  | `'auth' \| 'none'`                | Route guard (stub in this phase) |
| `title`  | `string`                          | Document title / breadcrumb      |

**Initial routes**:

| Path         | Layout    | Guard       | Title                        |
| ------------ | --------- | ----------- | ---------------------------- |
| `/`          | none      | none        | — (redirect to `/dashboard`) |
| `/login`     | auth      | none        | Sign In                      |
| `/dashboard` | dashboard | auth (stub) | Dashboard                    |
| `*`          | none      | none        | Page Not Found               |

---

## API Client Configuration

Not a store entity — configuration object for Axios instance.

| Field                  | Type     | Value                               | Source   |
| ---------------------- | -------- | ----------------------------------- | -------- |
| `baseURL`              | `string` | `import.meta.env.VITE_API_BASE_URL` | `.env`   |
| `timeout`              | `number` | `30000` (ms)                        | constant |
| `headers.Content-Type` | `string` | `application/json`                  | default  |

**Interceptor contracts** (stubs):

- **Request**: Read `accessToken` from `auth.store`; attach `Authorization: Bearer` when
  token exists (implementation in Spec 002)
- **Response error**: Normalize to `{ message, status, code }`; 401 triggers refresh
  flow placeholder (Spec 002)

---

## Query Client Defaults

TanStack Query configuration (not persisted).

| Option                 | Value            | Rationale                   |
| ---------------------- | ---------------- | --------------------------- |
| `staleTime`            | `5 * 60 * 1000`  | Admin data reasonably fresh |
| `gcTime`               | `10 * 60 * 1000` | Keep unused cache 10 min    |
| `retry`                | `1`              | Single retry on failure     |
| `refetchOnWindowFocus` | `true`           | Refresh on tab return       |

---

## Shared Type Exports

Centralized in `src/types/`:

```text
types/
├── theme.types.ts       → ThemeMode, ResolvedTheme
├── navigation.types.ts  → NavigationItem, NavigationSection
└── api.types.ts         → ApiError, ApiResponse<T> (foundation)
```

**ApiError** (for interceptor normalization):

| Field     | Type      |
| --------- | --------- |
| `message` | `string`  |
| `status`  | `number`  |
| `code`    | `string?` |

---

## Relationships

```text
ThemeProvider ──reads──► theme.store ──persists──► localStorage
DashboardLayout ──reads──► ui.store ──controls──► Sidebar/Drawer
AuthGuard (stub) ──reads──► auth.store
axios interceptor (stub) ──reads──► auth.store
QueryProvider ──uses──► query-client.ts
Navigation ──renders──► NavigationItem[] from constants/navigation.ts
```

No database entities. No API request/response models until Spec 002+.
