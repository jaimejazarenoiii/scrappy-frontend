# Quickstart & Validation: Organization Management

Validation guide for Specification 003. Builds on Specifications 001–002; uses **pnpm**
only. Implementation details live in `tasks.md` — this is a run/validate guide.

## Prerequisites

- Specifications 001–002 implemented; `pnpm build` green.
- Backend P002 reachable at `VITE_API_BASE_URL` (e.g. `http://localhost:3000/api/v1`).
- Seed accounts available (see Scrappy API reference):

| Email                   | Role     | Password      |
| ----------------------- | -------- | ------------- |
| `owner@example.com`     | OWNER    | `password123` |
| `manager@example.com`   | MANAGER  | `password123` |
| `employee1@example.com` | EMPLOYEE | `password123` |

## Setup

```bash
pnpm install
cp .env.example .env   # VITE_API_BASE_URL=http://localhost:3000/api/v1
pnpm dev
```

## Validation scenarios

### 1. Navigation & authorization (US4)

- Sign in as **owner** → sidebar shows Branches, Warehouses, Vehicles.
- Sign in as **employee** → organization menu items visible if `*.view` permissions granted;
  create/edit/archive actions hidden.
- Navigate directly to `/warehouses` without permission → `/403` or access denied.
- Use browser back/forward between organization pages → layout intact, URL state preserved.

### 2. Branches (US1)

- `/branches` → skeleton, then paginated table (desktop) / cards (mobile).
- Search and status filter → list updates; distinct empty states for "no branches" vs "no
  results".
- Create branch with valid `name` → success toast; appears in list.
- Edit branch → changes persist on detail page.
- Archive branch → confirmation dialog → removed from default list.
- Invalid form → inline Zod errors; submit disabled while pending.

### 3. Warehouses (US2)

- `/warehouses` → full list UX parity with branches.
- Create/edit/archive warehouse with validation and permission gates.
- Detail page shows branch association if API returns `branchId` or nested branch.

### 4. Vehicles (US3)

- `/vehicles` → list with plate number column and status badge.
- Create vehicle with `plateNumber` → success; detail shows description and status.
- Edit operational status (`AVAILABLE`, `IN_USE`, etc.) via form.
- Archive vehicle → confirmation → excluded from default list.

### 5. Entity relationships

- On warehouse/vehicle detail, relationship fields render from API only (no client joins).
- If association pickers exist on forms, options load from `GET /branches` (and warehouses
  for vehicles) — not hardcoded.

### 6. Responsive & theme

- Verify each organization screen at 320px, 768px, 1280px+, 1536px+.
- Toggle light/dark/system theme on list, detail, and form pages.

### 7. Error handling

- Force 409 on double-archive → friendly toast, list refreshes.
- Force 404 on detail → not-found state with link back to list.
- Disconnect network on list load → retryable error state (not blank screen).

## Quality gates

```bash
pnpm typecheck   # zero errors
pnpm lint        # zero errors
pnpm build       # production build succeeds
```

## Specification 004 readiness

After validation, confirm:

- [x] Three feature modules follow `features/<name>/{types,services,validation,hooks,components,pages}`
- [x] No changes required to `AuthGuard`, session bootstrap, or `apiClient` envelope handling
- [x] `PermissionGuard` / `PermissionGate` pattern extended, not replaced
- [x] `useListQuery` + server pagination used for all org lists
- [x] Navigation extended additively in `constants/navigation.ts`
- [x] No Workforce, Transaction, or Trip code introduced

## Notes (implementation validation — 2026-07-08)

- **RBAC matrix (T024)**: OWNER/MANAGER receive full org permissions via `permissionsForRole()`;
  EMPLOYEE receives view-only (`branch.view`, `warehouse.view`, `vehicle.view`). Create/edit/archive
  buttons are gated with `PermissionGate`; routes use granular `PermissionGuard` per contract.
- **T055**: Requires a running Backend P002 instance — not executed in CI-only environment.
  Run quickstart scenarios manually when the API is available.

## References

- [spec.md](./spec.md) — requirements and acceptance criteria
- [data-model.md](./data-model.md) — entity shapes
- [contracts/api-endpoints.md](./contracts/api-endpoints.md) — service methods
- [contracts/routes-and-guards.md](./contracts/routes-and-guards.md) — routing matrix
