# Feature Specification: Analytics

**Feature Branch**: `009-analytics`

**Created**: 2026-07-10

**Status**: Draft

**Input**: User description: Create Specification 009 – Analytics for Scrappy Web (Backend P008). Implement comprehensive read-only analytics dashboards, KPIs, charts, and business intelligence by consuming backend Analytics APIs. Builds on Specifications 001–008 without architectural refactoring. Excludes Reports and Activity Logs.

## Purpose _(mandatory — Constitution Principle XXII)_

Give Owners and Managers a centralized, read-only Analytics experience that surfaces operational and executive insights—transaction performance, expenses, payroll, workforce activity, trips, and organizational health—using data provided exclusively by Backend P008. Users must be able to answer “How is the business performing?” for a chosen time period and organizational slice without exporting spreadsheets or manually aggregating list pages.

This feature builds strictly on Specifications 001–008 and MUST NOT redesign or refactor the existing architecture. It corresponds directly to **Backend P008 — Analytics** and MUST leave the codebase ready for **Specification 010 — Reports (Backend P009)** without architectural changes.

**In scope**: Centralized analytics hub; executive and operational dashboard views; KPI cards; charts and graphs driven by backend payloads; domain views for company overview, transactions, expenses, workforce, trips, and organization (branches, warehouses, vehicles); shared period and entity filters; manual refresh and last-updated indicators; permission-gated navigation and routes; responsive, accessible layouts with loading, empty, and error states.

**Out of scope**: Reports (tabular audit lists and export — Specification 010); Activity Logs (Specification 011); any mutation of business data; client-side calculation or recomputation of business metrics; real-time push/streaming analytics unless explicitly provided by backend contracts.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Executive company overview (Priority: P1)

An Owner or Manager opens Analytics to see a company-wide summary for the selected period: transaction volumes and amounts, expenses, payroll, net operational position, and counts of active employees, trips, and vehicles.

**Why this priority**: The executive overview is the primary decision-making entry point; all other analytics views extend this mental model.

**Independent Test**: Log in as Owner/Manager, open Analytics with default period (e.g., this month), and verify KPI cards and summary sections match backend company analytics for the same filters.

**Acceptance Scenarios**:

1. **Given** the user has analytics access, **When** they open `/analytics` or `/analytics/dashboard`, **Then** a company overview loads with KPI cards and summary sections populated from backend data.
2. **Given** the backend returns `appliedFilters` and `generatedAt`, **When** the dashboard renders, **Then** the UI shows the active filter context and last-updated timestamp.
3. **Given** the user lacks analytics permission, **When** they navigate to Analytics routes, **Then** authorization blocks access with a safe recovery path.
4. **Given** an Employee user, **When** they attempt Analytics, **Then** access is denied per backend role rules without exposing sensitive aggregates.

---

### User Story 2 - Filter analytics by period and organization (Priority: P1)

An authorized user adjusts the reporting period (presets or custom range) and optional organizational filters (branch, warehouse, vehicle, employee) to narrow all dashboard metrics consistently.

**Why this priority**: Filters define the analytical question; without them, dashboards show misleading or unusable data.

**Independent Test**: Change period from “This month” to a custom 30-day range and apply a branch filter; verify all visible KPIs and charts refresh to reflect the same filter set echoed by the backend.

**Acceptance Scenarios**:

1. **Given** period presets (today, yesterday, this week, this month, this year, custom), **When** the user selects a preset, **Then** analytics queries use the corresponding backend `period` parameter and results update.
2. **Given** custom period, **When** the user selects valid from/to dates within the maximum allowed span, **Then** analytics load successfully.
3. **Given** custom period exceeds the maximum span or has invalid dates, **When** the user applies filters, **Then** inline validation prevents the request and explains the constraint.
4. **Given** optional branch, warehouse, vehicle, or employee filters, **When** applied, **Then** all dashboard sections on the current view respect the same filter bundle.
5. **Given** “Include archived” is toggled when supported, **When** enabled, **Then** backend `includeArchived` is sent and results may include archived operational records per API rules.

---

### User Story 3 - Transaction and revenue analytics (Priority: P2)

An authorized user reviews transaction-focused analytics: counts, totals, average values, top materials, and most active employees, branches, or warehouses for the selected period.

**Why this priority**: Transaction performance is core junkshop operations insight, second only to the executive summary.

