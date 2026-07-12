# Quickstart: Expense Management (Spec 008)

Manual validation guide for Backend P007 integration. Run after implementation phases complete.

## Prerequisites

- Node.js 20+, pnpm 9+
- Scrappy Backend running with P007 Expense Management enabled
- `VITE_API_BASE_URL` pointing to backend (e.g. `http://localhost:3000/api/v1`)
- Seed accounts with OWNER and MANAGER roles
- At least one expense category configured on backend
- At least one branch, warehouse, vehicle, and trip available for reference pickers

## Setup

```bash
pnpm install
pnpm dev
```

Log in as **OWNER** or **MANAGER** for full CRUD coverage.

## Quality gates (automated)

```bash
pnpm typecheck
pnpm lint
pnpm build
```

All must pass before manual sign-off.

## Scenario 1 — Navigation and list (User Story 1)

1. Confirm **Expenses** appears in sidebar when user has `expenses.view`.
2. Navigate to `/expenses`.
3. Verify list loads with skeleton then data (or empty state).
4. Apply category filter → results update.
5. Apply reference type filter → results update.
6. Apply date range filter → results update.
7. Search by description or expense number → results update.
8. Change sort and pagination → behavior correct.
9. If dashboard endpoint exists, verify KPI cards match API (no client sums).
10. Log in as user **without** `expenses.view` → nav hidden; direct `/expenses` → forbidden.

**Expected**: Responsive table/cards; status badges; no console errors.

## Scenario 2 — Create and edit expense (User Story 2)

1. Click **New expense** → `/expenses/new`.
2. Submit empty form → inline validation errors.
3. Select category from API-loaded list (not hardcoded).
4. Select reference type **Branch** → branch picker appears; select branch.
5. Change reference type to **Trip** → branch selection cleared; trip picker appears.
6. Fill description, amount, expense date → submit.
7. **Expected**: Success toast; redirect to detail; fields match API.
8. Open **Edit** → change amount → save.
9. **Expected**: Detail reflects updated amount from API.

## Scenario 3 — Categories (User Story 3)

1. Open create form → categories load from `GET /expenses/categories`.
2. Filter list by category used in step 2 → expense appears.
3. If categories empty in seed → form shows guided empty state.

## Scenario 4 — Receipt photos (User Story 4)

1. On editable expense, upload one JPEG receipt.
2. **Expected**: Progress indicator; thumbnail in gallery.
3. Upload second image → both visible.
4. Remove one receipt → gallery updates per API.
5. Upload oversized or wrong type file → backend error message; other receipts intact.

## Scenario 5 — Reference display and links (User Story 5)

1. Create expense with **Trip** reference → detail shows trip label.
2. Click trip link (if permitted) → navigates to `/trips/:id`.
3. Repeat for branch reference → organization detail route.
4. Open expense whose reference entity was archived → safe fallback label.

## Scenario 6 — Delete or archive (User Story 6)

1. If archive supported: archive expense → confirm → status/list updates.
2. Toggle **include archived** filter → archived expense visible.
3. If delete supported: delete expense → confirm → removed from list; detail not found.

## Scenario 7 — Accessibility spot check

1. Tab through create form → all fields reachable; visible focus.
2. Open delete confirm dialog → focus trapped; Escape closes.
3. Upload control keyboard operable.
4. Table has semantic headers on desktop; cards readable on mobile.

## Scenario 8 — Dark mode

1. Toggle dark mode on list, detail, create, edit.
2. Verify badges, gallery thumbnails, and form controls remain readable.

## Scenario 9 — Spec 009 boundary

1. Confirm no `/analytics` or `/reports` routes added.
2. Confirm no chart/export UI on expense pages.

## Sign-off

| Check                          | Pass |
| ------------------------------ | ---- |
| All user stories 1–6 validated | ☐    |
| Quality gates green            | ☐    |
| Permissions enforced           | ☐    |
| Categories not hardcoded       | ☐    |
| Reference pickers dynamic      | ☐    |
| Receipt upload matches API     | ☐    |
