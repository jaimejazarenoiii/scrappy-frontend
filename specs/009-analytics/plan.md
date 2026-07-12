# Implementation Plan: Analytics (Specification 009)

**Branch**: `009-analytics` (or current feature branch)  
**Date**: 2026-07-10  
**Spec**: [spec.md](./spec.md)  
**Backend**: P008 — `/api/v1/analytics/*`

## Summary

Deliver a read-only Analytics module at `src/features/analytics/` that consumes Backend P008 aggregates for executive and operational dashboards. The frontend visualizes KPI cards, charts, and ranking tables; it never computes business metrics. Architecture follows Specs 001–008: Axios via service classes, TanStack Query for server state, Zustand for UI/filter preferences, React Router lazy routes, permission-driven navigation.

**Out of scope**: Reports (`/reports/*`), Activity Logs, export/download, client-side aggregation.

## Technical Context

| Area                | Choice                                                             |
| ------------------- | ------------------------------------------------------------------ |
| **Language**        | TypeScript 5.x                                                     |
| **Framework**       | React 18 + Vite                                                    |
| **Routing**         | React Router Data Router, nested layouts, lazy routes              |
| **Server state**    | TanStack Query v5                                                  |
| **Client UI state** | Zustand (filters, tab, refresh prefs)                              |
| **HTTP**            | Axios via shared `apiClient` (Spec 001)                            |
| **Charts**          | Recharts (new dependency — see [research.md](./research.md) R-003) |
| **UI**              | shadcn/ui + Tailwind + UI UX Pro Max patterns                      |
| **Auth**            | JWT session + `PermissionGuard` (Spec 002)                         |
| **Target**          | Owner/Manager only; Employee 403                                   |

## Constitution Check

_GATE: Must pass before Phase 0 research and re-checked after Phase 1 design._

| Principle                         | Compliance                                                                      |
| --------------------------------- | ------------------------------------------------------------------------------- |
| I. Spec-driven delivery           | Plan traces to Spec 009 FR/NFR only                                             |
| II. Backend as source of truth    | All metrics from `/analytics/*`; no list-page aggregation                       |
| III. Feature module layout        | `src/features/analytics/{types,services,hooks,components,pages,lib,validation}` |
| IV. Service layer                 | `AnalyticsService`; no Axios in components                                      |
| V. TanStack Query for server data | Per-endpoint hooks; no metric duplication in Zustand                            |
| VI. Permission-based access       | `PERMISSIONS.analytics.view`; nav via `anyOf`                                   |
| VII. Reuse shared UI              | `PageContainer`, `PageHeader`, `FilterBar`, `Card`, skeletons, toasts           |
| VIII. Accessibility               | Semantic HTML, chart fallbacks, keyboard filters                                |
| IX. Performance                   | Lazy routes, query caching, `keepPreviousData` on filter change                 |
| X. Dependency discipline          | Recharts justified in research; no other new deps                               |
| XI. Reports boundary              | No Spec 010 code paths                                                          |

**Post-design re-check**: PASS — contracts and data model preserve boundaries.

## Project Structure

### Documentation (this feature)

```text
specs/009-analytics/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1 validation
├── contracts/
│   ├── api-endpoints.md
│   └── routes-and-guards.md
└── tasks.md             # Phase 2 (/speckit-tasks — not created by plan)
```

### Source (target)

```text
src/features/analytics/
├── types/
│   └── analytics.types.ts
├── validation/
│   └── analytics-filter.schema.ts
├── lib/
│   ├── analytics-api.ts          # param builder + normalizers
│   └── analytics-chart-config.ts # chart kind mapping
├── services/
│   └── analytics.service.ts
├── hooks/
│   ├── analytics-keys.ts
│   ├── useAnalyticsFilterStore.ts
│   ├── useAnalyticsPreferencesStore.ts
│   ├── useCompanyAnalytics.ts
│   ├── useTransactionAnalytics.ts
│   ├── useExpenseAnalytics.ts
│   ├── useWorkforceAnalytics.ts
│   ├── useTripAnalytics.ts
│   └── useOrganizationAnalytics.ts
├── components/
│   ├── AnalyticsFilterBar.tsx
│   ├── AnalyticsRefreshBar.tsx
│   ├── AnalyticsKpiCard.tsx
│   ├── AnalyticsKpiGrid.tsx
│   ├── AnalyticsChart.tsx
│   ├── AnalyticsRankingTable.tsx
│   ├── AnalyticsSection.tsx
│   ├── AnalyticsEmptyState.tsx
│   ├── AnalyticsErrorState.tsx
│   ├── AnalyticsSkeleton.tsx
│   └── sections/
│       ├── CompanyOverviewSection.tsx
│       ├── TransactionAnalyticsSection.tsx
│       ├── ExpenseAnalyticsSection.tsx
│       ├── WorkforceAnalyticsSection.tsx
│       ├── TripAnalyticsSection.tsx
│       └── OrganizationAnalyticsSection.tsx
└── pages/
    └── AnalyticsDashboardPage.tsx

src/constants/
├── routes.ts           # analytics routes
├── permissions.ts      # analytics.view
└── navigation.ts       # Analytics nav item

src/app/router/routes.tsx   # lazy analytics routes
src/hooks/useBreadcrumbTrail.ts
src/lib/breadcrumb.ts
src/features/auth/lib/session.ts  # grant analytics.view
```

