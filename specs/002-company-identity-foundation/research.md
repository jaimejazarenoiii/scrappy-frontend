# Phase 0 Research: Company & Identity Foundation

All decisions comply with the Scrappy Web Constitution and reuse the Specification 001
foundation. No new dependencies are introduced.

## R-001 — Token storage & "remember session"

- **Decision**: Keep the access token in memory (Zustand `auth.store`). Persist the refresh
  token (and a "remember session" flag) using a small `lib/token-storage.ts` abstraction:
  `localStorage` when "remember session" is enabled, `sessionStorage` otherwise. If the
  backend issues an httpOnly refresh cookie, prefer that and skip JS-side refresh
  persistence (the abstraction hides this).
- **Rationale**: Minimizes XSS token exposure (access token never persisted), supports
  session restoration on reload (Constitution XIV), and isolates storage behind one module
  so the mechanism can change without touching features.
- **Alternatives considered**: Access token in localStorage (rejected — larger XSS blast
  radius); all-cookie approach (deferred — depends on backend support, abstraction keeps it
  swappable).

## R-002 — Automatic refresh & single-flight

- **Decision**: Implement 401 handling in the existing `apiClient` response interceptor
  (replacing the Spec 001 TODO). Use a module-level in-flight refresh promise so concurrent
  401s await a single `POST /auth/refresh`, then retry their original requests. Exclude the
  refresh and login endpoints from this logic to prevent loops. On refresh failure, clear
  the session once and redirect to `/login`.
- **Rationale**: Satisfies FR-005/FR-006 and the "refresh race"/"refresh loop" edge cases
  without per-component logic (Constitution VIII).
- **Alternatives considered**: Per-request retry wrappers (rejected — duplicative);
  library-based refresh (rejected — no new dependency, straightforward to implement).

## R-003 — RBAC representation (backend-driven)

- **Decision**: Treat permissions as opaque backend-provided strings, stored on
  `auth.store` after fetching the current identity (`/auth/me`). Expose `usePermissions()`
  and `useHasPermission(key | keys, mode)` hooks; gate routes with `PermissionGuard`,
  components/actions with `PermissionGate`, and menu items via a permission field on
  navigation config. Centralize known keys in `constants/permissions.ts` as string
  constants only (not rules).
- **Rationale**: FR-009/FR-010; no hardcoded rules; UI reflects refetched permissions
  automatically (FR-014).
- **Alternatives considered**: Client-side role→permission mapping (rejected — hardcodes
  policy); route metadata only (insufficient for component/action gating).

## R-004 — Tenant isolation & scoping

- **Decision**: Derive tenant/company context from the current identity and hold it in
  `auth.store`. Apply tenant scoping centrally in the `apiClient` request interceptor
  (attach tenant header/claim if the backend requires it; otherwise the JWT already encodes
  tenant). Clear all TanStack Query cache on logout and on identity/tenant change. No
  tenant-switching UI in this spec; the context object and cache-reset seam make switching
  future-ready.
- **Rationale**: FR-028–FR-031; prevents cross-tenant leakage (edge case) with a single
  choke point.
- **Alternatives considered**: Per-service tenant params (rejected — duplicative,
  leak-prone); tenant in route path (deferred — not required by backend now).

## R-005 — List query params (search/filter/sort/pagination)

- **Decision**: Standardize a `ListQueryParams` shape (`search`, `filters`, `sort`,
  `page`, `pageSize`) and a `PaginatedResponse<T>` (`data`, `total`, `page`, `pageSize`).
  Add a `useListQuery` hook that syncs this state to the URL search params (deep-linkable,
  Constitution IV) and feeds TanStack Query keys.
- **Rationale**: Consistent, bookmarkable list state; reused by Users and Employees; ready
  for future modules.
- **Alternatives considered**: Local component state (rejected — not shareable/bookmarkable);
  cursor pagination (deferred — adopt if backend uses cursors; shape allows swapping).

## R-006 — Shared DataTable enhancement (additive)

- **Decision**: Enhance `components/common/DataTable.tsx` with optional sorting, an optional
  server-driven pagination slot, and an optional responsive "card mode" for mobile. All new
  props are optional so the existing Specification 001 usage keeps working unchanged. Add a
  standalone `Pagination` control and a `FilterBar` container rather than embedding them.
- **Rationale**: Constitution XXXVI (standardized table) without refactoring the foundation;
  backward-compatible.
- **Alternatives considered**: New separate table component (rejected — duplication,
  Principle XXIX); rewrite DataTable (rejected — violates "do not refactor foundation").

## R-007 — Auth/session client state location

- **Decision**: Extend the existing `auth.store` to hold `currentUser`, `permissions`, and
  `tenant/company` context alongside tokens. Optionally add a thin `session.store.ts` only
  if separation improves clarity; default is to keep one cohesive auth/session store.
- **Rationale**: Single source of client session truth; avoids duplication; no server state
  in Zustand (Constitution VII — server entities remain in TanStack Query; only identity
  needed synchronously for guards lives in the store, hydrated once at bootstrap).
- **Alternatives considered**: Store current user only in Query cache (rejected — guards
  need synchronous access during render/redirect decisions).

## R-008 — Login page location & shared confirmation dialog

- **Decision**: Move the login UI into `features/auth/pages/LoginPage.tsx` and update the
  router import; the Spec 001 `app/pages/LoginPage.tsx` shell is replaced (feature owns its
  page per Principle III). Add a shared `ConfirmDialog` in `components/common/` built on the
  existing `dialog`/`sheet` primitives for activate/deactivate/archive confirmations.
- **Rationale**: Feature ownership; reuse of UI primitives; consistent destructive-action UX
  (FR-038).
- **Alternatives considered**: Keep LoginPage in `app/pages` (rejected — belongs to the auth
  feature); per-feature confirm dialogs (rejected — duplication).

## R-009 — API type generation

- **Decision**: Generate or verify request/response models from the Backend P001 OpenAPI
  contract when available (Constitution XXVI); otherwise hand-write types in each feature's
  `types/` and reconcile during implementation. Keep endpoint paths in service classes.
- **Rationale**: Avoids manual model drift; centralizes contract dependence.
- **Alternatives considered**: Manual duplication everywhere (rejected — Principle XXVI).

## Summary of resolved unknowns

All Technical Context items are resolved; no `NEEDS CLARIFICATION` remain. Exact P001
endpoint payloads are treated as a dependency to reconcile against the published OpenAPI
contract during implementation; service classes and centralized types isolate that risk.
