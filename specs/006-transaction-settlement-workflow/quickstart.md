# Quickstart Validation: Transaction Settlement Workflow (Spec 006)

Validates Specification 006 end-to-end against Backend P005. Assumes Spec 005 foundation is already working.

See also: [data-model.md](./data-model.md), [contracts/api-endpoints.md](./contracts/api-endpoints.md).

## Prerequisites

- Scrappy Web dev server running
- Backend P005 settlement endpoints available at `/api/v1/transactions`
- Seed accounts (development):
  - `employee1@example.com` — finish assigned drafts (timed in)
  - `manager@example.com` — settle, return to draft, cancel
  - `owner@example.com` — reopen, all manager capabilities

## Validation Scenarios

### 1) Status badges and list filters

1. Sign in as manager; open `/transactions`.
2. Filter by `Ready for Payment`, `Paid`, `Cancelled`.
3. Verify:
   - Status badges render for all four statuses
   - Unknown status does not break layout
   - Pending payment filter highlights `READY_FOR_PAYMENT` rows

### 2) Finish draft → Ready for Payment (employee)

1. Sign in as `employee1@example.com`; time in if required.
2. Open a complete `DRAFT` transaction assigned to the employee.
3. Click **Mark Ready for Payment** → confirm.
4. Verify:
   - Status becomes `Ready for Payment`
   - Success toast appears
   - `submittedAt` visible on detail/settlement when returned by API
   - Edit draft route is no longer available to employee

### 3) Settle → Paid (manager)

1. Sign in as manager; open a `READY_FOR_PAYMENT` transaction.
2. Open settlement view `/transactions/:id/settlement`.
3. Click **Mark as Paid** → confirm (optional settlement note).
4. Verify:
   - Status becomes `Paid`
   - **Paid By** and **Paid At** display from backend
   - Payment summary shows `totalAmount` from server (not recalculated)
   - Receipt link appears

### 4) Return to draft (manager approval / reject path)

1. From `READY_FOR_PAYMENT`, click **Return to Draft** with optional reason.
2. Verify:
   - Status returns to `Draft`
   - Employee can edit draft again (Spec 005 editor)
   - Timeline shows return event if backend/history provides it

### 5) Cancel transaction

1. From `DRAFT` or `READY_FOR_PAYMENT`, click **Cancel** with reason if prompted.
2. Verify:
   - Status becomes `Cancelled`
   - Cancellation reason displayed when returned
   - Settlement actions hidden

### 6) Owner reopen

1. Sign in as owner; open a `PAID` transaction.
2. Click **Reopen** → enter required reason → confirm.
3. Verify:
   - Status returns per backend (typically `Ready for Payment`)
   - Paid markers cleared per API response
   - Reopen reason visible in timeline/metadata

### 7) Receipt view and print

1. Open `/transactions/:id/receipt` for a Paid transaction.
2. Verify:
   - Receipt shows `transactionNumber`, party, items, `grandTotal`, `paidByDisplayName`, `paidAt` from API
   - Print opens browser print dialog with readable layout
3. Open receipt URL for non-Paid transaction.
4. Verify ineligible message (not a broken page).

### 8) Audit timeline

1. On settlement view, inspect timeline after finish → settle (or finish → return → finish → settle).
2. Verify:
   - Events show action, user, timestamp, notes when API provides them
   - Empty state for new drafts without settlement events
   - Timeline error is section-scoped (does not break page)

### 9) Error handling

1. Attempt finish without meeting backend rules (e.g. not timed in).
2. Verify business-rule message without raw exception text.
3. Attempt settle on already-paid transaction (or simulate concurrent update).
4. Verify lifecycle conflict message and refreshed status.

### 10) Authorization and deep links

1. As employee, deep link to manager-only settle action — verify action hidden or 403 handled.
2. Deep link `/transactions/:id/settlement` and `/transactions/:id/receipt` — verify guards and breadcrumbs.

## Quality Gates

```bash
pnpm typecheck
pnpm lint
pnpm build
```

## Exit Criteria

- All scenarios pass without modifying Spec 005 draft creation architecture
- No trip/expense/analytics/report/activity-log UI introduced
- Codebase ready for Spec 007 (Trip Management) without refactoring
