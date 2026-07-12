import type { ColumnDef } from '@tanstack/react-table'
import { Clock } from 'lucide-react'
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
import { Select } from '@/components/ui/select'
import { buildRoute } from '@/constants/routes'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { useFormatRecordEmployee } from '@/features/employees/hooks/useFormatRecordEmployee'
import { canClockAttendance, isCompanyViewer } from '@/features/workforce/lib/workforce-roles'
import { useListQuery } from '@/hooks/useListQuery'
import { formatDate } from '@/utils/format-date'

import { AttendanceActionDialog } from '../components/AttendanceActionDialog'
import { AttendanceCompanyDashboard } from '../components/AttendanceCompanyDashboard'
import { AttendanceDashboardKpis } from '../components/AttendanceDashboardKpis'
import {
  attendanceStatusLabel,
  attendanceStatusTone,
  displayTimeIn,
  displayTimeOut,
} from '../lib/attendance-status'
import { useAttendances } from '../hooks/useAttendances'
import {
  useAttendanceCompanyDashboard,
  useAttendanceOperationalDashboard,
  useAttendanceStatus,
} from '../hooks/useAttendanceDashboard'
import { useTimeInAttendance, useTimeOutAttendance } from '../hooks/useAttendanceMutations'
import type { Attendance } from '../types/attendance.types'

function formatDateTime(value: string | null): string {
  if (!value) return '—'
  return new Intl.DateTimeFormat('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export default function AttendanceDashboardPage() {
  const navigate = useNavigate()
  const { currentUser } = useCurrentUser()
  const isManagerView = isCompanyViewer(currentUser?.role)
  const showPersonalClock = canClockAttendance(currentUser?.role)
  const formatEmployee = useFormatRecordEmployee()

  const { params, setSearch, setPage, setSort, setFilter } = useListQuery({
    defaultSort: { field: 'timeInAt', direction: 'desc' },
  })
  const operationalDashboardQuery = useAttendanceOperationalDashboard()
  const companyDashboardQuery = useAttendanceCompanyDashboard()
  const statusQuery = useAttendanceStatus()
  const attendancesQuery = useAttendances(params)
  const timeIn = useTimeInAttendance()
  const timeOut = useTimeOutAttendance()
  const [actionDialog, setActionDialog] = useState<'time-in' | 'time-out' | null>(null)

  useEffect(() => {
    document.title = 'Attendance | Scrappy'
  }, [])

  const columns = useMemo<ColumnDef<Attendance>[]>(
    () => [
      {
        id: 'timeInAt',
        accessorKey: 'timeInAt',
        header: 'Time in',
        cell: ({ row }) => formatDateTime(displayTimeIn(row.original)),
      },
      {
        id: 'timeOutAt',
        header: 'Time out',
        enableSorting: false,
        cell: ({ row }) => formatDateTime(displayTimeOut(row.original)),
      },
      {
        id: 'employeeId',
        accessorKey: 'employeeId',
        header: 'Employee',
        enableSorting: false,
        cell: ({ row }) => <span className="font-medium">{formatEmployee(row.original)}</span>,
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <StatusBadge
            label={attendanceStatusLabel(row.original.status)}
            tone={attendanceStatusTone(row.original.status)}
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
                void navigate(buildRoute.attendanceDetail(row.original.id))
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

  const data = attendancesQuery.data
  const hasFilters = Boolean(params.search ?? params.filters?.status ?? params.filters?.employeeId)
  const hasNoResults = data && data.total === 0 && !hasFilters

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Attendance"
          description={
            isManagerView
              ? 'Monitor business attendance and correct records when needed.'
              : 'View your attendance history and clock in or out.'
          }
        />

        {isManagerView ? (
          <AttendanceCompanyDashboard
            dashboard={companyDashboardQuery.data}
            isLoading={companyDashboardQuery.isLoading}
          />
        ) : null}

        {showPersonalClock ? (
          <AttendanceDashboardKpis
            role={currentUser?.role}
            dashboard={operationalDashboardQuery.data}
            status={statusQuery.data}
            isLoading={operationalDashboardQuery.isLoading || statusQuery.isLoading}
            isTimingIn={timeIn.isPending}
            isTimingOut={timeOut.isPending}
            onTimeIn={() => {
              setActionDialog('time-in')
            }}
            onTimeOut={() => {
              setActionDialog('time-out')
            }}
          />
        ) : (
          <AttendanceDashboardKpis
            role={currentUser?.role}
            dashboard={operationalDashboardQuery.data}
            status={statusQuery.data}
            isLoading={operationalDashboardQuery.isLoading}
          />
        )}

        {attendancesQuery.isError ? (
          <ErrorState description="We couldn't load attendance records. Please try again." />
        ) : hasNoResults ? (
          <EmptyState
            icon={Clock}
            title="No attendance yet"
            description={
              isManagerView
                ? 'Attendance sessions will appear here after employees clock in.'
                : 'Your attendance sessions will appear here after you clock in.'
            }
          />
        ) : (
          <div className="space-y-4">
            <FilterBar
              search={params.search ?? ''}
              onSearchChange={setSearch}
              searchPlaceholder="Search attendance…"
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
                <option value="OPEN">Open</option>
                <option value="CLOSED">Closed</option>
              </Select>
            </FilterBar>

            <DataTable
              columns={columns}
              data={data?.data ?? []}
              isLoading={attendancesQuery.isLoading}
              emptyMessage="No attendance records match your filters."
              sort={params.sort}
              onSortChange={setSort}
              getRowId={(row) => row.id}
              renderMobileCard={(attendance) => (
                <Card className="gap-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{formatEmployee(attendance)}</p>
                      <p className="text-muted-foreground text-sm">
                        {formatDate(attendance.timeInAt)}
                      </p>
                    </div>
                    <StatusBadge
                      label={attendanceStatusLabel(attendance.status)}
                      tone={attendanceStatusTone(attendance.status)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      void navigate(buildRoute.attendanceDetail(attendance.id))
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

      {actionDialog ? (
        <AttendanceActionDialog
          open={Boolean(actionDialog)}
          onOpenChange={(open) => {
            if (!open) setActionDialog(null)
          }}
          action={actionDialog}
          isLoading={timeIn.isPending || timeOut.isPending}
          onConfirm={() => {
            const mutation = actionDialog === 'time-in' ? timeIn : timeOut
            mutation.mutate(undefined, {
              onSuccess: () => {
                setActionDialog(null)
              },
            })
          }}
        />
      ) : null}
    </PageContainer>
  )
}
