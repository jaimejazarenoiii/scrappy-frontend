import type { ColumnDef } from '@tanstack/react-table'
import { Banknote } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { PERMISSIONS } from '@/constants/permissions'
import { buildRoute } from '@/constants/routes'
import { PermissionGate } from '@/features/authorization/components/PermissionGate'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { useFormatRecordEmployee } from '@/features/employees/hooks/useFormatRecordEmployee'
import { useListQuery } from '@/hooks/useListQuery'
import { formatDate } from '@/utils/format-date'

import { payrollStatusLabel, payrollStatusTone } from '../lib/payroll-status'
import { useGeneratePayroll } from '../hooks/usePayrollMutations'
import { usePayrolls } from '../hooks/usePayrolls'
import type { Payroll } from '../types/payroll.types'

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount)
}

function toIsoDate(value: string): string {
  return value
}

export default function PayrollListPage() {
  const navigate = useNavigate()
  const { currentUser } = useCurrentUser()
  const formatEmployee = useFormatRecordEmployee()
  const { params, setSearch, setPage, setSort, setFilter } = useListQuery({
    defaultSort: { field: 'payPeriodStart', direction: 'desc' },
  })
  const payrollsQuery = usePayrolls(params)
  const generatePayroll = useGeneratePayroll()
  const [generateOpen, setGenerateOpen] = useState(false)
  const [payPeriodStart, setPayPeriodStart] = useState('')
  const [payPeriodEnd, setPayPeriodEnd] = useState('')

  const canGenerate = currentUser?.role === 'OWNER' || currentUser?.role === 'MANAGER'

  useEffect(() => {
    document.title = 'Payroll | Scrappy'
  }, [])

  const columns = useMemo<ColumnDef<Payroll>[]>(
    () => [
      {
        id: 'employeeId',
        header: 'Employee',
        enableSorting: false,
        cell: ({ row }) => <span className="font-medium">{formatEmployee(row.original)}</span>,
      },
      {
        id: 'period',
        header: 'Period',
        enableSorting: false,
        cell: ({ row }) => (
          <span>
            {formatDate(row.original.payPeriodStart)} – {formatDate(row.original.payPeriodEnd)}
          </span>
        ),
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <StatusBadge
            label={payrollStatusLabel(row.original.status)}
            tone={payrollStatusTone(row.original.status)}
          />
        ),
      },
      {
        id: 'netPay',
        accessorKey: 'netPay',
        header: 'Net pay',
        cell: ({ row }) => formatCurrency(row.original.netPay),
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
                void navigate(buildRoute.payrollDetail(row.original.id))
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

  const data = payrollsQuery.data
  const hasFilters = Boolean(params.search ?? params.filters?.status)
  const hasNoResults = data && data.total === 0 && !hasFilters

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Payroll"
          description="Review payroll records returned by the workforce API."
          actions={
            canGenerate ? (
              <PermissionGate permission={PERMISSIONS.payroll.view}>
                <Button
                  type="button"
                  onClick={() => {
                    setGenerateOpen(true)
                  }}
                >
                  Generate payroll
                </Button>
              </PermissionGate>
            ) : null
          }
        />

        {payrollsQuery.isError ? (
          <ErrorState description="We couldn't load payroll records. Please try again." />
        ) : hasNoResults ? (
          <EmptyState
            icon={Banknote}
            title="No payroll records yet"
            description="Generate a weekly payroll batch to populate this list."
            action={
              canGenerate ? (
                <Button
                  type="button"
                  onClick={() => {
                    setGenerateOpen(true)
                  }}
                >
                  Generate payroll
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="space-y-4">
            <FilterBar
              search={params.search ?? ''}
              onSearchChange={setSearch}
              searchPlaceholder="Search payroll…"
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
                <option value="PAYABLE">Payable</option>
                <option value="PAID">Paid</option>
              </Select>
            </FilterBar>

            <DataTable
              columns={columns}
              data={data?.data ?? []}
              isLoading={payrollsQuery.isLoading}
              emptyMessage="No payroll records match your filters."
              sort={params.sort}
              onSortChange={setSort}
              getRowId={(row) => row.id}
              renderMobileCard={(payroll) => (
                <Card className="gap-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{formatEmployee(payroll)}</p>
                      <p className="text-muted-foreground text-sm">
                        {formatCurrency(payroll.netPay)}
                      </p>
                    </div>
                    <StatusBadge
                      label={payrollStatusLabel(payroll.status)}
                      tone={payrollStatusTone(payroll.status)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      void navigate(buildRoute.payrollDetail(payroll.id))
                    }}
                  >
                    View details
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

      <Dialog open={generateOpen} onOpenChange={setGenerateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate weekly payroll</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payPeriodStart">Period start</Label>
              <Input
                id="payPeriodStart"
                type="date"
                value={payPeriodStart}
                onChange={(event) => {
                  setPayPeriodStart(event.target.value)
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payPeriodEnd">Period end</Label>
              <Input
                id="payPeriodEnd"
                type="date"
                value={payPeriodEnd}
                onChange={(event) => {
                  setPayPeriodEnd(event.target.value)
                }}
              />
            </div>
            <p className="text-muted-foreground text-sm">
              Leave employee filter empty to include all active employees.
            </p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setGenerateOpen(false)
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!payPeriodStart || !payPeriodEnd || generatePayroll.isPending}
              onClick={() => {
                generatePayroll.mutate(
                  {
                    payPeriodStart: toIsoDate(payPeriodStart),
                    payPeriodEnd: toIsoDate(payPeriodEnd),
                  },
                  {
                    onSuccess: () => {
                      setGenerateOpen(false)
                      setPayPeriodStart('')
                      setPayPeriodEnd('')
                    },
                  },
                )
              }}
            >
              {generatePayroll.isPending ? 'Generating…' : 'Generate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}
