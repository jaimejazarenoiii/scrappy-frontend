# Routes and Guards: Transaction Settlement Workflow (Spec 006)

Extends Spec 005 transaction routes additively. Settlement is part of the Transactions module — no new top-level navigation item.

## New Protected Routes

### Transaction Settlement View

- **Route**: `/transactions/:id/settlement`
- **Guard**: `PermissionGuard` with `PERMISSIONS.transactions.view` (minimum)
- **Lazy**: `TransactionSettlementPage`
- **Notes**:
  - Settlement summary, permitted workflow actions, audit timeline
  - Deep link from transaction detail primary actions
  - Breadcrumb: Transactions → {transaction} → Settlement

### Transaction Receipt View

- **Route**: `/transactions/:id/receipt`
- **Guard**: `PermissionGuard` with `PERMISSIONS.transactions.view` (or `transactions.receipt` if reconciled)
- **Lazy**: `TransactionReceiptPage`
- **Notes**:
  - Only renders receipt for `PAID` transactions; otherwise ineligible empty/error state
  - Print action in page header
  - Breadcrumb: Transactions → {transaction} → Receipt

## Extended Existing Routes

### Transaction Detail (`/transactions/:id`)

- **Add**: Settlement action buttons (finish, settle, cancel, return, reopen) via `PermissionGate` + status gating
- **Add**: Links to `/settlement` and `/receipt` when applicable
- **Add**: Paid By / Paid At in description list when `PAID`
- **Unchanged**: Foundation field display, photo gallery (Spec 005)

### Transaction Edit (`/transactions/:id/edit`)

- **Guard**: Unchanged permission key
- **Gate**: Route entry and Edit button only when `status === DRAFT'` (and backend allows)
- **Note**: Ready-for-payment correction uses manager PATCH on settlement view or detail — not draft editor

### Transactions List (`/transactions`)

- **Add**: Status filter options for `READY_FOR_PAYMENT`, `PAID`, `CANCELLED`
- **Add**: Status badge tones for settlement states
- **Add**: Optional quick filter “Pending payment” (`status=READY_FOR_PAYMENT`)

## Action Visibility Matrix (PermissionGate + status)

| Action                 | Min permission (proposed)    | Status gate                  |
| ---------------------- | ---------------------------- | ---------------------------- |
| Mark Ready for Payment | `transactions.finish`        | `DRAFT`                      |
| Mark as Paid           | `transactions.settle`        | `READY_FOR_PAYMENT`          |
| Cancel                 | `transactions.cancel`        | `DRAFT`, `READY_FOR_PAYMENT` |
| Return to Draft        | `transactions.returnToDraft` | `READY_FOR_PAYMENT`          |
| Reopen                 | `transactions.reopen`        | `PAID`                       |
| View Receipt           | `transactions.view`          | `PAID`                       |
| Edit draft             | `transactions.update`        | `DRAFT`                      |

Backend 403 on mutation is authoritative when client gating is optimistic.

## Route Constants (extend `src/constants/routes.ts`)

```text
ROUTES.transactionSettlement: '/transactions/:id/settlement'
ROUTES.transactionReceipt: '/transactions/:id/receipt'

buildRoute.transactionSettlement(id)
buildRoute.transactionReceipt(id)
```

## Router Registration (`src/app/router/routes.tsx`)

- Add lazy children under existing transactions layout (same pattern as Spec 005)
- Preserve code splitting per page

## Breadcrumbs (`src/lib/breadcrumb.ts`, `useBreadcrumbTrail`)

- Add settlement and receipt segment labels
- Use transaction number or party name when available from route loader/query cache

## Session Permissions (`src/features/auth/lib/session.ts`)

Extend role maps:

- **EMPLOYEE**: `transactions.finish`, `transactions.cancel` (if API allows), existing view/create/update
- **MANAGER**: `transactions.settle`, `transactions.returnToDraft`, `transactions.cancel`, all employee transaction perms
- **OWNER**: `transactions.reopen`, all manager transaction perms

Exact keys reconciled against Backend P005 during implementation.

## Out of Scope

- No `/settlement` root route
- No separate sidebar nav item for settlement
