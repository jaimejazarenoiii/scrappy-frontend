# Quickstart: Analytics (Spec 009)

Validation guide for Backend P008 integration. Assumes backend running with analytics endpoints enabled.

## Prerequisites

- Node 20+, pnpm
- `.env` with `VITE_API_BASE_URL` pointing to backend with P008
- Owner or Manager test account (Employee must **not** see Analytics)
- Completed Specs 001–008 in frontend branch

## Setup

```bash
pnpm install
pnpm dev
```

After implementation, install chart dependency:

```bash
pnpm add recharts
```

## Build verification

```bash
pnpm typecheck
pnpm lint
pnpm build
```

## Scenario 1 — Navigation & authorization

1. Log in as **Owner** or **Manager**
2. Confirm **Analytics** appears in sidebar
3. Navigate to `/analytics` → redirects to `/analytics/dashboard`
4. Log in as **Employee**
5. Confirm Analytics nav hidden; visit `/analytics/dashboard` → forbidden state

**Expected**: Permission-driven visibility only; no hardcoded role checks in page source.

## Scenario 2 — Company KPI overview

1. Open Analytics dashboard (Overview tab)
2. Default period: **This month**
3. Confirm KPI cards show values from network tab: `GET /api/v1/analytics/company`
4. Change period to **Today** → new request with `period=TODAY`
5. Confirm **Last updated** shows `generatedAt` from response

**Expected**: No client-side summation; values match API `data` fields exactly.

## Scenario 3 — Custom date range

1. Select **Custom** period
2. Set `from` / `to` within 366 days
3. Apply filters → `period=CUSTOM&from=...&to=...`
4. Set range > 366 days → inline validation error; no request sent

**Expected**: 400 avoided for invalid range on client.

## Scenario 4 — Entity filters

1. Select a **Branch** from filter bar
2. Confirm all active tab queries include `branchId=...`
3. Clear branch → param omitted
4. Repeat for warehouse, vehicle, employee when pickers available

**Expected**: Shared filter state drives every analytics hook.

## Scenario 5 — Transactions tab

1. Switch to **Transactions** tab
2. Verify `GET /analytics/transactions` loads
3. Top materials chart/table matches `topMaterials` array order and amounts
4. If `timeSeries` present, line chart renders; if absent, chart area shows empty state

**Expected**: Chart displays API values only.

## Scenario 6 — Expenses tab

1. Switch to **Expenses** tab
2. Verify `GET /analytics/expenses`
3. Category breakdown pie/donut uses `byCategory` with string `category` keys (e.g. "Fuel")
4. Totals match `totalAmount` / `expenseCount`

**Expected**: No aggregation from `GET /expenses` list.

## Scenario 7 — Workforce & payroll summary

1. Switch to **Workforce** tab
2. Verify `GET /analytics/workforce`
3. Payroll KPIs from `payrollSummary` object
4. Employee activity table from `employeeActivity` array

**Expected**: No payroll math on frontend.

## Scenario 8 — Trips & vehicle utilization

1. Switch to **Trips** tab
2. Verify `GET /analytics/trips`
3. Status distribution chart from `statusDistribution`
4. Vehicle utilization table from `vehicleUtilization`

## Scenario 9 — Branch performance

1. Switch to **Organization** tab
2. Verify `GET /analytics/organization`
3. Branch and warehouse tables match `branchPerformance` / `warehousePerformance`

## Scenario 10 — Refresh & loading states

1. Click **Refresh** → all visible queries `refetch`
2. During load: skeleton placeholders on KPI cards and charts
3. Simulate API error (stop backend) → section error state with retry
4. Toggle auto-refresh (if implemented) → periodic refetch only when enabled

## Scenario 11 — Responsive & theme

1. Resize viewport: mobile, tablet, desktop
2. KPI grid stacks on narrow screens
3. Toggle light/dark mode — charts and cards use design tokens
4. Keyboard: tab through filters, refresh button, chart legend

## Scenario 12 — Spec 010 boundary

1. Search codebase for `/reports/` in analytics feature → **no matches**
2. Confirm no export/download buttons on analytics pages

## References

- [API contracts](./contracts/api-endpoints.md)
- [Routes & guards](./contracts/routes-and-guards.md)
- [Data model](./data-model.md)
- [Feature spec](./spec.md)
