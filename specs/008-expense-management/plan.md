# Implementation Plan: Expense Management

**Branch**: `008-expense-management` | **Date**: 2026-07-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/008-expense-management/spec.md`

**Note**: Maps to Backend P007 – Expense Management. Builds strictly on Specifications 001–007 and MUST NOT redesign or replace the existing architecture. Leaves the codebase ready for **Specification 009 – Analytics (Backend P008)** with no architectural refactoring.

## Summary

Deliver the Expense Management module as a new feature at `src/features/expenses/` with permission-driven navigation and protected routes. The module provides:

- Expense dashboard and list with search, filtering, sorting, and pagination
- Expense details with category, dynamic reference entity, amount, date, status, notes, and receipt gallery
- Create and edit expense forms with backend-driven categories and reference-type selectors
- Delete and/or archive when supported by Backend P007
- Receipt photo upload, preview, removal, and gallery with upload progress
- Deep links to related organization and trip entities when permitted

Out of scope (explicitly not implemented):

- Analytics, Reports, Activity Logs (Specifications 009–011)
- Client-side expense aggregation, reporting, or category hierarchies not returned by API
- Hardcoded categories, reference types, or entity relationship logic

Technical approach:

- Implement `src/features/expenses/` following the proven feature architecture: `types/`, `services/`, `validation/`, `hooks/`, `components/`, `pages/`
- Reuse shared infrastructure: `apiClient` + `unwrap`/`unwrapList`, `useListQuery`, `DataTable`, `FilterBar`, `Pagination`, `PermissionGuard`, `PermissionGate`, RHF + Zod + `applyApiValidationErrors`, `PageHeader`, `PageContainer`, `ConfirmDialog`, `StatusBadge`, skeleton/empty/error states
- Reuse cross-feature pickers: `useBranchOptions`, `useWarehouseOptions`, vehicle list hooks, `TripService.list` / trip search for `TRIP` reference type
- Mirror receipt upload patterns from `TransactionPhotosManager` (Spec 005)
- Extend constants and routing additively: `routes.ts`, `navigation.ts`, `permissions.ts`, `routes.tsx`, breadcrumbs
- TanStack Query for all server state; Zustand for list filters, dialog open state, and temporary UI preferences only

## Technical Context

**Language/Version**: TypeScript (Strict Mode) on React 19+ with Vite

**Primary Dependencies**: React Router (Data Router), TanStack Query, Axios, Zustand, React Hook Form, Zod, Tailwind CSS v4, Lucide React, Sonner

**Storage**: N/A (frontend only; persistence via Backend P007 REST APIs)

**Testing**: Manual quickstart validation + `pnpm typecheck`, `pnpm lint`, `pnpm build`

**Target Platform**: Modern browsers (mobile-first: 320px–1536px+); light and dark mode

**Performance Goals**: Lazy-loaded expense routes; targeted query invalidation on mutations; memoized table columns; progressive image loading for receipt gallery

**Constraints**:

- No Axios in UI components (feature service classes only)
- No server state in Zustand
- No hardcoded expense categories or reference option lists
- No client-side totals/KPIs unless dashboard endpoint returns pre-aggregated data
- No duplication of analytics, reporting, or activity-log logic
- No architectural refactor of existing features (001–007)

**Scale/Scope**: New `expenses` feature module; additive constants/routes/navigation/permissions only

## Constitution Check

_GATE: Passed before Phase 0 research. Re-checked after Phase 1 design._

| Gate                                             | Status  | Notes                                                               |
| ------------------------------------------------ | ------- | ------------------------------------------------------------------- |
| API First (I, VIII)                              | ✅ Pass | `ExpenseService` + hooks; UI consumes hooks only                    |
| Type Safety (II, IX)                             | ✅ Pass | Strict TS; Zod per form; feature-local `types/`                     |
| Feature Architecture (III, XVII, XVIII)          | ✅ Pass | Entire module under `src/features/expenses/`                        |
| Routing (IV, V)                                  | ✅ Pass | Data Router; nested layouts; lazy-loaded routes                     |
| State (VII)                                      | ✅ Pass | TanStack Query for server data; Zustand for UI/filters only         |
| UI & Styling (VI, X, XI, XII, XXIX–XXXIV, XXXIX) | ✅ Pass | Reuse shared primitives; UI UX Pro Max enterprise patterns          |
| Auth & Security (XIV, XX)                        | ✅ Pass | PermissionGuard routes + PermissionGate actions                     |
| Accessibility (XV, XL)                           | ✅ Pass | Semantic forms/tables; dialog focus trap; accessible file upload    |
| Responsive Design (XXVII, XXXI)                  | ✅ Pass | Mobile card list; desktop table; stacked detail sections            |
| Page & Table Standards (XXXII, XXXVI)            | ✅ Pass | Standard page header/content; DataTable list pattern                |
| Forms & Dashboards (XXXVII, XXXVIII)             | ✅ Pass | RHF + Zod; disabled while pending; optional dashboard summary cards |
| AI UI Standards (XXVIII, XL)                     | ✅ Pass | Reuse-first; no duplicate primitives                                |
| Performance (XVI, XXXV)                          | ✅ Pass | Lazy routes; efficient query keys and invalidation                  |
| API Contract (XXVI)                              | ✅ Pass | Contracts in `specs/008/.../contracts/`                             |
| Documentation (XXII)                             | ✅ Pass | research, data-model, contracts, quickstart complete                |

No violations. Complexity Tracking not required.

## Project Structure

### Documentation (this feature)

```text
specs/008-expense-management/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
└── contracts/
    ├── api-endpoints.md
    └── routes-and-guards.md
