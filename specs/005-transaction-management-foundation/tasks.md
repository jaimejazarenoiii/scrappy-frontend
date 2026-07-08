# Tasks: Specification 005 – Transaction Management Foundation

**Input**: Design documents from `/specs/005-transaction-management-foundation/`

**Prerequisites**: `plan.md` and `spec.md` (and optional `research.md`, `data-model.md`, `contracts/`, `quickstart.md`)

**Tests**: Not requested in Specification 005 (quickstart validation is required).

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 [P] Create feature directory structure under `src/features/transactions/` (components, hooks, pages, validation, lib).
- [x] T002 [P] Create `src/features/transactions/lib/transaction-direction.ts` to map `direction`/`directionLabel` to UI labels.
- [x] T003 [P] Create `src/features/transactions/lib/transaction-status.ts` to map backend `TransactionStatus` to `StatusBadge` tone/label.
- [x] T004 [P] Create `src/features/transactions/validation/transaction.schema.ts` (Zod schema for supported draft transaction fields).
- [x] T005 [P] Create `src/features/transactions/validation/transaction-item.schema.ts` (Zod schema for supported transaction item fields).
- [x] T006 [P] Create `src/features/transactions/validation/transaction-photos.schema.ts` (file constraint helpers if desired).
- [x] T007 [P] Create `src/features/transactions/hooks/useTransactions.ts` (list/dashboard queries and `transactionKeys`).
- [x] T008 [P] Create `src/features/transactions/hooks/useTransaction.ts` (detail query by id via `TransactionService.get`).
- [x] T009 [P] Create `src/features/transactions/hooks/useTransactionMutations.ts` (create draft + draft update mutations).
- [x] T010 [P] Create `src/features/transactions/hooks/useTransactionItems.ts` (draft item list query via `TransactionService.listItems`).
- [x] T011 [P] Create `src/features/transactions/hooks/useTransactionItemsMutations.ts` (add/update/delete item mutations).
- [x] T012 [P] Create `src/features/transactions/hooks/useTransactionAttachments.ts` (draft attachment list query via `TransactionService.listAttachments`).
- [x] T013 [P] Create `src/features/transactions/hooks/useTransactionAttachmentsMutations.ts` (upload/delete attachment mutations).
- [x] T014 [P] Create `src/features/transactions/hooks/useTransactionSuggestions.ts` (material + price suggestion helpers).
- [x] T015 [P] Create `src/features/transactions/hooks/useTransactionDraftStore.ts` (Zustand draft dirty/saving/lastSaved state).
- [x] T016 [P] Create `src/features/transactions/hooks/useUnsavedChangesPrompt.ts` (navigation + beforeunload guard).
- [x] T017 [P] Create placeholder UI components: `src/features/transactions/components/TransactionDirectionBadge.tsx`, `src/features/transactions/components/TransactionStatusBadge.tsx`, `src/features/transactions/components/TransactionDraftIndicator.tsx`.

---

## Phase 2: Foundational (Blocking Prerequisites)

- [x] T018 Update `src/constants/routes.ts` with `/transactions` `/transactions/new` `/transactions/drafts` `/transactions/:id` `/transactions/:id/edit` route constants.
- [x] T019 Update `src/constants/routes.ts` `buildRoute` with `transactionDetail(id)` and `transactionEdit(id)` helpers.
- [x] T020 Update `src/constants/permissions.ts` with transaction permission keys needed for navigation and route protection (additive).
- [x] T021 Update `src/features/auth/lib/session.ts` `ROLE_PERMISSIONS` for OWNER/MANAGER/EMPLOYEE with the new transaction permission keys (additive).
- [x] T022 Update `src/constants/navigation.ts` to add a `Transactions` nav item with permission-driven `anyOf`.
- [x] T023 Update `src/app/router/routes.tsx` to register protected transactions routes under `AuthGuard` + `DashboardLayout`.
- [x] T024 Update `src/app/router/routes.tsx` to wrap each transactions route with `PermissionGuard` using the new transaction `*.view`/appropriate permissions.
- [x] T025 Create placeholder route components (default exports) so imports compile: `src/features/transactions/pages/TransactionsDashboardPage.tsx`, `TransactionsListPage.tsx`, `TransactionDetailPage.tsx`, `TransactionCreatePage.tsx`, `TransactionDraftsPage.tsx`, `TransactionEditPage.tsx`.
- [x] T026 Update `src/lib/breadcrumb.ts` to add transaction entity parent support for resolving `/transactions/:id` breadcrumb labels.
- [x] T027 Update `src/hooks/useBreadcrumbTrail.ts` to load transaction data via `useTransaction` and resolve a breadcrumb label using backend-provided fields.
- [x] T028 Ensure `src/components/common/Breadcrumb.tsx` renders breadcrumbs for transaction pages without assumptions about only workforce entities.
- [x] T029 Ensure placeholder transaction pages use shared layout primitives for loading/empty/error states (`src/components/common/*` and `src/components/feedback/*`).
- [x] T030 Ensure no out-of-scope workflows are introduced under `src/features/transactions/` (no settlement/payment/receipts/approvals/trips/expenses/analytics/reports/activity logs).

