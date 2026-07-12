# Feature Specification: Reports

**Feature Branch**: `010-reports`

**Created**: 2026-07-10

**Status**: Draft

**Input**: User description: Create Specification 010 – Reports for Scrappy Web (Backend P009). Implement complete frontend for generating, filtering, reviewing, exporting, and printing business reports across transactions, trips, expenses, payroll, and attendance. Builds on Specifications 001–009 without architectural refactoring. Excludes Activity Logs.

## Purpose _(mandatory — Constitution Principle XXII)_

Give authorized users a centralized, read-only Reports experience to generate, filter, review, export, and print operational report tables across transactions, trips, expenses, payroll, and attendance—using data provided exclusively by Backend P009. Users must be able to answer “What are the detailed records for this period and slice?” and leave with a downloadable or printable artifact without manually assembling list pages or computing totals in the browser.

This feature builds strictly on Specifications 001–009 and MUST NOT redesign or refactor the existing architecture. It corresponds directly to **Backend P009 — Reports** and MUST leave the codebase ready for **Specification 011 — Activity Logs (Backend P010)** without architectural changes.

**In scope**: Reports hub/dashboard; five report domains (transactions, trips, expenses, payroll, attendance); shared filtering and search where the backend supports them; summary and detail/table views; backend-generated export (CSV, Excel, PDF when available); print and print-friendly views; permission-gated navigation and routes; responsive, accessible layouts with loading, empty, and error states.

**Out of scope**: Activity Logs (Specification 011); Analytics charts/KPI recomputation (Specification 009); any mutation of business data; client-side aggregation or recalculation of report totals; generating export file bytes on the frontend; inventing report types not exposed by Backend P009.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Discover and open reports (Priority: P1)

An authorized user opens Reports, sees available report categories (transactions, trips, expenses, payroll, attendance), and navigates into a specific report. When the backend provides recently generated reports, saved filters, or quick-access shortcuts, those appear on the hub; otherwise the hub focuses on category navigation.

**Why this priority**: Without a clear entry point and navigation, users cannot reach any report domain.

**Independent Test**: Log in with reports access, open `/reports`, confirm categories and navigation; open one category route (e.g. `/reports/transactions`); confirm unauthorized users are blocked.

**Acceptance Scenarios**:

1. **Given** the user has reports access, **When** they open `/reports`, **Then** they see report categories and can navigate to each supported report route.
2. **Given** the backend returns recently generated reports or saved filters, **When** the hub loads, **Then** those sections display; **Given** they are unsupported, **When** the hub loads, **Then** those sections are omitted without error.
3. **Given** the user lacks reports permission, **When** they navigate to Reports routes, **Then** authorization blocks access with a safe recovery path.
4. **Given** deep links such as `/reports/expenses`, **When** opened directly, **Then** the correct report view loads with browser history preserved.

---

### User Story 2 - Filter, search, and page report results (Priority: P1)

An authorized user applies backend-supported filters (date range, branch, warehouse, employee, vehicle, transaction type, expense category, payroll period, and others exposed by the API), optional search, and pagination to narrow a report’s tabular results. Summary metrics shown on the page come only from backend-provided summary fields.

**Why this priority**: Filters and paging define usable report output; unfiltered dumps are not operationally useful.

**Independent Test**: On a report page, set a valid date range and an organizational filter, apply search if available, change page; verify requests and displayed rows match backend responses for the same parameters.

**Acceptance Scenarios**:

1. **Given** a report supports date range filters, **When** the user applies a valid from/to range, **Then** results refresh from the backend using those parameters.
2. **Given** invalid or incomplete date range (missing bound, from after to, or span beyond backend maximum), **When** the user applies filters, **Then** inline validation prevents the request and explains the constraint.
3. **Given** optional entity filters (branch, warehouse, employee, vehicle, etc.), **When** applied, **Then** only filters supported by that report’s API are sent and results update accordingly.
4. **Given** backend search is available, **When** the user searches, **Then** search is performed via the API—not by scanning the full dataset in the browser.
5. **Given** paginated results, **When** the user changes page or page size (within API limits), **Then** the table shows the corresponding backend page.
6. **Given** no rows match the filters, **When** the view loads, **Then** a clear empty state explains no data for the selected criteria.

---

### User Story 3 - Review transaction and trip reports (Priority: P2)

An authorized user reviews transaction reports (summary, details, inbound/outbound) and trip reports (summary, details, vehicle utilization, employee trips, completed/cancelled) as backend-provided tables and summaries.

**Why this priority**: Transactions and trips are core junkshop operational records and the most common audit/export needs after discovery and filtering.