**Structure decision**: Single feature module with section components (not separate page routes per domain) to share filters and refresh — aligns with research R-004.

---

## Implementation Phases

### Phase 1 — Foundation: Types, Service, Filters

**Objective**: Establish analytics data contracts and API access layer without UI.

**Scope**:

- TypeScript types mirroring P008 responses
- Filter schema and query param builder
- `AnalyticsService` with six endpoint methods
- Query key factory

**Tasks**:

1. Create `analytics.types.ts` per [data-model.md](./data-model.md)
2. Create `analytics-filter.schema.ts` (Zod: custom range, limit 1–25)
3. Implement `buildAnalyticsQueryParams` + response normalizers in `analytics-api.ts`
4. Implement `AnalyticsService` using `apiClient`
5. Add `analytics-keys.ts` with filter-serialized keys
6. Add `pnpm add recharts` and type-only imports where needed

**Deliverables**: Types, service, lib, validation, query keys.

**Dependencies**: Spec 001 `apiClient`; backend P008 available for manual smoke test.

**Validation**: Unit-style manual test — call service methods from dev console or temporary hook; verify query string shape matches [contracts/api-endpoints.md](./contracts/api-endpoints.md).

**Risks**: OpenAPI field name drift → mitigate with normalizers and Swagger reconciliation checklist in research.

**Exit criteria**: Service returns typed data; filter validation blocks invalid custom ranges; no UI files yet.

**Parallel**: None — blocks all UI phases.

---

### Phase 2 — Platform Wiring: Permissions, Routes, Navigation

**Objective**: Integrate analytics into app shell with authorization.

**Scope**:

- `PERMISSIONS.analytics.view`
- Route constants, lazy routes, redirect `/analytics` → `/analytics/dashboard`
- Navigation item
- Breadcrumbs

**Tasks**:

1. Add `analytics.view` to `permissions.ts`
2. Grant permission to Owner/Manager in `session.ts` (mirror backend)
3. Add `ROUTES.analytics`, `ROUTES.analyticsDashboard`
4. Register lazy `AnalyticsDashboardPage` + `PermissionGuard` in `routes.tsx`
5. Add Analytics to `navigation.ts` with `anyOf: [PERMISSIONS.analytics.view]`
6. Extend breadcrumb helpers
7. Scaffold `AnalyticsDashboardPage` (placeholder shell)

**Deliverables**: Routable protected analytics area; nav visible for Owner/Manager only.

**Dependencies**: Phase 1 optional for placeholder; Phase 3 needs Phase 1.

**Validation**: [quickstart.md](./quickstart.md) Scenario 1.

**Risks**: Permission string mismatch with backend → confirm with API team / OpenAPI.

**Exit criteria**: Deep links work; Employee forbidden; lazy chunk loads.

**Parallel**: Can start breadcrumb/nav constants while Phase 1 finishes (last 2 tasks need page scaffold).

---

### Phase 3 — Shared UI Primitives

**Objective**: Reusable dashboard building blocks following design system.

**Scope**:

- KPI cards and grid
- Chart wrapper (Recharts)
- Filter bar, refresh bar
- Section wrapper with loading/error/empty
- Zustand filter + preferences stores

**Tasks**:

1. `useAnalyticsFilterStore` + `useAnalyticsPreferencesStore`
2. `AnalyticsFilterBar` — period presets, custom date range, entity selects (reuse branch/warehouse/vehicle/employee option hooks)
3. `AnalyticsRefreshBar` — manual refresh, `generatedAt` display, optional auto-refresh toggle (default off)
4. `AnalyticsKpiCard` / `AnalyticsKpiGrid` — trend slot only when API provides
5. `AnalyticsChart` — line, bar, area, pie, donut; theme-aware colors; accessible title
6. `AnalyticsRankingTable` — sortable display-only table for top-N lists
7. `AnalyticsSection`, `AnalyticsSkeleton`, `AnalyticsEmptyState`, `AnalyticsErrorState`
8. `analytics-chart-config.ts` — maps domain fields to chart types

**Deliverables**: Component library usable by all domain sections.

**Dependencies**: Phase 1 types; Phase 2 page shell; Recharts installed.

**Validation**: Storybook optional; manual render in dashboard with mock data object.

**Risks**: Chart a11y gaps → provide tabular fallback per research R-014.

**Exit criteria**: Filter changes update store; refresh calls `refetch`; responsive KPI grid.

**Parallel**: Filter bar (entity pickers) can parallel chart wrapper once stores exist.

---

### Phase 4 — TanStack Query Hooks

**Objective**: Connect service layer to React with efficient caching.

**Scope**:

