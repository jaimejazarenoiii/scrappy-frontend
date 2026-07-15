import type { ColumnDef } from '@tanstack/react-table'
import { Pencil, Plus, Receipt } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router'

import { DataTable } from '@/components/common/DataTable'
import { FilterBar } from '@/components/common/FilterBar'
import { PageContainer } from '@/components/common/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { Pagination } from '@/components/common/Pagination'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { PERMISSIONS } from '@/constants/permissions'
import { buildRoute, ROUTES } from '@/constants/routes'
import { PermissionGate } from '@/features/authorization/components/PermissionGate'
import { useListQuery } from '@/hooks/useListQuery'
import { useAuthStore } from '@/store/auth.store'
import { formatCurrency } from '@/utils/format-currency'
import { formatDate } from '@/utils/format-date'

import { ExpenseStatusBadge } from '../components/ExpenseStatusBadge'
import { expenseReferenceTypeLabel, EXPENSE_REFERENCE_TYPE_OPTIONS } from '../lib/expense-reference'
import {
  expenseStatusLabel,
  EXPENSE_STATUS_OPTIONS,
  isEditableExpenseStatus,
} from '../lib/expense-status'
import { useExpenseCategories } from '../hooks/useExpenseCategories'
import { useExpenseDashboard, useExpenses } from '../hooks/useExpenses'
import { useExpenseListStore } from '../hooks/useExpenseListStore'
import type { ExpenseSummary } from '../types/expense.types'

function expenseTitle(expense: ExpenseSummary): string {
  return expense.expenseNumber ?? expense.description
}

