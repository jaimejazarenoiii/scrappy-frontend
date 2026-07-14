# Feature Specification: Trip Load Management UI (P006 Addendum)

**Feature Branch**: `011-trip-load-ui`

**Created**: 2026-07-14

**Status**: Draft

**Input**: User description: Create Frontend Product Specification — P006 Addendum — Trip Load Management UI for Scrappy Web. Optional pre-trip inventory planning with remaining-quantity visibility, role-based editing, and non-blocking transaction validation warnings. Extends existing Trip interface; transaction screens remain independent.

## Purpose _(mandatory — Constitution Principle XXII)_

Provide a simple, intuitive interface for optionally planning what materials and quantities a trip will carry **before** the trip begins. Trip Load helps owners and managers prepare expected inventory; employees and managers can see what was loaded, what was sold during the trip, and what remains—without forcing every trip to use the feature.

Trip Load is **optional by design**. Users must never feel required to create a Trip Load to use trips normally. When Prepare Trip Load is off, trip behavior and screens match existing Trip Management (Specification 007) with no visible Trip Load section.

This specification covers **frontend user experience and interface only**. It extends Trip Create and Trip Detail within the existing Trips module. It does **not** define backend implementation, API contracts, database design, project structure, state management approach, testing strategy, or code examples. Backend Trip Load capabilities are assumed to be specified separately; the UI consumes authoritative server-provided data and validation messages.

**In scope**: Prepare Trip Load toggle on trip create; Trip Load section on trip detail (hidden until enabled); Trip Load summary card; item table with add/edit/remove (managers and owners, draft/pre-start only); read-only Loaded / Sold / Remaining views for started and completed trips; remaining-quantity visual indicators (normal, warning, exceeded); validation warnings surfaced on transaction flows without changing transaction entry behavior; responsive layouts (panel, collapsible, accordion); loading, empty, and error states; permission-gated actions; future-friendly layout for scanners and integrations.

**Out of scope**: Backend or API implementation; automatic material selection on transactions; barcode/QR/scale integrations in v1; warehouse picking workflows; vehicle inventory modules; return-load workflows; changes to core transaction form fields or settlement logic (Specifications 005–006); expense, analytics, reports, or activity logs.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Optionally enable Trip Load when creating a trip (Priority: P1)

An owner or manager creating a trip can turn on **Prepare Trip Load** (default **OFF**). When OFF, the trip behaves as today with no Trip Load section. When ON, Trip Load becomes available on the trip after creation so they can define expected materials, quantities, and units before the trip starts.

**Why this priority**: Opt-in is the foundation of the feature; without a clear, non-intrusive enablement path, users would feel forced into extra work.

**Independent Test**: Create a trip with Prepare Trip Load OFF and confirm no Trip Load UI appears. Create another trip with it ON and confirm Trip Load section appears on detail with empty-state guidance.

**Acceptance Scenarios**:

1. **Given** the user is on Create Trip, **When** the page loads, **Then** Prepare Trip Load toggle is visible, default OFF, with brief helper text that Trip Load is optional.
2. **Given** Prepare Trip Load is OFF, **When** the user saves the trip, **Then** Trip Detail shows no Trip Load section (or equivalent hidden state).
3. **Given** Prepare Trip Load is ON, **When** the user saves the trip, **Then** Trip Detail shows the Trip Load section with summary card and empty item table (or guided empty state).
4. **Given** the user lacks permission to manage Trip Load, **When** they view Create Trip, **Then** the toggle is hidden or disabled with no misleading affordances.

---

### User Story 2 - Manage Trip Load items before the trip starts (Priority: P1)

An owner or manager on a draft (or otherwise editable, pre-start) trip with Trip Load enabled can add, edit, and remove load items. Each item includes material name, quantity, unit, and optional notes. A summary card shows total loaded items, total loaded weight (or weight-equivalent totals as provided by the backend), remaining weight context when applicable, and last updated time.

**Why this priority**: Defining the load plan is the core value for dispatch and reconciliation before departure.

**Independent Test**: On an enabled, editable trip, add two items, edit one, remove one, and verify the table and summary card reflect server state after each action.

**Acceptance Scenarios**:

1. **Given** Trip Load is enabled and the trip is editable, **When** the user adds an item with valid material, quantity, unit, and optional notes, **Then** the item appears in the table and summary totals update from backend data.
2. **Given** existing load items, **When** the user edits quantity, unit, material, or notes, **Then** changes persist and last updated reflects the latest server timestamp.
3. **Given** an existing item, **When** the user removes it with confirmation, **Then** the item disappears and summary totals refresh.
4. **Given** invalid input (empty material, zero quantity, unsupported unit), **When** the user submits, **Then** inline validation appears without clearing other valid fields.
5. **Given** the trip transitions to Started (or another read-only state per backend rules), **When** detail loads, **Then** add/edit/remove actions are hidden and items display in read-only mode.

