# Tasks: Specification 004 – Workforce Management

**Input**: Design documents from `/specs/004-workforce-management/`

**Prerequisites**: `plan.md` and `spec.md`

**Tests**: Not requested in Specification 004 (task list focuses on implementation).

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 Create directory tree for attendance module under `src/features/attendance/` (components, hooks, pages, services, validation, types, lib)
- [x] T002 [P] Create directory tree for leave module under `src/features/leave/` (components, hooks, pages, services, validation, types, lib)
- [x] T003 [P] Create directory tree for cash-advances module under `src/features/cash-advances/` (components, hooks, pages, services, validation, types, lib)
- [x] T004 [P] Create directory tree for payroll module under `src/features/payroll/` (components, hooks, pages, services, validation, types, lib)
- [x] T005 [P] Create `src/features/employees/hooks/useEmployeeOptions.ts` skeleton for active employee picker options (returns `{label,value}` options; no workforce dependencies)
- [x] T006 [P] Create placeholder status/tone mapping files if referenced by later components: `src/features/attendance/lib/attendance-status.ts`, `src/features/leave/lib/leave-status.ts`, `src/features/cash-advances/lib/cash-advance-status.ts`, `src/features/payroll/lib/payroll-status.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

These tasks must be complete before implementing any workforce user story so the router/guards and types compile.

- [x] T007 Update `src/constants/routes.ts` to add workforce route constants for `/attendance`, `/attendance/:id`, `/leave`, `/leave/new`, `/leave/:id`, `/leave/:id/edit`, `/cash-advances`, `/cash-advances/new`, `/cash-advances/:id`, `/cash-advances/:id/edit`, `/payroll`, `/payroll/:id`
- [x] T008 Update `src/constants/routes.ts` `buildRoute` helpers for all workforce detail/edit/new routes used by pages (attendance, leave, cash advances, payroll)
- [x] T009 Extend `src/constants/permissions.ts` with workforce permission key constants for Attendance, Leave, Cash Advances, and Payroll (and update `PermissionKey` union type)
- [x] T010 Update `src/features/auth/lib/session.ts` `ROLE_PERMISSIONS` mapping to include workforce permission keys for OWNER/MANAGER/EMPLOYEE (additive to existing keys)
- [x] T011 Update `src/app/router/routes.tsx` to register workforce routes under `AuthGuard` + `DashboardLayout`, wrapping route groups with `PermissionGuard` using the `*.view` keys
- [x] T012 Create placeholder attendance pages `src/features/attendance/pages/AttendanceDashboardPage.tsx` and `src/features/attendance/pages/AttendanceDetailPage.tsx` (default-export React components)
- [x] T013 Create placeholder leave pages `src/features/leave/pages/LeaveListPage.tsx`, `src/features/leave/pages/LeaveCreatePage.tsx`, `src/features/leave/pages/LeaveDetailPage.tsx`, `src/features/leave/pages/LeaveEditPage.tsx` (default-export React components)
- [x] T014 Create placeholder cash advance pages `src/features/cash-advances/pages/CashAdvancesListPage.tsx`, `src/features/cash-advances/pages/CashAdvanceCreatePage.tsx`, `src/features/cash-advances/pages/CashAdvanceDetailPage.tsx`, `src/features/cash-advances/pages/CashAdvanceEditPage.tsx` (default-export React components)
- [x] T015 Create placeholder payroll pages `src/features/payroll/pages/PayrollListPage.tsx` and `src/features/payroll/pages/PayrollDetailPage.tsx` (default-export React components)
- [x] T016 Implement `src/features/employees/hooks/useEmployeeOptions.ts` to fetch active employees (via existing `EmployeeService`) and map into `Select`-ready `{label,value}` options
- [x] T017 Ensure placeholder pages render valid JSX (no missing imports/types) and show a consistent “Coming soon / Not implemented” UI using existing shared components like `EmptyState` or `ErrorState`

---

## Phase 3: User Story 1 – Manage Attendance (Priority: P1) 🎯 MVP

**Goal**: Attendance dashboard/list with search/filter/sort/pagination, attendance detail view, and conditional manual time-in/time-out/correction actions (only when supported by backend + permissions).

**Independent Test**: Open `/attendance`, verify skeleton/empty/no-results behavior and correct pagination/sort/filter, open `/attendance/:id`, confirm employee/status/timestamps/history display when available, and verify manual actions appear only when supported and permitted.

### Implementation for User Story 1

- [x] T018 [US1] Create attendance types in `src/features/attendance/types/attendance.types.ts` (Attendance, AttendanceStatus union, dashboard summary, and correction input shapes)
- [x] T019 [US1] Create attendance Zod schemas in `src/features/attendance/validation/attendance.schema.ts` (time-in/time-out inputs and correction payload validation)
- [x] T020 [P] [US1] Implement `src/features/attendance/services/attendance.service.ts` (dashboard, list, get, time-in, time-out, corrections, and optional history endpoint; use shared API envelope helpers)
- [x] T021 [US1] Implement `src/features/attendance/hooks/useAttendances.ts` using TanStack Query + `useListQuery` + server pagination via `unwrapList()`
- [x] T022 [US1] Implement `src/features/attendance/hooks/useAttendance.ts` detail query by id (enabled only when id exists)
- [x] T023 [US1] Implement `src/features/attendance/hooks/useAttendanceDashboard.ts` dashboard summary query
- [x] T024 [P] [US1] Implement `src/features/attendance/hooks/useAttendanceMutations.ts` with mutations and query invalidations for `['attendance','dashboard']`, `['attendance','list',params]`, and `['attendance','detail',id]`
- [x] T025 [US1] Implement `src/features/attendance/lib/attendance-status.ts` mapping backend AttendanceStatus enums to `StatusBadge` tone/label helpers
- [x] T026 [P] [US1] Implement `src/features/attendance/components/AttendanceDashboardKpis.tsx` to render dashboard KPI cards from backend summary payload
- [x] T027 [US1] Implement `src/features/attendance/components/AttendanceActionDialog.tsx` (action confirmation + submission shell driven by allowed action type)
- [x] T028 [US1] Implement `src/features/attendance/components/AttendanceCorrectionForm.tsx` using RHF + Zod for correction fields
- [x] T029 [US1] Implement `src/features/attendance/pages/AttendanceDashboardPage.tsx` (dashboard KPIs + embedded attendance list, skeleton/loading/error/empty/no-results states)
- [x] T030 [US1] Implement Attendance list columns in `src/features/attendance/pages/AttendanceDashboardPage.tsx` (employee, status, timestamps, notes; ensure sort fields align with backend)
- [x] T031 [US1] Wire Attendance list URL state in `AttendanceDashboardPage.tsx` using `useListQuery` + `FilterBar` for filters `status`, `employeeId`, `dateFrom`, `dateTo` when supported by backend
- [x] T032 [US1] Implement row navigation in `AttendanceDashboardPage.tsx` using `buildRoute.attendanceDetail(id)`
- [x] T033 [US1] Ensure Attendance empty-state UX distinguishes “no attendance yet” vs “no matches found” in `AttendanceDashboardPage.tsx`
- [x] T034 [US1] Implement `src/features/attendance/pages/AttendanceDetailPage.tsx` detail layout showing employee association, timestamps, status badge, and notes/metadata
- [x] T035 [US1] Implement relationship display in `AttendanceDetailPage.tsx` using backend employee embed fields when present, otherwise show only returned identifiers/fields
- [x] T036 [US1] Implement optional employee attendance history section in `AttendanceDetailPage.tsx` only when backend provides history (no client fabrication)
- [x] T037 [US1] Add conditional time-in action UI in `AttendanceDetailPage.tsx` gated by `PermissionGate` for `attendance.timeIn` and backend “allowed/supported” signals
- [x] T038 [US1] Add conditional time-out action UI in `AttendanceDetailPage.tsx` gated by `PermissionGate` for `attendance.timeOut` and backend “allowed/supported” signals
- [x] T039 [US1] Add conditional correction UI in `AttendanceDetailPage.tsx` gated by `PermissionGate` for `attendance.correct` and backend corrections support in payload
- [x] T040 [US1] Implement submit flow in `AttendanceActionDialog`/`AttendanceCorrectionForm` for time-in/out/corrections (disable while pending, loading indicator, success toast, handle 409 with refresh)
- [x] T041 [US1] Replace the Phase 2 placeholders with fully implemented Attendance pages and ensure `document.title` and accessibility labels exist

---

## Phase 4: User Story 2 – Manage Leave Requests (Priority: P1)

**Goal**: Leave list/detail/create/edit plus approval/cancel workflows driven by backend state and permissions.

**Independent Test**: Open `/leave` to validate list UX; open `/leave/:id` and create a valid leave request; edit/cancel when allowed; approve/reject when permitted by role; confirm approval history and record status updates.

### Implementation for User Story 2

- [x] T042 [US2] Create leave types in `src/features/leave/types/leave.types.ts` (Leave, LeaveStatus union, CreateLeaveInput, UpdateLeaveInput, optional WorkflowHistoryEntry)
- [x] T043 [US2] Create leave Zod schemas in `src/features/leave/validation/leave.schema.ts` (create/edit fields and date constraints end >= start)
- [x] T044 [US2] Implement `src/features/leave/services/leave.service.ts` (list/get/create/update/cancel/approve/reject; use shared envelope helpers; canonicalize endpoints per OpenAPI during implementation)
- [x] T045 [US2] Implement `src/features/leave/hooks/useLeaves.ts` with TanStack Query + `useListQuery` server pagination and `unwrapList()`
- [x] T046 [US2] Implement `src/features/leave/hooks/useLeave.ts` detail query
- [x] T047 [P] [US2] Implement `src/features/leave/hooks/useLeaveMutations.ts` (create/update/cancel/approve/reject; invalidate `leave` list/detail query keys; handle 409 with toast + refresh; map validation errors to RHF)
- [x] T048 [US2] Implement `src/features/leave/lib/leave-status.ts` mapping LeaveStatus to `StatusBadge` tone/label helpers
- [x] T049 [US2] Implement `src/features/leave/components/LeaveForm.tsx` using React Hook Form + Zod; include employee picker using `useEmployeeOptions()`
- [x] T050 [US2] Implement `src/features/leave/components/ApprovalActions.tsx` with buttons gated by `PermissionGate` (`leave.approve`, `leave.reject`, `leave.cancel`) and backend allowed-action signals
- [x] T051 [US2] Implement `src/features/leave/components/WorkflowHistory.tsx` rendering backend approval history or a clear empty placeholder when absent
- [x] T052 [US2] Implement `src/features/leave/pages/LeaveListPage.tsx` list UX (DataTable/table cards; skeleton/loading/error/empty/no-results; FilterBar + Pagination)
- [x] T053 [US2] Wire URL filters/sort/search in `LeaveListPage.tsx` using `useListQuery` for `status`, `employeeId`, and date range filter keys when supported by backend
- [x] T054 [US2] Implement row navigation in `LeaveListPage.tsx` using `buildRoute.leaveDetail(id)`
- [x] T055 [US2] Add conditional row actions (edit/cancel) in `LeaveListPage.tsx` gated by `PermissionGate` and backend state
- [x] T056 [US2] Implement `src/features/leave/pages/LeaveDetailPage.tsx` detail layout (leave type, dates, status, requester/employee, approver info, notes; show status badge)
- [x] T057 [US2] Implement workflow actions in `LeaveDetailPage.tsx` (edit/cancel/approve/reject) gated by both backend allowed-state signals and appropriate `PermissionGate` keys
- [x] T058 [US2] Implement cancel confirmation UI using `src/components/common/ConfirmDialog.tsx` in `LeaveDetailPage.tsx` (disable submit while pending + toasts)
- [x] T059 [US2] Implement approve/reject confirmation UI using `ConfirmDialog` in `LeaveDetailPage.tsx` (include optional notes payload if backend supports)
- [x] T060 [US2] Implement `src/features/leave/pages/LeaveCreatePage.tsx` using `LeaveForm` (disabled submit while saving, success notification, redirect to list or detail)
- [x] T061 [US2] Implement `src/features/leave/pages/LeaveEditPage.tsx` (load detail via `useLeave`, prefill `LeaveForm`, update only when allowed + permitted)
- [x] T062 [US2] Implement 404 not-found state in `LeaveDetailPage.tsx` with recovery navigation back to `/leave`
- [x] T063 [US2] Implement RHF API validation error mapping in `LeaveForm.tsx` using the shared helper (`applyApiValidationErrors`)
- [x] T064 [US2] Ensure “approval history absent” UX does not break layout (omit section or show a placeholder)
- [x] T065 [US2] Ensure date inputs use backend-compatible ISO date strings with Zod validation (no client-side payroll/business recalculation)
- [x] T066 [US2] Implement `document.title` updates and accessible labels for all Leave components/pages
- [x] T067 [US2] Ensure responsive layout for Leave list/detail views on mobile/tablet with accessible action controls

---

## Phase 5: User Story 3 – Manage Cash Advances (Priority: P2)

**Goal**: Cash advance list/detail/create/edit plus approval/cancel workflows driven by backend state and permissions.

**Independent Test**: Open `/cash-advances` to validate list UX; create a cash advance; edit/cancel when allowed; approve/reject when permitted; confirm workflow history and detail fields update correctly.

### Implementation for User Story 3

- [x] T068 [US3] Create cash-advance types in `src/features/cash-advances/types/cash-advance.types.ts` (CashAdvance, CashAdvanceStatus union, CreateCashAdvanceInput, UpdateCashAdvanceInput)
- [x] T069 [US3] Create cash-advance Zod schemas in `src/features/cash-advances/validation/cash-advance.schema.ts` (amount validation and required fields per backend contract)
- [x] T070 [US3] Implement `src/features/cash-advances/services/cash-advance.service.ts` (list/get/create/update/cancel/approve/reject; shared envelope helpers; canonicalize endpoints per OpenAPI)
- [x] T071 [US3] Implement `src/features/cash-advances/hooks/useCashAdvances.ts` with TanStack Query + `useListQuery` server pagination via `unwrapList()`
- [x] T072 [US3] Implement `src/features/cash-advances/hooks/useCashAdvance.ts` detail query
- [x] T073 [P] [US3] Implement `src/features/cash-advances/hooks/useCashAdvanceMutations.ts` (mutations; invalidate list/detail query keys; handle 409 with toast + refresh; map validation errors to RHF)
- [x] T074 [US3] Implement `src/features/cash-advances/lib/cash-advance-status.ts` mapping CashAdvanceStatus to `StatusBadge` tone/label helpers
- [x] T075 [US3] Implement `src/features/cash-advances/components/CashAdvanceForm.tsx` using RHF + Zod; include employee picker using `useEmployeeOptions()`
- [x] T076 [US3] Implement `src/features/cash-advances/components/ApprovalActions.tsx` with buttons gated by `PermissionGate` and backend allowed-action signals
- [x] T077 [US3] Implement `src/features/cash-advances/components/WorkflowHistory.tsx` rendering backend approval history or a clear empty placeholder when absent
- [x] T078 [US3] Implement `src/features/cash-advances/pages/CashAdvancesListPage.tsx` list UX (table/cards; skeleton/loading/error/empty/no-results; FilterBar + Pagination)
- [x] T079 [US3] Implement Cash Advances list columns in `CashAdvancesListPage.tsx` (amount, status, employee, reason snippet, timestamps; ensure sort keys align with backend)
- [x] T080 [US3] Implement row navigation in `CashAdvancesListPage.tsx` using `buildRoute.cashAdvanceDetail(id)`
- [x] T081 [US3] Add conditional row actions (edit/cancel) in `CashAdvancesListPage.tsx` gated by `PermissionGate` and backend state
- [x] T082 [US3] Implement `src/features/cash-advances/pages/CashAdvanceDetailPage.tsx` detail layout showing employee, amount, reason, status badge, and timestamps
- [x] T083 [US3] Implement conditional workflow actions in `CashAdvanceDetailPage.tsx` (edit/cancel/approve/reject) using `ConfirmDialog` and toasts
- [x] T084 [US3] Implement `src/features/cash-advances/pages/CashAdvanceCreatePage.tsx` using `CashAdvanceForm` with disabled submit while saving and success notification
- [x] T085 [US3] Implement `src/features/cash-advances/pages/CashAdvanceEditPage.tsx` (load detail via `useCashAdvance`, prefill form, update only when allowed + permitted)
- [x] T086 [US3] Implement RHF API validation error mapping in `CashAdvanceForm.tsx` using `applyApiValidationErrors`
- [x] T087 [US3] Implement 404 not-found state in `CashAdvanceDetailPage.tsx` with recovery navigation back to `/cash-advances`
- [x] T088 [US3] Ensure unauthorized users cannot see workflow actions due to correct `PermissionGate` usage
- [x] T089 [US3] Ensure 409 conflict handling shows friendly messaging and triggers detail/list refresh
- [x] T090 [US3] Implement `document.title` updates and accessible labels for Cash Advances pages/components
- [x] T091 [US3] Ensure responsive layout and dialog focus management for Cash Advance actions

---

## Phase 6: User Story 4 – Review Payroll Information (Priority: P2)

**Goal**: Read-only payroll list/detail and period/summary views that display backend-computed totals exactly (no frontend payroll calculations).

**Independent Test**: Open `/payroll` and validate list UX; open `/payroll/:id` and confirm summary and line items match backend payload values exactly; verify no mutation actions exist.

### Implementation for User Story 4

- [x] T092 [US4] Create payroll types in `src/features/payroll/types/payroll.types.ts` (Payroll, PayrollPeriod, PayrollLineItem, summary shapes, PayrollStatus)
- [x] T093 [US4] Implement `src/features/payroll/services/payroll.service.ts` read-only methods list/get/periods/summary with envelope unwrapping
- [x] T094 [US4] Implement `src/features/payroll/hooks/usePayrolls.ts` list query (TanStack Query + `useListQuery` server pagination + URL state)
- [x] T095 [US4] Implement `src/features/payroll/hooks/usePayroll.ts` detail query
- [x] T096 [US4] Implement `src/features/payroll/hooks/usePayrollPeriods.ts` for period filter options if backend exposes periods endpoint
- [x] T097 [US4] Implement `src/features/payroll/components/PayrollSummaryCards.tsx` to display backend provided totals exactly (formatting only)
- [x] T098 [US4] Implement `src/features/payroll/components/PayrollLineItemsTable.tsx` to render `PayrollLineItem[]` in an accessible format
- [x] T099 [US4] Implement `src/features/payroll/pages/PayrollListPage.tsx` list UX (skeleton/loading/error/empty/no-results; FilterBar + Pagination; document titles)
- [x] T100 [US4] Implement list columns and sort/filter mapping in `PayrollListPage.tsx` based on backend fields (no client arithmetic)
- [x] T101 [US4] Implement navigation from list rows to `buildRoute.payrollDetail(id)` and confirm deep links render correctly
- [x] T102 [US4] Implement `src/features/payroll/pages/PayrollDetailPage.tsx` showing period metadata/status plus summary cards and line items from API payload
- [x] T103 [US4] If summary is a separate endpoint, fetch it and display it without recomputing totals
- [x] T104 [US4] Ensure payroll UI is strictly read-only by omitting all create/edit/mutation actions and mutation hooks
- [x] T105 [US4] Implement graceful fallback when periods/summary endpoints are absent (omit sections and show placeholders)
- [x] T106 [US4] Implement 404 not-found state in `PayrollDetailPage.tsx` with recovery navigation back to `/payroll`
- [x] T107 [US4] Ensure responsive layout for payroll list/detail (use DataTable responsive patterns where applicable)
- [x] T108 [US4] Verify payroll values render from API response objects exactly (formatting only)
- [x] T109 [US4] Replace Phase 2 placeholders with fully implemented Payroll pages and ensure PermissionGuard view gating works

---

## Phase 7: User Story 5 – Navigate Workforce Modules Securely (Priority: P1)

**Goal**: Add workforce menu items and ensure visibility is permission-driven (no hardcoded visibility). Deep linking must work correctly.

**Independent Test**: Sign in with different roles/permissions and confirm Attendance/Leave/Cash Advances/Payroll appear only when authorized; confirm direct URL access is blocked when lacking permission; confirm browser back/forward doesn’t break workforce layout/state.

### Implementation for User Story 5

- [x] T110 [US5] Update `src/constants/navigation.ts` to add `Attendance` nav item (icon `Clock`, href `ROUTES.attendance`, `anyOf: [PERMISSIONS.attendance.view]`)
- [x] T111 [US5] Update `src/constants/navigation.ts` to add `Leave` nav item (icon `CalendarDays`, href `ROUTES.leave`, `anyOf: [PERMISSIONS.leave.view]`)
- [x] T112 [US5] Update `src/constants/navigation.ts` to add `Cash Advances` nav item (icon `Wallet`, href `ROUTES.cashAdvances`, `anyOf: [PERMISSIONS.cashAdvance.view]`)
- [x] T113 [US5] Update `src/constants/navigation.ts` to add `Payroll` nav item (icon `Banknote`, href `ROUTES.payroll`, `anyOf: [PERMISSIONS.payroll.view]`)
- [x] T114 [US5] Ensure navigation items are never hardcoded visible without permission checks by using only `anyOf` permission arrays and existing `usePermissions` logic
- [x] T115 [US5] Validate deep linking by ensuring all nav `href` values come exclusively from `src/constants/routes.ts` constants
- [x] T116 [US5] Audit `src/app/router/routes.tsx` to ensure every workforce route is wrapped with `PermissionGuard` using the correct `*.view` permission key
- [x] T117 [US5] Audit workflow action gating across attendance/leave/cash pages so buttons use `PermissionGate` with the correct permission keys

---

## Phase 8: Polish & Spec 005 Readiness

- [x] T118 Implement/confirm relationship display on all workforce detail pages (use API employee embed fields when present; otherwise show identifiers/fields returned by backend)
- [x] T119 Add/confirm consistent skeleton, empty (“no records yet”), no-results (“no matches”), and retryable error states on every list page
- [x] T120 Standardize page header placement, breadcrumbs behavior, and primary actions across all workforce screens using existing DashboardLayout/PageHeader conventions
- [x] T121 Accessibility pass across all workforce modules (semantic HTML, labels, keyboard navigation, and dialog focus management)
- [x] T122 Responsive verification at 320px/768px/1280px/1536px for attendance, leave, cash-advances, and payroll screens
- [x] T123 Error handling consistency across modules (toasts on mutation failures, friendly 409 conflict handling, safe not-found UI on 404s)
- [x] T124 Performance pass (lazy-loaded routes, `keepPreviousData` on list queries, stable rendering for DataTables and pagination controls)
- [x] T125 Contract reconciliation pass (verify endpoint paths, sortBy keys, and filter keys against Backend P003 OpenAPI and update service constants/mappings without changing UI architecture)
- [x] T126 Enforce out-of-scope boundaries (ensure no Transaction/Trip/Expense/Analytics/Reports/Activity Logs code introduced outside these modules)
- [x] T127 Run quality gates and manual validation: `pnpm typecheck`, `pnpm lint`, `pnpm build`, and execute `specs/004-workforce-management/quickstart.md` scenarios

---

## Dependencies & Execution Order

Phase 2 must complete before any user story. After Phase 2, US2/US3 can share only the `useEmployeeOptions()` picker and can be developed in parallel; US4 (Payroll) is read-only and can be developed in parallel with US2/US3 once Phase 2 wiring exists. US5 (Navigation) can be completed once permission keys and route guards are wired in Phase 2.

## Parallel Opportunities

All Phase 1 directory-creation tasks can run in parallel. Within each user story, services/types/hooks can be built before pages as long as the page components exist for routing. Final accessibility/responsive checks can be done after all modules are implemented.
