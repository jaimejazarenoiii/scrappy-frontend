# Phase 0 Research: Workforce Management

All decisions comply with the Scrappy Constitution, Specification 004, and reuse the
Specification 001–003 foundations. No new dependencies are introduced.

## R-001 — Feature module pattern (four parallel modules, clone Spec 003)

- **Decision**: Implement each workforce domain (`attendance`, `leave`, `cash-advances`,
  `payroll`) as an independent feature folder under `src/features/` mirroring the proven
  Organization Management pattern from Specification 003: `types/`, `services/`,
  `validation/`, `hooks/`, `components/`, `pages/`. Reuse `DataTable`, `FilterBar`,
  `Pagination`, `useListQuery`, `PageHeader`, `PageContainer`, `ConfirmDialog`,
  `DescriptionList`, `StatusBadge`, RHF + Zod, and `applyApiValidationErrors` without
  modifying shared component public APIs.
- **Rationale**: Constitution III/XVIII; Spec 003 demonstrated server-paginated list +
  workflow detail pages; four domains have distinct business rules and should not share a
  premature "workforce entity" abstraction.
- **Alternatives considered**: Monolithic `workforce/` feature (rejected — violates feature
  ownership); generic workflow engine (rejected — over-engineering).

## R-002 — Server-driven pagination (P003 lists)

- **Decision**: Attendance, leave, cash advance, and payroll list endpoints are
  **server-paginated** with query params `page`, `limit`, `sortBy`, `sortOrder`, `search`,
  and domain-specific filters (`status`, `employeeId`, `dateFrom`, `dateTo`, `periodId` per
  OpenAPI). Services call `apiClient` with `toQueryParams(ListQueryParams)` and unwrap via
  `unwrapList()` into `PaginatedResponse<T>`. TanStack Query keys include full
  `ListQueryParams` for cache correctness.
- **Rationale**: Matches Spec 003 envelope pattern and Backend P003 contract expectations;
  workforce datasets grow over time and must not be client-paginated.
- **Alternatives considered**: Client-side pagination like current `EmployeeService.list`
  (rejected — wrong for P003); custom pagination per module (rejected — `useListQuery` exists).

## R-003 — Attendance dashboard + list on single route

- **Decision**: `/attendance` renders `AttendanceDashboardPage` combining backend-provided
  summary KPIs (from `GET /attendance/dashboard` or embedded in list meta if OpenAPI defines
  otherwise) with a paginated attendance records section below. `/attendance/:id` is the
  detail page. No separate `/attendance/list` route — spec defines only two attendance
  paths.
- **Rationale**: FR-001/FR-002 and route contract; avoids route proliferation while
  delivering both dashboard and list UX on one bookmarkable URL with list state in query
  params.
- **Alternatives considered**: Separate dashboard and list routes (rejected — not in spec
  route list); dashboard-only without list (rejected — FR-001 requires list).

## R-004 — Conditional workflow actions (backend-driven)

- **Decision**: Manual time-in, time-out, correction, edit, cancel, approve, and reject
  actions are rendered **only when** the backend contract exposes the endpoint and the
  current record state permits the transition. UI uses `PermissionGate` plus optional
  `allowedActions[]` or status checks from the API payload — never hardcoded workflow rules.
  Unsupported actions are hidden, not disabled with misleading affordances.
- **Rationale**: FR-004–FR-006, FR-012–FR-015, FR-020–FR-022; spec edge cases explicitly
  forbid inventing workflows.
- **Alternatives considered**: Always show all action buttons (rejected — violates spec);
  client-side state machine (rejected — duplicates business logic).

## R-005 — Payroll is read-only consumer

- **Decision**: Payroll feature has **no create/edit/mutation forms** unless OpenAPI explicitly
  adds them later. `PayrollService` exposes `list`, `get`, and optional `periods`/`summary`
  helpers. Detail and list pages display backend totals, deductions, and net pay exactly as
  returned — no client-side arithmetic.
- **Rationale**: FR-027, SC-006; payroll calculations are backend responsibilities.
- **Alternatives considered**: Editable payroll forms (rejected — out of scope); client-side
  total recomputation for display (rejected — violates FR-027).

## R-006 — Employee picker hook (reuse Spec 002)

- **Decision**: Add `useEmployeeOptions()` in `features/employees/hooks/` (or extend existing
  employee hooks) fetching active employees for `<Select>` pickers in leave and cash advance
  forms when `employeeId` is required. Mirror `useBranchOptions()` from Spec 003. Attendance
  records display employee data from API embeds only on detail pages.
- **Rationale**: FR-032; employee foundation exists from Spec 002; avoids duplicate fetch
  logic across leave/cash-advance forms.
- **Alternatives considered**: Hardcoded employee list (rejected); global workforce store
  (rejected — server state belongs in Query).

