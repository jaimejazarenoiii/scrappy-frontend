# Implementation Plan: Transaction Settlement Workflow

**Branch**: `006-transaction-settlement-workflow` | **Date**: 2026-07-08 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/006-transaction-settlement-workflow/spec.md`

**Note**: Maps to Backend P005 – Transaction Settlement Workflow. Builds strictly on Specifications 001–005 and MUST NOT redesign or replace the existing architecture. Leaves the codebase ready for Specification 007 – Trip Management with no architectural refactoring.

## Summary

Extend the existing `src/features/transactions/` module with settlement workflow capabilities:

- Mark Ready for Payment (`finish`)
- Mark Paid (`settle`) with Paid By / Paid At display
- Cancel with optional/required reason
- Manager review: settle (approve) and return-to-draft (reject/correct)
- Owner reopen with required reason
- Receipt view and print from backend receipt API
- Settlement audit timeline from backend history or lifecycle fields

Reuse Spec 005 for draft creation, editing, items, photos, auto-save, and suggestions — unchanged in purpose.

Technical approach:

- Extend `transaction.types.ts`, `transaction.service.ts`, status helpers, and mutation hooks additively
- Add settlement-specific components (`TransactionSettlementActions`, `TransactionSettlementTimeline`, `TransactionReceiptView`, reason dialogs)
- Add pages: extend `TransactionDetailPage`; new `TransactionSettlementPage`, `TransactionReceiptPage`
- Extend routes, breadcrumbs, and permissions additively
- TanStack Query for all server state; Zustand for dialog/UI state only

## Technical Context

**Language/Version**: TypeScript (Strict Mode) on React 19+ with Vite

**Primary Dependencies**: React Router (Data Router), TanStack Query, Axios, Zustand, React Hook Form, Zod, Tailwind CSS v4, Lucide React, Sonner

**Storage**: N/A (frontend only; persistence via Backend P005 REST APIs)

**Testing**: Manual quickstart validation + `pnpm typecheck`, `pnpm lint`, `pnpm build`

**Target Platform**: Modern browsers (mobile-first: 320px–1536px+); light and dark mode

**Performance Goals**: Lazy-loaded settlement/receipt routes; invalidate minimal query keys on mutations; memoized timeline and action panels

**Constraints**:

- No Axios in UI components
- No server state in Zustand
- No client-side payment/receipt calculations
- No hardcoded workflow rules beyond permission gates + status display
- No changes to Spec 005 draft editor behavior except status-based entry gating

**Scale/Scope**: Settlement layer on existing Transactions module only; no new product modules

## Constitution Check

_GATE: Passed before Phase 0 research. Re-checked after Phase 1 design._

| Gate                                             | Status  | Notes                                                   |
| ------------------------------------------------ | ------- | ------------------------------------------------------- |
| API First (I, VIII)                              | ✅ Pass | Extend `TransactionService`; UI consumes hooks only     |
| Type Safety (II, IX)                             | ✅ Pass | Extend types + Zod schemas for reason dialogs           |
| Feature Architecture (III, XVII, XVIII)          | ✅ Pass | All work under `src/features/transactions/`             |
| Routing (IV, V)                                  | ✅ Pass | Data Router; lazy settlement + receipt routes           |
| State (VII)                                      | ✅ Pass | Query for status/history/receipt; Zustand for dialogs   |
| UI & Styling (VI, X, XI, XII, XXIX–XXXIV, XXXIX) | ✅ Pass | Reuse ConfirmDialog, StatusBadge, PageHeader, skeletons |
| Auth & Security (XIV, XX)                        | ✅ Pass | PermissionGate + backend 403 enforcement                |
| Accessibility (XV, XL)                           | ✅ Pass | Accessible dialogs, timeline list semantics, focus trap |
| Responsive Design (XXVII, XXXI)                  | ✅ Pass | Mobile-first settlement + receipt layouts               |
| Page & Table Standards (XXXII, XXXVI)            | ✅ Pass | Standard headers, breadcrumbs, actions                  |
| Forms & Dashboards (XXXVII, XXXVIII)             | ✅ Pass | RHF + Zod for reason forms; disabled while pending      |
| AI UI Standards (XXVIII, XL)                     | ✅ Pass | Reuse-first; no duplicate primitives                    |
| Performance (XVI, XXXV)                          | ✅ Pass | Lazy routes; targeted cache invalidation                |
| API Contract (XXVI)                              | ✅ Pass | Contracts in `specs/006/.../contracts/`                 |
| Documentation (XXII)                             | ✅ Pass | research, data-model, contracts, quickstart complete    |

No violations. Complexity Tracking not required.

## Project Structure

### Documentation (this feature)

```text
specs/006-transaction-settlement-workflow/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
└── contracts/
    ├── api-endpoints.md
    └── routes-and-guards.md
