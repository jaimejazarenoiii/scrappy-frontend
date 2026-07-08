# Implementation Plan: Transaction Management Foundation

**Branch**: `005-transaction-management-foundation` | **Date**: 2026-07-08 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/005-transaction-management-foundation/spec.md`

**Note**: Maps to Backend P004 – Transaction Management Foundation. Builds strictly on Specifications 001–004 and MUST NOT redesign or refactor the existing architecture. Leaves the codebase ready for Specification 006 – Transaction Settlement Workflow with no architectural refactoring.

## Summary

Deliver the Transaction Management Foundation module with permission-driven navigation and protected routes. The module provides:

- Transaction dashboard (inbound/outbound overview and context)
- Transaction list with search, filtering, sorting, and pagination
- Transaction details with backend-supported fields and relationship data
- Draft transactions: save draft, auto-save, resume draft, draft indicator, unsaved changes detection, and recover previous draft (when supported)
- Transaction items: add/edit/remove with quantity/weight/unit/unit price/notes support
- Transaction photos: upload/preview/remove (multiple photos) with upload progress
- Backend-powered material suggestions and backend-powered price suggestions (no frontend price calculations)

Out of scope (explicitly not implemented in this specification):

- Transaction settlement, payments, receipts
- Ready for Payment, Paid, Cancelled
- Manager Approval, Owner Reopen
- Audit trail, trip management, expenses
- Analytics, reports, activity logs

Technical approach:

- Implement `src/features/transactions/` following the proven feature architecture:
  `types/`, `services/`, `validation/`, `hooks/`, `components/`, `pages/`
- Reuse shared infrastructure from Specifications 001–004:
  `apiClient` + `unwrap`/`unwrapList`, `useListQuery`, `DataTable`, `FilterBar`, `Pagination`, `PermissionGuard`, `PermissionGate`, RHF + Zod + `applyApiValidationErrors`, and shared page layout primitives.
- Extend constants and routing additively:
  - `src/constants/routes.ts`
  - `src/constants/navigation.ts`
  - `src/constants/permissions.ts`
  - `src/app/router/routes.tsx`

## Technical Context

**Language/Version**: TypeScript (Strict Mode) on React 19+ with Vite

**Primary Dependencies**: React Router (Data Router), TanStack Query, Axios, Zustand, React Hook Form, Zod, Tailwind CSS v4, Lucide React, Sonner

**Storage**: N/A (frontend only; persistence via Backend P004 REST APIs)

**Testing**: Manual quickstart validation + `pnpm typecheck`, `pnpm lint`, `pnpm build`

**Target Platform**: Modern browsers (mobile-first: 320px–1536px+)

**Constraints**:

- No Axios calls from UI components (feature service classes only)
- No server state in Zustand (use Query for server data)
- No out-of-scope workflows in this specification
- No hardcoded RBAC policy; always use the authorization infrastructure (permission keys from Spec 002)

## Constitution Check

_GATE: Passed before Phase 0 research. Re-check after Phase 1 design — planned implementation path follows all gates._

| Gate                                             | Status  | Notes                                                            |
| ------------------------------------------------ | ------- | ---------------------------------------------------------------- |
| API First (I, VIII)                              | ✅ Pass | Services call `apiClient`; UI only consumes hooks                |
| Type Safety (II, IX)                             | ✅ Pass | Strict TS; Zod per form; feature-local `types/`                  |
| Feature Architecture (III, XVII, XVIII)          | ✅ Pass | Entire transaction module under `src/features/transactions/`     |
| Routing (IV, V)                                  | ✅ Pass | React Router Data Router; nested layouts; lazy-loaded routes     |
| State (VII)                                      | ✅ Pass | TanStack Query for server state; Zustand for draft UI state only |
| UI & Styling (VI, X, XI, XII, XXIX–XXXIV, XXXIX) | ✅ Pass | Reuse existing primitives + responsive DataTable patterns        |
| Auth & Security (XIV, XX)                        | ✅ Pass | Permission-driven route access + action gating                   |
| Accessibility (XV, XL)                           | ✅ Pass | Labeled forms and keyboard-friendly interactions                 |
| Responsive Design (XXVII, XXXI)                  | ✅ Pass | Mobile/tablet/desktop layouts per existing module patterns       |
| Page & Table Standards (XXXII, XXXVI)            | ✅ Pass | Standard page header/content structure                           |
| Forms & Dashboards (XXXVII, XXXVIII)             | ✅ Pass | RHF + Zod; disabled-while-processing; validation feedback        |
| AI UI Standards (XXVIII, XL)                     | ✅ Pass | Reuse-first; no duplicate primitives                             |
| Performance (XVI, XXXV)                          | ✅ Pass | Efficient query caching + memoized column definitions            |
| API Contract (XXVI)                              | ✅ Pass | Endpoint paths isolated in services + type alignment             |
| Documentation (XXII)                             | ✅ Pass | research, data-model, contracts, quickstart produced             |

No violations. Complexity Tracking not required.

## Project Structure

### Documentation (this feature)

```text
specs/005-transaction-management-foundation/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
    ├── api-endpoints.md
    └── routes-and-guards.md