---

### User Story 3 - View remaining quantities during and after the trip (Priority: P1)

All users with trip access (owners, managers, assigned employees) can view Trip Load on started or completed trips in read-only form. For each material, the UI shows **Loaded**, **Sold**, and **Remaining** with clear visual indicators: **Normal**, **Warning**, and **Exceeded** (when sold exceeds loaded or remaining is negative per backend rules).

**Why this priority**: Remaining quantity visibility is the operational payoff during field work and settlement review.

**Independent Test**: Open a started trip with known load and transaction activity; verify per-material Loaded/Sold/Remaining rows and indicator states match backend calculations.

**Acceptance Scenarios**:

1. **Given** a started trip with Trip Load enabled, **When** Trip Load section loads, **Then** each material row shows Loaded, Sold, and Remaining values from the backend (not client-calculated).
2. **Given** remaining quantity is within expected bounds, **When** displayed, **Then** the row uses the Normal visual indicator.
3. **Given** remaining is low or approaching zero per backend warning thresholds, **When** displayed, **Then** the Warning indicator appears without blocking other trip actions.
4. **Given** sold exceeds loaded (or backend marks exceeded state), **When** displayed, **Then** the Exceeded indicator appears prominently but does not crash or obscure the rest of the trip detail.
5. **Given** an employee with view-only permission, **When** they open the trip, **Then** they see Trip Load and remaining quantities but no edit controls.

---

### User Story 4 - See validation warnings on transactions without changing transaction entry (Priority: P2)

When creating or editing a transaction linked to a trip (or otherwise in scope per backend rules), users continue entering materials **manually** as today. If Trip Load validation applies, non-blocking warnings appear—for example, remaining quantity lower than entered transaction quantity, or material not present on the Trip Load. Warnings do **not** auto-fill materials from Trip Load and do **not** replace existing transaction form layout.

**Why this priority**: Trip Load informs operators without hijacking the established transaction workflow.

**Independent Test**: On a trip with Trip Load, start a transaction for a material with insufficient remaining quantity; verify a clear warning appears and the user can still proceed or adjust per backend enforcement rules.

**Acceptance Scenarios**:

1. **Given** a transaction in context of a trip with Trip Load, **When** the user enters a material and quantity manually, **Then** the transaction form fields and flow are unchanged from Specification 005.
2. **Given** entered quantity exceeds remaining for that material, **When** validation runs, **Then** a concise warning message appears (inline or summary banner) describing the mismatch.
3. **Given** the material is not on the Trip Load, **When** validation runs, **Then** a warning indicates the material is not in the load plan without preventing form use unless the backend forbids submission.
4. **Given** multiple warnings exist, **When** displayed, **Then** they are grouped or listed clearly without overwhelming the screen (e.g., one primary message plus expandable detail).
5. **Given** Trip Load is disabled for the trip, **When** the user works on a transaction, **Then** no Trip Load validation warnings appear.

---

### User Story 5 - Responsive Trip Load across devices (Priority: P2)

Trip Load adapts to viewport: dedicated panel on desktop, collapsible section on tablet, accordion on mobile—consistent with established Scrappy responsive patterns.

**Why this priority**: Field staff use mobile; managers use desktop—both need readable load and remaining data.

**Independent Test**: Open the same started trip at mobile, tablet, and desktop widths; verify layout mode and that Loaded/Sold/Remaining remain readable without horizontal clutter.

**Acceptance Scenarios**:

1. **Given** desktop width (1280px+), **When** Trip Detail loads, **Then** Trip Load appears as a dedicated panel within the trip layout.
2. **Given** tablet width (768px+), **When** Trip Detail loads, **Then** Trip Load is a collapsible section, expanded by default when warnings or exceeded states exist.
3. **Given** mobile width (320px+), **When** Trip Detail loads, **Then** Trip Load uses accordion layout with touch-friendly row cards for items or remaining quantities.
4. **Given** any breakpoint, **When** loading or empty, **Then** skeleton and empty states match the layout mode (no layout shift on data arrival).

---

### Edge Cases