```

### Source Code (additive changes only)

```text
src/
├── app/router/routes.tsx                    # EXTEND: settlement + receipt lazy routes
├── constants/
│   ├── routes.ts                          # EXTEND: settlement/receipt paths + buildRoute
│   ├── navigation.ts                      # UNCHANGED (no new nav item)
│   └── permissions.ts                     # EXTEND: finish, settle, cancel, return, reopen
├── features/auth/lib/session.ts           # EXTEND: role permission maps
├── lib/
│   └── breadcrumb.ts                      # EXTEND: settlement/receipt segments
├── hooks/useBreadcrumbTrail.ts            # EXTEND: settlement/receipt trails
└── features/transactions/
    ├── types/transaction.types.ts         # EXTEND: statuses, lifecycle fields, receipt type
    ├── services/transaction.service.ts    # EXTEND: finish, settle, return, reopen, receipt
    ├── validation/
    │   ├── transaction-cancel.schema.ts   # NEW (optional)
    │   ├── transaction-reopen.schema.ts   # NEW
    │   ├── transaction-return.schema.ts   # NEW (optional)
    │   └── transaction-settle.schema.ts   # NEW (optional note)
    ├── lib/
    │   ├── transaction-status.ts          # EXTEND: READY_FOR_PAYMENT, PAID
    │   ├── transaction-settlement.ts      # NEW: action eligibility helpers (status-only)
    │   └── transaction-timeline.ts        # NEW: compose timeline from detail/history
    ├── hooks/
    │   ├── useTransaction.ts              # UNCHANGED (reuse)
    │   ├── useTransactionReceipt.ts       # NEW
    │   ├── useTransactionTimeline.ts      # NEW
    │   ├── useSettlementMutations.ts      # NEW: finish, settle, cancel, return, reopen
    │   └── useSettlementDialogStore.ts    # NEW: dialog open state (Zustand)
    ├── components/
    │   ├── TransactionStatusBadge.tsx     # EXTEND (via status lib)
    │   ├── TransactionSettlementActions.tsx    # NEW
    │   ├── TransactionSettlementSummary.tsx    # NEW: Paid By/At, totals
    │   ├── TransactionSettlementTimeline.tsx   # NEW
    │   ├── TransactionReceiptDocument.tsx      # NEW: printable receipt layout
    │   ├── CancelTransactionDialog.tsx         # NEW
    │   ├── ReopenTransactionDialog.tsx         # NEW
    │   ├── ReturnToDraftDialog.tsx             # NEW
    │   └── SettleTransactionDialog.tsx         # NEW
    └── pages/
        ├── TransactionDetailPage.tsx      # EXTEND: settlement actions + paid metadata
        ├── TransactionSettlementPage.tsx  # NEW
        ├── TransactionReceiptPage.tsx     # NEW
        ├── TransactionsListPage.tsx       # EXTEND: status filters/badges
        └── TransactionEditPage.tsx        # EXTEND: gate to DRAFT only (if not already)
