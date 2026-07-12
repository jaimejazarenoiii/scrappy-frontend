import type { ColumnDef } from '@tanstack/react-table'
import { CalendarDays, Plus } from 'lucide-react'
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
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { useFormatRecordEmployee } from '@/features/employees/hooks/useFormatRecordEmployee'
import { canCreateLeave, isCompanyViewer } from '@/features/workforce/lib/workforce-roles'
import { useListQuery } from '@/hooks/useListQuery'
import { formatDate } from '@/utils/format-date'

import { LeaveDashboardKpis } from '../components/LeaveDashboardKpis'
import { leaveStatusLabel, leaveStatusTone, leaveTypeLabel } from '../lib/leave-status'
import { useLeaveDashboard } from '../hooks/useLeaveDashboard'
import { useLeaves } from '../hooks/useLeaves'
import type { Leave } from '../types/leave.types'

export default function LeaveListPage() {
  const navigate = useNavigate()
  const { currentUser } = useCurrentUser()
  const isManagerView = isCompanyViewer(currentUser?.role)
  const showCreate = canCreateLeave(currentUser?.role)
  const formatEmployee = useFormatRecordEmployee()
  const createLabel =
    currentUser?.role === 'OWNER' ? 'Create leave for employee' : 'New leave request'

  const { params, setSearch, setPage, setSort, setFilter } = useListQuery({
    defaultSort: { field: 'leaveDate', direction: 'desc' },
  })
  const leaveDashboardQuery = useLeaveDashboard()
  const leavesQuery = useLeaves(params)

  useEffect(() => {
    document.title = 'Leave | Scrappy'
  }, [])

  const columns = useMemo<ColumnDef<Leave>[]>(
    () => [
      {
        id: 'employeeId',
        header: 'Employee',
        enableSorting: false,
        cell: ({ row }) => <span className="font-medium">{formatEmployee(row.original)}</span>,
      },
      {
        id: 'leaveType',
        accessorKey: 'leaveType',
        header: 'Type',
        cell: ({ row }) => leaveTypeLabel(row.original.leaveType),
      },
      {
        id: 'leaveDate',
        accessorKey: 'leaveDate',
        header: 'Date',
        cell: ({ row }) => formatDate(row.original.leaveDate),
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <StatusBadge
            label={leaveStatusLabel(row.original.status)}
            tone={leaveStatusTone(row.original.status)}
          />
        ),
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
                void navigate(buildRoute.leaveDetail(row.original.id))
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

  const data = leavesQuery.data
  const hasFilters = Boolean(params.search ?? params.filters?.status)
  const hasNoResults = data && data.total === 0 && !hasFilters

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Leave"
          description={
            isManagerView
              ? 'Review business leave requests and approve or reject them.'
              : 'Submit and track your leave requests.'
          }
          actions={
            showCreate ? (
              <PermissionGate permission={PERMISSIONS.leave.create}>
                <Button
                  type="button"
                  onClick={() => {
                    void navigate(ROUTES.leaveNew)
                  }}
                >
                  <Plus className="size-4" />
                  {createLabel}
                </Button>
              </PermissionGate>
            ) : null
          }
        />

        {isManagerView ? (
          <LeaveDashboardKpis
            dashboard={leaveDashboardQuery.data}
            isLoading={leaveDashboardQuery.isLoading}
          />
        ) : null}

        {leavesQuery.isError ? (
          <ErrorState description="We couldn't load leave requests. Please try again." />
        ) : hasNoResults ? (
          <EmptyState
            icon={CalendarDays}
            title="No leave requests yet"
            description={
              showCreate
                ? currentUser?.role === 'OWNER'
                  ? 'Create leave on behalf of an employee.'
                  : 'Create a leave request to start tracking planned absences.'
                : 'Leave requests from managers and employees will appear here.'
            }
            action={
              showCreate ? (
                <PermissionGate permission={PERMISSIONS.leave.create}>
                  <Button
                    type="button"
                    onClick={() => {
                      void navigate(ROUTES.leaveNew)
                    }}
                  >
                    <Plus className="size-4" />
                    {createLabel}
                  </Button>
                </PermissionGate>
              ) : undefined
            }
          />
        ) : (
          <div className="space-y-4">
            <FilterBar
              search={params.search ?? ''}
              onSearchChange={setSearch}
              searchPlaceholder="Search leave requests…"
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
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="CANCELLED">Cancelled</option>
              </Select>
            </FilterBar>

            <DataTable
              columns={columns}
              data={data?.data ?? []}
              isLoading={leavesQuery.isLoading}
              emptyMessage="No leave requests match your filters."
              sort={params.sort}
              onSortChange={setSort}
              getRowId={(row) => row.id}
              renderMobileCard={(leave) => (
                <Card className="gap-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{formatEmployee(leave)}</p>
                      <p className="text-muted-foreground text-sm">
                        {leaveTypeLabel(leave.leaveType)} · {formatDate(leave.leaveDate)}
                      </p>
                    </div>
                    <StatusBadge
                      label={leaveStatusLabel(leave.status)}
                      tone={leaveStatusTone(leave.status)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      void navigate(buildRoute.leaveDetail(leave.id))
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