**Independent Test**: Open `/reports/transactions` and `/reports/trips`; verify row content and any summary blocks match Backend P009 responses for the same filters; confirm no client-side totals are invented.

**Acceptance Scenarios**:

1. **Given** transaction report data is available, **When** the user opens transaction reports, **Then** summary and detail/table views display backend fields only, including inbound/outbound distinctions when provided.
2. **Given** trip report data is available, **When** the user opens trip reports, **Then** summary, detail, utilization, and status-oriented sections reflect backend payloads without joining CRUD list endpoints for totals.
3. **Given** a report row references an operational entity the user may view, **When** a deep link is offered, **Then** navigation respects target-module permissions.

---

### User Story 4 - Review expense, payroll, and attendance reports (Priority: P2)

An authorized user reviews expense reports (summary, details, categories, trends when provided as report fields, by reference type), payroll reports (summary, details, by period, by employee), and attendance reports (summary, details, by employee, trends when provided).

**Why this priority**: Cost and workforce reporting complete the operational report set required for management and compliance review.

**Independent Test**: Open `/reports/expenses`, `/reports/payroll`, and `/reports/attendance`; verify tables and summaries match Backend P009 for the same filters.

**Acceptance Scenarios**:

1. **Given** expense report data, **When** viewed, **Then** category and reference-type breakdowns or columns use backend-provided values only.
2. **Given** payroll report data, **When** viewed, **Then** period and employee payroll rows/summaries match backend fields without frontend payroll math.
3. **Given** attendance report data, **When** viewed, **Then** employee attendance rows and any trend/summary fields are displayed read-only from the API.

---

### User Story 5 - Export reports (Priority: P2)

An authorized user requests a backend-generated export (CSV, Excel, and PDF when supported) for the active report and filter set, sees progress/completion feedback, and downloads the file produced by the backend.

**Why this priority**: Export is a primary reason users open Reports versus Analytics or module lists.

**Independent Test**: Apply filters on a report, choose an available export format, confirm a backend export request is made and the user receives download/completion feedback; confirm the app does not assemble CSV/Excel/PDF locally from table rows.

**Acceptance Scenarios**:

1. **Given** export is supported for the current report, **When** the user selects CSV (or Excel/PDF when available), **Then** the system requests a backend-generated file for the active filters.
2. **Given** an export is in progress, **When** the user waits, **Then** they see non-blocking progress or pending feedback.
3. **Given** export succeeds, **When** the file is ready, **Then** the user can download it and receives completion feedback.
4. **Given** export fails or a format is unsupported, **When** the error returns, **Then** a safe message and retry path appear without exposing raw server exceptions.
5. **Given** a format is not offered by the backend, **When** the export menu renders, **Then** that format is hidden or disabled—not faked client-side.

---

### User Story 6 - Print and print-friendly views (Priority: P3)

An authorized user prints the current report view (and uses print preview when the environment supports it) using backend-provided report data in a print-friendly layout.

**Why this priority**: Print supports compliance and offline review but depends on usable on-screen report views first.

**Independent Test**: Open a populated report, invoke print; confirm the print-oriented layout shows the same backend-sourced rows/summary relevant to the active filters without requiring a separate client-side data rebuild.

**Acceptance Scenarios**:

1. **Given** report data is displayed, **When** the user chooses Print, **Then** a print-friendly view of backend-provided content is presented for printing.
2. **Given** print preview is available in the environment, **When** invoked, **Then** the user can review layout before printing.
3. **Given** print fails or is cancelled, **When** the user returns, **Then** the on-screen report state remains intact.

---

### Edge Cases