```

**Structure Decision**: Single feature module extension per Spec 005 readiness plan. Settlement components are colocated with transactions; shared primitives remain in `src/components/`.

## Implementation Phases

### Phase 0 — Research & Contract Reconciliation

- **Objective**: Confirm Backend P005 endpoints, status values, and lifecycle fields match frontend contracts.
- **Scope**: API shapes for finish/settle/cancel/return/reopen/receipt; permission keys; optional history endpoint; editability matrix.
- **Tasks**:
  1. Produce `research.md` with decisions and alternatives
  2. Produce `data-model.md` with extended entities and transitions
  3. Produce `contracts/api-endpoints.md` and `contracts/routes-and-guards.md`
  4. Draft `quickstart.md` validation scenarios
- **Deliverables**: Phase 0 documentation artifacts (complete)
- **Dependencies**: Backend P005 API reference / running dev API
- **Validation**: No unresolved NEEDS CLARIFICATION in technical context
- **Risks**: Permission key mismatch → reconcile during Phase 1 against live API
- **Exit Criteria**: Contracts documented; implementation can proceed without architecture changes

**Status**: ✅ Complete

---

### Phase 1 — Types, Service & Status Foundation

- **Objective**: Extend the transaction data layer for settlement statuses and workflow APIs.
- **Scope**: Types, service methods, status labels/tones, list param status union.
- **Tasks**:
  1. Extend `TransactionStatus` with `READY_FOR_PAYMENT` | `PAID`
  2. Add lifecycle fields to `TransactionBase` (`transactionNumber`, `submittedAt`, `paidAt`, etc.)
  3. Add `TransactionReceipt`, `SettleTransactionInput`, `ReopenTransactionInput`, `ReturnToDraftInput`
  4. Add `TRANSACTION_ENDPOINTS.finish`, `.settle`, `.returnToDraft`, `.reopen`, `.receipt`
  5. Implement service methods: `finish`, `settle`, `cancel` (wire existing), `returnToDraft`, `reopen`, `getReceipt`
  6. Update `transaction-status.ts` labels and tones (Draft=neutral, Ready=warning, Paid=success, Cancelled=inactive)
  7. Add `transaction-settlement.ts` with pure status-based helpers (e.g. `canShowReceipt(status)` — display hints only, not authorization)
- **Deliverables**: Updated `types/`, `services/`, `lib/transaction-status.ts`, `lib/transaction-settlement.ts`
- **Dependencies**: Phase 0 contracts
- **Validation**: `pnpm typecheck` passes; service methods match contract paths
- **Risks**: Spec 005 code assumes `DRAFT | CANCELLED` only → update all switch statements and filters
- **Exit Criteria**: Service layer callable; types align with API reference

**Parallelizable**: No (foundation for all UI phases)

---

### Phase 2 — Permissions, Routes & Navigation Wiring

- **Objective**: Wire protected settlement/receipt routes and permission keys without new nav items.
- **Scope**: `routes.ts`, `permissions.ts`, `session.ts`, `routes.tsx`, breadcrumbs.
- **Tasks**:
  1. Add `ROUTES.transactionSettlement`, `ROUTES.transactionReceipt` + `buildRoute` helpers
  2. Extend `PERMISSIONS.transactions` with `finish`, `settle`, `cancel`, `returnToDraft`, `reopen` (reconcile strings)
  3. Map permissions to OWNER/MANAGER/EMPLOYEE in `session.ts`
  4. Register lazy routes for `TransactionSettlementPage`, `TransactionReceiptPage`
  5. Extend breadcrumb config for settlement and receipt segments
  6. Gate `TransactionEditPage` route/button to `DRAFT` status
- **Deliverables**: Routing and auth integration files updated
- **Dependencies**: Phase 1 types (for route loaders if used)
- **Validation**: Deep links load; unauthorized users blocked; breadcrumbs correct
- **Risks**: Over-broad employee permissions → match API (finish/cancel only when assigned)
- **Exit Criteria**: `/transactions/:id/settlement` and `/transactions/:id/receipt` reachable and protected

**Parallelizable**: Can start after Phase 1 begins (once route constants known)

---

### Phase 3 — Settlement Mutations & Query Hooks

- **Objective**: TanStack Query mutations and receipt/timeline hooks with correct cache invalidation.
- **Scope**: `useSettlementMutations`, `useTransactionReceipt`, `useTransactionTimeline`, Zod schemas.
- **Tasks**:
  1. Create Zod schemas for cancel, reopen, return-to-draft, settle note forms
  2. Implement `useFinishTransaction`, `useSettleTransaction`, `useCancelTransaction`, `useReturnToDraft`, `useReopenTransaction`
  3. On success: invalidate `transactionKeys.detail(id)`, list queries, receipt query
  4. Implement `useTransactionReceipt(id)` enabled when `status === PAID`
  5. Implement `useTransactionTimeline(id)` — fetch history endpoint OR derive from cached detail via `transaction-timeline.ts`
  6. Create `useSettlementDialogStore` for active dialog type + transaction id
  7. Toast success/error via Sonner; map API errors with `applyApiValidationErrors`
- **Deliverables**: `hooks/useSettlementMutations.ts`, `useTransactionReceipt.ts`, `useTransactionTimeline.ts`, `useSettlementDialogStore.ts`, validation schemas
- **Dependencies**: Phase 1 service methods
- **Validation**: Mutations refresh detail; no duplicate server data in Zustand
- **Risks**: Stale cache after concurrent update → always refetch detail on 409
- **Exit Criteria**: Hooks usable from components; manual mutation test via devtools

**Parallelizable**: After Phase 1 completes

---

### Phase 4 — Settlement Action UI & Dialogs

- **Objective**: Confirmation dialogs and action toolbar for all workflow transitions.
- **Scope**: Dialog components + `TransactionSettlementActions`.
- **Tasks**:
  1. `FinishTransactionDialog` or reuse `ConfirmDialog` for finish (no body)
  2. `SettleTransactionDialog` — optional settlement note (RHF + Zod)
  3. `CancelTransactionDialog` — optional/required cancellation reason
  4. `ReturnToDraftDialog` — optional reason
  5. `ReopenTransactionDialog` — required reason
  6. `TransactionSettlementActions` — renders buttons by `PermissionGate` + status; opens dialogs; disabled while pending
  7. Loading states: disable confirm, show spinner on primary button
- **Deliverables**: Dialog components + `TransactionSettlementActions.tsx`
- **Dependencies**: Phase 3 hooks and Phase 2 permissions
- **Validation**: Each dialog blocks double-submit; cancel dismisses without mutation
- **Risks**: Dialog focus trap conflicts on mobile → use existing ConfirmDialog patterns
- **Exit Criteria**: All five workflow actions triggerable from action component

**Parallelizable**: With Phase 5 once hooks exist

---

### Phase 5 — Transaction Detail & List Enhancements

- **Objective**: Surface settlement metadata and pending indicators on existing read surfaces.
- **Scope**: `TransactionDetailPage`, `TransactionsListPage`, `TransactionStatusBadge`.
- **Tasks**:
  1. Detail: show `transactionNumber`, Paid By/At when `PAID`, submitted metadata when present
  2. Detail: embed `TransactionSettlementActions` in header actions
  3. Detail: link to settlement view and receipt (when Paid)
  4. List: extend status filter dropdown with `READY_FOR_PAYMENT`, `PAID`, `CANCELLED`
  5. List: optional “Pending payment” quick filter
  6. List: status badge tones for new statuses
  7. Hide “Edit draft” on detail when not `DRAFT`
- **Deliverables**: Extended detail and list pages
- **Dependencies**: Phase 1 status lib; Phase 4 actions component
- **Validation**: FR-009 pending indicators visible; paid metadata from API only
- **Risks**: List query param `status` enum mismatch → align with backend filter values
- **Exit Criteria**: User Stories 1–4 partially verifiable from list + detail

**Parallelizable**: Phase 4 dialogs can proceed in parallel

---

### Phase 6 — Settlement Page & Audit Timeline

- **Objective**: Dedicated settlement view with summary, actions, and audit trail.
- **Scope**: `TransactionSettlementPage`, `TransactionSettlementSummary`, `TransactionSettlementTimeline`.
- **Tasks**:
  1. Page layout: PageHeader, breadcrumbs, status badge, back to detail
  2. `TransactionSettlementSummary` — party, direction, totalAmount, paid/submitted/cancel metadata
  3. Embed `TransactionSettlementActions`
  4. `TransactionSettlementTimeline` — accessible `<ol>` timeline; loading skeleton; empty state; section error
  5. Implement `transaction-timeline.ts` builder from detail fields (+ history API if available)
  6. Resolve actor display names via user label helpers where possible
- **Deliverables**: Settlement page + summary + timeline components
- **Dependencies**: Phase 3 timeline hook; Phase 4 actions
- **Validation**: User Story 6 acceptance scenarios; SC-005 timeline completeness
- **Risks**: Missing return-to-draft event in lifecycle fields → document gap; prefer history API
- **Exit Criteria**: `/transactions/:id/settlement` production-ready with all UI states

**Parallelizable**: Phase 7 receipt page in parallel after Phase 3 receipt hook

---

### Phase 7 — Receipt Page & Print

- **Objective**: Backend-driven receipt view with print support.
- **Scope**: `TransactionReceiptPage`, `TransactionReceiptDocument`.
- **Tasks**:
  1. Page: load receipt via `useTransactionReceipt`; skeleton; error; ineligible state for non-Paid
  2. `TransactionReceiptDocument` — render company, transactionNumber, party, date, items table, grandTotal, paidByDisplayName, paidAt
  3. Print button → `window.print()` with `@media print` styles (hide chrome)
  4. Download/share: implement only if backend provides URL; otherwise omit buttons
  5. Back navigation to transaction detail
- **Deliverables**: Receipt page + document component + print CSS
- **Dependencies**: Phase 3 receipt hook; Phase 2 receipt route
- **Validation**: User Story 5 receipt scenarios; SC-004 under 1 minute to print
- **Risks**: Print layout on mobile → single-column print stylesheet
- **Exit Criteria**: Receipt matches API payload; no client-side total math

**Parallelizable**: With Phase 6 after Phase 3

---

### Phase 8 — Integration Hardening & Edge Cases

- **Objective**: Lifecycle conflicts, concurrent updates, unknown statuses, and authorization edge cases.
- **Scope**: Cross-cutting error handling and refresh behavior.
- **Tasks**:
  1. On `409 LIFECYCLE_CONFLICT`: toast + refetch detail + close dialog
  2. On `403`: toast + hide action on next render
  3. Unknown `status` fallback in badge and filters
  4. Deep link guards: receipt for non-Paid shows ineligible empty state
  5. Verify employee assigned-transaction rules (`GET /transactions/assigned` flows if used)
  6. Ensure Spec 005 draft editor unchanged except DRAFT gate
  7. Document title updates for settlement and receipt pages
- **Deliverables**: Hardened error paths across settlement surfaces
- **Dependencies**: Phases 4–7 complete
- **Validation**: Edge cases from spec (concurrent update, not timed in, archived)
- **Risks**: Regression in Spec 005 draft flows → run Spec 005 quickstart subset
- **Exit Criteria**: SC-003 actionable errors on 95%+ of failure paths

**Parallelizable**: No (integration pass)

---

### Phase 9 — Quality Gates & Quickstart Validation

- **Objective**: Production readiness and Spec 007 handoff.
- **Scope**: Lint, typecheck, build, manual quickstart, documentation finalize.
- **Tasks**:
  1. Run `pnpm typecheck`, `pnpm lint`, `pnpm build`
  2. Execute `quickstart.md` scenarios with seed accounts
  3. Verify no trip/expense/analytics/report/activity-log code added
  4. Verify no Axios in components; no server state in Zustand
  5. Accessibility spot-check: dialogs, timeline, print
  6. Light/dark mode visual pass on settlement and receipt pages
- **Deliverables**: Passing quality gates; validated quickstart
- **Dependencies**: Phase 8
- **Validation**: All Spec 006 success criteria spot-checked
- **Risks**: Backend unavailable for manual test → document blocked scenarios in quickstart notes
- **Exit Criteria**: Module demo-ready; no architectural refactor needed before Spec 007

**Parallelizable**: No

---

## Parallel Development Opportunities

| Workstream              | Can parallelize after | Notes                                            |
| ----------------------- | --------------------- | ------------------------------------------------ |
| Phase 2 routing         | Phase 1 started       | Route constants independent of full service impl |
| Phase 4 dialogs         | Phase 3 hooks         | UI mock with stubbed mutations for layout        |
| Phase 6 settlement page | Phase 3 hooks         | Parallel with Phase 7 receipt                    |
| Phase 7 receipt page    | Phase 3 receipt hook  | Parallel with Phase 6                            |
| Phase 5 list/detail     | Phase 4 actions       | Detail can ship before settlement page           |

Recommended team split after Phase 3:

- **Stream A**: Phase 4 + 5 (actions + detail/list)
- **Stream B**: Phase 6 + 7 (settlement page + receipt)

## Complexity Tracking

No constitution violations. No new feature modules or state management patterns introduced.

## Spec 007 Readiness

After Phase 9:

- Transactions module contains complete P004 foundation + P005 settlement
- `tripId` field on transactions remains display-only until Spec 007
- No coupling between settlement services and future trip services beyond existing `tripId` on `TransactionDetail`
- Route namespace `/transactions/*` stable for trip linking later

## Generated Artifacts (Phase 0 + Phase 1)

| Artifact        | Path                                                                       | Status                    |
| --------------- | -------------------------------------------------------------------------- | ------------------------- |
| Research        | `specs/006-transaction-settlement-workflow/research.md`                    | ✅                        |
| Data model      | `specs/006-transaction-settlement-workflow/data-model.md`                  | ✅                        |
| API contracts   | `specs/006-transaction-settlement-workflow/contracts/api-endpoints.md`     | ✅                        |
| Routes & guards | `specs/006-transaction-settlement-workflow/contracts/routes-and-guards.md` | ✅                        |
| Quickstart      | `specs/006-transaction-settlement-workflow/quickstart.md`                  | ✅                        |
| Tasks           | `specs/006-transaction-settlement-workflow/tasks.md`                       | ⏳ Next: `/speckit-tasks` |