```

### Source Code (repository root)

New paths only. Existing files are extended additively.

```text
src/
├── app/
│   └── router/
│       └── routes.tsx                        # EXTEND: add transactions routes (lazy)
├── constants/
│   ├── routes.ts                           # EXTEND: add transactions paths + buildRoute
│   ├── navigation.ts                       # EXTEND: add Transactions nav item (permission-driven)
│   └── permissions.ts                     # EXTEND: add transaction permission key constants
└── features/
    └── transactions/
        ├── components/
        ├── hooks/
        ├── pages/
        ├── services/
        ├── validation/
        └── types/
```

**Structure Decision**: Follow the organization/workforce pattern: each transaction sub-surface lives in the `transactions` feature folder and reuses shared UI primitives. Keep the draft editor core isolated so later settlement workflow can reuse the foundation.

## Implementation Phases

### Phase 0 — Research & Contract Reconciliation

- **Objective**: Ensure UI behavior matches Backend P004 contract shapes and supported draft mechanics.
- **Scope**:
  - Confirm transaction list/dashboard response formats and status enum values
  - Confirm draft behavior and mapping to backend statuses/endpoints
  - Confirm item CRUD semantics for drafts (add/update/delete)
  - Confirm attachment upload semantics (multipart support) and photo response structure
  - Confirm material suggestions and price suggestion payloads (and whether price history exists)
  - Confirm which UI actions must be hidden to avoid out-of-scope workflows
- **Tasks**:
  - Generate `research.md` with “Decision / Rationale / Alternatives” sections
  - Generate `data-model.md` with entities and relationships
  - Generate `contracts/api-endpoints.md` and `contracts/routes-and-guards.md`
  - Draft `quickstart.md` validation checklist outline for Phase 1/2
- **Deliverables**: research + contracts + data model + quickstart outline
- **Dependencies**: Backend P004 accessible and consistent with existing frontend service/type scaffolding.
- **Validation**:
  - No unresolved placeholders for endpoints in the contract artifacts
  - Draft workflow assumptions are documented and mapped to observable backend behavior
- **Risks**:
  - Backend rejects empty bodies for partial updates → mitigate by only sending changed fields per `UpdateTransactionInput`
  - Photo upload requires multipart config → mitigate by keeping multipart handling in services
- **Exit Criteria**:
  - Phase 0 artifacts created; implementation can proceed without architectural changes.

**Status**: Planned.

### Phase 1 — Foundation Wiring (Routing, Navigation, Permissions)

- **Objective**: Add protected transactions routes and permission-driven navigation/actions.
- **Scope**:
  - Extend route constants and `buildRoute` helpers for:
    - `/transactions`
    - `/transactions/new`
    - `/transactions/drafts`
    - `/transactions/:id`
    - `/transactions/:id/edit`
  - Extend `PERMISSIONS` with transaction keys (additive)
  - Register lazy-loaded routes under existing auth/guards infrastructure
  - Add “Transactions” nav item controlled by permissions
- **Tasks**:
  1. Implement/extend the authorization integration points only where required to wire new permissions to existing guards.
  2. Add `PermissionGuard` protection to each route.
  3. Add `PermissionGate` gating around draft-only and foundation-only actions (create draft, edit draft, item/photo edits).
  4. Ensure routes match deep linking behavior and lazy loading patterns used elsewhere.
- **Deliverables**:
  - Updated `src/constants/routes.ts`, `src/constants/navigation.ts`, `src/constants/permissions.ts`
  - Updated `src/app/router/routes.tsx`
- **Dependencies**: Phase 0 permission key naming confirmation against backend.
- **Validation**:
  - Unauthorized users receive correct access behavior (e.g., redirect to forbidden/blocked page)
  - Navigation visibility matches permission state
- **Risks**:
  - Permission key mismatch with backend → mitigate by reconciling against actual returned permissions during development.
- **Exit Criteria**:
  - All 5 specified transactions routes are reachable and protected.

**Parallelizable**: No.

### Phase 2 — Transactions Dashboard + List + Details (Read UX)

- **Objective**: Implement the core read surfaces for transactions with correct type/status rendering.
- **Scope**:
  - Dashboard page: show inbound/outbound breakdown and transaction summaries (as available by backend)
  - List page: search/filter/sort/paginate
  - Details page: show supported fields and relationship summaries
- **Tasks**:
  - Create/extend hooks for:
    - transactions list
    - single transaction details
    - assigned employees summary if provided separately
  - Implement pages:
    - dashboard/list page header + controls (FilterBar, search)
    - DataTable columns and mobile cards (type + status + primary metadata)
    - details page sections using `DescriptionList` + status/type badges
  - Action gating:
    - show only foundation actions (continue draft/edit only when transaction is a draft or backend indicates editability)
- **Deliverables**:
  - `TransactionsDashboardPage.tsx`
  - `TransactionsListPage.tsx`
  - `TransactionDetailPage.tsx`
- **Dependencies**: Phase 1 route wiring and permission constants.
- **Validation**:
  - Search and filters map correctly to backend query params
  - Pagination works and does not lose current query state
  - Status mapping gracefully handles unknown statuses
- **Risks**:
  - List vs detail payload differences → mitigate by page-specific selectors and defensive rendering.
- **Exit Criteria**:
  - FR-001/FR-002/FR-003 read behaviors met.

**Parallelizable**: Can start items/photos integration once draft pages exist, but keep wiring dependencies explicit.

### Phase 3 — Draft Workflow (Create/Edit/Resume) + Auto Save

- **Objective**: Implement draft UX with auto-save and user-safe change tracking.
- **Scope**:
  - Drafts list
  - New draft editor
  - Edit draft editor
  - Draft indicator (last saved, saving state)
  - Unsaved changes detection and recovery
  - Auto-save using backend draft update APIs
- **Tasks**:
  - Draft pages:
    - implement drafts list using status-driven query (drafts endpoint or list filter)
    - implement create/edit editor pages that load draft detail and bind to forms
  - Form + autosave:
    - Use RHF + Zod schemas for supported transaction fields
    - Use Zustand to track “dirty” and “last saved / saving” UI state
    - Implement debounced auto-save mutation calling `TransactionService.update` with changed fields
    - Invalidate/refetch detail data on save success
  - Unsaved changes detection:
    - Block navigation when dirty and no successful save occurred after edits
    - Provide safe recovery messaging when leaving or on reload
- **Deliverables**:
  - `TransactionDraftsPage.tsx`
  - `TransactionCreatePage.tsx`
  - `TransactionEditPage.tsx`
  - `TransactionDraftIndicator.tsx` + draft editor component(s)
- **Dependencies**: Phase 2 detail page patterns + draft update semantics confirmed in Phase 0.
- **Validation**:
  - Auto-save persists edits across reload
  - Draft indicator updates on successful saves
  - Unsaved changes detection works and provides clear recovery options
- **Risks**:
  - Backend limitations on partial updates → mitigate with field-level change detection and safe fallbacks.
- **Exit Criteria**:
  - Draft workflow acceptance scenarios met.

**Parallelizable**: After draft editor scaffold exists, can start Phase 4 item/photo editors in parallel.

### Phase 4 — Transaction Items + Transaction Photos + Backend Suggestions

- **Objective**: Implement draft composition editing: items + photos + backend-driven suggestions.
- **Scope**:
  - Items editor:
    - add item, edit item, remove item
    - fields: material selection, weight, unit, unit price, notes (when supported)
  - Photos manager:
    - upload multiple photos with progress
    - preview gallery
    - remove photos
  - Suggestions:
    - backend material suggestions search and selection
    - backend price suggestions display (including history if available)
- **Tasks**:
  - Items editor:
    - implement add/edit/remove UI for multiple items
    - wire to `TransactionService.addItem`, `TransactionService.updateItem`, `TransactionService.deleteItem`
    - refetch items list after mutations to keep server as source of truth
  - Photos manager:
    - list existing attachments on draft load
    - implement upload flow calling `TransactionService.uploadAttachment`
    - implement per-file progress tracking (service-level axios request config support if required)
    - implement remove flow calling `TransactionService.deleteAttachment`
  - Suggestions:
    - implement a backend-driven material search UX
    - when material is selected, request backend price suggestions and render results
    - never compute suggested prices on the client
- **Deliverables**:
  - `TransactionItemsEditor` component(s)
  - `TransactionPhotosManager` component(s)
  - Suggestions UI components wired to backend endpoints
  - Draft editor integration assembling these sections
- **Dependencies**: Draft editor must provide `transactionId` context and support required layout structure.
- **Validation**:
  - Item CRUD persists and reflects immediately after save
  - Photo uploads show progress, preview, and can be removed
  - Suggestions show correct backend results and update as user changes material selection
- **Risks**:
  - Upload concurrency/timeouts → mitigate with controlled concurrency and retry UX.
- **Exit Criteria**:
  - FR-009 to FR-015 and the photo upload/draft editor acceptance scenarios met.

**Parallelizable**: Items editor and photo manager can be implemented in parallel once draft editor loads transaction id.

### Phase 5 — Inbound/Outbound Hardening + Action Visibility

- **Objective**: Ensure inbound/outbound distinction is consistent and out-of-scope actions never appear.
- **Scope**:
  - inbound/outbound labeling across dashboard/list/detail/draft/editor
  - filter correctness by direction
  - ensure only allowed foundation actions are present for each transaction state
- **Tasks**:
  - Add direction/type badges in each module surface
  - Harden action visibility based on backend-provided status and capability (never client-only rules)
  - Ensure drafts preserve direction when resumed
- **Deliverables**:
  - Direction-consistent UI behavior
  - Final out-of-scope action audit results recorded in the plan/notes
- **Dependencies**: Phase 4 UI integration.
- **Validation**:
  - No payment/settlement/receipt/approval UI exists in this module
  - Draft editor remains stable when switching inbound/outbound direction selection (if allowed)
- **Risks**:
  - Backend may return different fields per direction → mitigate with defensive rendering and safe defaults
- **Exit Criteria**:
  - Transaction type UX consistency verified across all surfaces.

### Phase 6 — Quality Gates + Quickstart Validation + Spec 006 Readiness

- **Objective**: Validate production readiness and confirm the foundation is ready for settlement workflow in Specification 006.
- **Scope**:
  - Code quality:
    - `pnpm typecheck`, `pnpm lint`, `pnpm build`
  - UX quality:
    - loading, empty, error, success for each screen
  - Readiness:
    - keep draft core isolated so settlement workflow can be attached later without refactoring
  - Documentation:
    - finalize quickstart validation guide
- **Tasks**:
  - Implement missing UI states across all module screens
  - Update `quickstart.md` with runnable validation scenarios:
    - dashboard/list/detail
    - create draft → auto-save → reload → resume draft
    - items editor CRUD
    - photos upload + preview + remove
    - suggestions usage
  - Run:
    - `pnpm typecheck`
    - `pnpm lint`
    - `pnpm build`
  - Re-verify:
    - no out-of-scope workflows implemented
- **Deliverables**:
  - Updated `quickstart.md`
  - Completed Transaction Foundation module
- **Dependencies**: Phase 5 completion.
- **Validation**:
  - Manual validation matches Spec 005 acceptance scenarios
  - No TypeScript/ESLint violations
  - Build succeeds
- **Risks**:
  - UI gaps from missing/optional backend fields → mitigate via defensive rendering
- **Exit Criteria**:
  - Module is demo-ready and ready for Spec 006 without architectural refactoring.

## Complexity Tracking

No special complexity justification required. Follow the existing patterns from Specifications 003–004.
