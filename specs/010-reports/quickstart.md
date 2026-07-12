# Quickstart: Reports (Spec 010)

Validation guide for Backend P009 integration.

## Prerequisites

- Node 20+, pnpm
- `.env` with `VITE_API_BASE_URL` pointing to backend with P009
- Owner or Manager test account (Employee must **not** see Reports)
- Specs 001–009 present in branch

## Setup

```bash
pnpm install
pnpm dev
```

## Build verification

```bash
pnpm typecheck
pnpm lint
pnpm build
```

## Scenario 1 — Navigation & authorization

1. Log in as Owner/Manager → **Reports** in sidebar
2. Open `/reports` → category links visible
3. Open `/reports/expenses` via card or URL
4. Log in as Employee → Reports nav hidden; `/reports` → forbidden

## Scenario 2 — Required date range & list

1. Open any domain report
2. Default range = current month
3. Network: `GET /api/v1/reports/{domain}?from=...&to=...&page=1`
4. Clear `from` → validation blocks request
5. Set span > 366 days → inline error, no request

## Scenario 3 — Filters, search, pagination

1. Apply branch (and other supported) filters → params present
2. Search (≥2 chars if required) → `search=` on request
3. Change page → `page=` updates; rows match response
4. Empty filters → empty state, not error

## Scenario 4 — Transaction & trip reports

1. `/reports/transactions` — rows/summary match API; inbound/outbound columns if present
2. `/reports/trips` — status/utilization fields from API only

## Scenario 5 — Expense, payroll, attendance

1. `/reports/expenses` — uses Reports service (not Expenses CRUD list)
2. `/reports/payroll` and `/reports/attendance` — summaries/rows from API only

## Scenario 6 — Export

1. Choose CSV (or Excel) → backend export/blob request with active filters
2. Busy/progress feedback → file download + success toast
3. Unsupported PDF → not offered
4. Force failure → error toast; table remains

## Scenario 7 — Print

1. With data loaded, Print → print-friendly layout
2. Cancel print → on-screen state unchanged

## Scenario 8 — Spec boundaries

1. No Activity Logs UI under reports feature
2. No client-built CSV from table scraping
3. No `/analytics` calls from reports pages

## References

- [API contracts](./contracts/api-endpoints.md)
- [Routes & guards](./contracts/routes-and-guards.md)
- [Data model](./data-model.md)
- [Feature spec](./spec.md)
