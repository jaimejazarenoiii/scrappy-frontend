# Phase 0 Research: Expense Management

This research documents implementation decisions for Specification 008, aligned with the Scrappy Web Constitution and built strictly on Specifications 001–007. Expense Management is a new `src/features/expenses/` module consuming Backend P007.

## R-001 — New feature module (not extension of transactions or trips)

- **Decision**: Implement expenses as `src/features/expenses/` with its own types, services, hooks, components, and pages. Do not fold expense UI into transactions or trips features.
- **Rationale**: Constitution roadmap lists Expense Management as Backend P007 with dedicated `/expenses` routes and navigation; transactions (P004/P005) and trips (P006) remain separate operational domains.
- **Alternatives considered**: Extend transactions for expense-like records (rejected — violates module boundaries and roadmap).

## R-002 — Backend-driven categories and reference types

- **Decision**: Expense categories and reference type enums come exclusively from Backend P007 APIs (`GET /expenses/categories` or equivalent). Reference entity pickers load options from existing organization/trip services based on selected `referenceType`. Never hardcode category lists or reference option maps in UI.
- **Rationale**: Spec FR-007–FR-009; categories and reference eligibility are backend-owned.
- **Alternatives considered**: Static category config in frontend (rejected — breaks tenant customization).

## R-003 — Dynamic reference selector pattern

- **Decision**: `ExpenseForm` watches `referenceType` and renders one of:
  - Company context (implicit tenant company or read-only company id from session when `COMPANY`)
  - `useBranchOptions` for `BRANCH`
  - `useWarehouseOptions` for `WAREHOUSE`
  - Vehicle list hook for `VEHICLE`
  - Trip search/list hook for `TRIP`
    Clearing `referenceId` when `referenceType` changes. Validation requires both type and id when backend mandates them.
- **Rationale**: Spec User Story 2; reuses Spec 003 organization pickers and Spec 007 trip list without duplicating fetch logic.
- **Alternatives considered**: Single combined entity picker (rejected — obscures backend reference model).

## R-004 — Expense status and lifecycle

- **Decision**: `ExpenseStatus` values loaded from API contract (typical: `ACTIVE` | `ARCHIVED` or similar). Labels/tones in `expense-status.ts` with unknown-status fallback. Delete and archive actions implemented only when Backend P007 exposes endpoints; hide actions when absent.
- **Rationale**: Spec FR-005, FR-006, FR-011; same pattern as organization archive and trip terminal states.
- **Alternatives considered**: Client-only “deleted” flag (rejected — backend owns lifecycle).

## R-005 — Amount display and totals

- **Decision**: Display `amount` and line totals from API only. List and detail show formatted currency (PHP) via shared formatter. No client-side aggregation across expenses for dashboard unless dashboard endpoint returns pre-aggregated values.
- **Rationale**: Spec FR-010; analytics aggregation belongs to Spec 009.
- **Alternatives considered**: Client sum of list page for KPI cards (rejected — use dashboard endpoint or omit KPIs).

## R-006 — Receipt attachments (mirror transactions)

- **Decision**: Clone proven `TransactionPhotosManager` patterns from Spec 005:
  - `GET /expenses/:id/attachments` list
  - `POST /expenses/:id/attachments` multipart `file`
  - `DELETE /expenses/:id/attachments/:attachmentId`
  - Authenticated image URLs via `?access_token=` for `<img>` preview
  - Upload progress, per-file error, max count/size from backend docs
- **Rationale**: Spec FR-012–FR-013; constitution reuse-first; transaction attachment flow already production-tested.
- **Alternatives considered**: New upload component from scratch (rejected — unnecessary duplication).

## R-007 — Nested attachments vs embedded detail

- **Decision**: `ExpenseService.get` returns attachments when embedded on detail. If backend uses separate attachment endpoints only, `useExpenseAttachments(expenseId)` composes alongside detail — UI uses `ExpenseReceiptGallery` fed by hook data.
- **Rationale**: Same normalization strategy as trip members/transactions (R-006 in trip research).
- **Alternatives considered**: UI calls attachment endpoints directly (rejected — violates service boundary).

## R-008 — List query and filters