**Independent Test**: Open the transactions analytics view, compare totals to backend transaction analytics for the same period, and verify ranking lists (e.g., top materials) match API ordering and limits.

**Acceptance Scenarios**:

1. **Given** transaction analytics data is available, **When** the user opens the transactions section, **Then** KPIs and charts display backend-provided totals and rankings without frontend recomputation.
2. **Given** ranking lists support a limit parameter, **When** the user changes “top N” (within allowed bounds), **Then** results update per backend `limit`.
3. **Given** no transactions exist in the period, **When** the view loads, **Then** a clear empty state explains no data for the selected filters.

---

### User Story 4 - Expense, payroll, and workforce analytics (Priority: P2)

An authorized user reviews expense breakdowns (by category and context), payroll summaries, and workforce metrics (attendance, leave, cash advances) for the selected period.

**Why this priority**: Cost and workforce visibility complement transaction revenue in operational decision-making.

**Independent Test**: Open expense and workforce analytics tabs; verify category breakdowns use backend category names and workforce summaries match API payloads for the same filters.

**Acceptance Scenarios**:

1. **Given** expense analytics are available, **When** the user views expense analytics, **Then** totals and category/context breakdowns reflect backend aggregates only.
2. **Given** payroll analytics are available, **When** displayed, **Then** gross, net, and status summaries match backend workforce analytics.
3. **Given** attendance or leave summaries are included, **When** shown, **Then** labels and counts are presented read-only with accessible chart alternatives where charts are used.

---

### User Story 5 - Trip, vehicle, and branch analytics (Priority: P2)

An authorized user reviews trip summaries (completed, cancelled, duration, utilization), vehicle utilization, and branch/warehouse performance for the selected period.

**Why this priority**: Field operations (trips and fleet) and location performance are essential for Owners managing multi-site scrap operations.

**Independent Test**: Open trip and organization analytics; verify trip counts and vehicle utilization lists match backend trip and organization analytics endpoints.

**Acceptance Scenarios**:

1. **Given** trip analytics data, **When** the user views trip analytics, **Then** status distribution and duration metrics display from backend payloads.
2. **Given** vehicle utilization rankings, **When** displayed, **Then** vehicle identifiers and utilization metrics match API data.
3. **Given** branch or warehouse performance tables/charts, **When** rendered, **Then** each row reflects backend-provided branch/warehouse metrics without client-side joins across list endpoints.

---

### User Story 6 - Refresh and dashboard preferences (Priority: P3)

An authorized user manually refreshes analytics data, sees refresh-in-progress indicators, and optionally persists UI preferences (last selected period, default tab, collapsed sections) across visits.

**Why this priority**: Freshness and personal layout improve trust and repeat use but depend on core views existing first.

**Independent Test**: Apply filters, click refresh, observe loading state and updated `generatedAt`; reload the app and confirm persisted filter preferences restore when using the preferences store.

**Acceptance Scenarios**:

1. **Given** analytics data is displayed, **When** the user clicks refresh, **Then** queries refetch, a non-blocking loading indicator appears, and `generatedAt` updates on success.
2. **Given** refresh fails, **When** the error returns, **Then** the user sees an actionable error with retry while previously loaded data remains visible when safe.
3. **Given** dashboard preferences are saved locally, **When** the user returns to Analytics, **Then** last-used period preset or custom range restores without mutating backend data.

---

### Edge Cases

