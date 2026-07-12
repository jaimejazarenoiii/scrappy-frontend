# Implementation Plan: Reports (Specification 010)

**Branch**: `010-reports`  
**Date**: 2026-07-10  
**Spec**: [spec.md](./spec.md)  
**Backend**: P009 — `/api/v1/reports/*`

## Summary

Deliver a read-only Reports module at `src/features/reports/` that consumes Backend P009 for tabular report retrieval, filtering, search, pagination, backend-generated export, and print-friendly views across transactions, trips, expenses, payroll, and attendance. Architecture follows Specs 001–009: Axios via service classes, TanStack Query for server state, Zustand for UI/filter preferences only, React Router lazy domain routes, permission-driven navigation.

**Out of scope**: Activity Logs, Analytics aggregation, client-side export file generation, client-side full-dataset search.

## Technical Context

| Area                | Choice                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------ |
| **Language**        | TypeScript 5.x (strict)                                                                    |
| **Framework**       | React 19 + Vite                                                                            |
| **Routing**         | React Router Data Router, nested layouts, lazy routes                                      |
| **Server state**    | TanStack Query v5                                                                          |
| **Client UI state** | Zustand (filters, view prefs)                                                              |
| **HTTP**            | Axios via shared `apiClient` (Spec 001); `responseType: 'blob'` for export                 |
| **UI**              | Existing `DataTable`, `PageHeader`, `FilterBar`, skeletons, toasts + feature report chrome |
| **Auth**            | JWT + `PermissionGuard`; `PERMISSIONS.reports.view`                                        |
| **Target**          | Owner/Manager; Employee forbidden                                                          |
| **New deps**        | None planned (native blob download + `window.print`)                                       |

## Constitution Check

_GATE: Must pass before Phase 0 research and re-checked after Phase 1 design._

| Gate                                            | Status |
| ----------------------------------------------- | ------ |
| API First — services only, no Axios in UI       | PASS   |
| Type safety — Zod filters, no `any`             | PASS   |
| Feature module under `src/features/reports/`    | PASS   |
| Routing — URL per domain, lazy                  | PASS   |
| State — Query for rows/export; Zustand UI only  | PASS   |
| Reuse shared UI / design system                 | PASS   |
| Auth — permission keys, not role hardcoding     | PASS   |
| A11y + responsive + production quality          | PASS   |
| No Activity Logs / no Analytics misuse          | PASS   |
| Dependency discipline — no unjustified packages | PASS   |

**Post-design re-check**: PASS — contracts and data model preserve boundaries; Spec 008 expense-report helpers migrate into Reports ownership.

## Project Structure

### Documentation

```text
specs/010-reports/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── api-endpoints.md
│   └── routes-and-guards.md
└── tasks.md             # /speckit-tasks (not this command)
```

### Source (target)

```text
src/features/reports/
├── types/reports.types.ts
├── validation/report-filter.schema.ts
├── lib/
│   ├── report-api.ts              # shared params, dates, download helper
│   ├── transaction-report-api.ts
│   ├── trip-report-api.ts
│   ├── expense-report-api.ts      # migrate from expenses feature
│   ├── payroll-report-api.ts
│   └── attendance-report-api.ts
├── services/report.service.ts
├── hooks/
│   ├── report-keys.ts
│   ├── useReportFilterStore.ts
│   ├── useReportPreferencesStore.ts
│   ├── useTransactionReport.ts
│   ├── useTripReport.ts
│   ├── useExpenseReport.ts
│   ├── usePayrollReport.ts
│   ├── useAttendanceReport.ts
│   └── useReportExport.ts
├── components/
│   ├── ReportCategoryCard.tsx
│   ├── ReportFilterBar.tsx
│   ├── ReportSummaryStrip.tsx
│   ├── ReportExportMenu.tsx
│   ├── ReportPrintButton.tsx
│   ├── ReportTable.tsx
│   ├── ReportEmptyState.tsx
│   ├── ReportErrorState.tsx
│   └── ReportSkeleton.tsx
└── pages/
    ├── ReportsHubPage.tsx
    ├── TransactionReportsPage.tsx
    ├── TripReportsPage.tsx
    ├── ExpenseReportsPage.tsx
    ├── PayrollReportsPage.tsx
    └── AttendanceReportsPage.tsx

src/constants/{routes,permissions,navigation}.ts
src/app/router/routes.tsx
src/features/auth/lib/session.ts
src/lib/breadcrumb.ts / useBreadcrumbTrail.ts
```

