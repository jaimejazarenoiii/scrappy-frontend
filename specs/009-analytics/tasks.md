# Tasks: Specification 009 – Analytics

**Input**: Design documents from `/specs/009-analytics/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Not requested in Specification 009 (manual quickstart validation required).

**Organization**: Tasks grouped by user story for independent implementation and testing. New module at `src/features/analytics/` — no architectural refactor of Specs 001–008.

## Phase 1: Setup (Analytics Module Scaffolding)

**Purpose**: Create feature directory tree, install chart dependency, and placeholder files so foundational work can proceed without import errors.

- [x] T001 Create directory tree under `src/features/analytics/` per `plan.md`: `components/sections/`, `hooks/`, `pages/`, `services/`, `types/`, `validation/`, `lib/`.
- [x] T002 Run `pnpm add recharts` and verify `package.json` includes `recharts` dependency.
- [x] T003 [P] Create `src/features/analytics/types/analytics.types.ts` with exported placeholder types (`AnalyticsFilterSet`, `CompanyAnalytics`).
- [x] T004 [P] Create `src/features/analytics/services/analytics.service.ts` with exported `ANALYTICS_ENDPOINTS` and `AnalyticsService` placeholder object.
- [x] T005 [P] Create `src/features/analytics/lib/analytics-api.ts` with placeholder `buildAnalyticsQueryParams` export.
- [x] T006 [P] Create `src/features/analytics/lib/analytics-chart-config.ts` with placeholder chart kind mapping export.
- [x] T007 [P] Create `src/features/analytics/validation/analytics-filter.schema.ts` with placeholder Zod schema for filter validation.
- [x] T008 [P] Create `src/features/analytics/hooks/analytics-keys.ts` with exported `analyticsKeys` query key factory placeholders.
- [x] T009 [P] Create placeholder hooks: `src/features/analytics/hooks/useAnalyticsFilterStore.ts`, `useAnalyticsPreferencesStore.ts`.
- [x] T010 [P] Create placeholder hooks: `src/features/analytics/hooks/useCompanyAnalytics.ts`, `useTransactionAnalytics.ts`, `useExpenseAnalytics.ts`, `useWorkforceAnalytics.ts`, `useTripAnalytics.ts`, `useOrganizationAnalytics.ts`.
- [x] T011 [P] Create placeholder components: `src/features/analytics/components/AnalyticsKpiCard.tsx`, `AnalyticsKpiGrid.tsx`, `AnalyticsChart.tsx`, `AnalyticsRankingTable.tsx`.
- [x] T012 [P] Create placeholder components: `src/features/analytics/components/AnalyticsFilterBar.tsx`, `AnalyticsRefreshBar.tsx`, `AnalyticsSection.tsx`.
- [x] T013 [P] Create placeholder components: `src/features/analytics/components/AnalyticsSkeleton.tsx`, `AnalyticsEmptyState.tsx`, `AnalyticsErrorState.tsx`.
- [x] T014 [P] Create placeholder section components: `src/features/analytics/components/sections/CompanyOverviewSection.tsx`, `TransactionAnalyticsSection.tsx`, `ExpenseAnalyticsSection.tsx`, `WorkforceAnalyticsSection.tsx`, `TripAnalyticsSection.tsx`, `OrganizationAnalyticsSection.tsx`.
- [x] T015 [P] Create placeholder page: `src/features/analytics/pages/AnalyticsDashboardPage.tsx`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Types, services, API lib, permissions, routes, navigation, shared UI primitives, and Zustand stores. **No user story work until this phase completes.**

- [x] T016 Define `AnalyticsPeriodPreset` union in `src/features/analytics/types/analytics.types.ts` per `data-model.md`.
- [x] T017 Define `AnalyticsFilterSet` interface in `src/features/analytics/types/analytics.types.ts` with period, from, to, entity filters, includeArchived, and limit fields.
- [x] T018 Define shared sub-types in `src/features/analytics/types/analytics.types.ts`: `RankingRow`, `EntityRankingRow`, `CategoryBreakdown`, `TimeSeriesPoint`, `VehicleUtilizationRow`, `LocationPerformanceRow`, `StatusBreakdown`, `ContextBreakdown`.
- [x] T019 Define `CompanyAnalytics` interface in `src/features/analytics/types/analytics.types.ts` per `data-model.md` and `contracts/api-endpoints.md`.
- [x] T020 Define `TransactionAnalytics`, `ExpenseAnalytics`, `WorkforceAnalytics`, `TripAnalytics`, and `OrganizationAnalytics` interfaces in `src/features/analytics/types/analytics.types.ts`.
- [x] T021 Define `AnalyticsChartKind` type and `AnalyticsMetadata` fields (`appliedFilters`, `generatedAt`) in `src/features/analytics/types/analytics.types.ts`.
- [x] T022 Implement `buildAnalyticsQueryParams(filters)` in `src/features/analytics/lib/analytics-api.ts` mapping filter set to query string per `contracts/api-endpoints.md`.
- [x] T023 Implement response normalizers in `src/features/analytics/lib/analytics-api.ts` for each analytics endpoint (defensive null/array coercion).
- [x] T024 Implement Zod schema in `src/features/analytics/validation/analytics-filter.schema.ts` with custom range validation (from/to required, from ≤ to, span ≤ 366 days, limit 1–25).
- [x] T025 Implement `ANALYTICS_ENDPOINTS` in `src/features/analytics/services/analytics.service.ts` for all six `/analytics/*` paths.
- [x] T026 Implement `AnalyticsService.getCompany` in `src/features/analytics/services/analytics.service.ts` calling `GET /analytics/company`.
- [x] T027 Implement `AnalyticsService.getTransactions` in `src/features/analytics/services/analytics.service.ts` calling `GET /analytics/transactions`.
- [x] T028 Implement `AnalyticsService.getExpenses` in `src/features/analytics/services/analytics.service.ts` calling `GET /analytics/expenses`.
- [x] T029 Implement `AnalyticsService.getWorkforce` in `src/features/analytics/services/analytics.service.ts` calling `GET /analytics/workforce`.
- [x] T030 Implement `AnalyticsService.getTrips` in `src/features/analytics/services/analytics.service.ts` calling `GET /analytics/trips`.
- [x] T031 Implement `AnalyticsService.getOrganization` in `src/features/analytics/services/analytics.service.ts` calling `GET /analytics/organization`.
- [x] T032 Implement `analyticsKeys` factory in `src/features/analytics/hooks/analytics-keys.ts` with keys for company, transactions, expenses, workforce, trips, organization (serialized filter snapshot).
- [x] T033 Implement `useAnalyticsFilterStore` in `src/features/analytics/hooks/useAnalyticsFilterStore.ts` with default `THIS_MONTH` period and filter setters per `data-model.md`.
- [x] T034 Implement `useAnalyticsPreferencesStore` in `src/features/analytics/hooks/useAnalyticsPreferencesStore.ts` with activeTab, autoRefreshEnabled (default false), and collapsedSections.
- [x] T035 Implement `AnalyticsKpiCard` in `src/features/analytics/components/AnalyticsKpiCard.tsx` with label, value, optional trend slot (render trend only when API provides change/trend data).
- [x] T036 Implement `AnalyticsKpiGrid` in `src/features/analytics/components/AnalyticsKpiGrid.tsx` with responsive 1→2→3→4 column layout.
- [x] T037 Implement `AnalyticsChart` in `src/features/analytics/components/AnalyticsChart.tsx` using Recharts for line, bar, area, pie, and donut with theme-aware CSS variable colors.
- [x] T038 Implement `AnalyticsRankingTable` in `src/features/analytics/components/AnalyticsRankingTable.tsx` as display-only accessible table for top-N lists.
- [x] T039 Implement `AnalyticsSection` in `src/features/analytics/components/AnalyticsSection.tsx` wrapping title, children, and slot for loading/error/empty states.
- [x] T040 Implement `AnalyticsSkeleton`, `AnalyticsEmptyState`, and `AnalyticsErrorState` in `src/features/analytics/components/AnalyticsSkeleton.tsx`, `AnalyticsEmptyState.tsx`, `AnalyticsErrorState.tsx`.
- [x] T041 Implement `analytics-chart-config.ts` in `src/features/analytics/lib/analytics-chart-config.ts` mapping domain fields to chart kinds (declarative config only — no data computation).
- [x] T042 Update `src/constants/permissions.ts` additively with `PERMISSIONS.analytics.view` per `contracts/routes-and-guards.md`.
- [x] T043 Update `PermissionKey` union in `src/constants/permissions.ts` to include analytics permission keys.
- [x] T044 Update `src/features/auth/lib/session.ts` `ROLE_PERMISSIONS` for OWNER and MANAGER with `analytics.view`; ensure EMPLOYEE has no analytics permissions.
- [x] T045 Update `src/constants/routes.ts` with `analytics` and `analyticsDashboard` route constants.
- [x] T046 Update `src/constants/navigation.ts` to add Analytics nav item with `anyOf: [PERMISSIONS.analytics.view]` and Lucide `BarChart3` icon (after Expenses).
- [x] T047 Register lazy analytics routes in `src/app/router/routes.tsx`: `/analytics` redirect to `/analytics/dashboard`, `/analytics/dashboard` with `PermissionGuard` per `contracts/routes-and-guards.md`.
- [x] T048 Update `src/lib/breadcrumb.ts` to support analytics and dashboard breadcrumb segments.
- [x] T049 Update `src/hooks/useBreadcrumbTrail.ts` to resolve Analytics breadcrumb labels.
- [x] T050 Run `pnpm typecheck` after foundational changes and fix compile errors in `src/features/analytics/` and updated constants.

**Checkpoint**: Types, services, routes, permissions, and shared UI primitives ready — user story implementation can begin.

---

## Phase 3: User Story 1 – Executive Company Overview (Priority: P1) 🎯 MVP

**Goal**: Owners and Managers open Analytics and see company-wide KPI summary for the selected period with applied filter echo and last-updated timestamp.

**Independent Test**: Log in as Owner/Manager, open `/analytics/dashboard`, verify KPI cards match `GET /analytics/company` for default period; Employee receives forbidden on analytics routes.

- [x] T051 [US1] Implement `useCompanyAnalytics` in `src/features/analytics/hooks/useCompanyAnalytics.ts` using TanStack Query, `AnalyticsService.getCompany`, and filters from `useAnalyticsFilterStore`.
- [x] T052 [US1] Configure `useCompanyAnalytics` with `staleTime` 60s and `placeholderData: keepPreviousData` on filter changes.
- [x] T053 [US1] Implement `CompanyOverviewSection` in `src/features/analytics/components/sections/CompanyOverviewSection.tsx` rendering company KPI cards from API fields only (no client-side aggregation).
- [x] T054 [US1] Highlight `netOperationalAmount` KPI in `CompanyOverviewSection` with distinct visual treatment per design system.
- [x] T055 [US1] Display `appliedFilters` summary and `generatedAt` timestamp in `CompanyOverviewSection` when provided by API.
- [x] T056 [US1] Add loading skeleton, empty state (zero metrics), and error state with retry in `CompanyOverviewSection`.
- [x] T057 [US1] Scaffold `AnalyticsDashboardPage` in `src/features/analytics/pages/AnalyticsDashboardPage.tsx` with `PageContainer`, `PageHeader` (“Analytics”), and Overview tab hosting `CompanyOverviewSection`.
- [x] T058 [US1] Implement `AnalyticsRefreshBar` in `src/features/analytics/components/AnalyticsRefreshBar.tsx` with manual refresh button and `generatedAt` display wired to company query `refetch`.
- [x] T059 [US1] Set `document.title` to “Analytics” in `src/features/analytics/pages/AnalyticsDashboardPage.tsx`.
- [x] T060 [US1] Verify `/analytics` redirects to `/analytics/dashboard` and deep links work with browser back/forward.
- [x] T061 [US1] Verify Employee user cannot access analytics routes (nav hidden, direct URL shows forbidden recovery path).

**Checkpoint**: User Story 1 independently testable — executive overview MVP complete.

---

## Phase 4: User Story 2 – Filter Analytics by Period and Organization (Priority: P1)

**Goal**: Authorized users adjust period presets, custom date range, entity filters, include-archived toggle, and ranking limit; all visible analytics respect the same filter bundle echoed by backend.

**Independent Test**: Change period to custom 30-day range and apply branch filter; verify all active queries include matching params and `appliedFilters` echo updates.

- [x] T062 [US2] Implement `AnalyticsFilterBar` in `src/features/analytics/components/AnalyticsFilterBar.tsx` with period preset select (today, yesterday, this week, this month, this year, custom).
- [x] T063 [US2] Add custom date range inputs to `AnalyticsFilterBar` with Zod validation from `analytics-filter.schema.ts` — block apply when invalid.
- [x] T064 [US2] Wire branch filter in `AnalyticsFilterBar` using `useBranchOptions` from `src/features/branches/hooks/useBranchOptions.ts`.
- [x] T065 [US2] Wire warehouse filter in `AnalyticsFilterBar` using `useWarehouseOptions` from `src/features/warehouses/hooks/useWarehouseOptions.ts`.
- [x] T066 [US2] Wire vehicle filter in `AnalyticsFilterBar` using existing vehicle list/options hooks from `src/features/vehicles/`.
- [x] T067 [US2] Wire employee filter in `AnalyticsFilterBar` using `useEmployeeOptions` from `src/features/employees/hooks/useEmployeeOptions.ts`.
- [x] T068 [US2] Add include-archived toggle and ranking limit control (1–25) to `AnalyticsFilterBar` updating `useAnalyticsFilterStore`.
- [x] T069 [US2] Integrate `AnalyticsFilterBar` into `AnalyticsDashboardPage` above tab content with collapsible mobile layout per responsive spec.
- [x] T070 [US2] Display active filter summary chips or text in `AnalyticsFilterBar` reflecting current `AnalyticsFilterSet`.
- [x] T071 [US2] Ensure filter changes invalidate/refetch all enabled analytics queries via updated `analyticsKeys` filter snapshot.
- [x] T072 [US2] Add inline validation messages for custom date errors (missing from/to, span > 366 days, from > to) without firing API requests.

**Checkpoint**: User Story 2 independently testable — shared filters drive all analytics queries.

---

## Phase 5: User Story 3 – Transaction and Revenue Analytics (Priority: P2)

**Goal**: Authorized users review transaction counts, totals, averages, top materials, and most active employees/branches/warehouses from backend transaction analytics.

**Independent Test**: Open Transactions tab, compare totals and rankings to `GET /analytics/transactions` for the same filters; empty period shows clear empty state.

- [x] T073 [US3] Implement `useTransactionAnalytics` in `src/features/analytics/hooks/useTransactionAnalytics.ts` with `enabled` when transactions tab is active.
- [x] T074 [US3] Implement `TransactionAnalyticsSection` in `src/features/analytics/components/sections/TransactionAnalyticsSection.tsx` with transaction KPI cards (`transactionCount`, `totalAmount`, `averageValue`).
- [x] T075 [US3] Render top materials bar chart in `TransactionAnalyticsSection` from `topMaterials` API array using `AnalyticsChart` — no frontend recomputation.
- [x] T076 [US3] Render optional `timeSeries` line/area chart in `TransactionAnalyticsSection` when API provides series; hide chart area with empty state when absent.
- [x] T077 [US3] Render `mostActiveEmployees`, `mostActiveBranches`, and `mostActiveWarehouses` ranking tables in `TransactionAnalyticsSection` using `AnalyticsRankingTable`.
- [x] T078 [US3] Add Transactions tab to `AnalyticsDashboardPage` hosting `TransactionAnalyticsSection`.
- [x] T079 [US3] Add loading skeleton, empty state, and isolated error state with section-scoped retry in `TransactionAnalyticsSection`.
- [x] T080 [US3] Respect backend `limit` param from filter store for ranking list lengths in `TransactionAnalyticsSection`.

**Checkpoint**: User Story 3 independently testable — transaction analytics tab complete.

---

## Phase 6: User Story 4 – Expense, Payroll, and Workforce Analytics (Priority: P2)

**Goal**: Authorized users review expense breakdowns, payroll summaries, and workforce metrics (attendance, leave, cash advances) from backend analytics.

**Independent Test**: Open Expenses and Workforce tabs; verify category breakdowns use backend category name strings and payroll summaries match `GET /analytics/workforce`.

- [x] T081 [US4] Implement `useExpenseAnalytics` in `src/features/analytics/hooks/useExpenseAnalytics.ts` with `enabled` when expenses tab is active.
- [x] T082 [US4] Implement `useWorkforceAnalytics` in `src/features/analytics/hooks/useWorkforceAnalytics.ts` with `enabled` when workforce tab is active.
- [x] T083 [US4] Implement `ExpenseAnalyticsSection` in `src/features/analytics/components/sections/ExpenseAnalyticsSection.tsx` with expense KPI cards (`expenseCount`, `totalAmount`).
- [x] T084 [US4] Render category breakdown pie/donut chart in `ExpenseAnalyticsSection` from `byCategory` using string `category` keys — no client-side totals.
- [x] T085 [US4] Render `byContextType` and `byStatus` bar charts in `ExpenseAnalyticsSection` from API breakdown arrays.
- [x] T086 [US4] Render optional expense `timeSeries` trend chart in `ExpenseAnalyticsSection` when API provides data.
- [x] T087 [US4] Implement `WorkforceAnalyticsSection` in `src/features/analytics/components/sections/WorkforceAnalyticsSection.tsx` with attendance, payroll, leave, and cash advance KPI strips from API summary objects.
- [x] T088 [US4] Render `employeeActivity` table in `WorkforceAnalyticsSection` as read-only accessible table — no payroll calculations on frontend.
- [x] T089 [US4] Add Expenses and Workforce tabs to `AnalyticsDashboardPage` hosting respective section components.
- [x] T090 [US4] Add loading, empty, and isolated error states to `ExpenseAnalyticsSection` and `WorkforceAnalyticsSection`.

**Checkpoint**: User Story 4 independently testable — expense and workforce analytics tabs complete.

---

## Phase 7: User Story 5 – Trip, Vehicle, and Branch Analytics (Priority: P2)

**Goal**: Authorized users review trip summaries, vehicle utilization, and branch/warehouse performance from backend trip and organization analytics.

**Independent Test**: Open Trips and Organization tabs; verify trip counts, status distribution, and branch performance rows match `GET /analytics/trips` and `GET /analytics/organization`.

- [x] T091 [US5] Implement `useTripAnalytics` in `src/features/analytics/hooks/useTripAnalytics.ts` with `enabled` when trips tab is active.
- [x] T092 [US5] Implement `useOrganizationAnalytics` in `src/features/analytics/hooks/useOrganizationAnalytics.ts` with `enabled` when organization tab is active.
- [x] T093 [US5] Implement `TripAnalyticsSection` in `src/features/analytics/components/sections/TripAnalyticsSection.tsx` with trip KPI cards (`tripCount`, `completedCount`, `cancelledCount`, `averageDurationMinutes`).
- [x] T094 [US5] Render trip `statusDistribution` donut chart in `TripAnalyticsSection` from API payload.
- [x] T095 [US5] Render `vehicleUtilization` table/chart in `TripAnalyticsSection` with vehicle identifiers and metrics from API only.
- [x] T096 [US5] Implement `OrganizationAnalyticsSection` in `src/features/analytics/components/sections/OrganizationAnalyticsSection.tsx` with `branchPerformance` and `warehousePerformance` tables.
- [x] T097 [US5] Render organization `vehicleUtilization` in `OrganizationAnalyticsSection` without client-side joins across CRUD list endpoints.
- [x] T098 [US5] Add Trips and Organization tabs to `AnalyticsDashboardPage` hosting respective section components.
- [x] T099 [US5] Add optional deep links from ranking rows to entity detail routes (`buildRoute` helpers) behind `PermissionGate` for branch, warehouse, vehicle, trip when IDs present.
- [x] T100 [US5] Add loading, empty, and isolated error states to `TripAnalyticsSection` and `OrganizationAnalyticsSection`.

**Checkpoint**: User Story 5 independently testable — trip and organization analytics tabs complete.

---

## Phase 8: User Story 6 – Refresh and Dashboard Preferences (Priority: P3)

**Goal**: Authorized users manually refresh analytics, see refresh-in-progress indicators, and persist UI preferences (period, tab, layout) across visits.

**Independent Test**: Apply filters, click refresh, observe loading and updated `generatedAt`; reload app and confirm filter/tab preferences restore from Zustand persist (if configured).

- [x] T101 [US6] Implement `useAnalyticsRefresh` coordinator in `src/features/analytics/hooks/useAnalyticsRefresh.ts` refetching all enabled domain queries for active tab.
- [x] T102 [US6] Wire `AnalyticsRefreshBar` refresh button to `useAnalyticsRefresh` with non-blocking loading indicator during refetch.
- [x] T103 [US6] Show success toast on manual refresh completion and error toast on refresh failure without clearing previously loaded data.
- [x] T104 [US6] Add optional auto-refresh toggle to `AnalyticsRefreshBar` (default off) using `refetchInterval` in active hooks when `useAnalyticsPreferencesStore.autoRefreshEnabled` is true.
- [x] T105 [US6] Persist `useAnalyticsFilterStore` and `useAnalyticsPreferencesStore` to localStorage (UI preferences only — no metric payload caching).
- [x] T106 [US6] Restore last-used period preset or custom range on `AnalyticsDashboardPage` mount from persisted filter store.
- [x] T107 [US6] Sync optional `?tab=` query param with `useAnalyticsPreferencesStore.activeTab` for deep-link tab selection.
- [x] T108 [US6] Enable `refetchOnWindowFocus` on analytics queries per TanStack Query defaults for stale tab recovery.

**Checkpoint**: User Story 6 independently testable — refresh and preferences complete.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Production quality, accessibility, responsive verification, and quickstart validation across all user stories.

- [x] T109 [P] Verify responsive layouts on mobile (320px+), tablet (768px+), laptop, desktop, and large desktop — KPI grid stacks, filter bar collapses, charts stack vertically on mobile.
- [x] T110 [P] Verify light and dark mode theming for KPI cards, charts, filters, and tables using design system CSS variables.
- [x] T111 [P] Add accessible chart data table fallback (`sr-only` or expandable “View data table”) to `AnalyticsChart` per research R-014.
- [x] T112 [P] Verify keyboard navigation through filter controls, tab list, refresh button, and ranking tables with visible focus rings.
- [x] T113 [P] Verify lazy-loaded analytics route chunk in production build (`pnpm build`) — analytics code-split from main bundle.
- [x] T114 [P] Confirm no `/reports/` or activity-log references exist under `src/features/analytics/` (Spec 010/011 boundary).
- [x] T115 [P] Verify partial section failure: one endpoint error shows section error with retry while other sections remain visible.
- [x] T116 Run `pnpm typecheck`, `pnpm lint`, and `pnpm build` and fix any errors in `src/features/analytics/` and touched shared files.
- [x] T117 Run manual validation per `specs/009-analytics/quickstart.md` Scenarios 1–12 and document any OpenAPI field reconciliation in `specs/009-analytics/research.md` checklist.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately.
- **Foundational (Phase 2)**: Depends on Phase 1 — **BLOCKS all user stories**.
- **User Stories (Phases 3–8)**: All depend on Foundational completion.
  - US1 (Phase 3) and US2 (Phase 4) are both P1; US1 can ship as MVP with default filters before US2 filter bar is complete.
  - US3–US5 (Phases 5–7) are P2 and can proceed in parallel after Phases 3–4.
  - US6 (Phase 8) depends on at least US1 query hooks existing; best completed after all domain tabs exist.
- **Polish (Phase 9)**: Depends on Phases 3–8.

### User Story Dependencies

| Story | Priority | Depends on              | Independent test                           |
| ----- | -------- | ----------------------- | ------------------------------------------ |
| US1   | P1       | Phase 2                 | Company overview at `/analytics/dashboard` |
| US2   | P1       | Phase 2, US1 page shell | Filter changes refetch all queries         |
| US3   | P2       | Phase 2, US1–US2        | Transactions tab vs API                    |
| US4   | P2       | Phase 2, US1–US2        | Expenses + Workforce tabs vs API           |
| US5   | P2       | Phase 2, US1–US2        | Trips + Organization tabs vs API           |
| US6   | P3       | US1+ domain hooks       | Refresh + persisted preferences            |

### Parallel Opportunities

- **Phase 1**: T003–T015 all marked [P] — different files, no dependencies.
- **Phase 2**: T016–T021 types [P]; T026–T031 service methods [P] after T025; T035–T040 components [P] after types.
- **Phase 5–7**: US3, US4, US5 section work can run in parallel on different files after foundational hooks pattern established.
- **Phase 9**: T109–T115 all marked [P].

### Parallel Example: User Story 5

```bash
# After Phase 2 complete, launch domain hooks in parallel:
Task: "Implement useTripAnalytics in src/features/analytics/hooks/useTripAnalytics.ts"
Task: "Implement useOrganizationAnalytics in src/features/analytics/hooks/useOrganizationAnalytics.ts"

# Then section components in parallel:
Task: "Implement TripAnalyticsSection in src/features/analytics/components/sections/TripAnalyticsSection.tsx"
Task: "Implement OrganizationAnalyticsSection in src/features/analytics/components/sections/OrganizationAnalyticsSection.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (executive overview with default `THIS_MONTH` filters)
4. **STOP and VALIDATE**: quickstart Scenarios 1–2 (partial)
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → foundation ready
2. US1 → executive overview MVP
3. US2 → full filter bar
4. US3 → transaction analytics tab
5. US4 → expense + workforce tabs
6. US5 → trip + organization tabs
7. US6 → refresh + preferences
8. Polish → production gate

### Parallel Team Strategy

1. Team completes Setup + Foundational together
2. Developer A: US1 + US2 (dashboard shell + filters)
3. Developer B: US3 + US4 (transaction + expense/workforce tabs)
4. Developer C: US5 + US6 (trip/org tabs + refresh)
5. Merge and run Phase 9 polish together

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks in the same batch
- [Story] label maps task to user story for traceability
- No test tasks — manual quickstart validation only
- Never call Axios from components; all requests through `AnalyticsService`
- Never aggregate business metrics on the frontend
- Trend indicators only when API supplies change/trend fields
- Commit after each task or logical group; stop at any checkpoint to validate story independently