```

### Source Code (repository root)

New paths only. Existing files are extended additively.

```text
src/
├── app/router/routes.tsx                    # EXTEND: expenses lazy routes
├── constants/
│   ├── routes.ts                            # EXTEND: expenses paths + buildRoute
│   ├── navigation.ts                        # EXTEND: Expenses nav item
│   └── permissions.ts                       # EXTEND: expenses permission keys
├── features/auth/lib/session.ts             # EXTEND: role → expenses permissions
├── lib/breadcrumb.ts                        # EXTEND: expense segments
├── hooks/useBreadcrumbTrail.ts              # EXTEND: expense trails
└── features/expenses/
    ├── types/expense.types.ts
    ├── services/expense.service.ts
    ├── validation/expense.schema.ts
    ├── lib/
    │   ├── expense-status.ts
    │   └── expense-reference.ts             # reference type labels + route resolver
    ├── hooks/
    │   ├── expense-keys.ts
    │   ├── useExpenses.ts
    │   ├── useExpense.ts
    │   ├── useExpenseCategories.ts
    │   ├── useExpenseMutations.ts
    │   ├── useExpenseAttachments.ts
    │   ├── useExpenseAttachmentMutations.ts
    │   ├── useExpenseDashboard.ts           # optional when endpoint exists
    │   ├── useExpenseListStore.ts           # Zustand: filters/view prefs
    │   └── useExpenseDialogStore.ts         # Zustand: delete/archive confirm dialogs
    ├── components/
    │   ├── ExpenseStatusBadge.tsx
    │   ├── ExpenseForm.tsx
    │   ├── ExpenseReferencePicker.tsx       # dynamic branch/warehouse/vehicle/trip
    │   ├── ExpenseReferenceSummary.tsx      # detail display + deep links
    │   ├── ExpenseCategorySelect.tsx
    │   ├── ExpenseReceiptGallery.tsx
    │   ├── ExpenseReceiptUpload.tsx
    │   ├── ExpenseDeleteDialog.tsx
    │   ├── ExpenseArchiveDialog.tsx
    │   └── ExpenseDetailActions.tsx
    └── pages/
        ├── ExpensesDashboardPage.tsx          # wraps list + optional summary cards
        ├── ExpensesListPage.tsx
        ├── ExpenseDetailPage.tsx
        ├── ExpenseCreatePage.tsx
        └── ExpenseEditPage.tsx