## R-007 — Permissions extension (additive to Spec 002–003)

- **Decision**: Add opaque permission key constants in `constants/permissions.ts`:

  | Module       | Keys                                                                                                                              |
  | ------------ | --------------------------------------------------------------------------------------------------------------------------------- |
  | Attendance   | `attendance.view`, `attendance.timeIn`, `attendance.timeOut`, `attendance.correct`                                                |
  | Leave        | `leave.view`, `leave.create`, `leave.update`, `leave.cancel`, `leave.approve`, `leave.reject`                                     |
  | Cash Advance | `cashAdvance.view`, `cashAdvance.create`, `cashAdvance.update`, `cashAdvance.cancel`, `cashAdvance.approve`, `cashAdvance.reject` |
  | Payroll      | `payroll.view`                                                                                                                    |

  Extend `permissionsForRole()` in `session.ts`: OWNER all; MANAGER all workforce except
  payroll approve if N/A; EMPLOYEE view + create own leave/cash advance where API allows.
  Route guards use `PermissionGuard`; actions use `PermissionGate`.

- **Rationale**: Reuses Spec 002 authorization primitives; keys are data, not rules.
- **Alternatives considered**: Role checks in components (rejected — hardcodes policy).

## R-008 — Workflow UI components (feature-local, not shared abstraction)

- **Decision**: Each workflow module (leave, cash-advances) owns a small
  `ApprovalActions.tsx` and `WorkflowHistory.tsx` component in its `components/` folder.
  Attendance owns `AttendanceActionDialog.tsx` and `AttendanceCorrectionForm.tsx`. No
  cross-feature "workflow engine" package — copy the minimal pattern twice rather than
  abstract prematurely.
- **Rationale**: Constitution XXIX (reuse-first but no premature abstraction); leave and
  cash advance workflows are similar but may diverge per OpenAPI.
- **Alternatives considered**: Shared `features/workflow/` module (rejected — scope creep).

## R-009 — Status badge mapping

- **Decision**: Extend or colocate status tone helpers in `features/attendance/lib/`
  `attendance-status.ts` (and per-module libs) mapping backend enums to `StatusBadge` tones.
  Attendance: PRESENT/ON_TIME→`active`, LATE→`inactive`, ABSENT→`archived` or custom per
  OpenAPI. Leave/Cash: PENDING→`neutral`, APPROVED→`active`, REJECTED→`archived`,
  CANCELLED→`inactive`. Payroll: OPEN→`neutral`, PROCESSED→`active`, CLOSED→`inactive`.
  Reconcile exact enums during implementation against Swagger.
- **Rationale**: Consistent UX; Spec 003 `org-status.ts` pattern proven.
- **Alternatives considered**: Raw enum strings in UI (rejected — poor UX).

## R-010 — API envelope, errors, and mutations

- **Decision**: All P003 service methods use `ApiEnvelope<T>` generics, `unwrap`/`unwrapList`,
  normalized errors from `lib/axios.ts`, `applyApiValidationErrors` on forms, toast on 409
  `LIFECYCLE_CONFLICT` for stale workflow transitions. Workflow mutations invalidate list +
  detail query keys; no optimistic updates on approve/reject (refresh on success to avoid
  stale state); optional optimistic UI only for cancel when safe.
- **Rationale**: Spec 003 mutation patterns; workflow conflicts are common.
- **Alternatives considered**: Optimistic approve/reject (rejected — 409 rollback complexity).

## R-011 — OpenAPI reconciliation

- **Decision**: Hand-write types in each feature's `types/` aligned to Backend P003 OpenAPI;
  verify at `GET /docs` during `/speckit-implement`. Endpoint path variants in spec
  (`/leave` vs `/leave-requests`) resolved to canonical paths from OpenAPI — services use
  constants (`LEAVE_ENDPOINTS`) so path changes are one-line fixes.
- **Rationale**: Constitution XXVI; service layer isolates contract drift.
- **Alternatives considered**: Implement before contract review (rejected — risks rework).

## R-012 — Attendance list filters

- **Decision**: Attendance list/dashboard section supports `search`, `status`, and date-range
  filters via `useListQuery` flat filter keys (`dateFrom`, `dateTo`, `employeeId`) mapped in
  `toQueryParams` when OpenAPI defines them. Default sort: `date:desc` or `createdAt:desc`
  per contract.
- **Rationale**: FR-001; URL-synced filters per Constitution IV.
- **Alternatives considered**: Zustand filter state (rejected — list state belongs in URL).

## Summary of resolved unknowns

All Technical Context items are resolved; no `NEEDS CLARIFICATION` remain. Conditional
workflow endpoints and exact status enums are documented as **OpenAPI-verified during
implementation** — UI includes action affordances only when the contract confirms them.
