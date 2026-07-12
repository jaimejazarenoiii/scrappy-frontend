# Routes and Guards: Expense Management (Spec 008)

Maps to Backend P007. New top-level **Expenses** navigation item.

## Protected Routes

### Expenses dashboard / list

- **Route**: `/expenses`
- **Guard**: `PermissionGuard` with `PERMISSIONS.expenses.view`
- **Lazy**: `ExpensesDashboardPage` (wraps list + optional summary)
- **Notes**: Search, filter (category, reference type, status, dates), sort, pagination; primary CTA “New expense” when `expenses.create`

### Create expense

- **Route**: `/expenses/new`
- **Guard**: `PermissionGuard` with `PERMISSIONS.expenses.create`
- **Lazy**: `ExpenseCreatePage`
- **Breadcrumb**: Expenses → New expense

### Expense detail

- **Route**: `/expenses/:id`
- **Guard**: `PermissionGuard` with `PERMISSIONS.expenses.view`
- **Lazy**: `ExpenseDetailPage`
- **Notes**: Reference summary, receipt gallery, edit/delete/archive actions when permitted
- **Breadcrumb**: Expenses → {expenseNumber or description}

### Edit expense

- **Route**: `/expenses/:id/edit`
- **Guard**: `PermissionGuard` with `PERMISSIONS.expenses.update`
- **Lazy**: `ExpenseEditPage`
- **Gate**: Route entry and Edit button only when backend allows edit (typically `ACTIVE` status)
- **Breadcrumb**: Expenses → {expense} → Edit

## Action Visibility Matrix (PermissionGate + status hints)

Backend 403 is authoritative when client gating is optimistic.

| Action                  | Min permission (proposed) | Status hint (display only) |
| ----------------------- | ------------------------- | -------------------------- |
| New expense             | `expenses.create`         | —                          |
| Edit expense            | `expenses.update`         | `ACTIVE` (confirm via API) |
| Upload / remove receipt | `expenses.update`         | editable status per API    |
| Archive                 | `expenses.archive`        | non-archived per API       |
| Delete                  | `expenses.delete`         | per API rules              |
| View reference link     | target module `*.view`    | —                          |

## Navigation

Add to `navigation.ts`:

```typescript
{
  label: 'Expenses',
  href: ROUTES.expenses,
  icon: Receipt, // or Wallet — Lucide
  anyOf: [PERMISSIONS.expenses.view],
}
```

Position after Trips, before future Analytics entry (when Spec 009 ships).

## Route constants (`routes.ts`)

```typescript
expenses: '/expenses',
expensesNew: '/expenses/new',
expenseDetail: (id: string) => `/expenses/${id}`,
expenseEdit: (id: string) => `/expenses/${id}/edit`,
```

## Breadcrumbs

| Segment    | Label source                                                 |
| ---------- | ------------------------------------------------------------ |
| `expenses` | “Expenses”                                                   |
| `new`      | “New expense”                                                |
| `:id`      | `expenseNumber` or truncated `description` from detail query |
| `edit`     | “Edit”                                                       |

Extend `useBreadcrumbTrail` and `lib/breadcrumb.ts` additively.

## Lazy loading

All expense pages imported via `React.lazy` in `routes.tsx` with `Suspense` fallback matching existing modules.

## Deep linking

- `/expenses/:id` must load detail from `useExpense(id)` even when opened from trip or branch context
- `/expenses/:id/edit` redirects or shows ineligible state when expense not editable
- Unauthorized deep link → `PermissionGuard` forbidden view with link back to `/expenses` or home

## Cross-module links (inbound)

- Trip detail may link to filtered expenses by `referenceType=TRIP&referenceId={tripId}` when Spec 008 ships (optional polish — not blocking)
- Transaction module unchanged; no expense UI embedded in transactions