- Trip Load enabled but zero items: show guided empty state with Add Item when editable; show “No load items defined” when read-only.
- Prepare Trip Load turned on after trip creation (if backend allows): section appears; if not allowed, toggle only on create per backend rules—UI follows server eligibility.
- Trip cancelled or archived: Trip Load read-only; actions hidden per backend terminal rules.
- Unknown unit or material label from backend: safe display fallback; no client-side unit conversion unless backend provides normalized totals.
- Concurrent edit (another user changes load items): refresh summary and table; show conflict message on failed mutation.
- Employee not assigned to trip but has company trip view: follow backend authorization—either view Trip Load or forbidden section message.
- Trip Load unavailable (API error or feature flag off): section-level error with retry; rest of trip detail remains usable.
- Permission denied on add/edit/remove: action hidden or disabled with safe messaging; no silent failure.
- Started trip with Trip Load never populated: read-only empty state; remaining views show zeros or dashes per backend payload.
- Validation warning while offline or stale remaining data: show last known warning with refresh prompt when data refetches.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: Create Trip MUST include a **Prepare Trip Load** toggle, default **OFF**, with helper text stating Trip Load is optional.
- **FR-002**: When Prepare Trip Load is OFF, Trip Detail MUST NOT show an active Trip Load section (section hidden or equivalent non-intrusive state).
- **FR-003**: When Prepare Trip Load is ON, Trip Detail MUST show a **Trip Load** section after the trip exists, including summary card and item list area.
- **FR-004**: Trip Load summary card MUST display **Total Loaded Items**, **Total Loaded Weight** (or backend-provided weight aggregate label), **Remaining Weight** (when provided), and **Last Updated** timestamp from authoritative server data.
- **FR-005**: Owners and managers on editable, pre-start trips MUST be able to **Add Item**, **Edit Item**, and **Remove Item** via actions on the Trip Load card or table.
- **FR-006**: Each Trip Load item MUST display **Material Name**, **Quantity**, **Unit**, and **Optional Notes** in a clean table on desktop/tablet and readable cards on mobile.
- **FR-007**: On **Started** trips (and other backend-defined read-only states), Trip Load MUST become **read-only** with add/edit/remove disabled or hidden.
- **FR-008**: For started/completed trips, each material MUST show **Loaded**, **Sold**, and **Remaining** quantities with units, sourced from the backend.
- **FR-009**: Remaining quantity presentation MUST support three visual indicator states: **Normal**, **Warning**, and **Exceeded**, mapped from backend-provided status or rules—never invented solely on the client.
- **FR-010**: Employees MUST be able to **view** Trip Load and remaining quantities on trips they are permitted to see; they MUST NOT edit Trip Load items.
- **FR-011**: Owners MUST have full Trip Load management access consistent with manager capabilities plus any owner-only trip permissions already established in Specification 007.
- **FR-012**: Transaction create/edit screens MUST remain **unchanged in layout and manual entry flow**; Trip Load MUST NOT auto-select materials or pre-fill line items from the load plan.
- **FR-013**: When backend Trip Load validation applies to a transaction, the UI MUST show **clear, non-blocking warnings** for cases such as remaining quantity lower than transaction quantity and material not on Trip Load.
- **FR-014**: Validation warnings MUST be dismissible or persist only while relevant (e.g., until quantity changes or user acknowledges) without blocking unrelated fields.
- **FR-015**: Trip Load section MUST implement skeleton loaders during fetch, guided empty states when no items, and section-level error states (unavailable, permission denied, not found).
- **FR-016**: Trip Load UI MUST reuse established Scrappy patterns: page sections, data tables, mobile cards, dialogs/sheets for add/edit, confirm dialog for remove, status badges for indicators, toasts for success/failure.
- **FR-017**: Trip Load layout MUST be extensible for future capabilities (barcode scanner, QR scanner, warehouse picking, weight scale, vehicle inventory, return loads) without redesigning the Trip Detail information architecture—e.g., reserved action area, modular item row, scanner entry point placeholder acceptable in v1 as hidden or “coming later” free of false affordances.
- **FR-018**: Trip Load MUST respect tenant isolation and permission gates consistent with Specification 007; backend 403/404 responses drive forbidden and not-found UX.
- **FR-019**: All Trip Load mutations MUST refresh summary and item/remaining views from server responses; optimistic UI is optional but MUST reconcile on error.
- **FR-020**: Out of scope for this specification: implementing scanners, scales, warehouse picking, return loads, or transaction form redesign.

### Backend Data Expectations _(UI consumes; contract defined elsewhere)_

The UI assumes the backend Trip Load addendum (Backend P006 extension) exposes, at minimum, the following **capabilities** the interface will display or trigger. This section names outcomes only—not endpoints, payloads, or implementation.

