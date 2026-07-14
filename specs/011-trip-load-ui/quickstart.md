# Quickstart: Trip Load Management UI

Manual validation guide for Specification 011. Requires running Scrappy frontend against a backend with Trip Load APIs enabled.

**Prerequisites**

- Backend P006 Trip Load endpoints deployed (see [contracts/api-endpoints.md](./contracts/api-endpoints.md))
- Logged-in **Owner** or **Manager** account
- Logged-in **Employee** account assigned to a trip (for read-only tests)
- At least one **Draft** trip and ability to **Start** a trip

## 1. Optional enablement (Prepare Trip Load OFF)

1. Navigate to **Trips → New trip**.
2. Confirm **Prepare Trip Load** toggle is visible and **OFF** by default.
3. Create trip without enabling load.
4. Open trip detail.

**Expected**: No Trip Load section anywhere on the page.

## 2. Enable Trip Load on create

1. Create a new trip with **Prepare Trip Load ON**.
2. Open trip detail.

**Expected**: **Trip Load** section visible with summary card (zeros or empty) and empty state with **Add item** for managers.

## 3. Manage load items (Manager)

1. On draft trip with load enabled, click **Add item**.
2. Enter material `Copper`, quantity `100`, unit `KG`, optional note.
3. Save.
4. Add second item `Aluminum`, `50`, `KG`.
5. Edit Copper quantity to `120`.
6. Remove Aluminum with confirm dialog.

**Expected**: Table and summary totals match backend after each action; last updated timestamp changes; success toasts.

## 4. Start trip → read-only progress

1. Start the trip via workflow actions.
2. Return to Trip Load section.

**Expected**: No Add/Edit/Remove; rows show **Loaded / Sold / Remaining** with indicator badges; values match backend.

## 5. Employee read-only

1. Log in as assigned **Employee**.
2. Open the started trip from step 4.

**Expected**: Trip Load visible; no mutation buttons; remaining quantities readable on mobile accordion.

## 6. Transaction validation warning

1. As employee or manager, create or edit a **TRIP** transaction linked to the started trip.
2. Add transaction line with material **not** on load plan (or quantity exceeding remaining).

**Expected**: Non-blocking warning banner appears; transaction form layout unchanged; no auto-filled materials; user can still save if backend allows.

## 7. Responsive checks

1. Open trip detail at 375px width.
2. Confirm Trip Load is accordion; cards readable.
3. Repeat at 768px (collapsible) and 1280px (panel).

**Expected**: No horizontal scroll on remaining cards; actions reachable (44px touch targets).

## 8. Error states

1. Simulate API failure (stop backend or invalid trip id).
2. Reload trip detail.

**Expected**: Trip Load section shows error with retry; overview/members still work.

## 9. Cancelled trip

1. Open a **Cancelled** trip that had load enabled.

**Expected**: Load section read-only; no edit actions.

## Sign-off checklist

- [ ] Prepare Trip Load default OFF
- [ ] Section hidden when disabled
- [ ] CRUD works on draft
- [ ] Read-only progress after start
- [ ] Employee cannot edit
- [ ] Transaction warnings non-blocking
- [ ] Responsive layouts verified
- [ ] Loading skeletons and empty states present

Run `pnpm typecheck`, `pnpm lint`, and `pnpm build` before merge.