- Backend returns success with zero rows → empty state with filter guidance, not an error.
- Required date range missing for a report that mandates `from`/`to` → block request with validation message.
- Date span exceeds backend maximum → validation error before request.
- Partial failure (list loads, export fails) → keep table visible; show export-specific error with retry.
- Unauthorized role → consistent forbidden experience across all `/reports/*` routes with no leakage of report rows.
- Very large result sets → rely on backend pagination; do not load entire report into memory for client search.
- Export format unsupported for a domain → omit from UI.
- Recently generated / saved filters unsupported → hub omits those sections cleanly.
- Print with empty results → print path either disabled or shows the same empty guidance.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST provide a centralized Reports area with category navigation to transactions, trips, expenses, payroll, and attendance reports.
- **FR-002**: System MUST expose protected routes for `/reports`, `/reports/transactions`, `/reports/trips`, `/reports/expenses`, `/reports/payroll`, and `/reports/attendance`.
- **FR-003**: System MUST display report rows, summaries, and metadata exclusively from Backend P009 responses for the active filter set.
- **FR-004**: System MUST support backend-backed filters relevant to each report (including date range and organizational/entity filters when exposed) and MUST NOT invent filters the API does not accept.
- **FR-005**: System MUST support backend search where available and MUST NOT perform large client-side report searches over full datasets.
- **FR-006**: System MUST support pagination driven by backend list/report contracts.
- **FR-007**: System MUST offer summary and detailed/table views appropriate to each report domain using backend-provided structures.
- **FR-008**: System MUST support backend-generated exports for CSV and Excel, and PDF when the backend supports it, including progress and completion feedback.
- **FR-009**: System MUST NOT generate export file contents on the frontend from in-memory table rows.
- **FR-010**: System MUST support print (and print preview when available) using backend-sourced report data in a print-friendly presentation.
- **FR-011**: System MUST gate Reports navigation and routes using permission keys from the authorization system—not hardcoded role names in components.
- **FR-012**: System MUST remain read-only: no create, update, delete, or workflow actions on operational entities from Reports screens (deep links to modules for viewing are allowed when permitted).
- **FR-013**: System MUST provide loading skeletons, empty states, and error states for the hub and each report page.
- **FR-014**: System MUST be responsive across mobile, tablet, laptop, desktop, and large desktop breakpoints.
- **FR-015**: System MUST support light and dark themes using the established design system.
- **FR-016**: System MUST meet accessibility expectations: semantic structure, keyboard-operable filters/export/print, and accessible tables.
- **FR-017**: System MUST lazy-load report routes to protect initial application load.
- **FR-018**: System MUST NOT implement Activity Logs timelines or audit streams—those belong to Specification 011.
- **FR-019**: System MUST NOT duplicate Analytics chart/KPI aggregation behavior; Reports focuses on tabular report retrieval, export, and print.
- **FR-020**: System MAY persist UI-only preferences (last filters, column visibility, page size) locally without storing duplicate report row payloads as a second source of truth.
- **FR-021**: System MUST show recently generated reports and saved filters on the hub only when Backend P009 provides those capabilities.

### API Dependencies _(mandatory — Constitution Principle XXII)_

Backend P009 Reports (`/api/v1/reports/*` and related export endpoints as documented in OpenAPI). Access restricted per backend authorization (typically Owner/Manager; reconcile exact roles/permissions during planning). Report list/detail endpoints return row-oriented data plus optional summary metadata; export endpoints return backend-generated files.

| Capability                                    | Backend capability (indicative)                              | User stories       |
| --------------------------------------------- | ------------------------------------------------------------ | ------------------ |
| Reports hub metadata / recent / saved filters | Hub or preference endpoints if present                       | US1                |
| Transaction reports                           | `GET /reports/transactions` (and related)                    | US2, US3, US5, US6 |
| Trip reports                                  | `GET /reports/trips` (and related)                           | US2, US3, US5, US6 |
| Expense reports                               | `GET /reports/expenses` (and related)                        | US2, US4, US5, US6 |
| Payroll reports                               | `GET /reports/payroll` (and related)                         | US2, US4, US5, US6 |
| Attendance reports                            | `GET /reports/attendance` (and related)                      | US2, US4, US5, US6 |
| Export (CSV / Excel / PDF)                    | Backend export endpoints or export query params              | US5                |
| Entity filter pickers                         | Existing organization/workforce read APIs from Specs 003–004 | US2                |

**OpenAPI reference**: Reconcile paths, required date parameters, max range, export formats, and permission keys against Swagger (`GET /docs`) during planning.

Supporting note: Any temporary expense-report helpers introduced under Spec 008 for future Reports use MUST be absorbed or replaced by the Reports feature module without changing overall app architecture.

### UI States _(mandatory — Constitution Principle XXII)_

- **Reports hub (`/reports`)**: Loading — skeleton category cards/list; Empty — “No report categories available” only if API returns none (normally static categories); Success — categories, optional recent/saved sections, quick access; Error — retry with safe message.
- **Domain report pages**: Loading — skeleton summary + table; Empty — “No results for these filters” with guidance to adjust criteria; Success — summary (if provided), filter bar, searchable table, pagination, export/print actions; Error — page or section error with retry; Export pending — non-blocking progress; Export error — toast/inline with retry.

### Responsive Behavior _(mandatory — Constitution Principle XXVII)_

- **Reports hub**: Navigation — app shell sidebar/drawer; Layout — category cards stack on mobile, multi-column on desktop.
- **Domain report pages**: Filters — collapsible panel/sheet on mobile, inline bar on desktop; Tables — horizontal scroll or card fallback on narrow viewports; Actions — export/print in header overflow menu on small screens; Print — print stylesheet/layout that remains readable on paper.

### Page Layout _(mandatory — Constitution Principle XXXII)_