- Backend returns success with zero-valued metrics → show KPI cards as zero and empty charts with guidance, not errors.
- Custom date range missing `from` or `to` when `period=CUSTOM` → block apply with validation message.
- Date span exceeds maximum allowed window (e.g., 366 days) → validation error before request.
- Partial section failure (one analytics endpoint errors while others succeed) → failed section shows error with retry; successful sections remain visible.
- Employee role → consistent forbidden experience across all analytics routes.
- Stale cached data after long idle tab → manual refresh or refetch on window focus per query defaults.
- Very long ranking lists → respect backend `limit` cap; paginate or truncate only as API supports.
- Archived records excluded by default → toggling include archived may change totals; UI must label the active rule.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST provide a centralized Analytics area accessible to authorized Owner and Manager roles only.
- **FR-002**: System MUST display company-wide executive KPIs and summaries sourced from backend company analytics for the active filter set.
- **FR-003**: System MUST support period selection via backend-supported presets and custom date ranges with validation for required bounds and maximum span.
- **FR-004**: System MUST support optional organizational filters (branch, warehouse, vehicle, employee) and optional include-archived toggle when the backend exposes them, applying the same filter bundle across the active analytics view.
- **FR-005**: System MUST present domain-specific analytics views for transactions, expenses, workforce (including payroll-related summaries when provided), trips, and organization performance without mixing in report-style row tables.
- **FR-006**: System MUST render KPI cards using only numeric and label fields returned by backend analytics responses.
- **FR-007**: System MUST render charts (line, bar, area, pie, donut) only from backend-provided series or breakdown structures; MUST NOT compute aggregates by summing CRUD list pages.
- **FR-008**: System MUST show `generatedAt` (or equivalent last-updated field) and applied filter context when the backend provides them.
- **FR-009**: System MUST support manual dashboard refresh with visible in-progress and error states.
- **FR-010**: System MUST gate Analytics navigation and routes using permission keys derived from the authorization system—not hardcoded role names in components.
- **FR-011**: System MUST remain read-only: no create, update, delete, or workflow actions on operational entities from Analytics screens.
- **FR-012**: System MUST provide loading skeletons, empty states, and error states for every primary analytics view.
- **FR-013**: System MUST be responsive across mobile, tablet, laptop, desktop, and large desktop breakpoints with readable KPI and chart layouts.
- **FR-014**: System MUST support light and dark themes using the established design system.
- **FR-015**: System MUST meet accessibility expectations: semantic structure, keyboard operable filters and refresh, and non-color-only chart encoding where feasible.
- **FR-016**: System MUST lazy-load analytics routes and code-split heavy chart bundles to protect initial application load.
- **FR-017**: System MUST NOT implement Reports export, activity log timelines, or audit tables—those belong to Specifications 010 and 011.
- **FR-018**: System MAY persist UI-only preferences (selected period, active tab, layout toggles) locally without storing duplicate analytics metric payloads.

### API Dependencies _(mandatory — Constitution Principle XXII)_

Backend P008 Analytics (`/api/v1/analytics/*`), Owner/Manager only; Employee receives forbidden. All endpoints share period and organizational filter parameters and return `appliedFilters` plus `generatedAt` in responses.

| Capability                | Backend endpoint (indicative) | User stories |
| ------------------------- | ----------------------------- | ------------ |
| Company executive summary | `GET /analytics/company`      | US1, US2     |
| Transaction analytics     | `GET /analytics/transactions` | US3          |
| Expense analytics         | `GET /analytics/expenses`     | US4          |
| Workforce analytics       | `GET /analytics/workforce`    | US4          |
| Trip analytics            | `GET /analytics/trips`        | US5          |
| Organization analytics    | `GET /analytics/organization` | US5          |

Supporting read-only lookups for filter pickers (already established in Specifications 003–008): branches, warehouses, vehicles, employees—via existing organization and workforce services, not new analytics mutations.

**OpenAPI reference**: Reconcile field names and ranking limits against Swagger (`GET /docs`) during planning.

### UI States _(mandatory — Constitution Principle XXII)_

- **Analytics hub / dashboard**: Loading — skeleton KPI row and chart placeholders; Empty — “No data for this period” with filter guidance; Success — KPI cards, charts, filter bar, last updated; Error — section-level or page-level error with retry.
- **Domain analytics views** (transactions, expenses, workforce, trips, organization): Loading — domain skeleton; Empty — domain-specific empty message; Success — KPIs + charts/tables from API; Error — retry without clearing unrelated sections on partial failure layouts.
- **Filter bar**: Loading — disable apply while validating; Error — inline validation for custom dates; Success — chips or summary of active filters.

### Responsive Behavior _(mandatory — Constitution Principle XXVII)_

- **Analytics hub**: Navigation — sidebar/drawer per app shell; Layout — KPI grid 1 col mobile → 2 tablet → 3–4 desktop; Charts — stack vertically on mobile, two-column on large screens; Filters — collapsible panel on mobile, inline bar on desktop.
- **Domain views**: Tables — horizontal scroll or card fallback on mobile; Charts — maintain minimum touch target height; Modals — full-screen filter sheet on small viewports when needed.

### Page Layout _(mandatory — Constitution Principle XXXII)_