**Structure decision**: Hub + five domain pages (required routes). Shared filter/export/print chrome; domain-specific columns/normalizers only.

---

## Implementation Phases

### Phase 1 — Foundation: Types, Shared Lib, Service

**Objective**: Establish report contracts and API access without full UI.

**Scope**: Types, Zod filter schema, shared date/param builders, `ReportService` list + export stubs, query keys; migrate expense report normalizers into reports lib.

**Tasks**:

1. Create `reports.types.ts` per [data-model.md](./data-model.md)
2. Implement `report-filter.schema.ts` (required from/to, max 366 days)
3. Implement `report-api.ts` (ISO date helpers, `buildReportQueryParams`, `downloadBlob`)
4. Port expense report normalizers from `src/features/expenses/lib/expense-report-api.ts`
5. Add domain normalizer stubs for transactions, trips, payroll, attendance
6. Implement `ReportService` list methods + export blob method
7. Add `reportKeys` factory

**Deliverables**: Typed service layer callable without pages.

**Dependencies**: Spec 001 `apiClient`; OpenAPI smoke access preferred.

**Validation**: Manual service call / temporary hook; expense params match Spec 008 behavior.

**Risks**: Export path shape unknown → abstract behind `export()` and reconcile checklist.

**Exit criteria**: Valid filters build query strings; invalid ranges rejected; no UI required.

**Parallel**: Domain normalizer files after shared types exist.

---

### Phase 2 — Platform Wiring: Permissions, Routes, Navigation

**Objective**: Integrate Reports into app shell.

**Scope**: Permissions, routes, nav, breadcrumbs, hub + page scaffolds.

**Tasks**:

1. Add `PERMISSIONS.reports.view` (+ optional `export`)
2. Grant Owner/Manager in `session.ts`
3. Add route constants for hub + five domains
4. Register lazy routes with `PermissionGuard`
5. Add Reports nav item after Analytics
6. Breadcrumb segments
7. Scaffold hub and five pages with `PageHeader`

**Deliverables**: Deep-linkable protected shell.

**Dependencies**: Phase 1 optional for empty scaffolds.

**Validation**: [quickstart.md](./quickstart.md) Scenario 1.

**Risks**: Permission key naming drift → confirm OpenAPI.

**Exit criteria**: Employee forbidden; Owner reaches all six routes.

**Parallel**: Constants/nav while Phase 1 finishes.

---

### Phase 3 — Shared Report UI Primitives

**Objective**: Reusable filter, summary, table, export, print chrome.

**Scope**: Zustand stores; filter bar with entity pickers; summary strip; table wrapper; export menu; print button; empty/error/skeleton.

**Tasks**:

1. `useReportFilterStore` / `useReportPreferencesStore`
2. `ReportFilterBar` — dates, shared entity filters, search, domain extras slot
3. `ReportSummaryStrip` — render API summary fields only
4. `ReportTable` — wrap `DataTable` + pagination wiring
5. `ReportExportMenu` — format list from capability config
6. `ReportPrintButton` + print CSS class
7. Empty/error/skeleton components
8. `ReportCategoryCard` for hub

**Deliverables**: Composable UI used by all domain pages.

**Dependencies**: Phase 1 types; Phase 2 scaffolds; existing branch/warehouse/employee/vehicle option hooks.

**Validation**: Story/manual with mock `ReportListResponse`.

**Risks**: Over-generic filter bar → use domain `allowedFilters` config.

**Exit criteria**: Invalid dates block queries; export menu hides unsupported formats.

**Parallel**: Export/print vs filter bar after stores land.

---

### Phase 4 — Query Hooks & Export Mutation

**Objective**: Connect service to React with caching and download UX.

**Scope**: Five list hooks; export mutation; `keepPreviousData`; enabled when filters valid.

**Tasks**:

1. Implement `useTransactionReport`, `useTripReport`, `useExpenseReport`, `usePayrollReport`, `useAttendanceReport`
2. Implement `useReportExport` with toast + blob download
3. Wire filter store → query keys
4. Deprecate/remove expenses-feature `useExpenseReport` usage (point to reports module)

**Deliverables**: Data layer ready for pages.

**Dependencies**: Phases 1 and 3.

**Validation**: Network tab params; export downloads file.

**Risks**: Async export jobs → add polling only if API returns job id.

**Exit criteria**: List refetch on filter change; export failure leaves table intact.

**Parallel**: Hooks per domain after service complete.

---

### Phase 5 — Hub + Transaction & Trip Report Pages

**Objective**: Ship hub MVP and first two operational domains.

**Scope**: `ReportsHubPage`; `TransactionReportsPage`; `TripReportsPage`.