- **Reports hub**: Header — “Reports”, breadcrumbs, optional refresh; Content — category navigation, optional recently generated, optional saved filters, quick access links.
- **Domain report page**: Header — report title, breadcrumbs, export and print actions; Content — filter/search bar, optional summary strip from API, primary table/detail view, pagination.

### Empty State Design _(mandatory — Constitution Principle XXXIV)_

- **Hub**: Message — categories always present when permitted; if recent/saved empty, omit or show “No recent reports yet.”
- **Domain report**: Icon — document/report motif; Message — “No results for these filters”; Guidance — widen date range or clear filters; Primary action — focus/open filter controls.

### Production Quality Checklist _(mandatory — Constitution Principle XL)_

Confirm deliverables meet: responsive layouts, WCAG-friendly interactions, strict typing, reusable table/filter/export patterns, dark mode, loading/error/empty states, keyboard-accessible filters and actions, lazy routes, no client-side business aggregation or local export generation, production-ready visual polish per UI UX Pro Max guidance.

### Validation Rules _(mandatory — Constitution Principle XXII)_

- **Date range**: When required by the report API, both `from` and `to` must be present; `from` ≤ `to`; span ≤ backend maximum (assumed 366 days unless contract differs).
- **Domain-specific filters**: Only send parameters documented for that report endpoint.
- **Export**: Format must be one of the backend-supported values for that report.
- Server-side validation is authoritative; frontend validation improves UX only.

### Error Scenarios _(mandatory — Constitution Principle XXII)_

- **Forbidden**: Message — “You don’t have access to reports”; Recovery — return to home dashboard or first permitted module.
- **Validation error on filters**: Inline field messages; do not fire report queries until valid.
- **Report load failure**: User-safe message with retry; do not expose raw exception text.
- **Export failure**: User-safe message with retry; leave on-screen results intact when already loaded.
- **Unsupported format**: Do not offer the action; if requested erroneously, show safe unsupported message.

### Key Entities _(include if feature involves data)_

- **ReportCategory**: Logical report domain (transactions, trips, expenses, payroll, attendance) used for hub navigation.
- **ReportFilterSet**: User-selected criteria (dates, branch, warehouse, employee, vehicle, type/category/period, search, pagination) mapped to backend query parameters per report.
- **ReportResultPage**: Backend-provided page of report rows plus optional summary/totals metadata and applied-filter echo.
- **ReportExportJob**: Backend-generated export request/result (format, status, download reference) when asynchronous; or immediate file response when synchronous.
- **ReportViewPreference**: UI-only preferences (active filters snapshot, page size, view mode) persisted locally without duplicating row data as source of truth.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: An authorized user can open Reports and reach a populated domain report (with default or simple date filters) in under 30 seconds from navigation click (excluding network cold start).
- **SC-002**: Changing filters or page updates the visible report table in a single user action without a full application reload.
- **SC-003**: 100% of displayed report row values and summary figures on any Reports screen trace to Backend P009 responses for the active filter set—verified by spot-check against API responses during QA.
- **SC-004**: Export downloads are produced by the backend; QA confirms no client-built CSV/Excel/PDF from DOM/table scraping for supported formats.
- **SC-005**: Unauthorized users are blocked from all `/reports/*` routes with zero leakage of report rows in UI or network calls initiated by Reports pages.
- **SC-006**: Report tables remain usable on 320px-wide viewports (horizontal table scroll or card fallback acceptable) with primary filters and export/print actions reachable.
- **SC-007**: After implementation, no architectural refactor is required before starting Specification 011 (Activity Logs)—reports live in a dedicated feature module following established patterns.

## Assumptions

- Backend P009 exposes report endpoints for the five domains listed, with shared or per-domain filter parameters consistent with the Scrappy API Reference / OpenAPI.
- Reports access is limited to roles/permissions defined by the backend (assumed Owner/Manager unless OpenAPI states otherwise); Employees do not see company-wide reports unless the API explicitly grants scoped access.
- “Trends” in expense or attendance reports means backend-provided trend fields or series in the report payload—not Analytics chart recomputation on the client.
- Recently generated reports and saved filters are optional hub features included only when Backend P009 supports them.
- PDF export and print preview are included when the platform/backend supports them; CSV and Excel are the baseline export formats when documented.
- Maximum custom date span defaults to 366 days unless the contract specifies otherwise.
- Specifications 001–009 remain the source for shared UI, auth, entity pickers, and module deep links.
- Home Dashboard (`/dashboard`) remains a separate landing experience and is not replaced by Reports.
- Analytics (Spec 009) remains the aggregate/KPI/chart hub; Reports does not subsume Analytics.