---

## Phase 3: User Story 1 – Transaction Dashboard/List/Details + Start Draft (Priority: P1) 🎯 MVP

- [x] T031 [US1] Implement `src/features/transactions/hooks/useTransactions.ts` list/dashboard hook using `TransactionService.list` and `useListQuery` params mapping to `TransactionListParams`.
- [x] T032 [US1] Implement `src/features/transactions/hooks/useTransaction.ts` detail hook using `TransactionService.get(id)`.
- [x] T033 [US1] Create `src/features/transactions/lib/transaction-format.ts` to render party/date snippets and direction/type consistently across pages.
- [x] T034 [US1] Implement `src/features/transactions/components/TransactionDirectionBadge.tsx` using `transaction-direction` mapping.
- [x] T035 [US1] Implement `src/features/transactions/components/TransactionStatusBadge.tsx` using `transaction-status` mapping.
- [x] T036 [US1] Implement `src/features/transactions/pages/TransactionsDashboardPage.tsx` with dashboard header, inbound/outbound context (as backend provides), and loading/empty/error states.
- [x] T037 [US1] Implement `src/features/transactions/pages/TransactionsListPage.tsx` with `DataTable` columns, mobile card rendering, and list UX (search/filter/sort/pagination via `useListQuery`).
- [x] T038 [US1] Wire row navigation in `src/features/transactions/pages/TransactionsListPage.tsx` to `buildRoute.transactionDetail(id)`.
- [x] T039 [US1] Implement `src/features/transactions/pages/TransactionDetailPage.tsx` using `DescriptionList` to show supported transaction fields only.
- [x] T040 [US1] Implement relationship rendering in `src/features/transactions/pages/TransactionDetailPage.tsx` for assigned employees, items count, and attachment/photos count (or safe placeholders if not present).
- [x] T041 [US1] Render direction/type and status badges in `src/features/transactions/pages/TransactionDetailPage.tsx` with safe fallback for unknown backend status values.
- [x] T042 [US1] Implement `src/features/transactions/hooks/useTransactionMutations.ts` create-draft mutation using `TransactionService.create`.
- [x] T043 [US1] Implement `src/features/transactions/pages/TransactionCreatePage.tsx` with React Hook Form + `transaction.schema.ts`, submit disabled while processing, and backend validation error mapping via `applyApiValidationErrors`.
- [x] T044 [US1] Implement assigned employee selection UI in `src/features/transactions/pages/TransactionCreatePage.tsx` using `src/features/employees/hooks/useEmployeeOptions.ts` and checkbox/multi-selection approach.
- [x] T045 [US1] Implement conditional location fields in `src/features/transactions/pages/TransactionCreatePage.tsx` based on `locationType` using available branch/warehouse picker hooks (`useBranchOptions`, `useWarehouseOptions`) and outside fields.
- [x] T046 [US1] After successful create in `src/features/transactions/pages/TransactionCreatePage.tsx`, navigate to `/transactions/:id/edit` (or `/transactions/:id` if that is the backend-supported draft flow).
- [x] T047 [US1] Add permission-gated create-draft CTA in `src/features/transactions/pages/TransactionsDashboardPage.tsx` and/or list pages using `PermissionGate` with transaction permission keys.
- [x] T048 [US1] Ensure transaction pages have document title updates in `src/features/transactions/pages/*` consistent with other modules.
- [x] T049 [US1] Ensure all transaction read pages use safe loading/empty/error states (no blank pages) in `src/features/transactions/pages/*`.
- [x] T050 [US1] Ensure no out-of-scope actions exist on transaction detail/draft entry points in `src/features/transactions/pages/TransactionDetailPage.tsx`.