- **Trip Load enabled flag** on trip (Prepare Trip Load) for create and detail views.
- **Trip Load summary** aggregates: item count, loaded weight total, remaining weight, last updated.
- **Trip Load item list** with material name, quantity, unit, notes, identifiers for edit/remove.
- **Mutations** to add, update, and delete load items when trip is editable.
- **Per-material progress** on started/completed trips: loaded, sold, remaining, indicator state (normal/warning/exceeded).
- **Transaction validation hints** when manual transaction lines relate to Trip Load: warning codes/messages for insufficient remaining and unknown material.
- **Authorization** consistent with owner/manager edit and employee view rules.

### UI States _(mandatory — Constitution Principle XXII)_

- **Create Trip (Prepare Trip Load toggle)**: Loading — form skeleton includes toggle area; Success — toggle interactive with helper text; Error — form-level error does not lose toggle state.
- **Trip Detail — Trip Load hidden**: When Prepare Trip Load off — section absent; no empty placeholder that implies missing data.
- **Trip Detail — Trip Load editable**: Loading — section skeleton (summary + table rows); Empty — “No load items yet” with Add Item when permitted; Success — summary card + table + actions; Error — section error with retry, trip detail otherwise usable.
- **Trip Detail — Trip Load read-only (started/completed)**: Loading — skeleton; Empty — “No load items were defined”; Success — Loaded/Sold/Remaining table/cards with indicators; Error — section error with retry.
- **Add/Edit Item dialog/sheet**: Loading — disabled submit; Success — close dialog, refresh section, success feedback; Error — inline field errors and safe summary message.
- **Transaction validation warnings**: Loading — no premature warning; Success — warning banner/inline when backend supplies validation; Error — if validation service fails, omit warning or show generic “Could not verify against trip load” without blocking transaction unless backend requires.

### Responsive Behavior _(mandatory — Constitution Principle XXVII)_

- **Trip Detail — Trip Load (desktop 1280px+)**: Dedicated panel—summary card above full-width table; actions aligned top-right of section header; remaining-quantity columns visible without horizontal scroll when possible.
- **Trip Detail — Trip Load (tablet 768px+)**: Collapsible section with summary visible in header when collapsed; table converts to fewer columns or wrapped metric chips; add/edit via modal.
- **Trip Detail — Trip Load (mobile 320px+)**: Accordion section; one material per card showing Loaded/Sold/Remaining stacked; primary action as full-width button; swipe not required for core flows.
- **Create Trip toggle**: Mobile — toggle and helper text stack above submit; Desktop — toggle within trip planning section grouping.

### Page Layout _(mandatory — Constitution Principle XXXII)_

- **Create Trip**: Existing header and form sections unchanged; add **Prepare Trip Load** toggle in planning section before submit, with one-line optional helper copy.
- **Trip Detail**: Existing header (trip number, status, workflow actions) unchanged; insert **Trip Load** section after route/vehicle/members block and before linked transactions (or adjacent to transactions if product layout requires—must remain a distinct labeled section). Section header — “Trip Load”, summary metrics, Add Item when editable; Content — table or remaining-quantity view.
- **Transaction screens**: No new primary sections; validation warnings appear as **non-blocking** banner above items or inline near material/quantity fields only when trip context applies.

### Empty State Design _(mandatory — Constitution Principle XXXIV)_

- **Trip Load editable, no items**: Icon — package/crate; Message — “No items on this load yet”; Primary action — “Add item” for owners/managers; Guidance — “Trip Load is optional—add materials you expect to carry.”
- **Trip Load read-only, no items**: Icon — package; Message — “No trip load was defined”; Guidance — “Sales and remaining quantities will appear here once load items exist.”
- **Trip Load unavailable**: Icon — alert; Message — “Trip load unavailable”; Primary action — “Try again”; Guidance — contact admin if problem persists.
- **Permission denied (employee on hidden manage action)**: No empty CTA for add; view-only copy only.

### Production Quality Checklist _(mandatory — Constitution Principle XL)_

Trip Load UI must be responsive across 320px+, accessible (semantic section headings, table headers, keyboard-operable dialogs, sufficient contrast for Normal/Warning/Exceeded indicators in light and dark mode), with skeleton/empty/error coverage, mobile-friendly touch targets, and production-ready feedback—extending Specification 007 without architectural refactor.

### Validation Rules _(mandatory — Constitution Principle XXII)_