- One hook per analytics endpoint
- Coordinated refetch for refresh bar
- `staleTime`, `placeholderData: keepPreviousData`

**Tasks**:

1. Implement `useCompanyAnalytics`, `useTransactionAnalytics`, `useExpenseAnalytics`, `useWorkforceAnalytics`, `useTripAnalytics`, `useOrganizationAnalytics`
2. Each hook reads filters from `useAnalyticsFilterStore`
3. `enabled` tied to active dashboard tab (avoid fetching all six on mount)
4. Export `useAnalyticsRefresh()` — `refetch` all enabled queries
5. Toast on refresh success/failure (optional, non-blocking)

**Deliverables**: Six hooks + refresh coordinator.

**Dependencies**: Phases 1 and 3.

**Validation**: Network tab shows correct params; switching tabs fetches lazily.

**Risks**: Over-fetching on filter change → single filter snapshot in query key debounced 300ms if needed.

**Exit criteria**: Manual refresh refetches; errors isolated per section.

**Parallel**: Hooks can be implemented in parallel per endpoint after Phase 1.

---

### Phase 5 — Dashboard Hub: Overview & Domain Sections

**Objective**: Complete `AnalyticsDashboardPage` with all analytics domains.

**Scope**:

- Tabbed layout: Overview, Transactions, Expenses, Workforce, Trips, Organization
- Wire hooks to sections
- Executive KPI overview (company endpoint)
- Operational domain panels

**Tasks**:

1. `CompanyOverviewSection` — company KPIs + highlight `netOperationalAmount`
2. `TransactionAnalyticsSection` — KPIs, top materials chart, active entity rankings
3. `ExpenseAnalyticsSection` — totals, category donut, context/status bars, trend line if `timeSeries`
4. `WorkforceAnalyticsSection` — attendance, payroll summary, employee activity table
5. `TripAnalyticsSection` — trip counts, duration KPI, status donut, vehicle utilization
6. `OrganizationAnalyticsSection` — branch/warehouse performance tables, fleet utilization
7. Compose `AnalyticsDashboardPage` — `PageContainer`, `PageHeader`, tabs, shared filter + refresh bars
8. Optional deep link `?tab=` sync with preferences store

**Deliverables**: Full analytics UX per spec user stories.

**Dependencies**: Phases 3–4.

**Validation**: [quickstart.md](./quickstart.md) Scenarios 2–9.

**Risks**: Large payloads slow charts → limit rankings via `limit` param; skeleton during fetch.

**Exit criteria**: All six API endpoints represented; no fabricated metrics; empty states when arrays empty.

**Parallel**: Each section component can be built in parallel by different developers after Phase 4.

---

### Phase 6 — Polish, Performance & Accessibility

**Objective**: Production-ready quality gate.

**Scope**:

- Responsive layouts all breakpoints
- Light/dark chart colors
- Keyboard navigation and focus management
- Code splitting verification
- Lint/typecheck/build

**Tasks**:

1. Responsive tab list (scroll on mobile) and KPI grid breakpoints
2. Verify lazy route chunk for analytics feature
3. Add `sr-only` chart data tables or expandable "View data table"
4. Entity links in ranking rows behind `PermissionGate`
5. Confirm no `/reports` references in analytics feature
6. Run `pnpm typecheck`, `pnpm lint`, `pnpm build`
7. Mark OpenAPI reconciliation checklist in research.md

**Deliverables**: Passing CI checks; accessible interactive dashboard.

**Dependencies**: Phase 5 complete.

**Validation**: [quickstart.md](./quickstart.md) Scenarios 10–12.

**Risks**: Recharts bundle size → acceptable for enterprise dashboard; tree-shake unused chart types.

**Exit criteria**: Build green; WCAG-friendly filter/chart interactions; Spec 010 requires no refactor.

**Parallel**: A11y pass and responsive pass can run in parallel.

---

## Parallel Development Summary

| Track A                      | Track B                       | After   |
| ---------------------------- | ----------------------------- | ------- |
| Phase 1 service/types        | Phase 2 routes/nav (scaffold) | Phase 3 |
| Phase 3 KPI + charts         | Phase 3 filter bar            | Phase 4 |
| Phase 4 hooks (per endpoint) | —                             | Phase 5 |
| Phase 5 sections (per tab)   | Phase 5 sections              | Phase 6 |

## Complexity Tracking

No constitution violations requiring justification.

## Generated Artifacts

| Artifact            | Path                                                 |
| ------------------- | ---------------------------------------------------- |
| Implementation plan | `specs/009-analytics/plan.md`                        |
| Research            | `specs/009-analytics/research.md`                    |
| Data model          | `specs/009-analytics/data-model.md`                  |
| API contracts       | `specs/009-analytics/contracts/api-endpoints.md`     |
| Route contracts     | `specs/009-analytics/contracts/routes-and-guards.md` |
| Quickstart          | `specs/009-analytics/quickstart.md`                  |

## Next Step

Run `/speckit-tasks` to generate `tasks.md` with dependency-ordered implementation tasks, then `/speckit-implement` to build the module.