- **Decision**: Reuse `useListQuery` + `FilterBar` + `DataTable` + `Pagination` from Spec 001/003 patterns. Map filters: `categoryId`, `referenceType`, `referenceId`, `status`, `fromDate`, `toDate`, `search`, `includeArchived` per contract.
- **Rationale**: Consistent with trips and transactions list UX; SC-004 find-and-open timing.
- **Alternatives considered**: Custom pagination state per page (rejected — `useListQuery` already standardized).

## R-009 — Dashboard summary (optional)

- **Decision**: If `GET /expenses/dashboard` exists, render KPI cards above list (e.g., month total, count by status, top category). If absent, list page is primary entry without client-derived aggregates.
- **Rationale**: Spec Assumptions; avoids building analytics ahead of Spec 009.
- **Alternatives considered**: Always show KPI row from list meta (rejected unless API documents meta fields).

## R-010 — Reference display and deep links

- **Decision**: `ExpenseReferenceSummary` resolves labels via existing hooks:
  - Branch/warehouse: option maps from Spec 003
  - Vehicle: vehicle list or embedded snapshot on expense detail
  - Trip: `useTrip(id)` or embedded trip summary when API provides `tripNumber`, `origin`, `destination`
  - Deep link when permitted: `buildRoute.branchDetail`, `warehouseDetail`, vehicle route, `buildRoute.tripDetail`
- **Rationale**: Spec FR-020; User Story 5.
- **Alternatives considered**: Store display names only on expense without link (rejected — poor audit UX when entity still exists).

## R-011 — Permissions model

- **Decision**: Proposed keys under `PERMISSIONS.expenses`: `view`, `create`, `update`, `delete`, `archive` (reconcile strings against backend during Phase 1). Map OWNER/MANAGER/EMPLOYEE in `session.ts` additively. Nav item uses `anyOf: [PERMISSIONS.expenses.view]`.
- **Rationale**: Matches trips/transactions permission nesting; Spec 002 gates.
- **Alternatives considered**: Reuse `transactions.*` permissions (rejected — separate product module).

## R-012 — Form validation

- **Decision**: Zod schema in `expense.schema.ts` for create/update: required category, reference type + id when applicable, description, positive amount, expense date, optional notes. `applyApiValidationErrors` on submit. Reference type change clears incompatible `referenceId` in `useEffect` (same pattern as transaction location type).
- **Rationale**: Spec FR-018; transaction draft form precedent.
- **Alternatives considered**: Separate schemas per reference type (rejected — unnecessary duplication with superRefine).

## R-013 — Delete vs archive

- **Decision**: Implement both actions when backend supports both. Archive uses `POST /expenses/:id/archive` or status transition per contract; delete uses `DELETE /expenses/:id`. List filter `includeArchived` when supported. Confirm dialogs for both; navigate to list after hard delete.
- **Rationale**: Spec User Story 6; organization archive pattern from Spec 003.
- **Alternatives considered**: Archive-only UI (rejected — spec requires conditional support for both).

## R-014 — Zustand scope

- **Decision**: `useExpenseListStore` for list filters, sort preferences, and dialog open state only. No expense records in Zustand.
- **Rationale**: Constitution Principle VII; trip `useTripListStore` precedent.
- **Alternatives considered**: Persist full expense draft in Zustand (rejected — no auto-save requirement in spec; use server as source of truth).

## R-015 — Spec 009 readiness

- **Decision**: No analytics charts, report export, or activity log UI in this module. Expense list may expose filters that analytics will later reuse, but no client-side reporting engine.
- **Rationale**: Spec FR-021; roadmap boundary.
- **Alternatives considered**: Embed simple charts on dashboard (rejected — Spec 009 scope).

## OpenAPI reconciliation checklist (implementation)

During Phase 1 service implementation, verify against `GET /docs`:

- [ ] Exact expense status enum values
- [ ] Category endpoint path and shape
- [ ] Reference type enum and required reference id rules per type
- [ ] Dashboard endpoint presence and response shape
- [ ] Attachment limits (count, size, mime types)
- [ ] Delete vs archive endpoint availability
- [ ] Permission key strings returned by backend or documented for `session.ts` mapping