- **Prepare Trip Load**: boolean; no validation beyond create/edit eligibility.
- **Load item — Material Name**: required, trimmed, reasonable max length; inline error before submit.
- **Load item — Quantity**: required, positive number; inline error for zero/negative/non-numeric.
- **Load item — Unit**: required selection from allowed unit set provided by backend or established transaction units; invalid unit blocked at UX layer.
- **Load item — Notes**: optional, max length per backend/product limit.
- **Remove item**: confirm dialog to prevent accidental deletion.
- **Transaction warnings**: display-only; submission rules enforced by backend—frontend does not hardcode hard stops unless backend response requires blocking submit.

### Error Scenarios _(mandatory — Constitution Principle XXII)_

- **Trip Load fetch failure**: “Couldn’t load trip load” with retry; trip detail otherwise functional.
- **Add/edit/remove failure**: actionable message from backend; list and summary refresh to authoritative state.
- **Permission denied**: “You don’t have permission to manage trip load” for mutations; hide actions for unauthorized roles.
- **Trip not editable**: disable add/edit/remove with helper “Trip load can’t be changed after the trip has started.”
- **Validation warning on transaction**: plain-language warning; no raw error codes exposed to users.
- **Concurrent modification**: “Trip load was updated elsewhere” with refresh.

### Key Entities _(include if feature involves data)_

- **Trip Load (plan)**: Optional inventory plan attached to a trip when Prepare Trip Load is enabled; includes summary aggregates and a collection of load items while editable.
- **Trip Load Item**: A planned material line: material name, quantity, unit, optional notes; editable before trip start.
- **Trip Load Progress (per material)**: Loaded, sold, and remaining quantities with indicator state for started/completed trips.
- **Trip Load Validation Warning**: A non-blocking user-facing message when manual transaction entry diverges from load plan or remaining quantity; sourced from backend validation.
- **Prepare Trip Load Setting**: Boolean choice at trip creation (default off) that controls visibility and availability of Trip Load for that trip.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: An owner or manager can enable Prepare Trip Load, create a trip, and add at least three load items with material, quantity, and unit in under 3 minutes without training.
- **SC-002**: 100% of users who leave Prepare Trip Load OFF see no Trip Load section on trip detail (zero false prompts to “complete” trip load).
- **SC-003**: On started trips with load data, users can identify Loaded, Sold, and Remaining for any material in under 10 seconds per material row at mobile width.
- **SC-004**: At least 95% of Trip Load add/edit/remove attempts either succeed with updated summary or fail with an actionable message without stale totals on screen.
- **SC-005**: Transaction forms retain the same field order and manual entry flow as before Trip Load; 100% of auto-fill-from-load behaviors remain absent in acceptance testing.
- **SC-006**: When backend reports exceeded remaining, users recognize Exceeded state without reading helper docs (validated by task-based usability check: correct identification in under 5 seconds).
- **SC-007**: Trip Load section achieves readable layout without horizontal scrolling on viewports 375px wide for remaining-quantity cards.

## Future Considerations

Design Trip Load so these capabilities can ship later **without redesigning Trip Detail**:

- **Barcode Scanner** — primary action slot adjacent to Add Item; scan populates material field.
- **QR Code Scanner** — same entry slot; QR resolves to material or load line reference.
- **Warehouse Picking** — item rows link to pick status column; summary adds picked vs loaded.
- **Weight Scale Integration** — quantity field accepts live weight reading with source label.
- **Vehicle Inventory** — summary card cross-links to vehicle stock view.
- **Return Loads** — additional tab or sub-section under Trip Load for return quantities vs outbound load.

v1 SHOULD keep section hierarchy, summary card + line list pattern, and action toolbar location stable to absorb these extensions.

## Assumptions

- Specification 007 (Trip Management) is implemented; this addendum extends Create Trip and Trip Detail only.
- Backend Trip Load feature is specified and will provide enabled flag, items CRUD, aggregates, sold/remaining calculations, indicator states, and transaction validation messages.
- “Sold” quantities derive from trip-linked transaction activity per backend rules; the frontend displays backend totals only.
- Weight totals use backend normalization when units differ; the UI does not convert units client-side unless the backend provides converted values.
- Prepare Trip Load is set at create time by default; if backend later allows toggling on edit, the UI will follow server eligibility without a separate spec amendment.
- Validation warnings on transactions are advisory unless the backend returns a hard validation error; blocking behavior follows server responses.
- Indicator thresholds (warning vs exceeded) are defined by the backend; the UI maps statuses to visual treatment.
- Assigned employees see Trip Load on trips they can open per existing trip member access rules.
