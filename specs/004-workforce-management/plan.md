# Implementation Plan: Workforce Management

**Branch**: `004-workforce-management` | **Date**: 2026-07-08 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/004-workforce-management/spec.md`

**Note**: Maps to Backend P003. Builds strictly on Specifications 001–003 and MUST NOT
redesign or refactor the existing architecture. Leaves the codebase ready for Specification
005 — Transaction Management Foundation (Backend P004) without architectural refactoring.

## Summary

Deliver the frontend for Workforce Management: **attendance** (dashboard + list + detail +
conditional manual actions), **leave requests** (CRUD + approval workflows), **cash advances**
(CRUD + approval workflows), and **payroll** (read-only viewing) with server-driven list
controls (search, filter, sort, pagination), permission-gated routes and navigation, and
production-quality responsive UI.

Technical approach: implement four parallel feature modules under `src/features/attendance`,
`leave`, `cash-advances`, and `payroll` — cloning the proven Organization Management pattern
from Specification 003 (service → hooks → pages → forms). Reuse all Specification 001–003
shared infrastructure (`apiClient` + envelope unwrap, `useListQuery`, `DataTable`,
`FilterBar`, `Pagination`, `PermissionGuard`, `PermissionGate`, RHF + Zod,
`applyApiValidationErrors`). Extend `constants/routes.ts`, `constants/navigation.ts`, and
`constants/permissions.ts` additively. Add `useEmployeeOptions()` in `features/employees/`
for form pickers. No new npm dependencies.

Design reference: **UI UX Pro Max** — Linear/GitHub/Vercel/Stripe-quality enterprise SaaS;
mobile-first, dark-mode compatible, accessible.

## Technical Context

**Language/Version**: TypeScript (Strict Mode) on React 19+ with Vite

**Primary Dependencies**: React Router (Data Router), TanStack Query, Axios, Zustand,
React Hook Form, Zod, Tailwind CSS v4, Lucide React, TanStack Table, Sonner (all installed;
no new dependencies)

**Storage**: N/A (frontend only; persistence via Backend P003 REST API at `/api/v1`)

**Testing**: Manual quickstart validation + `pnpm typecheck`, `pnpm lint`, `pnpm build`

**Target Platform**: Modern browsers (mobile-first: 320px–1536px+)

**Project Type**: Administrative web application (Scrappy frontend)

**Performance Goals**: Lazy-loaded workforce routes; TanStack Query caching with
`keepPreviousData` on lists; efficient invalidation on workflow mutations; no unnecessary
re-renders

**Constraints**: No Axios in components; no server state in Zustand; no `any`; no hardcoded
RBAC rules; no frontend payroll calculations; no refactoring of Spec 001–003 foundations;
out-of-scope modules (transactions, trips, expenses, analytics, reports, activity logs) MUST
NOT be introduced

**Scale/Scope**: Attendance, Leave, Cash Advances, Payroll only — Backend P003

## Constitution Check

_GATE: Passed before Phase 0. Re-checked after Phase 1 design — all gates satisfied._

| Gate                                             | Status  | Notes                                                                                          |
| ------------------------------------------------ | ------- | ---------------------------------------------------------------------------------------------- |
| API First (I, VIII)                              | ✅ Pass | `features/*/services/*.service.ts` over `apiClient`; envelope via `unwrap`/`unwrapList`        |
| Type Safety (II, IX)                             | ✅ Pass | Strict TS; Zod per form; types in feature `types/` verified against OpenAPI                    |
| Feature Architecture (III, XVII, XVIII)          | ✅ Pass | `src/features/{attendance,leave,cash-advances,payroll}` with `@/` imports                      |
| Routing (IV, V)                                  | ✅ Pass | `createBrowserRouter` extended; 12 lazy workforce routes under `AuthGuard` + `PermissionGuard` |
| State (VII)                                      | ✅ Pass | TanStack Query for all server state; Zustand for URL-adjacent UI prefs only                    |
| UI & Styling (VI, X, XI, XII, XXIX–XXXIV, XXXIX) | ✅ Pass | Reuse `components/ui/` + `components/common/`; skeletons, empty/error states                   |
| Auth & Security (XIV, XX)                        | ✅ Pass | Existing JWT session; permission guards; no secrets                                            |
| Accessibility (XV, XL)                           | ✅ Pass | Labeled forms, keyboard nav, accessible tables/dialogs, 44×44 touch targets                    |
| Responsive Design (XXVII, XXXI)                  | ✅ Pass | Mobile card mode via `DataTable.renderMobileCard`; responsive forms                            |
| Page & Table Standards (XXXII, XXXVI)            | ✅ Pass | PageHeader/PageContainer/DataTable/FilterBar/Pagination pattern per Spec 003                   |
| Forms & Dashboards (XXXVII, XXXVIII)             | ✅ Pass | RHF + Zod; inline validation; disabled-while-pending; attendance KPIs above list               |
| AI UI Standards (XXVIII, XL)                     | ✅ Pass | Reuse-first; no duplicate primitives; production checklist per screen                          |
| Performance (XVI, XXXV)                          | ✅ Pass | Lazy routes; `keepPreviousData`; workflow mutations refresh on success                         |
| API Contract (XXVI)                              | ✅ Pass | Types reconciled with P003 OpenAPI / Scrappy API reference                                     |
| Documentation (XXII)                             | ✅ Pass | Spec + plan artifacts document API deps, UI states, validation, errors                         |

No violations. Complexity Tracking not required.

## Project Structure

### Documentation (this feature)

```text
specs/004-workforce-management/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── api-endpoints.md
│   └── routes-and-guards.md
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created here)
```

### Source Code (repository root)

New paths only. **Existing files are extended additively.**

```text
src/
├── app/
│   └── router/
│       └── routes.tsx                    # EXTEND: 12 workforce routes (lazy)
│
├── constants/
│   ├── routes.ts                         # EXTEND: attendance/leave/cash-advances/payroll paths + buildRoute
│   ├── navigation.ts                     # EXTEND: 4 nav items (permission-gated)
│   └── permissions.ts                    # EXTEND: workforce permission keys
│
├── features/
│   ├── auth/
│   │   └── lib/session.ts                # EXTEND: workforce permissions in ROLE_PERMISSIONS
│   ├── employees/
│   │   └── hooks/
│   │       └── useEmployeeOptions.ts     # NEW: picker for leave/cash-advance forms
│   ├── attendance/
│   │   ├── components/
│   │   │   ├── AttendanceDashboardKpis.tsx
│   │   │   ├── AttendanceActionDialog.tsx
│   │   │   └── AttendanceCorrectionForm.tsx
│   │   ├── hooks/
│   │   │   ├── useAttendanceDashboard.ts
│   │   │   ├── useAttendances.ts
│   │   │   ├── useAttendance.ts
│   │   │   └── useAttendanceMutations.ts
│   │   ├── lib/attendance-status.ts
│   │   ├── pages/
│   │   │   ├── AttendanceDashboardPage.tsx
│   │   │   └── AttendanceDetailPage.tsx
│   │   ├── services/attendance.service.ts
│   │   ├── validation/attendance.schema.ts
│   │   └── types/attendance.types.ts
│   ├── leave/
│   │   ├── components/
│   │   │   ├── LeaveForm.tsx
│   │   │   ├── ApprovalActions.tsx
│   │   │   └── WorkflowHistory.tsx
│   │   ├── hooks/
│   │   │   ├── useLeaves.ts
│   │   │   ├── useLeave.ts
│   │   │   └── useLeaveMutations.ts
│   │   ├── lib/leave-status.ts
│   │   ├── pages/
│   │   │   ├── LeaveListPage.tsx
│   │   │   ├── LeaveDetailPage.tsx
│   │   │   ├── LeaveCreatePage.tsx
│   │   │   └── LeaveEditPage.tsx
│   │   ├── services/leave.service.ts
│   │   ├── validation/leave.schema.ts
│   │   └── types/leave.types.ts
│   ├── cash-advances/
│   │   ├── components/
│   │   │   ├── CashAdvanceForm.tsx
│   │   │   ├── ApprovalActions.tsx
│   │   │   └── WorkflowHistory.tsx
│   │   ├── hooks/
│   │   │   ├── useCashAdvances.ts
│   │   │   ├── useCashAdvance.ts
│   │   │   └── useCashAdvanceMutations.ts
│   │   ├── lib/cash-advance-status.ts
│   │   ├── pages/
│   │   │   ├── CashAdvancesListPage.tsx
│   │   │   ├── CashAdvanceDetailPage.tsx
│   │   │   ├── CashAdvanceCreatePage.tsx
│   │   │   └── CashAdvanceEditPage.tsx
│   │   ├── services/cash-advance.service.ts
│   │   ├── validation/cash-advance.schema.ts
│   │   └── types/cash-advance.types.ts
│   └── payroll/
│       ├── components/
│       │   ├── PayrollSummaryCards.tsx
│       │   └── PayrollLineItemsTable.tsx
│       ├── hooks/
│       │   ├── usePayrolls.ts
│       │   ├── usePayroll.ts
│       │   └── usePayrollPeriods.ts
│       ├── lib/payroll-status.ts
│       ├── pages/
│       │   ├── PayrollListPage.tsx
│       │   └── PayrollDetailPage.tsx
│       ├── services/payroll.service.ts
│       └── types/payroll.types.ts
```

**Structure Decision**: Four parallel feature modules per Constitution Principle III.
Each owns its domain surface. Workflow UI (`ApprovalActions`, `WorkflowHistory`) is
feature-local — not abstracted into a shared workflow engine. Employee picker hook lives in
`employees/` and is imported by leave/cash-advance forms only.

## Implementation Phases

### Phase 0 — Research & Contract Reconciliation

- **Objective**: Resolve technical decisions and align to Backend P003 API contract.
- **Scope**: Pagination strategy; attendance dashboard layout; conditional workflow actions;
  payroll read-only boundary; permission keys; employee picker; OpenAPI verification plan.
- **Tasks**: Produce `research.md`; draft `contracts/`; define `data-model.md`; write
  `quickstart.md` validation scenarios.
- **Deliverables**: `research.md`, `data-model.md`, `contracts/*`, `quickstart.md`.
- **Dependencies**: Specification 004 approved.
- **Validation**: No unresolved NEEDS CLARIFICATION; decisions traceable to constitution.
- **Risks**: OpenAPI drift on conditional endpoints (time-in, corrections, approve) →
  mitigate with endpoint constants and hide unsupported actions.
- **Exit Criteria**: Design artifacts complete; Constitution re-check passes.

**Status**: ✅ Complete

### Phase 1 — Foundation Wiring (Routes, Permissions, Navigation)

- **Objective**: Wire workforce module entry points before feature pages ship.
- **Scope**: Extend `ROUTES` + `buildRoute`; extend `PERMISSIONS` with attendance/leave/
  cashAdvance/payroll keys; extend `permissionsForRole()` in `session.ts`; extend
  `navigation.ts` with four items (Lucide: `Clock`, `CalendarDays`, `Wallet`, `Banknote`);
  register lazy workforce routes in `routes.tsx` with `PermissionGuard`.
- **Tasks**:
  - Add route constants and `buildRoute` helpers for all 12 workforce paths
  - Add permission key constants and role mapping (OWNER/MANAGER/EMPLOYEE)
  - Add navigation items with `anyOf` permission arrays
  - Extend `routes.tsx` with `PermissionGuard`-wrapped workforce route groups
  - Add `useEmployeeOptions()` hook skeleton (or full implementation if employees API ready)
- **Deliverables**: Updated `constants/*`, `session.ts`, `routes.tsx`, `useEmployeeOptions.ts`.
- **Dependencies**: Phase 0.
- **Validation**: Typecheck passes; nav items hidden/shown per role; guarded routes redirect
  to `/403` without permission; deep links resolve.
- **Risks**: Permission key mismatch with backend → reconcile against OpenAPI during
  implementation; keys are opaque strings only.
- **Exit Criteria**: US5 navigation infrastructure ready; all 12 routes registered.

**Parallelizable**: None (blocks Phases 2–5).

### Phase 2 — Attendance Management (US1)

- **Objective**: Complete attendance dashboard, list section, detail, and conditional actions.
- **Scope**: `attendance.types.ts`, `attendance.service.ts` (dashboard/list/get/timeIn/timeOut/
  correct with envelope unwrap), `attendance.schema.ts`, hooks, `AttendanceDashboardPage`
  (KPIs + paginated records), `AttendanceDetailPage`, action dialogs, status badge mapping.
- **Tasks**:
  - Implement service with server pagination via `toQueryParams` + `unwrapList`
  - Dashboard page: `useAttendanceDashboard` + `useAttendances` with `useListQuery`,
    `FilterBar` (search + status + date range), `DataTable` + mobile cards, `Pagination`,
    empty/error states
  - Detail page: `DescriptionList`, employee embed, timestamps, status badge, history section
  - Conditional `AttendanceActionDialog` for time-in/time-out (`PermissionGate`)
  - Conditional `AttendanceCorrectionForm` when API supports corrections
  - Mutations invalidate dashboard + list + detail keys; toast on success/409
- **Deliverables**: `/attendance`, `/attendance/:id`.
- **Dependencies**: Phase 1.
- **Validation**: US1 acceptance scenarios 1–7; quickstart §2.
- **Risks**: Dashboard endpoint shape differs from spec → adapt service to OpenAPI response;
  unsupported manual actions → hide affordances per R-004.
- **Exit Criteria**: FR-001–FR-006 met; attendance module demoable as MVP.

**Parallelizable**: After Phase 1, can overlap with Phase 3 start once attendance service
patterns are established.

### Phase 3 — Leave Management (US2)

- **Objective**: Complete leave CRUD + approval/cancel workflows + list controls.
- **Scope**: Mirror Spec 003 CRUD structure under `features/leave/`. Include
  `ApprovalActions`, `WorkflowHistory`, `LeaveForm` with `useEmployeeOptions()`, edit/cancel
  gated by record status from API.
- **Tasks**:
  - Implement `LeaveService` (list/get/create/update/cancel/approve/reject)
  - List page: `useListQuery`, filters (status, employee, date range), sort, pagination
  - Detail page: workflow history, approve/reject/cancel/edit actions (`PermissionGate` +
    status checks)
  - Create/edit pages: `LeaveForm` (RHF + Zod), date validation (end ≥ start), redirect on
    success
  - Workflow mutations with confirmation dialogs; 409 handling with refresh
- **Deliverables**: `/leave`, `/leave/new`, `/leave/:id`, `/leave/:id/edit`.
- **Dependencies**: Phase 1; `useEmployeeOptions()` from Phase 1.
- **Validation**: US2 acceptance scenarios; quickstart §3.
- **Risks**: `/leave` vs `/leave-requests` path variant → use `LEAVE_ENDPOINTS` constant;
  edit only on PENDING → gate UI from API status.
- **Exit Criteria**: FR-007–FR-015 met.

**Parallelizable**: With Phase 4 after Phase 1 (leave and cash advances are independent once
`useEmployeeOptions` exists).

### Phase 4 — Cash Advance Management (US3)

- **Objective**: Complete cash advance CRUD + approval/cancel workflows + list controls.
- **Scope**: Mirror Phase 3 structure under `features/cash-advances/` with amount/reason
  fields, currency display from API, approval history from payload.
- **Tasks**:
  - Implement `CashAdvanceService` (list/get/create/update/cancel/approve/reject)
  - List page: full list UX parity with leave
  - Detail page: amount, reason, status, approval history, workflow actions
  - Create/edit pages: `CashAdvanceForm` (RHF + Zod), amount validation per backend rules
  - Reuse workflow UI pattern from leave (feature-local copy, not shared package)
- **Deliverables**: `/cash-advances`, `/cash-advances/new`, `/cash-advances/:id`,
  `/cash-advances/:id/edit`.
- **Dependencies**: Phase 1; `useEmployeeOptions()`.
- **Validation**: US3 acceptance scenarios; quickstart §4.
- **Risks**: Amount precision/format → display exactly as API returns; DISBURSED status →
  add badge mapping during OpenAPI reconciliation.
- **Exit Criteria**: FR-016–FR-022 met.

**Parallelizable**: With Phase 3 after Phase 1.

### Phase 5 — Payroll Management (US4)

- **Objective**: Complete read-only payroll list and detail with periods/summary display.
- **Scope**: `payroll.types.ts`, `PayrollService` (list/get/periods/summary — no mutations),
  hooks, `PayrollListPage` with period filter, `PayrollDetailPage` with summary cards and
  line items table. **No create/edit forms. No client-side calculations.**
- **Tasks**:
  - Implement read-only service methods with envelope unwrap
  - List page: paginated payroll runs, period filter via `usePayrollPeriods`, status badges
  - Detail page: `PayrollSummaryCards` (gross/deductions/net from API), `PayrollLineItemsTable`
  - Verify displayed totals match API payload byte-for-byte (formatting only)
- **Deliverables**: `/payroll`, `/payroll/:id`.
- **Dependencies**: Phase 1.
- **Validation**: US4 acceptance scenarios; quickstart §5.
- **Risks**: Summary endpoint optional → degrade gracefully to list/detail only;
  line item shape varies → types reconciled with OpenAPI.
- **Exit Criteria**: FR-023–FR-027 met; payroll is strictly read-only.

**Parallelizable**: With Phases 3–4 after Phase 1 (payroll has no form dependencies).

### Phase 6 — Relationships, Cross-Module Polish & Spec 005 Readiness

- **Objective**: Verify employee relationship display, responsive/a11y pass, and production
  readiness.
- **Scope**: Employee embeds on detail pages; form pickers from API; filtered empty states;
  toast consistency; permission audit across all workforce screens; typecheck/lint/build;
  quickstart walkthrough; confirm no out-of-scope code.
- **Tasks**:
  - Verify FR-028–FR-032 on attendance/leave/cash advance/payroll detail pages
  - Responsive + dark mode pass on all 12 workforce pages
  - Accessibility spot-check (forms, tables, dialogs, keyboard, focus management)
  - Run quality gates; execute quickstart scenarios end-to-end
  - Document any OpenAPI deltas in `contracts/api-endpoints.md`
  - Confirm navigation (US5) works for all roles
- **Deliverables**: Green build; completed production checklist; Spec 005 readiness confirmed.
- **Dependencies**: Phases 2–5.
- **Validation**: SC-001–SC-006; quickstart full walkthrough; Principle XL checklist.
- **Risks**: Scope creep into Transactions/Trips/Expenses → enforce out-of-scope boundary.
- **Exit Criteria**: All spec acceptance criteria met; ready for `/speckit-tasks`.

## Parallelization

```text
Phase 0 (Research & Contracts)  ✅
    ↓
Phase 1 (Routes, Permissions, Navigation)
    ↓
    ├─ Phase 2 (Attendance) ───────────┐
    ├─ Phase 3 (Leave) ────────────────┤  ← 3, 4, 5 can start after Phase 1;
    ├─ Phase 4 (Cash Advances) ────────┤     employee picker from Phase 1 helps 3 & 4
    └─ Phase 5 (Payroll) ──────────────┘
                          ↓
                    Phase 6 (Polish & Readiness)
```

- **Maximum parallelism**: After Phase 1, Phases 3, 4, and 5 can proceed in parallel.
  Phase 2 (attendance) should start first as the P1 MVP vertical slice.
- **Within a phase**: types + service + schema → hooks → list page → detail → forms/actions
  is the recommended vertical slice order.

## Specification 005 Readiness Checklist

After Phase 6, the following MUST exist for Transaction Management (Backend P004) without
refactoring:

- [ ] Four feature modules demonstrating the standard scaffold pattern
- [ ] Server-paginated list pattern via `useListQuery` + `unwrapList` (proven across workforce)
- [ ] Workflow action pattern (approve/reject/cancel) proven on leave and cash advances
- [ ] Read-only consumer pattern proven on payroll (no client calculations)
- [ ] Permission constants + `PermissionGuard`/`PermissionGate` extended additively
- [ ] Navigation pattern proven for adding new modules
- [ ] `useEmployeeOptions()` available for transaction employee pickers in Spec 005+
- [ ] No changes to auth session, envelope handling, or dashboard layout architecture
- [ ] No Transaction, Trip, Expense, Analytics, Report, or Activity Log code introduced

## Complexity Tracking

No constitution violations; no complexity deviations to justify.

## Artifacts

| Artifact   | Path                             | Status                     |
| ---------- | -------------------------------- | -------------------------- |
| Research   | [research.md](./research.md)     | Complete                   |
| Data Model | [data-model.md](./data-model.md) | Complete                   |
| Contracts  | [contracts/](./contracts/)       | Complete                   |
| Quickstart | [quickstart.md](./quickstart.md) | Complete                   |
| Tasks      | [tasks.md](./tasks.md)           | Pending (`/speckit-tasks`) |
