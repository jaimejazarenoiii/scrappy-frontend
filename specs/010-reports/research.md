# Research: Reports (Backend P009)

**Date**: 2026-07-10  
**Spec**: [spec.md](./spec.md)

## R-001 — Reports vs Analytics boundary

- **Decision**: Reports module consumes only `/api/v1/reports/*` (row-oriented lists + optional summary meta + export). No `/analytics/*` chart aggregation in this feature.
- **Rationale**: Spec 010 and Constitution roadmap separate Analytics (P008) from Reports (P009).
- **Alternatives considered**: Reuse analytics endpoints for tables (rejected — wrong contract shape).

## R-002 — No client-side aggregation or local export generation

- **Decision**: Summary figures and row values render exclusively from report API fields. Export files are downloaded from backend responses (blob/URL). Never build CSV/Excel/PDF from DOM or in-memory row arrays.
- **Rationale**: FR-003, FR-008, FR-009; backend owns business rules and file formatting.
- **Alternatives considered**: Client-side SheetJS/PDFKit export (rejected — violates constitution and spec).

## R-003 — Absorb Spec 008 expense report helpers

- **Decision**: Move/repurpose `expense-report-api.ts` / `useExpenseReport` patterns into `src/features/reports/` as the canonical Reports feature. Leave Expenses CRUD on `GET /expenses`. Thin re-exports or deletion of unused expense-report hooks after migration.
- **Rationale**: Spec 008 already documented `/reports/expenses` as reserved for Reports; Spec 010 owns that surface.
- **Alternatives considered**: Keep calling ExpenseService.listReport from expenses feature (rejected — wrong module ownership).

## R-004 — Information architecture: hub + domain routes

- **Decision**: Hub at `/reports` with category cards/links. Separate lazy pages for `/reports/transactions|trips|expenses|payroll|attendance` (not a single tabbed page).
- **Rationale**: Spec FR-002 mandates distinct routes; deep linking and code splitting per domain.
- **Alternatives considered**: Analytics-style single dashboard with tabs (rejected — conflicts with required routes).

## R-005 — Shared filter model

- **Decision**: Per-domain Zustand filter stores (or one store keyed by `ReportDomain`) holding date range, entity filters, search, includeArchived, sort, page. TanStack Query keys include serialized filter + page snapshot. Queries disabled until date validation passes.
- **Rationale**: Constitution VII; required `from`/`to` for report endpoints (expense report already requires ISO8601 range).
- **Alternatives considered**: URL-only state for all filters (good for shareable links — adopt hybrid: sync critical filters to search params in Phase 6 polish).

## R-006 — Date range defaults and validation

- **Decision**: Default to current calendar month (`from` = first day, `to` = today). Max span **366 days**. Convert date inputs to ISO8601 start/end of day UTC (reuse Spec 008 helpers).
- **Rationale**: Matches existing `expense-report-api.ts` and API reference assumptions.
- **Alternatives considered**: Period presets like Analytics (optional enhancement; baseline is explicit from/to).

## R-007 — Permissions

- **Decision**: Add `PERMISSIONS.reports.view` (and optional `reports.export` if OpenAPI distinguishes). Grant to OWNER and MANAGER in `session.ts`. Employee has no reports permissions unless OpenAPI says otherwise.
- **Rationale**: Align with Analytics gating; backend 403 is authoritative.
- **Alternatives considered**: Role string checks in pages (rejected — Spec 002 pattern).

## R-008 — Export UX

- **Decision**: `ReportService.export*(filters, format)` returns `Blob` (or triggers download URL). UI: `ReportExportMenu` with CSV/Excel always when API lists them; PDF only when capability flag/OpenAPI says supported. Toast + button busy state for progress; `URL.createObjectURL` + temporary `<a download>` for completion.
- **Rationale**: No new dependencies; works with Axios `responseType: 'blob'`.
- **Alternatives considered**: Async job polling UI (implement only if backend returns job id instead of file).

## R-009 — Printing

- **Decision**: Print-friendly CSS class on report view + `window.print()`. Optional dedicated print route/layout later. No separate print data fetch unless backend provides a print-specific endpoint.
- **Rationale**: Spec allows print preview via browser; data already loaded from report query.
- **Alternatives considered**: Server-rendered PDF-only print (use export PDF when available instead).

## R-010 — Table performance

- **Decision**: Reuse shared `DataTable` + backend pagination. Defer virtualization until page size > 50 or measured jank; do not add `@tanstack/react-virtual` in v1 unless OpenAPI default page size is large.
- **Rationale**: Avoid unnecessary dependency; Spec allows virtualization “when appropriate.”
- **Alternatives considered**: Always virtualize (premature).

## R-011 — Optional hub features

- **Decision**: Recently generated reports and saved filters are **capability-gated**. If endpoints missing, hub shows only static categories + quick access links. No mock data.
- **Rationale**: FR-021.
- **Alternatives considered**: Local-only “recent” list in localStorage (optional polish — label as UI preference, not backend recent).

## R-012 — Domain filter matrix

- **Decision**: Shared base filters: `from`, `to`, `branchId`, `warehouseId`, `vehicleId`, `employeeId`, `includeArchived`, `search`, `page`, `limit`, `sortBy`, `sortOrder`. Domain extras only when OpenAPI documents them (e.g. transaction type, expense category, payroll period, trip status).
- **Rationale**: Expense report helpers already define shared keys; extend per domain during OpenAPI reconciliation.
- **Alternatives considered**: One mega filter form for all domains (rejected — sends invalid params).

## R-013 — Spec 011 readiness

- **Decision**: No `src/features/activity-logs/` code; no audit timeline UI in Reports.
- **Rationale**: Constitution roadmap.
- **Alternatives considered**: Shared “audit” package (premature).

## OpenAPI reconciliation checklist (implementation)

- [x] Confirm exact paths for five report domains + export — implemented as `/reports/{domain}` and `/reports/{domain}/export`; reconcile against live Swagger if paths differ
- [x] Confirm required `from`/`to` and max span — enforced client-side (366 days)
- [x] Confirm export formats per domain (csv/xlsx/pdf) — CSV/XLSX enabled; PDF gated off until OpenAPI confirms
- [x] Confirm sync blob vs async job export — sync blob download implemented; async job polling deferred
- [x] Confirm summary meta field names (`generatedAt`, `appliedCriteria`, totals) — parsed defensively from meta
- [x] Confirm 403 for Employee — `PERMISSIONS.reports.*` granted to Owner/Manager only
- [x] Confirm optional recent/saved-filter endpoints — hub omits sections; static categories + quick access only
