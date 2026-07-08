# Quickstart & Validation: Workforce Management

Validation guide for Specification 004. Builds on Specifications 001–003; uses **pnpm**
only. Implementation details live in `tasks.md` — this is a run/validate guide.

## Prerequisites

- Specifications 001–003 implemented; `pnpm build` green.
- Backend P003 reachable at `VITE_API_BASE_URL` (e.g. `http://localhost:3000/api/v1`).
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

### 1. Navigation & authorization (US5)

- Sign in as **owner** → sidebar shows Attendance, Leave, Cash Advances, Payroll.
- Sign in as **employee** → workforce menu items visible per `*.view` permissions; approve/
  reject and manual attendance actions hidden without permission.
- Navigate directly to `/payroll` without permission → `/403` or access denied.
- Use browser back/forward between workforce pages → layout intact, URL state preserved.

### 2. Attendance (US1)

- `/attendance` → dashboard KPI skeletons, then summary cards + paginated records table.
- Search/filter by status or date → list updates; distinct empty states for "no data" vs
  "no results".
- Open `/attendance/:id` → employee, timestamps, status, history (if API provides).
- Manual time-in/time-out (if supported) → confirmation → success toast → updated status.
- Attendance correction (if supported) → form validation → persisted state on detail.

### 3. Leave (US2)

- `/leave` → paginated list with skeleton loading and empty state.
- Create leave request → success toast; appears in list with PENDING status.
- Edit/cancel pending request (when allowed) → status updates in list and detail.
- Approve/reject as manager → workflow history visible; employee cannot see approve actions.
- Invalid form (end before start) → inline Zod errors.

### 4. Cash Advances (US3)

- `/cash-advances` → full list UX parity with leave.
- Create cash advance with amount + reason → success; detail shows approval state.
- Edit/cancel/approve/reject per backend rules and permissions.
- Approval history renders from API only (no client fabrication).

### 5. Payroll (US4)

- `/payroll` → payroll periods/runs with pagination and filters.
- `/payroll/:id` → period summary and line items exactly as backend returns.
- Verify totals on detail match API payload (no frontend recalculation).
- User without `payroll.view` → nav hidden and route blocked.

### 6. Entity relationships

- Attendance/leave/cash advance detail shows employee from API embed or ID only.
- Form employee pickers load from employee list endpoint — not hardcoded.
- No client-side joins for relationship display.

### 7. Responsive & theme

- Verify each workforce screen at 320px, 768px, 1280px+, 1536px+.
- Toggle light/dark/system theme on dashboard, list, detail, and form pages.

### 8. Error handling

- Force 409 on approve already-processed leave → friendly toast; detail refreshes.
- Force 404 on detail → not-found state with link back to list.
- Disconnect network on list load → retryable error state (not blank screen).

## Quality gates

```bash
pnpm typecheck   # zero errors
pnpm lint        # zero errors
pnpm build       # production build succeeds
```

## Specification 005 readiness

After validation, confirm:

- [ ] Four feature modules follow `features/<name>/{types,services,validation,hooks,components,pages}`
- [ ] No changes required to `AuthGuard`, session bootstrap, or `apiClient` envelope handling
- [ ] `PermissionGuard` / `PermissionGate` pattern extended, not replaced
- [ ] `useListQuery` + server pagination used for all workforce lists
- [ ] Workflow actions conditional on backend contract + permissions
- [ ] Payroll is read-only consumer (no client calculations)
- [ ] Navigation extended additively in `constants/navigation.ts`
- [ ] No Transaction, Trip, Expense, Analytics, or Report code introduced

## References

- [spec.md](./spec.md) — requirements and acceptance criteria
- [data-model.md](./data-model.md) — entity shapes
- [contracts/api-endpoints.md](./contracts/api-endpoints.md) — service methods
- [contracts/routes-and-guards.md](./contracts/routes-and-guards.md) — routing matrix