```

**Structure Decision**: New feature module per Constitution Principle III, cloned from trips + transactions patterns. Receipt upload reuses `TransactionPhotosManager` interaction model — not transaction business logic. Reference pickers compose existing organization and trip hooks.

## Implementation Phases

### Phase 0 — Research & Contract Reconciliation

- **Objective**: Confirm Backend P007 endpoints, status values, category/reference models, attachment APIs, and permission keys match frontend contracts.
- **Scope**: Expense CRUD, categories, reference types, attachments, dashboard summary (if any), delete/archive lifecycle.
- **Tasks**:
  1. Produce `research.md` with decisions and alternatives (R-001–R-015)
  2. Produce `data-model.md` with entities, relationships, and validation rules
  3. Produce `contracts/api-endpoints.md` and `contracts/routes-and-guards.md`
  4. Draft `quickstart.md` validation scenarios
- **Deliverables**: Phase 0 documentation artifacts
- **Dependencies**: Backend P007 API reference / Swagger at `GET /docs`
- **Validation**: No unresolved NEEDS CLARIFICATION in technical context; OpenAPI reconciliation checklist in research.md
- **Risks**: Endpoint path or permission key mismatch → reconcile during Phase 1 against live API
- **Exit Criteria**: Contracts documented; implementation can proceed without architecture changes

**Status**: ✅ Complete (artifacts in this spec directory)

**Parallelizable**: No

---

### Phase 1 — Types, Service & Status Foundation

- **Objective**: Establish expense data layer and service methods callable from hooks.
- **Scope**: `expense.types.ts`, `expense.service.ts`, `expense-status.ts`, `expense-reference.ts`, query key factory.
- **Tasks**:
  1. Define `ExpenseStatus` (reconcile with OpenAPI; typical `ACTIVE` | `ARCHIVED`)
  2. Define `ExpenseReferenceType`: `COMPANY` | `BRANCH` | `WAREHOUSE` | `VEHICLE` | `TRIP`
  3. Define `ExpenseSummary`, `ExpenseDetail`, `ExpenseCategory`, `ExpenseAttachment`, `CreateExpenseInput`, `UpdateExpenseInput`
  4. Add `EXPENSE_ENDPOINTS` constant object mirroring contract paths
  5. Implement `ExpenseService.list`, `get`, `create`, `update`, `delete` (if supported), `archive` (if supported)
  6. Implement `listCategories`, `listAttachments`, `uploadAttachment`, `deleteAttachment`
  7. Implement optional `getDashboard` when endpoint exists
  8. Add `expense-status.ts` labels/tones with unknown-status fallback
  9. Add `expense-reference.ts` with type labels and `resolveReferenceRoute(type, id)` for deep links
  10. Create `expenseKeys` query key factory
- **Deliverables**: `types/`, `services/`, `lib/expense-status.ts`, `lib/expense-reference.ts`, `hooks/expense-keys.ts`
- **Dependencies**: Phase 0 contracts
- **Validation**: `pnpm typecheck` passes; service paths match `contracts/api-endpoints.md`
- **Risks**: Nested attachment paths differ from contract → update service only, not UI
- **Exit Criteria**: Service layer callable; types align with API reference

**Parallelizable**: No (foundation for all UI phases)

---

### Phase 2 — Permissions, Routes & Navigation Wiring

- **Objective**: Wire protected expense routes and permission-driven navigation.
- **Scope**: `routes.ts`, `permissions.ts`, `session.ts`, `routes.tsx`, breadcrumbs.
- **Tasks**:
  1. Add `ROUTES.expenses`, `expensesNew`, `expenseDetail`, `expenseEdit` + `buildRoute.expenseDetail(id)`, `buildRoute.expenseEdit(id)`
  2. Extend `PERMISSIONS.expenses` with keys: `view`, `create`, `update`, `delete`, `archive` (reconcile against backend)
  3. Map expense permissions to OWNER/MANAGER/EMPLOYEE in `session.ts` (additive)
  4. Register lazy routes: `ExpensesDashboardPage`, `ExpenseCreatePage`, `ExpenseDetailPage`, `ExpenseEditPage`
  5. Protect each route with `PermissionGuard` (`expenses.view` minimum; create/edit with respective keys)
  6. Add `Expenses` nav item to `navigation.ts` with `anyOf: [PERMISSIONS.expenses.view]`
  7. Extend breadcrumb config for expense list, new, detail, edit segments
- **Deliverables**: Updated constants, router, session, breadcrumbs
- **Dependencies**: Phase 1 permission key naming from contracts
- **Validation**: Deep links work; unauthorized users blocked; nav hidden without permission
- **Risks**: Over-broad employee permissions → match backend role matrix
- **Exit Criteria**: All four expense routes reachable and protected

**Parallelizable**: Can start after Phase 1 types exist (route constants known)

---

### Phase 3 — List, Dashboard & Detail (Read UX)

- **Objective**: Implement core read surfaces with status rendering, category display, and reference summaries.
- **Scope**: `ExpensesListPage`, `ExpensesDashboardPage`, `ExpenseDetailPage` (read-only sections first).
- **Tasks**:
  1. Implement `useExpenses(params)` with `useListQuery` integration
  2. Implement `useExpense(id)` detail query
  3. Implement optional `useExpenseDashboard()` when endpoint exists
  4. Build list page: `PageHeader`, `FilterBar` (category, reference type, status, date range, includeArchived), search, `DataTable` + mobile cards, `Pagination`
  5. Add optional dashboard summary cards above list when `GET /expenses/dashboard` returns aggregates — no client-side sums
  6. Build detail page skeleton: header with `ExpenseStatusBadge`, amount, expense date, category
  7. Add `ExpenseReferenceSummary` with deep links to branch/warehouse/vehicle/trip when permitted
  8. Add `DescriptionList` sections for description, notes, audit timestamps
  9. Wire loading, empty, error, not-found states
  10. Document title updates per page
- **Deliverables**: List + dashboard + detail read layout
- **Dependencies**: Phase 1–2
- **Validation**: User Story 1 acceptance scenarios; SC-004 find-and-open timing
- **Risks**: List filter param names mismatch → align with `toQueryParams` / contract
- **Exit Criteria**: Users can browse, filter, and open expense details

**Parallelizable**: After Phase 2 route wiring

---

### Phase 4 — Create & Edit Expense Forms

- **Objective**: Expense creation and editing with validated forms and dynamic reference pickers.
- **Scope**: `ExpenseForm`, `ExpenseCategorySelect`, `ExpenseReferencePicker`, `ExpenseCreatePage`, `ExpenseEditPage`, `expense.schema.ts`, `useExpenseMutations`.
- **Tasks**:
  1. Implement `useExpenseCategories()` query — never hardcode categories
  2. Create Zod schema for create/update with `superRefine` for reference id when type requires entity
  3. Build `ExpenseForm` with RHF + `applyApiValidationErrors`
  4. Build `ExpenseReferencePicker`: watch `referenceType`; render branch/warehouse/vehicle/trip picker; clear `referenceId` on type change
  5. Build `ExpenseCategorySelect` with loading/empty/error states
  6. Implement `useCreateExpense`, `useUpdateExpense` mutations with toast + navigation on success
  7. Gate edit route/button by backend-permitted status (typically `ACTIVE`; confirm via API)
  8. Disable submit while pending; show success toast and redirect to detail
- **Deliverables**: Create/edit pages + form components + mutations
- **Dependencies**: Phase 3 detail page (navigation target); Spec 003/007 picker hooks
- **Validation**: User Stories 2 and 3 acceptance scenarios
- **Risks**: `COMPANY` reference may not need picker → read-only company context from session
- **Exit Criteria**: Create and edit flows persist via backend with dynamic reference selection

**Parallelizable**: After Phase 3 (detail exists)

---

### Phase 5 — Receipt Photos (Upload, Gallery, Remove)

- **Objective**: Receipt attachment management mirroring transaction photo patterns.
- **Scope**: `ExpenseReceiptUpload`, `ExpenseReceiptGallery`, attachment hooks.
- **Tasks**:
  1. Implement `useExpenseAttachments(expenseId)` and `useExpenseAttachmentMutations`
  2. Build `ExpenseReceiptUpload` with multi-file select, per-file progress, mime/size validation feedback from API
  3. Build `ExpenseReceiptGallery` with authenticated `downloadUrl` + `?access_token=` preview, progressive loading, remove action
  4. Handle partial upload success (some files fail, others succeed) with clear per-file errors
  5. Embed gallery on detail page; upload on detail and edit when expense editable
  6. Gate upload/remove with `PermissionGate` + editable status hints
  7. Reference `TransactionPhotosManager` for interaction patterns — do not import transaction-specific logic
- **Deliverables**: Receipt upload + gallery components + hooks
- **Dependencies**: Phase 1 attachment service methods; Phase 3 detail page
- **Validation**: User Story 4 acceptance scenarios
- **Risks**: Attachment embedded in detail vs separate endpoint → support both via service normalization
- **Exit Criteria**: Upload, preview, and remove receipts with backend as source of truth

**Parallelizable**: After Phase 1 (can proceed in parallel with Phase 4 once detail shell exists)

---

### Phase 6 — Delete & Archive Lifecycle

- **Objective**: Remove expenses from active use when backend supports delete and/or archive.
- **Scope**: `ExpenseDetailActions`, `ExpenseDeleteDialog`, `ExpenseArchiveDialog`, lifecycle mutations.
- **Tasks**:
  1. Implement `useDeleteExpense` and `useArchiveExpense` mutations (only when endpoints exist)
  2. Build confirm dialogs reusing `ConfirmDialog` pattern from Spec 003/006
  3. Build `ExpenseDetailActions` toolbar gated by `PermissionGate` + status hints
  4. On delete success: toast + navigate to list; invalidate list queries
  5. On archive success: invalidate detail + list; update status badge
  6. Wire `includeArchived` filter on list when supported
  7. On 409 lifecycle conflict: toast + refetch detail
- **Deliverables**: Lifecycle actions + dialogs + mutations
- **Dependencies**: Phase 3 detail page; Phase 1 service methods
- **Validation**: User Story 6 acceptance scenarios
- **Risks**: Backend supports only one of delete/archive → hide unsupported action without error
- **Exit Criteria**: Delete and/or archive operable per API contract

**Parallelizable**: After Phase 3 (with Phase 5)

---

### Phase 7 — Reference Deep Links & Cross-Module Polish

- **Objective**: Complete relationship display and inbound/outbound navigation polish.
- **Scope**: `ExpenseReferenceSummary`, optional trip detail expense filter link.
- **Tasks**:
  1. Enrich reference labels via existing branch/warehouse/vehicle/trip hooks when detail lacks `referenceLabel`
  2. Deep link to `buildRoute.branchDetail`, `warehouseDetail`, vehicle detail, `buildRoute.tripDetail` when user has target permission
  3. Safe fallback when reference entity archived or 404 on lookup
  4. Optional: on trip detail, link to `/expenses?referenceType=TRIP&referenceId={id}` (non-blocking polish)
  5. Ensure expense module does not embed organization or trip editors
- **Deliverables**: Polished reference summary + optional cross-links
- **Dependencies**: Phase 3 detail; Spec 003/007 routes
- **Validation**: User Story 5 acceptance scenarios
- **Risks**: Missing embedded snapshot on detail → extra lookup queries; cache via TanStack Query
- **Exit Criteria**: Reference type and entity display correctly with navigable links when permitted

**Parallelizable**: After Phase 3 (can overlap with Phases 4–6)

---

### Phase 8 — Integration Hardening & Quality Gates

- **Objective**: Edge cases, accessibility, responsive polish, and release readiness.
- **Scope**: Cross-cutting polish across expenses module.
- **Tasks**:
  1. Handle unknown `ExpenseStatus` in badge and filters
  2. On 403: toast + hide action on next render
  3. On 409: refresh detail + user-safe conflict message
  4. Verify deep links for all routes with/without permission
  5. Verify no analytics/report/activity-log code introduced
  6. Verify category and reference options never hardcoded (grep audit)
  7. Run `pnpm typecheck`, `pnpm lint`, `pnpm build`
  8. Execute `quickstart.md` manual validation checklist
  9. Dark mode spot-check on all expense pages
  10. Keyboard and screen-reader pass on forms, tables, gallery, dialogs, file upload
  11. Mobile/tablet/desktop responsive verification per UI UX Pro Max breakpoints
- **Deliverables**: Hardened module; passing quality gates
- **Dependencies**: Phases 1–7 complete
- **Validation**: All spec FRs and success criteria; Constitution production checklist
- **Risks**: Manual quickstart blocked without running backend → document seed prerequisites in quickstart.md
- **Exit Criteria**: Production-ready Expense Management; no refactor needed before Spec 009

**Parallelizable**: No

---

## Parallel Development Summary

| After phase | Can run in parallel                         |
| ----------- | ------------------------------------------- |
| Phase 1     | Phase 2 (once route/permission names fixed) |
| Phase 3     | Phases 4, 5, 6, 7 (detail shell required)   |
| Phase 4     | Phase 5 (receipts on detail/edit)           |
| Phase 6     | Phase 7 (lifecycle vs reference polish)     |

Recommended team split after Phase 3: one stream on forms (4) + lifecycle (6); another on receipts (5) + reference polish (7).

## Spec 009 Readiness

- New feature isolated under `src/features/expenses/`; no analytics charts or export UI
- Expense list filters (`categoryId`, `referenceType`, `fromDate`, `toDate`, `status`) stable for analytics module to compose later
- Route namespace `/expenses/*` established; no shared Zustand store pollution
- Dashboard KPIs only when backend pre-aggregates — analytics (P008) will own reporting views
- No architectural changes required to trips, transactions, or organization modules

## Complexity Tracking

Not required — all constitution gates pass without justified violations.
