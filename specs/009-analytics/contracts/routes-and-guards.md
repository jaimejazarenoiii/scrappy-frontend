# Routes and Guards: Analytics (Spec 009)

Maps to Backend P008. New top-level **Analytics** navigation item.

## Protected Routes

### Analytics index (redirect)

- **Route**: `/analytics`
- **Guard**: `PermissionGuard` with `PERMISSIONS.analytics.view`
- **Behavior**: `Navigate` to `/analytics/dashboard` (replace)
- **Lazy**: N/A (inline redirect in route config)

### Analytics dashboard hub

- **Route**: `/analytics/dashboard`
- **Guard**: `PermissionGuard` with `PERMISSIONS.analytics.view`
- **Lazy**: `AnalyticsDashboardPage`
- **Layout**: Nested under app shell (existing `AppLayout`)
- **Notes**: Tabbed sections — Overview, Transactions, Expenses, Workforce, Trips, Organization; shared filter bar + refresh
- **Breadcrumb**: Analytics → Dashboard

## Action Visibility Matrix

Analytics is **read-only**. No create/update/delete actions.

| Capability          | Min permission         | Notes                                    |
| ------------------- | ---------------------- | ---------------------------------------- |
| View analytics hub  | `analytics.view`       | Owner, Manager                           |
| Refresh data        | `analytics.view`       | Manual refetch                           |
| Apply filters       | `analytics.view`       | Sends query params only                  |
| Deep link to entity | target module `*.view` | e.g. branch detail from ranking row link |

Employee role: no `analytics.view` → nav hidden, direct URL → forbidden view.

## Navigation

Add to `src/constants/navigation.ts`:

```typescript
{
  label: 'Analytics',
  href: ROUTES.analyticsDashboard,
  icon: BarChart3, // Lucide
  anyOf: [PERMISSIONS.analytics.view],
}
```

Position after Expenses, before Settings (or per existing nav order convention).

## Route constants (`routes.ts`)

```typescript
analytics: '/analytics',
analyticsDashboard: '/analytics/dashboard',
```

## Breadcrumbs

| Segment     | Label source |
| ----------- | ------------ |
| `analytics` | "Analytics"  |
| `dashboard` | "Dashboard"  |

Extend `useBreadcrumbTrail` and `lib/breadcrumb.ts` additively.

## Lazy loading

```typescript
const AnalyticsDashboardPage = lazy(
  () => import('@/features/analytics/pages/AnalyticsDashboardPage'),
)
```

Register in `src/app/router/routes.tsx` with `Suspense` fallback consistent with Trips/Expenses modules.

## Deep linking

- `/analytics/dashboard` loads with default filters from Zustand init (or `THIS_MONTH`)
- Optional `?tab=transactions` for active tab — sync to `AnalyticsPreferencesStore` on mount
- Unauthorized `/analytics/*` → `PermissionGuard` forbidden with link to home or first permitted module

## Router pattern

- React Router Data Router (existing `createBrowserRouter`)
- Nested layout: parent authenticated layout → analytics child routes
- Browser history + deep linking preserved

## Cross-module links (outbound)

Ranking tables may link to:

| Entity    | Route builder                       |
| --------- | ----------------------------------- |
| Branch    | `buildRoute.branchDetail(id)`       |
| Warehouse | `buildRoute.warehouseDetail(id)`    |
| Employee  | workforce employee detail if routed |
| Vehicle   | vehicle detail if routed            |
| Trip      | `buildRoute.tripDetail(id)`         |

Links gated by target module view permission; hide link when forbidden.

## Spec 010 boundary

Do not add `/reports` or `/activity-logs` routes in this spec.