---

## Phase 4: User Story 2 – Draft Workflow + Auto Save + Resume (Priority: P2)

- [x] T051 [US2] Implement `src/features/transactions/hooks/useTransactionDraftStore.ts` (dirty/saving/lastSaved state actions).
- [x] T052 [US2] Implement `src/features/transactions/hooks/useUnsavedChangesPrompt.ts` to block navigation when dirty and provide beforeunload protection.
- [x] T053 [US2] Implement draft auto-save logic in `src/features/transactions/hooks/useDraftAutoSave.ts` (debounce + RHF watch + call draft update mutation).
- [x] T054 [US2] Implement `src/features/transactions/pages/TransactionDraftsPage.tsx` to list drafts (filter by `status === 'DRAFT'`), show UX states, and provide “Continue Draft” navigation.
- [x] T055 [US2] Implement `src/features/transactions/components/TransactionDraftIndicator.tsx` to reflect saving/saved/unsaved states from the Zustand store.
- [x] T056 [US2] Implement `src/features/transactions/pages/TransactionEditPage.tsx` as the draft editor: load by id, initialize RHF from backend payload, and render header + indicator + unsaved prompt.
- [x] T057 [US2] Implement draft editor base form section in `src/features/transactions/pages/TransactionEditPage.tsx` for supported transaction fields (direction/party/location/notes/reference/assigned employees).
- [x] T058 [US2] Wire auto-save in `src/features/transactions/pages/TransactionEditPage.tsx` using the debounce hook and persist supported field changes to backend via `TransactionService.update`.
- [x] T059 [US2] Ensure update payload handling in `src/features/transactions/pages/TransactionEditPage.tsx` is compatible with `UpdateTransactionInput` (null handling, optional fields, avoid empty bodies).
- [x] T060 [US2] Implement backend validation error handling for auto-save in `src/features/transactions/pages/TransactionEditPage.tsx` using `applyApiValidationErrors`.
- [x] T061 [US2] Ensure draft editor unsaved changes prompt is triggered only when there are unsaved edits in `src/features/transactions/pages/TransactionEditPage.tsx`.
- [x] T062 [US2] Implement draft “recover/resume” UX in `src/features/transactions/pages/TransactionEditPage.tsx` based on backend-supported recovery semantics.
- [x] T063 [US2] Implement draft-only action gating in `src/features/transactions/pages/TransactionEditPage.tsx` (enable items/photos editing only when transaction is in draft state).
- [x] T064 [US2] Implement draft deletion behavior in `src/features/transactions/pages/TransactionEditPage.tsx` only if backend supports safe draft deletion semantics without entering out-of-scope `CANCELLED`/settlement workflows.
- [x] T065 [US2] Implement draft duplication behavior in `src/features/transactions/pages/TransactionEditPage.tsx` only if backend provides duplication endpoints (otherwise omit UI controls).
- [x] T066 [US2] Add document title updates in `src/features/transactions/pages/TransactionEditPage.tsx` for direction/type context.
- [x] T067 [US2] Ensure responsive layout for draft editor sections in `src/features/transactions/pages/TransactionEditPage.tsx`.

---

## Phase 5: User Story 3 – Transaction Items + Photos + Suggestions (Priority: P3)

