# Tasks: Specification 010 – Reports

**Input**: Design documents from `/specs/010-reports/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Not requested in Specification 010 (manual quickstart validation required).

**Organization**: Tasks grouped by user story for independent implementation and testing. New module at `src/features/reports/` — no architectural refactor of Specs 001–009. Absorb Spec 008 expense-report helpers into this module.

## Phase 1: Setup (Reports Module Scaffolding)

**Purpose**: Create feature directory tree and placeholder files so foundational work can proceed without import errors.

- [x] T001 Create directory tree under `src/features/reports/` per `plan.md`: `components/`, `hooks/`, `pages/`, `services/`, `types/`, `validation/`, `lib/`.
- [x] T002 [P] Create `src/features/reports/types/reports.types.ts` with exported placeholder types (`ReportDomain`, `ReportFilterSet`, `ReportListResponse`).
- [x] T003 [P] Create `src/features/reports/services/report.service.ts` with exported `REPORT_ENDPOINTS` and `ReportService` placeholder object.
- [x] T004 [P] Create `src/features/reports/lib/report-api.ts` with placeholder `buildReportQueryParams` and `downloadBlob` exports.
- [x] T005 [P] Create placeholder domain libs: `src/features/reports/lib/transaction-report-api.ts`, `trip-report-api.ts`, `expense-report-api.ts`, `payroll-report-api.ts`, `attendance-report-api.ts`.
- [x] T006 [P] Create `src/features/reports/validation/report-filter.schema.ts` with placeholder Zod schema.
- [x] T007 [P] Create `src/features/reports/hooks/report-keys.ts` with exported `reportKeys` placeholders.
- [x] T008 [P] Create placeholder stores: `src/features/reports/hooks/useReportFilterStore.ts`, `useReportPreferencesStore.ts`.
- [x] T009 [P] Create placeholder hooks: `src/features/reports/hooks/useTransactionReport.ts`, `useTripReport.ts`, `useExpenseReport.ts`, `usePayrollReport.ts`, `useAttendanceReport.ts`, `useReportExport.ts`.
- [x] T010 [P] Create placeholder components: `src/features/reports/components/ReportCategoryCard.tsx`, `ReportFilterBar.tsx`, `ReportSummaryStrip.tsx`.
- [x] T011 [P] Create placeholder components: `src/features/reports/components/ReportExportMenu.tsx`, `ReportPrintButton.tsx`, `ReportTable.tsx`.
- [x] T012 [P] Create placeholder components: `src/features/reports/components/ReportEmptyState.tsx`, `ReportErrorState.tsx`, `ReportSkeleton.tsx`.
- [x] T013 [P] Create placeholder pages: `src/features/reports/pages/ReportsHubPage.tsx`, `TransactionReportsPage.tsx`, `TripReportsPage.tsx`, `ExpenseReportsPage.tsx`, `PayrollReportsPage.tsx`, `AttendanceReportsPage.tsx`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Types, services, libs, permissions, routes, navigation, shared UI primitives, and Zustand stores. **No user story work until this phase completes.**

- [x] T014 Define `ReportDomain` and `ReportExportFormat` unions in `src/features/reports/types/reports.types.ts` per `data-model.md`.
- [x] T015 Define `ReportFilterSet` interface in `src/features/reports/types/reports.types.ts` with from, to, entity filters, search, pagination, and domain-extra fields.
- [x] T016 Define `ReportSummary`, `ReportPageMeta`, and `ReportListResponse<TRow>` in `src/features/reports/types/reports.types.ts`.
- [x] T017 Define row interfaces in `src/features/reports/types/reports.types.ts`: `TransactionReportRow`, `TripReportRow`, `ExpenseReportRow`, `PayrollReportRow`, `AttendanceReportRow`.
- [x] T018 Define `ReportExportRequest` and `ReportExportResult` in `src/features/reports/types/reports.types.ts`.
- [x] T019 Implement date helpers and `downloadBlob` in `src/features/reports/lib/report-api.ts` (ISO start/end, max 366-day span check).
- [x] T020 Implement `buildReportQueryParams(domain, filters)` in `src/features/reports/lib/report-api.ts` per `contracts/api-endpoints.md`.
- [x] T021 Implement Zod schema in `src/features/reports/validation/report-filter.schema.ts` requiring from/to, from ≤ to, span ≤ 366 days.
- [x] T022 Port expense report normalizers from `src/features/expenses/lib/expense-report-api.ts` into `src/features/reports/lib/expense-report-api.ts`.
- [x] T023 [P] Implement transaction row/summary normalizers in `src/features/reports/lib/transaction-report-api.ts`.
- [x] T024 [P] Implement trip row/summary normalizers in `src/features/reports/lib/trip-report-api.ts`.
- [x] T025 [P] Implement payroll row/summary normalizers in `src/features/reports/lib/payroll-report-api.ts`.
- [x] T026 [P] Implement attendance row/summary normalizers in `src/features/reports/lib/attendance-report-api.ts`.
- [x] T027 Implement `REPORT_ENDPOINTS` in `src/features/reports/services/report.service.ts` for five list paths and export paths.
- [x] T028 Implement `ReportService.listTransactions` in `src/features/reports/services/report.service.ts` calling `GET /reports/transactions`.
- [x] T029 Implement `ReportService.listTrips` in `src/features/reports/services/report.service.ts` calling `GET /reports/trips`.
- [x] T030 Implement `ReportService.listExpenses` in `src/features/reports/services/report.service.ts` calling `GET /reports/expenses`.
- [x] T031 Implement `ReportService.listPayroll` in `src/features/reports/services/report.service.ts` calling `GET /reports/payroll`.
- [x] T032 Implement `ReportService.listAttendance` in `src/features/reports/services/report.service.ts` calling `GET /reports/attendance`.
- [x] T033 Implement `ReportService.export` in `src/features/reports/services/report.service.ts` with Axios `responseType: 'blob'` (no client-side file generation).
- [x] T034 Implement `reportKeys` factory in `src/features/reports/hooks/report-keys.ts` for list and export keys with serialized filters.
- [x] T035 Implement `useReportFilterStore` in `src/features/reports/hooks/useReportFilterStore.ts` with per-domain filters and default current-month range.
- [x] T036 Implement `useReportPreferencesStore` in `src/features/reports/hooks/useReportPreferencesStore.ts` for pageSize and UI prefs (no row payload caching).
- [x] T037 Implement `ReportEmptyState`, `ReportErrorState`, and `ReportSkeleton` in `src/features/reports/components/`.
- [x] T038 Implement `ReportSummaryStrip` in `src/features/reports/components/ReportSummaryStrip.tsx` rendering backend summary fields only.
- [x] T039 Implement `ReportTable` in `src/features/reports/components/ReportTable.tsx` wrapping shared `DataTable` with pagination props.
- [x] T040 Implement `ReportCategoryCard` in `src/features/reports/components/ReportCategoryCard.tsx` for hub navigation cards.
- [x] T041 Update `src/constants/permissions.ts` additively with `PERMISSIONS.reports.view` (and optional `reports.export` if OpenAPI splits).
- [x] T042 Update `PermissionKey` union in `src/constants/permissions.ts` to include reports permission keys.
- [x] T043 Update `src/features/auth/lib/session.ts` `ROLE_PERMISSIONS` for OWNER and MANAGER with reports permissions; ensure EMPLOYEE has none.
- [x] T044 Update `src/constants/routes.ts` with `reports`, `reportsTransactions`, `reportsTrips`, `reportsExpenses`, `reportsPayroll`, `reportsAttendance`.
- [x] T045 Update `src/constants/navigation.ts` to add Reports nav item with `anyOf: [PERMISSIONS.reports.view]` and Lucide `FileText` icon (after Analytics).
- [x] T046 Register lazy report routes in `src/app/router/routes.tsx` for hub + five domains with `PermissionGuard` per `contracts/routes-and-guards.md`.
- [x] T047 Update `src/lib/breadcrumb.ts` to support reports and domain breadcrumb segments.
- [x] T048 Update `src/hooks/useBreadcrumbTrail.ts` if needed for Reports labels.
- [x] T049 Run `pnpm typecheck` after foundational changes and fix compile errors in `src/features/reports/` and updated constants.

**Checkpoint**: Types, services, routes, and permissions ready — user story implementation can begin.

---

## Phase 3: User Story 1 – Discover and Open Reports (Priority: P1) 🎯 MVP

**Goal**: Authorized users open `/reports`, see categories, navigate to domain routes; unauthorized users are blocked.

**Independent Test**: Owner/Manager sees Reports nav and hub categories; open `/reports/transactions`; Employee forbidden on `/reports`.

- [x] T050 [US1] Implement static `REPORT_CATEGORIES` config in `src/features/reports/lib/report-categories.ts` linking to five domain routes.
- [x] T051 [US1] Build `ReportsHubPage` in `src/features/reports/pages/ReportsHubPage.tsx` with `PageContainer`, `PageHeader`, and category cards via `ReportCategoryCard`.
- [x] T052 [US1] Add quick-access links on `ReportsHubPage` to each domain route.
- [x] T053 [US1] Optionally fetch recent/saved filters on `ReportsHubPage` only when endpoints exist; omit sections cleanly when unsupported.
- [x] T054 [US1] Scaffold domain pages with `PageHeader` titles in `TransactionReportsPage.tsx`, `TripReportsPage.tsx`, `ExpenseReportsPage.tsx`, `PayrollReportsPage.tsx`, `AttendanceReportsPage.tsx`.
- [x] T055 [US1] Set `document.title` on hub and domain pages in `src/features/reports/pages/`.
- [x] T056 [US1] Verify `/reports` and `/reports/expenses` deep links work with browser back/forward after Phase 2 route registration.
- [x] T057 [US1] Verify Employee cannot access reports routes (nav hidden, direct URL shows forbidden recovery path).

**Checkpoint**: User Story 1 independently testable — hub and navigation complete.

---

## Phase 4: User Story 2 – Filter, Search, and Page Results (Priority: P1)

**Goal**: Users apply date range, entity filters, search, and pagination; summaries come only from API; invalid ranges block requests.

**Independent Test**: On a domain page, set valid month range + branch filter, search, change page; network params and rows match API.

- [x] T058 [US2] Implement `ReportFilterBar` in `src/features/reports/components/ReportFilterBar.tsx` with from/to date inputs and Zod validation messages.
- [x] T059 [US2] Wire branch/warehouse/vehicle/employee pickers in `ReportFilterBar` using existing option hooks from Specs 003–004.
- [x] T060 [US2] Add search input to `ReportFilterBar` that sends backend `search` only (min length 2); never client-filter full datasets.
- [x] T061 [US2] Support domain-extra filter slots in `ReportFilterBar` (transaction type, expense category, payroll period, trip status) via `allowedFilters` config.
- [x] T062 [US2] Implement `useTransactionReport` in `src/features/reports/hooks/useTransactionReport.ts` with `enabled` when filters valid and `placeholderData: keepPreviousData`.
- [x] T063 [US2] Implement remaining list hooks in `src/features/reports/hooks/useTripReport.ts`, `useExpenseReport.ts`, `usePayrollReport.ts`, `useAttendanceReport.ts` with the same query patterns.
- [x] T064 [US2] Integrate `ReportFilterBar`, `ReportSummaryStrip`, `ReportTable`, pagination, empty/error/skeleton into `ExpenseReportsPage` as the reference domain page.
- [x] T065 [US2] Wire page/pageSize from `useReportFilterStore` / preferences into report queries on `ExpenseReportsPage`.
- [x] T066 [US2] Block queries and show inline errors when date range invalid on `ReportFilterBar` / page.
- [x] T067 [US2] Apply the same filter/table wiring pattern to `TransactionReportsPage`, `TripReportsPage`, `PayrollReportsPage`, and `AttendanceReportsPage`.

**Checkpoint**: User Story 2 independently testable — filters/search/pagination work on all domains.

---

## Phase 5: User Story 3 – Transaction and Trip Reports (Priority: P2)

**Goal**: Transaction and trip report pages show backend summary + detail tables (inbound/outbound, utilization/status) without client aggregation.

**Independent Test**: Open `/reports/transactions` and `/reports/trips`; compare rows/summary to API; no invented totals.

- [x] T068 [US3] Define transaction table columns in `src/features/reports/pages/TransactionReportsPage.tsx` including type (inbound/outbound) when API provides.
- [x] T069 [US3] Render `ReportSummaryStrip` on `TransactionReportsPage` from API summary only.
- [x] T070 [US3] Add PermissionGate deep links from transaction rows to transaction detail when `id` present.
- [x] T071 [US3] Define trip table columns in `src/features/reports/pages/TripReportsPage.tsx` for status, vehicle, employee, duration when API provides.
- [x] T072 [US3] Render trip summary/utilization fields from API on `TripReportsPage` without joining CRUD list endpoints.
- [x] T073 [US3] Add PermissionGate deep links from trip rows to trip/vehicle/employee detail routes when permitted.
- [x] T074 [US3] Ensure loading, empty, and error states on both transaction and trip report pages.

**Checkpoint**: User Story 3 independently testable — txn/trip reports complete.

---

## Phase 6: User Story 4 – Expense, Payroll, and Attendance Reports (Priority: P2)

**Goal**: Expense, payroll, and attendance report pages display backend rows/summaries; migrate ownership away from Spec 008 expense helpers.

**Independent Test**: Open `/reports/expenses`, `/reports/payroll`, `/reports/attendance`; verify against Backend P009.

- [x] T075 [US4] Complete expense columns (category, reference type, amount, date) on `ExpenseReportsPage` using reports-module normalizers.
- [x] T076 [US4] Implement payroll columns and period filter on `PayrollReportsPage` from API fields only (no payroll math).
- [x] T077 [US4] Implement attendance columns and employee attendance rows on `AttendanceReportsPage` from API fields only.
- [x] T078 [US4] Display any backend-provided trend/summary fields as read-only summary/table data (not Analytics charts).
- [x] T079 [US4] Remove or re-export Spec 008 `useExpenseReport` / `ExpenseService.listReport` so Reports owns `/reports/expenses` in `src/features/expenses/` (no CRUD list misuse).
- [x] T080 [US4] Add loading, empty, and error states on expense, payroll, and attendance report pages.

**Checkpoint**: User Story 4 independently testable — remaining domains + expense migration complete.

---

## Phase 7: User Story 5 – Export Reports (Priority: P2)

**Goal**: Users export CSV/Excel (PDF if supported) via backend blob; progress and completion feedback; no client-built files.

**Independent Test**: Export CSV from a filtered report; confirm blob request and download; confirm no DOM-scraped CSV.

- [x] T081 [US5] Implement `useReportExport` mutation in `src/features/reports/hooks/useReportExport.ts` calling `ReportService.export` with toast success/error.
- [x] T082 [US5] Implement `ReportExportMenu` in `src/features/reports/components/ReportExportMenu.tsx` listing formats from capability config (hide unsupported PDF).
- [x] T083 [US5] Show non-blocking busy/progress state on export button while mutation pending.
- [x] T084 [US5] On success, trigger `downloadBlob` from `report-api.ts` using filename from `Content-Disposition` when present.
- [x] T085 [US5] Wire `ReportExportMenu` into all five domain report pages with active filter set.
- [x] T086 [US5] On export failure, keep table visible and show safe error toast with retry.
- [x] T087 [US5] Verify export never synthesizes CSV/Excel/PDF from in-memory table rows in `src/features/reports/`.

**Checkpoint**: User Story 5 independently testable — backend export works.

---

## Phase 8: User Story 6 – Print and Print-Friendly Views (Priority: P3)

**Goal**: Users print the current report view using backend-sourced on-screen data in a print-friendly layout.

**Independent Test**: Print a populated report; layout shows same backend rows/summary; cancel leaves UI intact.

- [x] T088 [US6] Implement `ReportPrintButton` in `src/features/reports/components/ReportPrintButton.tsx` calling `window.print()`.
- [x] T089 [US6] Add print-friendly CSS classes/styles for report summary + table in report pages or `src/styles/` as appropriate.
- [x] T090 [US6] Wire `ReportPrintButton` into all five domain report pages; disable or guide when empty.
- [x] T091 [US6] Ensure print uses already-loaded query data (no separate client recalculation).
- [x] T092 [US6] Verify cancel/close print leaves on-screen report state unchanged.

**Checkpoint**: User Story 6 independently testable — print path complete.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Production quality, accessibility, responsive verification, URL sync, Spec 011 boundary.

- [x] T093 [P] Verify responsive layouts on mobile (320px+), tablet, desktop — filter bar collapses, tables scroll or card-fallback.
- [x] T094 [P] Verify light/dark mode for filters, tables, export/print actions.
- [x] T095 [P] Verify keyboard navigation for filters, pagination, export menu, and print button.
- [x] T096 [P] Optionally sync `from`/`to` (and domain) to URL search params on domain pages for shareable deep links.
- [x] T097 [P] Verify lazy-loaded report route chunks in `pnpm build` output.
- [x] T098 [P] Confirm no `/activity-logs` routes and no `/analytics` calls under `src/features/reports/`.
- [x] T099 [P] Confirm no client-side aggregation or local export generation remains in reports feature.
- [x] T100 Run `pnpm typecheck`, `pnpm lint`, and `pnpm build`; fix errors in reports feature and touched shared files.
- [x] T101 Run manual validation per `specs/010-reports/quickstart.md` Scenarios 1–8 and update OpenAPI checklist in `specs/010-reports/research.md`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately.
- **Foundational (Phase 2)**: Depends on Phase 1 — **BLOCKS all user stories**.
- **US1 (Phase 3)**: After Phase 2 — MVP hub/navigation.
- **US2 (Phase 4)**: After Phase 2; benefits from US1 page scaffolds.
- **US3–US4 (Phases 5–6)**: After US2 filter/table wiring.
- **US5 (Phase 7)**: After at least one domain page has filters (US2).
- **US6 (Phase 8)**: After domain pages show data (US2+).
- **Polish (Phase 9)**: After Phases 3–8.

### User Story Dependencies

| Story | Priority | Depends on             | Independent test                       |
| ----- | -------- | ---------------------- | -------------------------------------- |
| US1   | P1       | Phase 2                | Hub + nav + forbidden                  |
| US2   | P1       | Phase 2, US1 scaffolds | Filters/search/page vs API             |
| US3   | P2       | US2                    | Txn + trip pages vs API                |
| US4   | P2       | US2                    | Expense/payroll/attendance + migration |
| US5   | P2       | US2                    | Backend export download                |
| US6   | P3       | US2+                   | Print-friendly view                    |

### Parallel Opportunities

- **Phase 1**: T002–T013 all [P].
- **Phase 2**: T023–T026 domain normalizers [P]; list service methods after T027.
- **Phase 5–6**: Domain pages can proceed in parallel after US2 pattern established.
- **Phase 9**: T093–T099 [P].

### Parallel Example: User Story 4

```bash
Task: "Complete expense columns on ExpenseReportsPage"
Task: "Implement payroll columns on PayrollReportsPage"
Task: "Implement attendance columns on AttendanceReportsPage"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (hub + routes + auth)
4. **STOP and VALIDATE**: quickstart Scenario 1
5. Demo if ready

### Incremental Delivery

1. Setup + Foundational → foundation ready
2. US1 → hub MVP
3. US2 → filters/search/pagination on all domains
4. US3 → transaction + trip depth
5. US4 → expense/payroll/attendance + migration
6. US5 → export
7. US6 → print
8. Polish → production gate for Spec 011

### Parallel Team Strategy

1. Team completes Setup + Foundational together
2. Dev A: US1 + US2 (hub + shared filter/table)
3. Dev B: US3 + US5 (txn/trip + export)
4. Dev C: US4 + US6 (remaining domains + print)
5. Merge and run Phase 9 together

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks in the same batch
- [Story] label maps task to user story for traceability
- No automated test tasks — manual quickstart validation only
- Never call Axios from components; all requests through `ReportService`
- Never aggregate report totals or generate export files on the frontend
- Commit after each task or logical group; stop at any checkpoint to validate story independently
