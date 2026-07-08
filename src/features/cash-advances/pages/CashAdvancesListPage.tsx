import type { ColumnDef } from '@tanstack/react-table'
import { Plus, Wallet } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router'

import { DataTable } from '@/components/common/DataTable'
import { FilterBar } from '@/components/common/FilterBar'
import { PageContainer } from '@/components/common/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { Pagination } from '@/components/common/Pagination'
import { StatusBadge } from '@/components/common/StatusBadge'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { PERMISSIONS } from '@/constants/permissions'
import { buildRoute, ROUTES } from '@/constants/routes'
import { PermissionGate } from '@/features/authorization/components/PermissionGate'
import { useFormatRecordEmployee } from '@/features/employees/hooks/useFormatRecordEmployee'
import { useListQuery } from '@/hooks/useListQuery'
import { formatDate } from '@/utils/format-date'

import { cashAdvanceStatusLabel, cashAdvanceStatusTone } from '../lib/cash-advance-status'
import { useCashAdvances } from '../hooks/useCashAdvances'
import type { CashAdvance } from '../types/cash-advance.types'

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount)
}

export default function CashAdvancesListPage() {
  const navigate = useNavigate()
  const formatEmployee = useFormatRecordEmployee()
  const { params, setSearch, setPage, setSort, setFilter } = useListQuery({
    defaultSort: { field: 'createdAt', direction: 'desc' },
  })
  const cashAdvancesQuery = useCashAdvances(params)

  useEffect(() => {
    document.title = 'Cash Advances | Scrappy'
  }, [])

  const columns = useMemo<ColumnDef<CashAdvance>[]>(
    () => [
      {
        id: 'employeeId',
        header: 'Employee',
        enableSorting: false,
        cell: ({ row }) => <span className="font-medium">{formatEmployee(row.original)}</span>,
      },
      {
        id: 'amount',
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({ row }) => formatCurrency(row.original.amount),
      },
      {
        id: 'remainingAmount',
        accessorKey: 'remainingAmount',
        header: 'Remaining',
        cell: ({ row }) => formatCurrency(row.original.remainingAmount),
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <StatusBadge
            label={cashAdvanceStatusLabel(row.original.status)}
            tone={cashAdvanceStatusTone(row.original.status)}
          />
        ),
      },
      {
        id: 'createdAt',
        accessorKey: 'createdAt',
        header: 'Created',
        cell: ({ row }) => formatDate(row.original.createdAt),
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                void navigate(buildRoute.cashAdvanceDetail(row.original.id))
              }}
            >
              View
            </Button>
          </div>
        ),
      },
    ],
    [formatEmployee, navigate],
  )

  const data = cashAdvancesQuery.data
  const hasFilters = Boolean(params.search ?? params.filters?.status)
  const hasNoResults = data && data.total === 0 && !hasFilters

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Cash Advances"
          description="Issue and track employee cash advances."
          actions={
            <PermissionGate permission={PERMISSIONS.cashAdvance.create}>
              <Button
                type="button"
                onClick={() => {
                  void navigate(ROUTES.cashAdvanceNew)
                }}
              >
                <Plus className="size-4" />
                Issue cash advance
              </Button>
            </PermissionGate>
          }
        />

        {cashAdvancesQuery.isError ? (
          <ErrorState description="We couldn't load cash advances. Please try again." />
        ) : hasNoResults ? (
          <EmptyState
            icon={Wallet}
            title="No cash advances yet"
            description="Issue a cash advance to an employee to begin tracking balances."
            action={
              <PermissionGate permission={PERMISSIONS.cashAdvance.create}>
                <Button
                  type="button"
                  onClick={() => {
                    void navigate(ROUTES.cashAdvanceNew)
                  }}
                >
                  <Plus className="size-4" />
                  Issue cash advance
                </Button>
              </PermissionGate>
            }
          />
        ) : (
          <div className="space-y-4">
            <FilterBar
              search={params.search ?? ''}
              onSearchChange={setSearch}
              searchPlaceholder="Search cash advances…"
            >
              <Select
                aria-label="Filter by status"
                value={params.filters?.status ?? ''}
                onChange={(event) => {
                  setFilter('status', event.target.value || undefined)
                }}
                className="w-40"
              >
                <option value="">All statuses</option>
                <option value="OUTSTANDING">Outstanding</option>
                <option value="SETTLED">Settled</option>
              </Select>
            </FilterBar>

            <DataTable
              columns={columns}
              data={data?.data ?? []}
              isLoading={cashAdvancesQuery.isLoading}
              emptyMessage="No cash advances match your filters."
              sort={params.sort}
              onSortChange={setSort}
              getRowId={(row) => row.id}
              renderMobileCard={(cashAdvance) => (
                <Card className="gap-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{formatEmployee(cashAdvance)}</p>
                      <p className="text-muted-foreground text-sm">
                        {formatCurrency(cashAdvance.amount)}
                      </p>
                    </div>
                    <StatusBadge
                      label={cashAdvanceStatusLabel(cashAdvance.status)}
                      tone={cashAdvanceStatusTone(cashAdvance.status)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      void navigate(buildRoute.cashAdvanceDetail(cashAdvance.id))
                    }}
                  >
                    View
                  </Button>
                </Card>
              )}
              footer={
                data ? (
                  <Pagination
                    page={data.page}
                    pageSize={data.pageSize}
                    total={data.total}
                    onPageChange={setPage}
                  />
                ) : null
              }
            />
          </div>
        )}
      </div>
    </PageContainer>
  )
}
