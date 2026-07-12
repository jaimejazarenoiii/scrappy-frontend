# Tasks: Specification 008 – Expense Management

**Input**: Design documents from `/specs/008-expense-management/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Not requested in Specification 008 (manual quickstart validation required).

**Organization**: Tasks grouped by user story for independent implementation and testing. New module at `src/features/expenses/` — no architectural refactor of Specs 001–007.

## Phase 1: Setup (Expense Module Scaffolding)

**Purpose**: Create feature directory tree and placeholder files so foundational work can proceed without import errors.

- [x] T001 Create directory tree under `src/features/expenses/` per `plan.md`: `components/`, `hooks/`, `pages/`, `services/`, `types/`, `validation/`, `lib/`.
- [x] T002 [P] Create `src/features/expenses/types/expense.types.ts` with exported placeholder types (`ExpenseStatus`, `ExpenseSummary`, `ExpenseDetail`).
- [x] T003 [P] Create `src/features/expenses/services/expense.service.ts` with exported `EXPENSE_ENDPOINTS` and `ExpenseService` placeholder object.
- [x] T004 [P] Create `src/features/expenses/lib/expense-status.ts` with placeholder `expenseStatusLabel` and `expenseStatusTone` exports.
- [x] T005 [P] Create `src/features/expenses/lib/expense-reference.ts` with placeholder `expenseReferenceTypeLabel` and `resolveExpenseReferenceRoute` exports.
- [x] T006 [P] Create `src/features/expenses/validation/expense.schema.ts` with placeholder Zod schema for create/update.
- [x] T007 [P] Create `src/features/expenses/hooks/expense-keys.ts` with exported `expenseKeys` query key factory placeholders.
- [x] T008 [P] Create placeholder hooks: `src/features/expenses/hooks/useExpenses.ts`, `useExpense.ts`, `useExpenseMutations.ts`.
- [x] T009 [P] Create placeholder hooks: `src/features/expenses/hooks/useExpenseCategories.ts`, `useExpenseAttachments.ts`, `useExpenseAttachmentMutations.ts`.
- [x] T010 [P] Create placeholder hooks: `src/features/expenses/hooks/useExpenseDashboard.ts`, `useExpenseListStore.ts`, `useExpenseDialogStore.ts`.
- [x] T011 [P] Create placeholder components: `src/features/expenses/components/ExpenseStatusBadge.tsx`, `ExpenseReferenceSummary.tsx`, `ExpenseCategorySelect.tsx`.
- [x] T012 [P] Create placeholder components: `src/features/expenses/components/ExpenseForm.tsx`, `ExpenseReferencePicker.tsx`, `ExpenseDetailActions.tsx`.
- [x] T013 [P] Create placeholder components: `src/features/expenses/components/ExpenseReceiptUpload.tsx`, `ExpenseReceiptGallery.tsx`.
- [x] T014 [P] Create placeholder dialogs: `src/features/expenses/components/ExpenseDeleteDialog.tsx`, `ExpenseArchiveDialog.tsx`.
- [x] T015 [P] Create placeholder pages: `src/features/expenses/pages/ExpensesDashboardPage.tsx`, `ExpensesListPage.tsx`, `ExpenseDetailPage.tsx`, `ExpenseCreatePage.tsx`, `ExpenseEditPage.tsx`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Types, services, status libs, routes, permissions, and navigation. **No user story work until this phase completes.**

- [x] T016 Define `ExpenseStatus` union in `src/features/expenses/types/expense.types.ts` (reconcile with OpenAPI; typical `ACTIVE` | `ARCHIVED`).
- [x] T017 Define `ExpenseReferenceType` union in `src/features/expenses/types/expense.types.ts`: `COMPANY` | `BRANCH` | `WAREHOUSE` | `VEHICLE` | `TRIP`.
- [x] T018 Define `ExpenseSummary` and `ExpenseDetail` interfaces in `src/features/expenses/types/expense.types.ts` per `data-model.md`.
- [x] T019 Define `ExpenseCategory`, `ExpenseAttachment`, and `ExpenseReferenceSnapshot` types in `src/features/expenses/types/expense.types.ts`.
- [x] T020 Define input types in `src/features/expenses/types/expense.types.ts`: `CreateExpenseInput`, `UpdateExpenseInput`, `ExpenseListParams`.
- [x] T021 Define optional `ExpenseDashboardSummary` type in `src/features/expenses/types/expense.types.ts` when dashboard endpoint exists.
- [x] T022 Implement `EXPENSE_ENDPOINTS` in `src/features/expenses/services/expense.service.ts` per `contracts/api-endpoints.md`.
- [x] T023 Implement `ExpenseService.list` in `src/features/expenses/services/expense.service.ts` calling `GET /expenses` with `unwrapList`.
- [x] T024 Implement `ExpenseService.get` in `src/features/expenses/services/expense.service.ts` calling `GET /expenses/:id`.
- [x] T025 Implement `ExpenseService.create` and `ExpenseService.update` in `src/features/expenses/services/expense.service.ts`.
- [x] T026 Implement `ExpenseService.delete` in `src/features/expenses/services/expense.service.ts` when backend supports deletion (graceful no-op or method guard documented in service).
- [x] T027 Implement `ExpenseService.archive` in `src/features/expenses/services/expense.service.ts` when backend supports archiving.
- [x] T028 Implement `ExpenseService.listCategories` in `src/features/expenses/services/expense.service.ts` calling category list endpoint.
- [x] T029 Implement attachment methods in `src/features/expenses/services/expense.service.ts`: `listAttachments`, `uploadAttachment`, `deleteAttachment`.
- [x] T030 Implement optional `ExpenseService.getDashboard` in `src/features/expenses/services/expense.service.ts` when endpoint exists (graceful fallback documented in service).
- [x] T031 Implement `expense-status.ts` in `src/features/expenses/lib/expense-status.ts` with labels/tones for all statuses and unknown-status fallback.
- [x] T032 Implement `expense-reference.ts` in `src/features/expenses/lib/expense-reference.ts` with type labels and `resolveExpenseReferenceRoute(type, id)` using `buildRoute` helpers.
- [x] T033 Implement `expenseKeys` factory in `src/features/expenses/hooks/expense-keys.ts` for list, detail, categories, attachments, and dashboard queries.
- [x] T034 Update `src/constants/permissions.ts` additively with `PERMISSIONS.expenses`: `view`, `create`, `update`, `delete`, `archive` per `contracts/routes-and-guards.md`.
- [x] T035 Update `PermissionKey` union in `src/constants/permissions.ts` to include expenses permission keys.
- [x] T036 Update `src/features/auth/lib/session.ts` `ROLE_PERMISSIONS` for OWNER/MANAGER/EMPLOYEE with expenses permission keys (reconcile against Backend P007).
- [x] T037 Update `src/constants/routes.ts` with `expenses`, `expensesNew`, `expenseDetail`, `expenseEdit` route constants.
- [x] T038 Update `src/constants/routes.ts` `buildRoute` with `expenseDetail(id)` and `expenseEdit(id)` helpers.
- [x] T039 Update `src/constants/navigation.ts` to add Expenses nav item with `anyOf: [PERMISSIONS.expenses.view]` and Lucide icon (after Trips).
- [x] T040 Register lazy expense routes in `src/app/router/routes.tsx` for all four pages with `PermissionGuard` per `contracts/routes-and-guards.md`.
- [x] T041 Update `src/lib/breadcrumb.ts` to support expenses, new, detail, and edit breadcrumb segments.
- [x] T042 Update `src/hooks/useBreadcrumbTrail.ts` to resolve expense breadcrumb labels from expense detail query cache (`expenseNumber` or truncated `description`).
- [x] T043 Run `pnpm typecheck` after foundational changes and fix compile errors in `src/features/expenses/` and updated constants.

**Checkpoint**: Types, services, routes, and permissions ready — user story implementation can begin.

---

## Phase 3: User Story 1 – Discover and Review Expenses (Priority: P1) 🎯 MVP

**Goal**: Authorized users browse expenses with search/filter/sort/pagination and open expense details with backend-provided fields and relationships.

**Independent Test**: Navigate to `/expenses`, filter and search, open an expense detail page; verify category, reference, amount, date, status, notes, and receipt summary load from API with loading/empty/error states.

- [x] T044 [US1] Implement `useExpenses(params)` in `src/features/expenses/hooks/useExpenses.ts` using TanStack Query and `ExpenseService.list`.
- [x] T045 [US1] Implement `useExpense(id)` in `src/features/expenses/hooks/useExpense.ts` with enabled guard when `id` is defined.
- [x] T046 [US1] Implement optional `useExpenseDashboard()` in `src/features/expenses/hooks/useExpenseDashboard.ts` when dashboard endpoint exists.
- [x] T047 [US1] Implement `ExpenseStatusBadge` in `src/features/expenses/components/ExpenseStatusBadge.tsx` using `expense-status.ts` labels/tones.
- [x] T048 [US1] Build `ExpensesListPage` in `src/features/expenses/pages/ExpensesListPage.tsx` with `PageHeader`, `FilterBar` (category, reference type, status, date range, includeArchived), search, `DataTable`, mobile cards, and `Pagination`.
- [x] T049 [US1] Wire `useListQuery` in `ExpensesListPage` for search, sort, page, and filter state synced to query params.
- [x] T050 [US1] Add status filter options in `ExpensesListPage` for all `ExpenseStatus` values with safe unknown fallback.
- [x] T051 [US1] Implement loading skeleton, empty state, and error state with retry in `src/features/expenses/pages/ExpensesListPage.tsx`.
- [x] T052 [US1] Implement `ExpensesDashboardPage` in `src/features/expenses/pages/ExpensesDashboardPage.tsx` wrapping `ExpensesListPage` with optional summary KPI cards when dashboard/meta data exists — no client-side aggregation.
- [x] T053 [US1] Build read-only `ExpenseDetailPage` in `src/features/expenses/pages/ExpenseDetailPage.tsx` with `PageHeader`, `ExpenseStatusBadge`, amount, expense date, category, and `DescriptionList` for description and notes.
- [x] T054 [US1] Display reference type and entity summary on `ExpenseDetailPage` using `ExpenseReferenceSummary` with embedded API labels.
- [x] T055 [US1] Add loading (`PageSkeleton`), not-found (`EmptyState`), and error (`ErrorState`) handling in `src/features/expenses/pages/ExpenseDetailPage.tsx`.
- [x] T056 [US1] Add row click navigation from `ExpensesListPage` to `buildRoute.expenseDetail(id)` with keyboard-accessible row actions.
- [x] T057 [US1] Gate New expense button in `ExpensesListPage` with `PermissionGate` (`PERMISSIONS.expenses.create`).
- [x] T058 [US1] Set `document.title` in `ExpensesListPage` and `ExpenseDetailPage` per page context.
- [x] T059 [US1] Verify `/expenses` and `/expenses/:id` deep links work with browser back/forward after Phase 2 route registration.

**Checkpoint**: User Story 1 independently testable — list and detail read UX complete.

---

## Phase 4: User Story 2 – Create and Edit Expenses (Priority: P1)

**Goal**: Authorized users create and edit eligible expenses with validated forms and dynamic reference pickers.

**Independent Test**: Create expense at `/expenses/new`, save, reopen edit, change fields, verify detail reflects latest API state; invalid submit shows inline errors; reference picker changes when reference type changes.

- [x] T060 [US2] Implement Zod schemas in `src/features/expenses/validation/expense.schema.ts` for create/update with `superRefine` for reference id when type requires entity.
- [x] T061 [US2] Implement `ExpenseForm` in `src/features/expenses/components/ExpenseForm.tsx` with React Hook Form, Zod resolver, and `applyApiValidationErrors`.
- [x] T062 [US2] Implement `ExpenseReferencePicker` in `src/features/expenses/components/ExpenseReferencePicker.tsx` watching `referenceType` and rendering branch/warehouse/vehicle/trip pickers via existing organization and trip hooks.
- [x] T063 [US2] Clear `referenceId` when `referenceType` changes in `ExpenseForm` via `useEffect` (same pattern as transaction location type).
- [x] T064 [US2] Integrate `ExpenseCategorySelect` in `ExpenseForm` loading categories from `useExpenseCategories` — never hardcode options.
- [x] T065 [US2] Implement `useCreateExpense` mutation in `src/features/expenses/hooks/useExpenseMutations.ts` with success toast and navigation to `buildRoute.expenseDetail(id)`.
- [x] T066 [US2] Implement `useUpdateExpense` mutation in `src/features/expenses/hooks/useExpenseMutations.ts` with `expenseKeys` invalidation for detail and lists.
- [x] T067 [US2] Build `ExpenseCreatePage` in `src/features/expenses/pages/ExpenseCreatePage.tsx` wrapping `ExpenseForm` with `PageHeader`, breadcrumbs, and disabled submit while pending.
- [x] T068 [US2] Build `ExpenseEditPage` in `src/features/expenses/pages/ExpenseEditPage.tsx` loading expense via `useExpense`, hydrating form, and handling save/cancel navigation.
- [x] T069 [US2] Gate Edit action on `ExpenseDetailPage` with `PermissionGate` (`expenses.update`) and editable status display hint (confirm against backend editability).
- [x] T070 [US2] Redirect or show ineligible state on `ExpenseEditPage` when expense status is not editable per backend rules.
- [x] T071 [US2] Show success toast and navigate to detail after create/update in `ExpenseCreatePage` and `ExpenseEditPage`.
- [x] T072 [US2] Set `document.title` for create and edit pages in `src/features/expenses/pages/ExpenseCreatePage.tsx` and `ExpenseEditPage.tsx`.

**Checkpoint**: User Story 2 independently testable — create and edit flows complete.

---

## Phase 5: User Story 3 – Manage Expense Categories (Priority: P1)

**Goal**: Categories load from backend APIs for form selection and list filtering; never hardcoded.

**Independent Test**: Open create form, verify category options load from API, select category, save, filter list by that category with matching results.

- [x] T073 [US3] Implement `useExpenseCategories()` in `src/features/expenses/hooks/useExpenseCategories.ts` using TanStack Query and `ExpenseService.listCategories`.
- [x] T074 [US3] Finalize `ExpenseCategorySelect` in `src/features/expenses/components/ExpenseCategorySelect.tsx` with loading, empty, and error states per `spec.md` empty state design.
- [x] T075 [US3] Show guided empty state in `ExpenseCategorySelect` when category list is empty (“No categories available”).
- [x] T076 [US3] Wire category filter in `ExpensesListPage` `FilterBar` using live category options from `useExpenseCategories`.
- [x] T077 [US3] Display `categoryName` or embedded `category` on `ExpenseDetailPage` and list rows from API payload only.
- [x] T078 [US3] Preserve API category sort order in `ExpenseCategorySelect` when `sortOrder` is returned.
- [x] T079 [US3] Block form submit in `ExpenseForm` when categories failed to load and category is required (actionable error with retry).
- [x] T080 [US3] Audit `src/features/expenses/` for hardcoded category arrays — remove any found.

**Checkpoint**: User Story 3 independently testable — categories fully API-driven.

---

## Phase 6: User Story 4 – Attach and Manage Receipt Photos (Priority: P2)

**Goal**: Upload, preview, and remove receipt images with progress feedback mirroring transaction photo patterns.

**Independent Test**: On editable expense, upload multiple receipt images, preview them, remove one when allowed, verify attachment list matches backend after refresh.

- [x] T081 [US4] Implement `useExpenseAttachments(expenseId)` in `src/features/expenses/hooks/useExpenseAttachments.ts` with support for embedded detail attachments or separate list endpoint.
- [x] T082 [US4] Implement `useUploadExpenseAttachment` and `useDeleteExpenseAttachment` in `src/features/expenses/hooks/useExpenseAttachmentMutations.ts` with targeted `expenseKeys` invalidation.
- [x] T083 [US4] Implement `ExpenseReceiptUpload` in `src/features/expenses/components/ExpenseReceiptUpload.tsx` with multi-file select, per-file progress, and mime/size error feedback from API — mirror `TransactionPhotosManager.tsx` interaction patterns.
- [x] T084 [US4] Implement `ExpenseReceiptGallery` in `src/features/expenses/components/ExpenseReceiptGallery.tsx` with authenticated `downloadUrl` + `?access_token=` preview and progressive image loading.
- [x] T085 [US4] Add remove action in `ExpenseReceiptGallery` gated by `PermissionGate` and editable expense status.
- [x] T086 [US4] Handle partial upload success in `ExpenseReceiptUpload` (some files fail, others succeed) with per-file error messages and retry.
- [x] T087 [US4] Embed `ExpenseReceiptGallery` and `ExpenseReceiptUpload` on `ExpenseDetailPage` when expense is editable.
- [x] T088 [US4] Add receipt section loading skeleton, empty state (“No receipt photos”), and section error with retry on `ExpenseDetailPage`.
- [x] T089 [US4] Gate upload/remove with `PermissionGate` (`expenses.update`) and editable status hints.
- [x] T090 [US4] Display `receiptCount` on list rows when API provides it in `ExpensesListPage`.

**Checkpoint**: User Story 4 independently testable — receipt upload and gallery complete.

---

## Phase 7: User Story 5 – View Expense Relationships and References (Priority: P2)

**Goal**: Detail shows linked reference entity with navigable labels and deep links when permitted.

**Independent Test**: Create expenses with different reference types, open each detail page, verify correct reference label and link match API relationship payloads.

- [x] T091 [US5] Finalize `ExpenseReferenceSummary` in `src/features/expenses/components/ExpenseReferenceSummary.tsx` displaying reference type label and entity label from API snapshot.
- [x] T092 [US5] Enrich reference labels in `ExpenseReferenceSummary` via `useBranchOptions`, `useWarehouseOptions`, vehicle hooks, or `useTrip` when detail lacks `referenceLabel`.
- [x] T093 [US5] Add deep link to `buildRoute.branchDetail(id)` when reference type is `BRANCH` and user has branch view permission.
- [x] T094 [US5] Add deep link to `buildRoute.warehouseDetail(id)` when reference type is `WAREHOUSE` and user has warehouse view permission.
- [x] T095 [US5] Add deep link to vehicle detail route when reference type is `VEHICLE` and user has vehicle view permission.
- [x] T096 [US5] Add deep link to `buildRoute.tripDetail(id)` when reference type is `TRIP` and user has trip view permission.
- [x] T097 [US5] Show safe fallback label in `ExpenseReferenceSummary` when reference entity is archived, deleted, or lookup returns 404.
- [x] T098 [US5] Embed `ExpenseReferenceSummary` in `ExpenseDetailPage` and ensure list rows show `referenceLabel` when API provides it.
- [x] T099 [US5] Optional polish: add filtered expenses link on `src/features/trips/pages/TripDetailPage.tsx` pointing to `/expenses?referenceType=TRIP&referenceId={id}` (additive only, non-blocking).

**Checkpoint**: User Story 5 independently testable — reference display and deep links complete.

---

## Phase 8: User Story 6 – Delete or Archive Expenses (Priority: P3)

**Goal**: Remove expenses from active use through delete and/or archive when backend supports them.

**Independent Test**: On eligible expense, confirm delete or archive, verify list/detail behavior per backend rules; archived expenses appear only when `includeArchived` filter is enabled.

- [x] T100 [US6] Implement `useDeleteExpense` mutation in `src/features/expenses/hooks/useExpenseMutations.ts` when `ExpenseService.delete` is supported.
- [x] T101 [US6] Implement `useArchiveExpense` mutation in `src/features/expenses/hooks/useExpenseMutations.ts` when `ExpenseService.archive` is supported.
- [x] T102 [US6] Implement `ExpenseDeleteDialog` in `src/features/expenses/components/ExpenseDeleteDialog.tsx` reusing `ConfirmDialog` pattern with loading/disabled confirm while pending.
- [x] T103 [US6] Implement `ExpenseArchiveDialog` in `src/features/expenses/components/ExpenseArchiveDialog.tsx` reusing `ConfirmDialog` pattern.
- [x] T104 [US6] Implement `ExpenseDetailActions` in `src/features/expenses/components/ExpenseDetailActions.tsx` with delete/archive buttons gated by `PermissionGate` and status hints.
- [x] T105 [US6] Wire `useExpenseDialogStore` in `src/features/expenses/hooks/useExpenseDialogStore.ts` for active delete/archive dialog state.
- [x] T106 [US6] On delete success: toast, navigate to list, invalidate list queries in `useDeleteExpense`.
- [x] T107 [US6] On archive success: invalidate detail and list queries; update status badge on `ExpenseDetailPage`.
- [x] T108 [US6] Hide delete/archive actions in `ExpenseDetailActions` when backend endpoint or permission is absent — no broken buttons.
- [x] T109 [US6] On `409 LIFECYCLE_CONFLICT` from delete/archive mutations, toast and refetch expense detail.

**Checkpoint**: User Story 6 independently testable — lifecycle actions complete.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Hardening, accessibility, quality gates, and Spec 009 readiness.

- [x] T110 Handle unknown `ExpenseStatus` in list filters and `ExpenseStatusBadge` with safe fallback label in `src/features/expenses/lib/expense-status.ts`.
- [x] T111 On `403 FORBIDDEN` from expense mutations, show safe toast and rely on permission gates to hide actions on next render.
- [x] T112 On concurrent edit conflict, toast and refetch expense detail in `useUpdateExpense` mutation handler.
- [x] T113 Verify deep links to `/expenses/new`, `/expenses/:id`, `/expenses/:id/edit` for authorized and unauthorized users per `quickstart.md` scenario 1.
- [x] T114 Audit `src/features/expenses/` and ensure no analytics/report/activity-log routes or services were introduced.
- [x] T115 Audit `src/features/expenses/` for hardcoded category or reference option lists — zero hardcoded arrays per SC-006.
- [x] T116 Run `pnpm typecheck`, `pnpm lint`, and `pnpm build` and fix any errors in `src/features/expenses/` and touched shared files.
- [x] T117 [P] Responsive pass on `ExpensesListPage`, `ExpenseDetailPage`, create/edit forms, and receipt gallery at mobile/tablet/desktop breakpoints.
- [x] T118 [P] Accessibility pass: keyboard navigation, dialog focus trap, table headers, accessible file upload, and form labels on expense pages.
- [x] T119 [P] Dark mode spot-check on all expense pages, gallery, and dialogs.
- [x] T120 Execute manual validation checklist in `specs/008-expense-management/quickstart.md` against live Backend P007 and document any contract deltas in service comments only.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — **blocks all user stories**
- **Phase 3 (US1)**: Depends on Phase 2
- **Phase 4 (US2)**: Depends on Phase 3 (detail navigation target); category select uses `useExpenseCategories` from Phase 5 or inline stub until T073
- **Phase 5 (US3)**: Depends on Phase 3; can parallel with Phase 4 after list exists
- **Phase 6 (US4)**: Depends on Phase 3 — parallel with Phases 4–5 after detail shell
- **Phase 7 (US5)**: Depends on Phase 3 — parallel with Phases 4–6
- **Phase 8 (US6)**: Depends on Phase 3 — parallel with Phases 4–7
- **Phase 9 (Polish)**: Depends on all desired user story phases complete

### User Story Dependencies

| Story | Depends on        | Can parallel with      |
| ----- | ----------------- | ---------------------- |
| US1   | Phase 2           | —                      |
| US2   | US1 (detail page) | US3 after US1          |
| US3   | US1               | US2, US4–US6 after US1 |
| US4   | US1               | US5, US6, US2, US3     |
| US5   | US1               | US4, US6, US2, US3     |
| US6   | US1               | US4, US5, US2, US3     |

### Parallel Opportunities

```text
Phase 1: T002–T015 all [P] in parallel after T001
Phase 2: T016–T021 types [P]; T023–T030 service sequential on expense.service.ts; T034–T042 wiring [P] after permissions defined
After US1 (Phase 3):
  Stream A: US2 create/edit (T060–T072)
  Stream B: US3 categories (T073–T080)
  Stream C: US4 receipts (T081–T090)
  Stream D: US5 references (T091–T099)
  Stream E: US6 lifecycle (T100–T109)