**Tasks**:

1. Hub with five category cards + quick access; optional recent/saved if endpoints exist
2. Transaction page — summary strip, filters (incl. type if API), table, export, print
3. Trip page — status/utilization columns from API, filters, export, print
4. Entity deep links behind `PermissionGate`

**Deliverables**: US1–US3 core paths.

**Dependencies**: Phases 2–4.

**Validation**: Quickstart Scenarios 1–4 (partial).

**Risks**: Column field drift → normalizers + defensive optional chaining.

**Exit criteria**: Hub navigates; txn/trip tables match API; no client totals.

**Parallel**: Transaction and trip pages after shared chrome.

---

### Phase 6 — Expense, Payroll & Attendance Pages

**Objective**: Complete remaining domains; finish expense migration.

**Scope**: Expense, payroll, attendance pages; remove Spec 008 report ownership from expenses UI.

**Tasks**:

1. `ExpenseReportsPage` using reports service
2. `PayrollReportsPage` with period filter when supported
3. `AttendanceReportsPage`
4. Ensure Expenses module no longer presents `/reports/expenses` as its list source
5. Document migration in research checklist

**Deliverables**: US4 complete.

**Dependencies**: Phase 5 patterns.

**Validation**: Quickstart Scenario 5.

**Risks**: Payroll/attendance OpenAPI thinner → ship table with available columns only.

**Exit criteria**: All five domain routes functional with filters/export/print.

**Parallel**: Three domain pages in parallel.

---

### Phase 7 — Export, Print Polish & URL Sync

**Objective**: Harden export/print and shareable filter URLs.

**Scope**: Export progress UX; print stylesheet; optional `from`/`to` query sync; capability flags for PDF.

**Tasks**:

1. Export busy states + error toasts for all domains
2. Print-friendly layout verification
3. Optional URL search-param sync for dates
4. Hub: omit recent/saved cleanly when unsupported
5. Confirm no client-side file generation

**Deliverables**: US5–US6 production quality.

**Dependencies**: Phase 6.

**Validation**: Quickstart Scenarios 6–7.

**Risks**: PDF unsupported → hide, don’t stub.

**Exit criteria**: CSV/Excel download works where API supports; print usable.

**Parallel**: Print CSS vs URL sync.

---

### Phase 8 — Performance, A11y & Spec 011 Gate

**Objective**: Production gate before Activity Logs.

**Scope**: Responsive/a11y pass; lazy chunk check; lint/typecheck/build; boundary audit.

**Tasks**:

1. Mobile filter sheet / table scroll
2. Keyboard paths for filters, export, print
3. Verify report route code-splitting
4. Consider virtualization only if needed
5. Grep: no activity-log routes; no analytics calls from reports
6. `pnpm typecheck && pnpm lint && pnpm build`
7. Complete OpenAPI checklist in research.md

**Deliverables**: CI-green module ready for Spec 011.

**Dependencies**: Phase 7.

**Validation**: Quickstart Scenario 8 + full manual pass.

**Risks**: Large export blobs — show progress, don’t parse as JSON.

**Exit criteria**: Build green; Spec 011 needs no refactor.

**Parallel**: A11y and boundary grep.

---

## Parallel Development Summary

| Track A                            | Track B                      | After     |
| ---------------------------------- | ---------------------------- | --------- |
| Phase 1 service/types              | Phase 2 routes/nav scaffolds | Phase 3   |
| Phase 3 filters                    | Phase 3 export/print         | Phase 4   |
| Phase 4 hooks (per domain)         | Expense migration prep       | Phase 5   |
| Phase 5 txn page                   | Phase 5 trip page            | Phase 6   |
| Phase 6 expense/payroll/attendance |                              | Phase 7–8 |

## Complexity Tracking

No constitution violations requiring justification. Optional hub endpoints and PDF export are capability-gated (research R-008, R-011).

## Generated Artifacts

| Artifact            | Path                                               |
| ------------------- | -------------------------------------------------- |
| Implementation plan | `specs/010-reports/plan.md`                        |
| Research            | `specs/010-reports/research.md`                    |
| Data model          | `specs/010-reports/data-model.md`                  |
| API contracts       | `specs/010-reports/contracts/api-endpoints.md`     |
| Route contracts     | `specs/010-reports/contracts/routes-and-guards.md` |
| Quickstart          | `specs/010-reports/quickstart.md`                  |

## Next Step

Run `/speckit-tasks` to generate `tasks.md`, then `/speckit-implement` to build `src/features/reports/`.