export default function ExpensesListPage() {
  const navigate = useNavigate()
  const role = useAuthStore((state) => state.currentUser?.role)
  const { includeArchived, setIncludeArchived } = useExpenseListStore()
  const { params, setSearch, setPage, setSort, setFilter } = useListQuery({
    defaultSort: { field: 'expenseDate', direction: 'desc' },
  })

  const listParams = useMemo(
    () => ({
      ...params,
      filters: {
        ...params.filters,
        ...(includeArchived ? { includeArchived: 'true' } : {}),
      },
    }),
    [params, includeArchived],
  )

  const expensesQuery = useExpenses(listParams)
  const dashboardQuery = useExpenseDashboard()
  const categoriesQuery = useExpenseCategories()

  useEffect(() => {
    document.title = 'Expenses | Scrappy'
  }, [])

  const columns = useMemo<ColumnDef<ExpenseSummary>[]>(
    () => [
      {
        id: 'expense',
        header: 'Expense',
        enableSorting: false,
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{expenseTitle(row.original)}</p>
            <p className="text-muted-foreground text-sm">{row.original.description}</p>
          </div>
        ),
      },
      {
        id: 'category',
        header: 'Category',
        enableSorting: false,
        cell: ({ row }) => row.original.category ?? '—',
      },
      {
        id: 'referenceType',
        header: 'Reference',
        enableSorting: false,
        cell: ({ row }) => (
          <div>
            <p className="text-sm">{expenseReferenceTypeLabel(row.original.referenceType)}</p>
            <p className="text-muted-foreground text-sm">{row.original.referenceLabel ?? '—'}</p>
          </div>
        ),
      },
      {
        id: 'amount',
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({ row }) => formatCurrency(row.original.amount),
      },
      {
        id: 'expenseDate',
        accessorKey: 'expenseDate',
        header: 'Date',
        cell: ({ row }) => formatDate(row.original.expenseDate),
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <ExpenseStatusBadge status={row.original.status} />,
      },
      {
        id: 'receiptCount',
        header: 'Receipts',
        enableSorting: false,
        cell: ({ row }) => <span className="tabular-nums">{row.original.receiptCount ?? 0}</span>,
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-end gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                void navigate(buildRoute.expenseDetail(row.original.id))
              }}
            >
              View
            </Button>
            <PermissionGate permission={PERMISSIONS.expenses.update}>
              {isEditableExpenseStatus(row.original.status, role) ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Edit ${expenseTitle(row.original)}`}
                  onClick={() => {
                    void navigate(buildRoute.expenseEdit(row.original.id))
                  }}
                >
                  <Pencil className="size-4" />
                </Button>
              ) : null}
            </PermissionGate>
          </div>
        ),
      },
    ],
    [navigate, role],
  )

  const data = expensesQuery.data
  const hasFilters = Boolean(
    params.search ??
    params.filters?.category ??
    params.filters?.referenceType ??
    params.filters?.status ??
    params.filters?.fromDate ??
    params.filters?.toDate ??
    includeArchived,
  )
  const hasNoResults = data && data.total === 0 && !hasFilters
  const dashboard = dashboardQuery.data

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Expenses"
          description="Record and review operational expenses."
          actions={
            <PermissionGate permission={PERMISSIONS.expenses.create}>
              <Button
                type="button"
                onClick={() => {
                  void navigate(ROUTES.expensesNew)
                }}
              >
                <Plus className="size-4" />
                New expense
              </Button>
            </PermissionGate>
          }
        />

        {dashboardQuery.isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-20 rounded-lg" />
            ))}
          </div>
        ) : dashboard ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dashboard.totalAmount != null ? (
              <Card className="p-4">
                <p className="text-muted-foreground text-sm">Total amount</p>
                <p className="text-2xl font-semibold tabular-nums">
                  {formatCurrency(dashboard.totalAmount)}
                </p>
              </Card>
            ) : null}
            {dashboard.expenseCount != null ? (
              <Card className="p-4">
                <p className="text-muted-foreground text-sm">Expense count</p>
                <p className="text-2xl font-semibold tabular-nums">{dashboard.expenseCount}</p>
              </Card>
            ) : null}
          </div>
        ) : null}

        {expensesQuery.isError ? (
          <div className="space-y-4">
            <ErrorState description="We couldn't load expenses. Please try again." />
            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  void expensesQuery.refetch()
                }}
              >
                Retry
              </Button>
            </div>
          </div>
        ) : hasNoResults ? (
          <EmptyState
            icon={Receipt}
            title="No expenses yet"
            description="Record your first expense to start tracking operational spend."
            action={
              <PermissionGate permission={PERMISSIONS.expenses.create}>
                <Button
                  type="button"
                  onClick={() => {
                    void navigate(ROUTES.expensesNew)
                  }}
                >
                  <Plus className="size-4" />
                  New expense
                </Button>
              </PermissionGate>
            }
          />
        ) : (
          <div className="space-y-4">
            <FilterBar
              search={params.search ?? ''}
              onSearchChange={setSearch}
              searchPlaceholder="Search by description or expense number…"
            >
              <Select
                aria-label="Filter by category"
                value={params.filters?.category ?? ''}
                onChange={(event) => {
                  const value = event.target.value
                  setFilter('category', value ? value : undefined)
                }}
                className="w-44"
              >
                <option value="">All categories</option>
                {(categoriesQuery.data ?? []).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>

              <Select
                aria-label="Filter by reference type"
                value={params.filters?.referenceType ?? ''}
                onChange={(event) => {
                  const value = event.target.value
                  setFilter('referenceType', value ? value : undefined)
                }}
                className="w-44"
              >
                <option value="">All references</option>
                {EXPENSE_REFERENCE_TYPE_OPTIONS.map((type) => (
                  <option key={type} value={type}>
                    {expenseReferenceTypeLabel(type)}
                  </option>
                ))}
              </Select>

              <Select
                aria-label="Filter by status"
                value={params.filters?.status ?? ''}
                onChange={(event) => {
                  const value = event.target.value
                  setFilter('status', value ? value : undefined)
                }}
                className="w-40"
              >
                <option value="">All statuses</option>
                {EXPENSE_STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {expenseStatusLabel(status)}
                  </option>
                ))}
              </Select>

              <div className="flex items-center gap-2">
                <input
                  id="includeArchived"
                  type="checkbox"
                  checked={includeArchived}
                  className="size-4 rounded border"
                  onChange={(event) => {
                    setIncludeArchived(event.target.checked)
                  }}
                />
                <Label htmlFor="includeArchived" className="text-sm">
                  Include archived
                </Label>
              </div>
            </FilterBar>

            <Card className="min-w-0 gap-0 overflow-hidden py-0">
              <DataTable
                columns={columns}
                data={data?.data ?? []}
                isLoading={expensesQuery.isLoading}
                sort={params.sort}
                onSortChange={setSort}
                getRowId={(row) => row.id}
                renderMobileCard={(expense) => (
                  <div className="space-y-3 border-b p-4 last:border-b-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-medium">{expenseTitle(expense)}</p>
                        <p className="text-muted-foreground line-clamp-2 text-sm">
                          {expense.description}
                        </p>
                        <p className="text-muted-foreground mt-1 text-sm">
                          {formatDate(expense.expenseDate)}
                          {expense.category ? ` · ${expense.category}` : ''}
                        </p>
                      </div>
                      <ExpenseStatusBadge status={expense.status} />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium tabular-nums">
                        {formatCurrency(expense.amount)}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        {expenseReferenceTypeLabel(expense.referenceType)}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          void navigate(buildRoute.expenseDetail(expense.id))
                        }}
                      >
                        View
                      </Button>
                      <PermissionGate permission={PERMISSIONS.expenses.update}>
                        {isEditableExpenseStatus(expense.status, role) ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              void navigate(buildRoute.expenseEdit(expense.id))
                            }}
                          >
                            Edit
                          </Button>
                        ) : null}
                      </PermissionGate>
                    </div>
                  </div>
                )}
              />
            </Card>

            {data?.total === 0 && hasFilters ? (
              <EmptyState
                icon={Receipt}
                title="No expenses match your filters"
                description="Try adjusting search or filters to find expenses."
              />
            ) : null}

            {(data?.total ?? 0) > 0 ? (
              <Pagination
                page={params.page}
                pageSize={params.pageSize}
                total={data?.total ?? 0}
                onPageChange={setPage}
              />
            ) : null}
          </div>
        )}
      </div>
    </PageContainer>
  )
}
