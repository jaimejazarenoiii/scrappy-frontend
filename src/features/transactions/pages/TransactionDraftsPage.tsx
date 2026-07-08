import type { ColumnDef } from '@tanstack/react-table'
import { Edit3 } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router'

import { DataTable } from '@/components/common/DataTable'
import { FilterBar } from '@/components/common/FilterBar'
import { PageContainer } from '@/components/common/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { Pagination } from '@/components/common/Pagination'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { PERMISSIONS } from '@/constants/permissions'
import { buildRoute } from '@/constants/routes'
import { PermissionGate } from '@/features/authorization/components/PermissionGate'
import { TransactionDirectionBadge } from '../components/TransactionDirectionBadge'
import { TransactionStatusBadge } from '../components/TransactionStatusBadge'
import { useTransactions } from '../hooks/useTransactions'
import { useListQuery } from '@/hooks/useListQuery'
import { formatDate } from '@/utils/format-date'
import type { Direction, TransactionSummary } from '../types/transaction.types'

function directionOptionLabel(direction: Direction): string {
  return direction === 'INBOUND' ? 'Inbound' : 'Outbound'
}

export default function TransactionDraftsPage() {
  const navigate = useNavigate()
  const { params, setSearch, setPage, setSort, setFilter } = useListQuery({
    defaultSort: { field: 'transactionDate', direction: 'desc' },
  })

  const transactionsQuery = useTransactions(params)

  useEffect(() => {
    document.title = 'Draft Transactions | Scrappy'

    // Force list to backend drafts only.
    setFilter('status', 'DRAFT')
  }, [setFilter])

  const columns = useMemo<ColumnDef<TransactionSummary>[]>(
    () => [
      {
        id: 'direction',
        header: 'Type',
        enableSorting: false,
        cell: ({ row }) => <TransactionDirectionBadge direction={row.original.direction} />,
      },
      {
        id: 'partyName',
        header: 'Party',
        enableSorting: false,
        cell: ({ row }) => <span className="font-medium">{row.original.partyName}</span>,
      },
      {
        id: 'status',
        header: 'Status',
        enableSorting: false,
        cell: ({ row }) => <TransactionStatusBadge status={row.original.status} />,
      },
      {
        id: 'transactionDate',
        accessorKey: 'transactionDate',
        header: 'Date',
        cell: ({ row }) => formatDate(row.original.transactionDate),
      },
      {
        id: 'itemCount',
        accessorKey: 'itemCount',
        header: 'Items',
        enableSorting: false,
        cell: ({ row }) => <span className="font-medium">{row.original.itemCount}</span>,
      },
      {
        id: 'assignedEmployees',
        header: 'Employees',
        enableSorting: false,
        cell: ({ row }) => (
          <span className="font-medium">{row.original.assignedEmployeeIds.length}</span>
        ),
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <PermissionGate permission={PERMISSIONS.transactions.update}>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  void navigate(buildRoute.transactionEdit(row.original.id))
                }}
              >
                <Edit3 className="size-4" />
                Continue
              </Button>
            </PermissionGate>
          </div>
        ),
      },
    ],
    [navigate],
  )

  const data = transactionsQuery.data
  const hasFilters = Boolean(params.search ?? params.filters?.direction)
  const hasNoResults = data && data.total === 0 && !hasFilters

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader title="Draft transactions" description="Resume and continue draft editing." />

        {transactionsQuery.isError ? (
          <ErrorState description="We couldn't load draft transactions. Please try again." />
        ) : hasNoResults ? (
          <EmptyState
            title="No drafts found"
            description="Create a new draft transaction to begin."
          />
        ) : (
          <div className="space-y-4">
            <FilterBar
              search={params.search ?? ''}
              onSearchChange={setSearch}
              searchPlaceholder="Search drafts…"
            >
              <Select
                aria-label="Filter by direction"
                value={params.filters?.direction ?? ''}
                onChange={(event) => {
                  const value = event.target.value
                  setFilter('direction', value ? value : undefined)
                }}
                className="w-44"
              >
                <option value="">All types</option>
                <option value="INBOUND">{directionOptionLabel('INBOUND')}</option>
                <option value="OUTBOUND">{directionOptionLabel('OUTBOUND')}</option>
              </Select>
            </FilterBar>

            <DataTable
              columns={columns}
              data={data?.data ?? []}
              isLoading={transactionsQuery.isLoading}
              emptyMessage="No draft transactions match your filters."
              sort={params.sort}
              onSortChange={setSort}
              getRowId={(row) => row.id}
              renderMobileCard={(transaction) => (
                <Card className="gap-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{transaction.partyName}</p>
                      <p className="text-muted-foreground text-sm">
                        {formatDate(transaction.transactionDate)}
                      </p>
                    </div>
                    <TransactionStatusBadge status={transaction.status} />
                  </div>
                  <div className="flex items-center justify-between">
                    <TransactionDirectionBadge direction={transaction.direction} />
                    <span className="text-muted-foreground text-sm">
                      {transaction.itemCount} items
                    </span>
                  </div>

                  <PermissionGate permission={PERMISSIONS.transactions.update}>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        void navigate(buildRoute.transactionEdit(transaction.id))
                      }}
                    >
                      <Edit3 className="size-4" />
                      Continue
                    </Button>
                  </PermissionGate>
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