- [x] T068 [US3] Implement `src/features/transactions/components/TransactionItemsEditor.tsx` with add/edit/remove for multiple draft items and validation using `transaction-item.schema.ts`.
- [x] T069 [US3] Implement `src/features/transactions/hooks/useTransactionItems.ts` to query items with correct TanStack Query keys in `transactionItemsKeys`.
- [x] T070 [US3] Implement `src/features/transactions/hooks/useTransactionItemsMutations.ts` to add/update/delete items and invalidate relevant queries.
- [x] T071 [US3] Implement material selection flow for items in `src/features/transactions/components/TransactionItemsEditor.tsx` by integrating `MaterialSuggestionsPicker` (or using it directly inside the editor).
- [x] T072 [US3] Implement `src/features/transactions/components/TransactionPhotosManager.tsx` to upload multiple photos, preview images, and remove attachments.
- [x] T073 [US3] Implement `src/features/transactions/hooks/useTransactionAttachments.ts` to list attachments for a draft using `TransactionService.listAttachments`.
- [x] T074 [US3] Implement `src/features/transactions/hooks/useTransactionAttachmentsMutations.ts` to upload and delete attachments and invalidate attachments/draft detail queries.
- [x] T075 [US3] Extend `src/features/transactions/services/transaction.service.ts` `uploadAttachment` to optionally report upload progress (service-layer Axios config).
- [x] T076 [US3] Implement per-file upload progress UI in `src/features/transactions/components/TransactionPhotosManager.tsx` using the progress callback from the service layer.
- [x] T077 [US3] Implement stable image preview behavior in `src/features/transactions/components/TransactionPhotosManager.tsx` using object URLs for new uploads and backend attachments for persisted photos.
- [x] T078 [US3] Implement `src/features/transactions/components/MaterialSuggestionsPicker.tsx` using `TransactionService.materialSuggestions` for backend-driven autocomplete.
- [x] T079 [US3] Implement `src/features/transactions/components/PriceSuggestionsPanel.tsx` calling `TransactionService.priceSuggestions(materialName)` and rendering backend-provided suggested prices (and optional history).
- [x] T080 [US3] Implement suggestion query wiring in `src/features/transactions/hooks/useTransactionSuggestions.ts` with caching/staleTime and non-blocking UI behavior.
- [x] T081 [US3] Integrate items editor + photos manager + suggestions into `src/features/transactions/pages/TransactionEditPage.tsx` ensuring correct transactionId context.
- [x] T082 [US3] Ensure suggestion UI never computes suggested prices on the frontend (render backend results only) in `src/features/transactions/components/PriceSuggestionsPanel.tsx`.
- [x] T083 [US3] Ensure all interactive editor controls are accessible (labels, focus rings, keyboard operability) in `src/features/transactions/components/*`.
- [x] T084 [US3] Ensure draft editor remains responsive on mobile/tablet/desktop in `src/features/transactions/pages/TransactionEditPage.tsx`.

---

## Phase 6: Inbound/Outbound Hardening + Quality Gates (Cross-cutting)

- [x] T085 [P] Ensure direction/type badges are consistent across transaction dashboard/list/detail/create/drafts/edit pages in `src/features/transactions/pages/*` using `TransactionDirectionBadge`.
- [x] T086 Ensure unsaved changes + auto-save work together correctly when switching direction/location fields in `src/features/transactions/pages/TransactionEditPage.tsx`.
- [x] T087 Ensure transaction items and photos persist correctly across reloads by validating query+mutation invalidation paths in `src/features/transactions/hooks/*`.
- [x] T088 Verify that `src/features/transactions/` contains no out-of-scope workflow implementations (payment/settlement/receipts/approval/reopen/trip/expense/analytics/reports/activity logs) by auditing module exports and components.
- [x] T089 Update `specs/005-transaction-management-foundation/quickstart.md` only if runnable validation steps need correction after implementation.
- [x] T090 [P] Run `pnpm typecheck` and fix TypeScript issues introduced by transactions module.
- [x] T091 [P] Run `pnpm lint` and fix ESLint issues introduced by transactions module.
- [x] T092 [P] Run `pnpm build` and ensure production build succeeds for transactions routes.
- [ ] T093 Perform manual quickstart validation per `specs/005-transaction-management-foundation/quickstart.md` for dashboard/list/details/draft editor/items/photos/suggestions.
- [x] T094 Final UI/UX accessibility pass for keyboard navigation and focus management in `src/features/transactions/pages/*` and `src/features/transactions/components/*`.

---

## Dependencies & Execution Order

- Complete Phase 2 before Phase 3 so routes/permissions/breadcrumbs compile.
- Phase 3 must land read and create-draft surfaces before Phase 4 draft editor and before Phase 5 items/photos integration.
- Phase 4 must provide draft `transactionId` context before Phase 5 item/photo editor hooks can be wired.

## Parallel Opportunities

- Phase 1 Setup tasks can be implemented in parallel (lib/validation/hooks/components scaffolding).
- In Phase 4/5, photo progress service extension (`transaction.service.ts`) can be implemented in parallel with photo UI once signatures are settled.