- **Analytics hub (`/analytics`, `/analytics/dashboard`)**: Header — “Analytics”, period summary, refresh action; Content — global filter bar, executive KPI strip, tabbed or sectioned domain summaries, chart grid.
- **Domain detail sections** (may be tabs or nested routes): Header — domain title + breadcrumb; Content — domain KPIs, charts, ranking lists, applied filter echo.

### Empty State Design _(mandatory — Constitution Principle XXXIV)_

- **Analytics hub**: Icon — chart/analytics motif; Message — “No analytics data for this period”; Guidance — adjust period or filters; Primary action — open filter bar.
- **Ranking lists**: Message — “No ranked items in this period”; Guidance — widen date range or clear entity filters.

### Production Quality Checklist _(mandatory — Constitution Principle XL)_

Confirm deliverables meet: responsive layouts, WCAG-friendly interactions, strict typing, reusable chart/KPI wrappers, dark mode, loading/error/empty states, keyboard-accessible filters, lazy routes, no client-side business aggregation, production-ready visual polish per UI UX Pro Max guidance.

### Validation Rules _(mandatory — Constitution Principle XXII)_

- **Custom date range**: Required `from` and `to` when custom period selected; `from` ≤ `to`; span ≤ backend maximum (assumed 366 days unless contract differs).
- **Search/filter pickers**: Reuse established entity picker validation from organization modules.
- Server-side validation is authoritative; frontend validation improves UX only.

### Error Scenarios _(mandatory — Constitution Principle XXII)_

- **Forbidden (Employee)**: Message — “You don’t have access to analytics”; Recovery — return to dashboard.
- **Validation error on filters**: Inline field messages; do not fire analytics queries until valid.
- **Analytics endpoint failure**: User-safe message with retry; do not expose raw exception text.
- **Partial multi-section failure**: Isolate errors per section with retry scoped to that query.

### Key Entities _(include if feature involves data)_

- **AnalyticsPeriod**: User-selected reporting window (preset or custom) mapped to backend `period`, `from`, `to`.
- **AnalyticsFilterSet**: Optional branch, warehouse, vehicle, employee, includeArchived, and limit for rankings.
- **CompanyAnalyticsSummary**: Executive KPI payload (transaction totals, expenses, payroll, net operational amount, active counts).
- **DomainAnalyticsBundle**: Per-domain metrics and chart-ready series (transactions, expenses, workforce, trips, organization).
- **AnalyticsMetadata**: `appliedFilters`, `generatedAt` echo from backend for trust and debugging.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: An authorized Owner or Manager can open Analytics and view an accurate company summary for the current month in under 30 seconds from navigation click (excluding network cold start).
- **SC-002**: Changing the reporting period updates all visible KPIs and charts on the active view in a single user action without requiring a full page reload.
- **SC-003**: 100% of displayed numeric KPIs and chart values on any analytics screen trace to Backend P008 responses for the active filter set—verified by spot-check against API responses during QA.
- **SC-004**: Employee users are blocked from all analytics routes with zero leakage of aggregate metrics in UI or network calls initiated by analytics pages.
- **SC-005**: Analytics screens remain usable on 320px-wide viewports: all primary KPIs and at least one chart per active domain view are readable without horizontal page scroll (chart-internal scroll acceptable).
- **SC-006**: After implementation, no architectural refactor is required before starting Specification 010 (Reports)—analytics lives in `src/features/analytics/` following established feature module patterns.

## Assumptions

- Backend P008 exposes the six analytics endpoints listed in API Dependencies with shared filter parameters consistent with the Scrappy API Reference.
- “Revenue” in user-facing copy maps to backend transaction amount fields (buy/sell operational inflow/outflow) unless the API provides distinct revenue labels—UI uses backend labels verbatim.
- Real-time auto-refresh is optional; manual refresh and query stale-time behavior are sufficient for v1 unless backend documents push/stream contracts.
- Chart library selection and service file layout are planning concerns, not specification scope.
- Ranking list sizes default to backend default `limit` (e.g., 10) with user-adjustable cap up to API maximum (e.g., 25).
- Net operational amount formula is defined by backend (`totalTransactionAmount - totalExpenses - totalPayroll`); frontend displays the provided field only.
- Cancelled transactions are excluded from analytics totals per backend rules unless `includeArchived` or documented exceptions apply.
- Specifications 001–008 modules remain the source for entity pickers (branches, warehouses, vehicles, employees, trips).