Phase 9: T117–T119 [P]
```

---

## Parallel Example: User Story 1

```bash
# After Phase 2, parallelize list vs detail components:
Task T047: ExpenseStatusBadge in src/features/expenses/components/ExpenseStatusBadge.tsx
Task T048: ExpensesListPage in src/features/expenses/pages/ExpensesListPage.tsx
Task T053: ExpenseDetailPage in src/features/expenses/pages/ExpenseDetailPage.tsx
Task T052: ExpensesDashboardPage in src/features/expenses/pages/ExpensesDashboardPage.tsx
```

---

## Parallel Example: User Stories 4 + 5 + 6

```bash
# After Phase 3 detail layout exists, split panel work:
Developer A: T081–T090 ExpenseReceiptUpload + ExpenseReceiptGallery
Developer B: T091–T099 ExpenseReferenceSummary + deep links
Developer C: T100–T109 ExpenseDetailActions + delete/archive dialogs
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Complete Phase 1: Setup scaffolding
2. Complete Phase 2: Foundational (critical path)
3. Complete Phase 3: US1 — list, filter, open detail
4. **STOP and VALIDATE**: quickstart scenarios 1 and partial 5 (read-only reference display)
5. Demo expense discovery MVP

### Incremental Delivery

1. Setup + Foundational → infrastructure ready
2. US1 List/detail → test browse and open
3. US2 Create/edit → test record expenses
4. US3 Categories → test API-driven category select and filter
5. US4 Receipts → test upload and gallery
6. US5 References → test deep links and label enrichment
7. US6 Delete/archive → test lifecycle management
8. Phase 9 Polish → production ready for Spec 009

### Suggested MVP Scope

**Minimum**: Phase 1 + Phase 2 + Phase 3 (US1) — delivers protected `/expenses` list and detail read UX.

**Core operations**: Add Phase 4 (US2) + Phase 5 (US3) — create expenses with categories and references.

**Full Spec 008**: All phases through T120.

---

## Notes

- All expense work lives under `src/features/expenses/` — do not create duplicate modules
- Do not duplicate analytics, reporting, or activity-log logic (Specs 009–011)
- Category and reference option lists MUST NEVER be hardcoded (SC-006)
- Permission keys in T034/T036 must be reconciled against live Backend P007 during implementation
- Receipt upload mirrors `TransactionPhotosManager` patterns — do not import transaction business logic
- Dashboard KPIs only when backend pre-aggregates — no client-side expense sums
- Commit after each task group or logical checkpoint
- `[P]` tasks = different files, no incomplete-task dependencies
