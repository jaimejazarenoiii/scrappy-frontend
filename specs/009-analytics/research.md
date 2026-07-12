# Research: Analytics (Backend P008)

**Date**: 2026-07-10  
**Spec**: [spec.md](./spec.md)

## R-001 — Analytics vs Reports boundary

- **Decision**: Analytics module consumes only `/api/v1/analytics/*` aggregates. No `/reports/*` list or export UI in Spec 009.
- **Rationale**: Spec 009 and Constitution roadmap separate Analytics (P008) from Reports (P009 backend / Spec 010 frontend).
- **Alternatives considered**: Reuse `GET /reports/*` for charts (rejected — wrong contract, row-oriented not aggregate).

## R-002 — No client-side aggregation

- **Decision**: KPI values and chart series render exclusively from analytics API fields. Never sum CRUD list pages (`GET /transactions`, `GET /expenses`, etc.).
- **Rationale**: FR-006, FR-007; backend is source of truth for business rules (cancelled exclusion, net operational amount).
- **Alternatives considered**: Fallback aggregation when analytics empty (rejected — misleading metrics).

## R-003 — Chart library

- **Decision**: Add **Recharts** (`recharts`) as the only new chart dependency; wrap in feature-local `AnalyticsChart` components styled with Tailwind/CSS variables for dark mode.
- **Rationale**: No chart library exists in `package.json`; Recharts is React-native, tree-shakeable, supports line/bar/area/pie/donut, widely paired with shadcn patterns; Constitution XL allows dependencies when justified.
- **Alternatives considered**: Chart.js + react-chartjs-2 (heavier canvas a11y); pure CSS bars (insufficient for line/area trends); Victory (less ecosystem fit).

## R-004 — Dashboard information architecture

- **Decision**: Single hub at `/analytics/dashboard` with tabbed domain sections (Overview, Transactions, Expenses, Workforce, Trips, Organization). `/analytics` redirects to dashboard.
- **Rationale**: Shared filter bar applies once; matches executive + operational views in one shell; deep-link via `?tab=` query optional in implementation.
- **Alternatives considered**: Separate routes per domain (`/analytics/transactions`, …) — deferred as optional Phase 6 enhancement if tabs feel cramped on mobile.

## R-005 — Shared filter model

- **Decision**: `AnalyticsFilterSet` in Zustand (`useAnalyticsFilterStore`) holds period preset, custom from/to, entity filters, includeArchived, ranking limit. TanStack Query keys include serialized filter snapshot.
- **Rationale**: Constitution VII — server data in Query; UI-only filter persistence in Zustand; one filter bundle drives all active queries.
- **Alternatives considered**: URL search params only (good for deep links but heavier v1); duplicating filters per tab (rejected).

## R-006 — Period presets

- **Decision**: Map UI presets to backend `period` enum: `TODAY`, `YESTERDAY`, `THIS_WEEK`, `THIS_MONTH`, `THIS_YEAR`, `CUSTOM` with ISO8601 `from`/`to` when custom.
- **Rationale**: Scrappy API Reference shared analytics parameters.
- **Alternatives considered**: Frontend-only date math without `period` param (rejected — breaks backend contract).

## R-007 — Custom range validation

- **Decision**: Max span **366 days**; require both `from` and `to` for `CUSTOM`; block query until valid (Zod in `analytics-filter.schema.ts`).
- **Rationale**: Matches reports/analytics API reference; prevents 400 validation errors.
- **Alternatives considered**: Silent clamping (rejected — hides user intent).

## R-008 — Permissions

- **Decision**: Add `PERMISSIONS.analytics.view` granted to OWNER and MANAGER in `session.ts`; Employee has no analytics permissions; routes use `PermissionGuard`.
- **Rationale**: Backend returns 403 for Employee on `/analytics/*`; align nav and routes with permission system not role string checks in components.
- **Alternatives considered**: Role-only checks (rejected — violates Spec 002 pattern).

## R-009 — Entity filter pickers

- **Decision**: Reuse existing hooks: `useBranchOptions`, `useWarehouseOptions`, `useVehicleOptions` (or list), `useEmployeeOptions` — no new analytics-specific lookup endpoints.
- **Rationale**: Filters are tenant-scoped IDs sent to analytics APIs; pickers already exist from Specs 003–004.
- **Alternatives considered**: Embedded labels in analytics response only (insufficient for filter dropdowns).

## R-010 — Query strategy

- **Decision**: One TanStack Query hook per analytics endpoint (`useCompanyAnalytics`, `useTransactionAnalytics`, …) enabled when hub tab active or overview visible; `staleTime` 60s; manual `refetch` on refresh button; `placeholderData: keepPreviousData` on filter change.
- **Rationale**: Partial failure isolation; avoids single mega-endpoint; efficient caching per domain.
- **Alternatives considered**: Single combined hook (rejected — couples error handling).

## R-011 — KPI card component

- **Decision**: Feature `AnalyticsKpiCard` + grid `AnalyticsKpiGrid`; reuse Card from `components/ui/card`; trend delta only when API provides `change`/`trend` fields.
- **Rationale**: Constitution reuse-first; no trend fabrication.
- **Alternatives considered**: Duplicating trip dashboard inline KPI markup (rejected).

## R-012 — Ranking lists

- **Decision**: Render top-N lists as accessible tables or ordered lists from API arrays; `limit` query param default 10, user-selectable up to 25.
- **Rationale**: API `limit` parameter (1–25).
- **Alternatives considered**: Client-side truncation of longer arrays (only if API returns more than requested — display as returned).

## R-013 — Auto refresh

- **Decision**: v1 implements **manual refresh** only + `generatedAt` display; optional `refetchInterval` behind a Zustand toggle default **off**.
- **Rationale**: Spec assumes streaming not required; avoids surprise load on backend.
- **Alternatives considered**: Mandatory 30s polling (rejected for v1).

## R-014 — Chart accessibility

- **Decision**: Each chart includes visible title, data table fallback (`sr-only` or collapsible), sufficient color contrast via CSS variables; keyboard-focusable legend toggles when Recharts supports.
- **Rationale**: FR-015, WCAG-friendly analytics.
- **Alternatives considered**: Charts-only with no tabular fallback (rejected).

## R-015 — Spec 010 readiness

- **Decision**: No `src/features/reports/` code, no export utilities, no shared service coupling beyond existing `apiClient`.
- **Rationale**: Constitution roadmap; Reports is separate module.
- **Alternatives considered**: Shared `lib/report-analytics.ts` (premature).

## OpenAPI reconciliation checklist (Phase 1)

- [ ] Confirm exact field names on `GET /analytics/company`
- [ ] Confirm ranking list shapes on transactions/organization endpoints
- [ ] Confirm expense `byCategory[].category` string key
- [ ] Confirm `generatedAt` and `appliedFilters` location in envelope
- [ ] Confirm 403 for Employee on all analytics routes
