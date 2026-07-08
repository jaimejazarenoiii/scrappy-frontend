# Tasks: Specification 006 – Transaction Settlement Workflow

**Input**: Design documents from `/specs/006-transaction-settlement-workflow/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

**Tests**: Not requested in Specification 006 (manual quickstart validation required).

**Organization**: Tasks grouped by user story for independent implementation and testing. Builds additively on Spec 005 `src/features/transactions/` — no architectural refactor.

## Phase 1: Setup (Settlement Scaffolding)

**Purpose**: Create new settlement-specific files and placeholders so foundational work can proceed in parallel without import errors.

- [x] T001 [P] Create `src/features/transactions/lib/transaction-settlement.ts` with exported placeholder helpers for status-based display hints.
- [x] T002 [P] Create `src/features/transactions/lib/transaction-timeline.ts` with exported placeholder `buildSettlementTimeline` function.
- [x] T003 [P] Create `src/features/transactions/validation/transaction-cancel.schema.ts` with Zod schema for optional/required `cancellationReason`.
- [x] T004 [P] Create `src/features/transactions/validation/transaction-reopen.schema.ts` with Zod schema requiring `reason`.
- [x] T005 [P] Create `src/features/transactions/validation/transaction-return.schema.ts` with Zod schema for optional `reason`.
- [x] T006 [P] Create `src/features/transactions/validation/transaction-settle.schema.ts` with Zod schema for optional `settlementNote`.
- [x] T007 [P] Create `src/features/transactions/hooks/useSettlementMutations.ts` with exported mutation hook placeholders.
- [x] T008 [P] Create `src/features/transactions/hooks/useTransactionReceipt.ts` with exported receipt query hook placeholder.
- [x] T009 [P] Create `src/features/transactions/hooks/useTransactionTimeline.ts` with exported timeline hook placeholder.
- [x] T010 [P] Create `src/features/transactions/hooks/useSettlementDialogStore.ts` (Zustand) for active dialog type and transaction id.
- [x] T011 [P] Create placeholder components: `src/features/transactions/components/TransactionSettlementActions.tsx`, `TransactionSettlementSummary.tsx`, `TransactionSettlementTimeline.tsx`, `TransactionReceiptDocument.tsx`.
- [x] T012 [P] Create placeholder dialog components: `src/features/transactions/components/CancelTransactionDialog.tsx`, `ReopenTransactionDialog.tsx`, `ReturnToDraftDialog.tsx`, `SettleTransactionDialog.tsx`.
- [x] T013 [P] Create placeholder pages: `src/features/transactions/pages/TransactionSettlementPage.tsx`, `TransactionReceiptPage.tsx`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Extend types, services, status handling, routes, and permissions. **No user story work until this phase completes.**

- [x] T014 Extend `TransactionStatus` in `src/features/transactions/types/transaction.types.ts` to include `READY_FOR_PAYMENT` and `PAID`.
- [x] T015 Extend `TransactionBase` in `src/features/transactions/types/transaction.types.ts` with lifecycle fields: `transactionNumber`, `submittedAt`, `submittedByUserId`, `paidAt`, `paidByUserId`, `cancelledByUserId`, `reopenedAt`, `reopenedByUserId`, `reopenReason`.
- [x] T016 Add settlement input types in `src/features/transactions/types/transaction.types.ts`: `SettleTransactionInput`, `ReopenTransactionInput`, `ReturnToDraftInput` (and confirm `CancelTransactionInput` shape).
- [x] T017 Add `TransactionReceipt` and `TransactionReceiptItem` types in `src/features/transactions/types/transaction.types.ts` matching Backend P005 receipt payload.
- [x] T018 Add `SettlementTimelineEvent` type in `src/features/transactions/types/transaction.types.ts` for normalized audit entries.
- [x] T019 Extend `TRANSACTION_ENDPOINTS` in `src/features/transactions/services/transaction.service.ts` with `finish`, `settle`, `returnToDraft`, `reopen`, and `receipt` paths per `contracts/api-endpoints.md`.
- [x] T020 Implement `TransactionService.finish(id)` in `src/features/transactions/services/transaction.service.ts` calling `POST /transactions/:id/finish`.
- [x] T021 Implement `TransactionService.settle(id, input?)` in `src/features/transactions/services/transaction.service.ts` calling `POST /transactions/:id/settle`.
- [x] T022 Implement `TransactionService.returnToDraft(id, input?)` in `src/features/transactions/services/transaction.service.ts` calling `POST /transactions/:id/return-to-draft`.
- [x] T023 Implement `TransactionService.reopen(id, input)` in `src/features/transactions/services/transaction.service.ts` calling `POST /transactions/:id/reopen`.
- [x] T024 Implement `TransactionService.getReceipt(id)` in `src/features/transactions/services/transaction.service.ts` calling `GET /transactions/:id/receipt`.
- [x] T025 Verify `TransactionService.cancel` in `src/features/transactions/services/transaction.service.ts` accepts `CancelTransactionInput` and returns updated `TransactionDetail`.
- [x] T026 Extend `transaction-status.ts` in `src/features/transactions/lib/transaction-status.ts` with labels/tones for `READY_FOR_PAYMENT` (warning) and `PAID` (success); keep safe fallback for unknown statuses.
- [x] T027 Implement `transaction-settlement.ts` in `src/features/transactions/lib/transaction-settlement.ts` with pure status helpers: `canShowReceiptHint`, `isDraftStatus`, `isReadyForPaymentStatus`, `isPaidStatus`, `isCancelledStatus` (display hints only, not authorization).
- [x] T028 Implement `buildSettlementTimeline` in `src/features/transactions/lib/transaction-timeline.ts` composing events from `TransactionDetail` lifecycle fields (and optional history array if service adds it later).
- [x] T029 Update `src/constants/permissions.ts` additively with `transactions.finish`, `transactions.settle`, `transactions.cancel`, `transactions.returnToDraft`, `transactions.reopen` (reconcile strings against Backend P005).
- [x] T030 Update `src/features/auth/lib/session.ts` `ROLE_PERMISSIONS` for OWNER/MANAGER/EMPLOYEE with new settlement permission keys per `contracts/routes-and-guards.md`.
- [x] T031 Update `src/constants/routes.ts` with `transactionSettlement` and `transactionReceipt` route constants.
- [x] T032 Update `src/constants/routes.ts` `buildRoute` with `transactionSettlement(id)` and `transactionReceipt(id)` helpers.
- [x] T033 Register lazy routes in `src/app/router/routes.tsx` for `TransactionSettlementPage` and `TransactionReceiptPage` under existing transactions layout with `PermissionGuard`.
- [x] T034 Update `src/lib/breadcrumb.ts` to support settlement and receipt breadcrumb segments under transactions.
- [x] T035 Update `src/hooks/useBreadcrumbTrail.ts` to resolve settlement/receipt breadcrumb labels using transaction detail query cache.
- [x] T036 Audit `src/features/transactions/` for `TransactionStatus` switch statements and update exhaustiveness for new statuses (list filters, edit gating, badges).
- [x] T037 Run `pnpm typecheck` after foundational type/service changes and fix any compile errors in `src/features/transactions/`.

**Checkpoint**: Types, services, status helpers, routes, and permissions ready — user story implementation can begin.

---

## Phase 3: User Story 1 – Submit Draft as Ready for Payment (Priority: P1) 🎯 MVP

**Goal**: Authorized users mark an eligible draft Ready for Payment with confirmation, loading, success/error feedback, and refreshed backend status.

**Independent Test**: Open eligible draft → Mark Ready for Payment → confirm → status becomes `READY_FOR_PAYMENT` with toast; ineligible/failed finish shows safe error without status change.

- [x] T038 [US1] Implement `useFinishTransaction` mutation in `src/features/transactions/hooks/useSettlementMutations.ts` calling `TransactionService.finish` with success toast and `transactionKeys` invalidation.
- [x] T039 [US1] Handle `403`/`409` errors in `useFinishTransaction` in `src/features/transactions/hooks/useSettlementMutations.ts` with lifecycle conflict refetch of detail query.
- [x] T040 [US1] Implement finish confirmation flow in `src/features/transactions/components/TransactionSettlementActions.tsx` using `ConfirmDialog` for Mark Ready for Payment (no body form).
- [x] T041 [US1] Gate finish button in `src/features/transactions/components/TransactionSettlementActions.tsx` with `PermissionGate` (`transactions.finish`) and `status === 'DRAFT'` display hint.
- [x] T042 [US1] Disable finish confirm and show loading spinner while `useFinishTransaction` is pending in `src/features/transactions/components/TransactionSettlementActions.tsx`.
- [x] T043 [US1] Embed `TransactionSettlementActions` in `src/features/transactions/pages/TransactionDetailPage.tsx` header actions area.
- [x] T044 [US1] Display `transactionNumber` and `submittedAt`/`submittedByUserId` in `src/features/transactions/pages/TransactionDetailPage.tsx` when returned after finish.
- [x] T045 [US1] Hide Edit draft button/link in `src/features/transactions/pages/TransactionDetailPage.tsx` when status is not `DRAFT`.
- [x] T046 [US1] Gate navigation to `src/features/transactions/pages/TransactionEditPage.tsx` so non-`DRAFT` transactions redirect or show ineligible state with recovery link to detail.
- [x] T047 [US1] Ensure `TransactionStatusBadge` in `src/features/transactions/components/TransactionStatusBadge.tsx` renders Ready for Payment tone after finish via updated `transaction-status.ts`.
- [x] T048 [US1] Add document title update in `src/features/transactions/pages/TransactionDetailPage.tsx` reflecting Ready for Payment status when applicable.

**Checkpoint**: Finish workflow independently testable from transaction detail.

---

## Phase 4: User Story 2 – Settle Payment and Display Paid By / Paid At (Priority: P1)

**Goal**: Managers/owners mark Ready for Payment transactions Paid; UI shows Paid By, Paid At, and payment summary from backend only.

**Independent Test**: From `READY_FOR_PAYMENT` → Mark as Paid → confirm → status `PAID` with Paid By/At visible; totals match API `totalAmount`/`grandTotal` without client calculation.

- [x] T049 [US2] Finalize `transaction-settle.schema.ts` in `src/features/transactions/validation/transaction-settle.schema.ts` with optional `settlementNote` max length aligned to API.
- [x] T050 [US2] Implement `useSettleTransaction` mutation in `src/features/transactions/hooks/useSettlementMutations.ts` calling `TransactionService.settle` with optional note payload.
- [x] T051 [US2] Implement `SettleTransactionDialog.tsx` in `src/features/transactions/components/SettleTransactionDialog.tsx` with RHF + Zod, disabled submit while pending, and `applyApiValidationErrors` mapping.
- [x] T052 [US2] Wire settle action in `src/features/transactions/components/TransactionSettlementActions.tsx` with `PermissionGate` (`transactions.settle`) and `status === 'READY_FOR_PAYMENT'` gate.
- [x] T053 [US2] Implement `TransactionSettlementSummary.tsx` in `src/features/transactions/components/TransactionSettlementSummary.tsx` showing party, direction, `totalAmount`, and paid metadata from `TransactionDetail` (no client math).
- [x] T054 [US2] Add Paid By / Paid At fields to `src/features/transactions/pages/TransactionDetailPage.tsx` `DescriptionList` when `status === 'PAID'`, resolving display name from `paidByUserId` when possible.
- [x] T055 [US2] Add link to settlement view in `src/features/transactions/pages/TransactionDetailPage.tsx` using `buildRoute.transactionSettlement(id)`.
- [x] T056 [US2] Show payment summary section on detail when Paid using `TransactionSettlementSummary` in `src/features/transactions/pages/TransactionDetailPage.tsx`.
- [x] T057 [US2] Ensure settle success invalidates detail, list, and receipt query keys in `src/features/transactions/hooks/useSettlementMutations.ts`.
- [x] T058 [US2] Update `TransactionStatusBadge` rendering for `PAID` success tone across detail and list surfaces.

**Checkpoint**: Settle workflow and Paid metadata display independently testable.

---

## Phase 5: User Story 3 – Cancel Transaction (Priority: P2)

**Goal**: Authorized users cancel eligible draft or ready-for-payment transactions with confirmation and optional/required reason.

**Independent Test**: Cancel eligible transaction → `CANCELLED` status with reason displayed; settlement actions hidden afterward.

- [x] T059 [US3] Finalize `transaction-cancel.schema.ts` in `src/features/transactions/validation/transaction-cancel.schema.ts` for optional/required `cancellationReason` per API constraints.
- [x] T060 [US3] Implement `useCancelTransaction` mutation in `src/features/transactions/hooks/useSettlementMutations.ts` calling `TransactionService.cancel` with reason payload.
- [x] T061 [US3] Implement `CancelTransactionDialog.tsx` in `src/features/transactions/components/CancelTransactionDialog.tsx` with RHF + Zod reason field and loading/disabled submit states.
- [x] T062 [US3] Wire cancel action in `src/features/transactions/components/TransactionSettlementActions.tsx` with `PermissionGate` (`transactions.cancel`) and status gate for `DRAFT` or `READY_FOR_PAYMENT`.
- [x] T063 [US3] Display `cancellationReason` and `cancelledAt` in `src/features/transactions/pages/TransactionDetailPage.tsx` when `status === 'CANCELLED'`.
- [x] T064 [US3] Hide finish/settle/return/reopen actions for `CANCELLED` transactions in `src/features/transactions/components/TransactionSettlementActions.tsx`.
- [x] T065 [US3] Ensure cancel mutation refreshes detail and list queries and shows success toast in `src/features/transactions/hooks/useSettlementMutations.ts`.

**Checkpoint**: Cancel workflow independently testable.

---

## Phase 6: User Story 4 – Manager Review: Return to Draft or Settle (Priority: P2)

**Goal**: Managers/owners review Ready for Payment queue; return to draft for correction or settle to pay; pending items visible in lists.

**Independent Test**: Return to draft from `READY_FOR_PAYMENT` → `DRAFT` editable again; list filter shows pending payment items.

- [x] T066 [US4] Finalize `transaction-return.schema.ts` in `src/features/transactions/validation/transaction-return.schema.ts` for optional `reason`.
- [x] T067 [US4] Implement `useReturnToDraft` mutation in `src/features/transactions/hooks/useSettlementMutations.ts` calling `TransactionService.returnToDraft`.
- [x] T068 [US4] Implement `ReturnToDraftDialog.tsx` in `src/features/transactions/components/ReturnToDraftDialog.tsx` with RHF + Zod optional reason and loading states.
- [x] T069 [US4] Wire return-to-draft action in `src/features/transactions/components/TransactionSettlementActions.tsx` with `PermissionGate` (`transactions.returnToDraft`) and `READY_FOR_PAYMENT` status gate.
- [x] T070 [US4] Extend status filter options in `src/features/transactions/pages/TransactionsListPage.tsx` to include `READY_FOR_PAYMENT`, `PAID`, and `CANCELLED`.
- [x] T071 [US4] Add optional “Pending payment” quick filter in `src/features/transactions/pages/TransactionsListPage.tsx` setting `status=READY_FOR_PAYMENT`.
- [x] T072 [US4] Ensure list rows show distinct status badges for `READY_FOR_PAYMENT` pending indicators in `src/features/transactions/pages/TransactionsListPage.tsx`.
- [x] T073 [US4] Verify manager can access company list `GET /transactions` via existing `useTransactions` hook in `src/features/transactions/hooks/useTransactions.ts` with new status param mapping.
- [x] T074 [US4] After return-to-draft success, ensure edit draft link reappears on detail for `DRAFT` status in `src/features/transactions/pages/TransactionDetailPage.tsx`.

**Checkpoint**: Manager review paths (settle from US2 + return here + list filters) independently testable.

---

## Phase 7: User Story 5 – Owner Reopen and Receipt (Priority: P3)

**Goal**: Owners reopen Paid transactions when permitted; users view/print backend-generated receipts for Paid transactions.

**Independent Test**: Reopen Paid with required reason → status per API; receipt page shows backend payload and supports print.

- [x] T075 [US5] Finalize `transaction-reopen.schema.ts` in `src/features/transactions/validation/transaction-reopen.schema.ts` requiring non-empty `reason`.
- [x] T076 [US5] Implement `useReopenTransaction` mutation in `src/features/transactions/hooks/useSettlementMutations.ts` calling `TransactionService.reopen`.
- [x] T077 [US5] Implement `ReopenTransactionDialog.tsx` in `src/features/transactions/components/ReopenTransactionDialog.tsx` with required reason validation and loading states.
- [x] T078 [US5] Wire reopen action in `src/features/transactions/components/TransactionSettlementActions.tsx` with `PermissionGate` (`transactions.reopen`) and `PAID` status gate.
- [x] T079 [US5] Implement `useTransactionReceipt(id)` in `src/features/transactions/hooks/useTransactionReceipt.ts` enabled only when transaction status is `PAID`.
- [x] T080 [US5] Implement `TransactionReceiptDocument.tsx` in `src/features/transactions/components/TransactionReceiptDocument.tsx` rendering receipt fields from API only (`grandTotal`, items, `paidByDisplayName`, `paidAt`, etc.).
- [x] T081 [US5] Implement `TransactionReceiptPage.tsx` in `src/features/transactions/pages/TransactionReceiptPage.tsx` with loading skeleton, error state, and ineligible empty state for non-Paid deep links.
- [x] T082 [US5] Add Print button in `src/features/transactions/pages/TransactionReceiptPage.tsx` calling `window.print()` with print-friendly layout.
- [x] T083 [US5] Add print-specific CSS in `src/features/transactions/components/TransactionReceiptDocument.tsx` or feature stylesheet using `@media print` to hide app chrome.
- [x] T084 [US5] Add View Receipt link on `src/features/transactions/pages/TransactionDetailPage.tsx` when `status === 'PAID'` pointing to `buildRoute.transactionReceipt(id)`.
- [x] T085 [US5] Display `reopenReason` and reopen metadata on detail when present after reopen in `src/features/transactions/pages/TransactionDetailPage.tsx`.
- [x] T086 [US5] Omit download/share receipt buttons unless backend provides explicit download URL (document decision in component comments only; no client PDF generation).

**Checkpoint**: Reopen and receipt flows independently testable.

---

## Phase 8: User Story 6 – Settlement Timeline / Audit Trail (Priority: P3)

**Goal**: Users see chronological settlement history with actor, timestamp, action, and notes from backend data only.

**Independent Test**: After finish/settle/cancel/reopen, settlement timeline shows matching events; empty state for new drafts; section error does not break page.

- [x] T087 [US6] Complete `buildSettlementTimeline` in `src/features/transactions/lib/transaction-timeline.ts` mapping submitted/paid/cancelled/reopened lifecycle fields to `SettlementTimelineEvent[]` sorted chronologically.
- [x] T088 [US6] Add optional history endpoint support in `src/features/transactions/services/transaction.service.ts` if Backend P005 provides `GET /transactions/:id/history` (fallback to composition when absent).
- [x] T089 [US6] Implement `useTransactionTimeline(id)` in `src/features/transactions/hooks/useTransactionTimeline.ts` using history endpoint or detail-derived composition.
- [x] T090 [US6] Implement `TransactionSettlementTimeline.tsx` in `src/features/transactions/components/TransactionSettlementTimeline.tsx` as accessible `<ol>` with loading skeleton, empty state, and section-level error.
- [x] T091 [US6] Resolve actor display names in timeline using existing user/employee label helpers where `actorUserId` is available.
- [x] T092 [US6] Implement `TransactionSettlementPage.tsx` in `src/features/transactions/pages/TransactionSettlementPage.tsx` with PageHeader, breadcrumbs, status badge, summary, actions, and timeline.
- [x] T093 [US6] Embed `TransactionSettlementSummary` and `TransactionSettlementActions` in `src/features/transactions/pages/TransactionSettlementPage.tsx`.
- [x] T094 [US6] Add link from `src/features/transactions/pages/TransactionDetailPage.tsx` to settlement view for all non-archived transactions with settlement history or actions.
- [x] T095 [US6] Add document title update in `src/features/transactions/pages/TransactionSettlementPage.tsx`.
- [x] T096 [US6] Ensure timeline empty state copy matches spec (“No settlement events yet”) in `src/features/transactions/components/TransactionSettlementTimeline.tsx`.

**Checkpoint**: Settlement page and audit timeline independently testable.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Hardening, accessibility, responsive/dark mode, quality gates, and Spec 007 readiness.

- [x] T097 [P] Centralize settlement mutation error handling in `src/features/transactions/hooks/useSettlementMutations.ts` for `409 LIFECYCLE_CONFLICT` (toast + invalidate detail + close dialog via store).
- [x] T098 [P] Ensure `useSettlementDialogStore.ts` resets active dialog on successful mutations and route changes.
- [x] T099 [P] Verify no Axios imports exist in `src/features/transactions/components/` or `pages/` (service layer only).
- [x] T100 [P] Verify Zustand `useSettlementDialogStore.ts` holds UI state only (no transaction/receipt/timeline server data duplication).
- [x] T101 [P] Accessibility pass: focus trap and Escape dismiss on all settlement dialogs in `src/features/transactions/components/*Dialog.tsx`.
- [x] T102 [P] Accessibility pass: timeline list semantics and keyboard-readable labels in `src/features/transactions/components/TransactionSettlementTimeline.tsx`.
- [x] T103 [P] Responsive layout pass on `TransactionSettlementPage.tsx` and `TransactionReceiptPage.tsx` (mobile stack, desktop toolbar) per spec.
- [x] T104 [P] Dark mode visual pass on settlement summary, actions, timeline, and receipt document components.
- [x] T105 [P] Ensure unknown `TransactionStatus` values render safe fallback in `src/features/transactions/lib/transaction-status.ts` without breaking list/detail/settlement pages.
- [x] T106 [P] Regression check: Spec 005 draft create/edit/items/photos/suggestions still work for `DRAFT` transactions (no architectural changes).
- [x] T107 [P] Ensure no trip/expense/analytics/report/activity-log routes or services were added under `src/features/transactions/`.
- [x] T108 Run `pnpm typecheck` from repository root and fix any settlement-related type errors.
- [x] T109 Run `pnpm lint` from repository root and fix any settlement-related lint errors.
- [x] T110 Run `pnpm build` from repository root and confirm production build succeeds with new lazy routes.
- [x] T111 Execute manual validation scenarios in `specs/006-transaction-settlement-workflow/quickstart.md` against Backend P005 and record pass/fail notes.
- [x] T112 Update `specs/006-transaction-settlement-workflow/quickstart.md` with any permission key or endpoint reconciliations discovered during implementation.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 placeholders — **BLOCKS all user stories**
- **Phase 3 (US1)**: Depends on Phase 2 — MVP finish workflow
- **Phase 4 (US2)**: Depends on Phase 2; integrates with US1 actions component
- **Phase 5 (US3)**: Depends on Phase 2; extends shared actions component
- **Phase 6 (US4)**: Depends on Phase 2 + US2 settle (list filters can start after Phase 2)
- **Phase 7 (US5)**: Depends on Phase 2 + Phase 4 (Paid state); receipt route from Phase 2
- **Phase 8 (US6)**: Depends on Phase 2 timeline lib + Phase 3–7 for meaningful event data
- **Phase 9 (Polish)**: Depends on Phases 3–8

### User Story Dependencies

| Story                | Priority | Depends on                      | Independent test                 |
| -------------------- | -------- | ------------------------------- | -------------------------------- |
| US1 Finish           | P1       | Foundational                    | Finish draft → Ready for Payment |
| US2 Settle           | P1       | Foundational, US1 actions shell | Settle → Paid + Paid By/At       |
| US3 Cancel           | P2       | Foundational                    | Cancel → Cancelled               |
| US4 Manager review   | P2       | Foundational, US2               | Return to draft + list filters   |
| US5 Reopen + Receipt | P3       | Foundational, US2 (Paid)        | Reopen + receipt print           |
| US6 Timeline         | P3       | Foundational, US1–US5 events    | Settlement page timeline         |

### Within Each User Story

1. Zod schemas (if needed) → service already in Foundational
2. Mutation hooks → dialog components → actions wiring → page integration
3. Story checkpoint before next priority

### Parallel Opportunities

**After Phase 2 completes:**

```text
Stream A (US1 + US2 + US3): mutations + dialogs + detail integration
Stream B (US6 + US7 pages): settlement page + receipt page scaffolding
Stream C (US4): list filter enhancements (parallel with US2)
```

**Phase 1**: All tasks T001–T013 marked [P] can run in parallel.

**Phase 2**: T014–T018 types [P]; T020–T025 service methods sequential on same file; T029–T035 routing [P] after constants.

**Phase 7 + Phase 8**: Receipt page (US5) and Settlement page (US6) parallel after Phase 3 hooks exist.

---

## Parallel Example: User Story 1

```bash
# After Phase 2, launch US1 hook + detail integration in parallel where files differ:
Task T038: useFinishTransaction in src/features/transactions/hooks/useSettlementMutations.ts
Task T045: Edit page DRAFT gate in src/features/transactions/pages/TransactionEditPage.tsx
Task T047: Status badge update in src/features/transactions/components/TransactionStatusBadge.tsx
```

---

## Parallel Example: User Story 5 + User Story 6

```bash
# After Phase 4 (Paid state exists), split page work:
Developer A: T079–T086 receipt hook + TransactionReceiptPage.tsx + TransactionReceiptDocument.tsx
Developer B: T087–T096 timeline lib + TransactionSettlementPage.tsx + TransactionSettlementTimeline.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 + User Story 2)

1. Complete Phase 1: Setup scaffolding
2. Complete Phase 2: Foundational (critical path)
3. Complete Phase 3: US1 — Finish → Ready for Payment
4. Complete Phase 4: US2 — Settle → Paid
5. **STOP and VALIDATE**: Employee finish + manager settle per quickstart scenarios 2–3
6. Demo minimum viable settlement loop

### Incremental Delivery

1. Setup + Foundational → infrastructure ready
2. US1 Finish → test independently
3. US2 Settle → test finish → settle loop
4. US3 Cancel → test cancel paths
5. US4 Manager list/return → test review queue
6. US5 Reopen + Receipt → test post-payment flows
7. US6 Timeline + Settlement page → full audit UX
8. Phase 9 Polish → production ready for Spec 007

### Suggested MVP Scope

**Minimum**: Phase 1 + Phase 2 + Phase 3 (US1) + Phase 4 (US2) — delivers Draft → Ready for Payment → Paid with Paid By/At on detail.

**Full Spec 006**: All phases through T112.

---

## Notes

- All settlement work extends `src/features/transactions/` — do not create `src/features/settlement/`
- Do not modify Spec 005 draft editor behavior beyond `DRAFT` status gating
- Payment/receipt totals must never be calculated on the frontend
- Permission keys in T029/T030 must be reconciled against live Backend P005 responses during implementation
- Commit after each task group or logical checkpoint
- `[P]` tasks = different files, no incomplete-task dependencies
