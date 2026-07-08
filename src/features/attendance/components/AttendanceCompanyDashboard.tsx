import type { ColumnDef } from '@tanstack/react-table'
import { Users } from 'lucide-react'
import { useMemo } from 'react'

import { DataTable } from '@/components/common/DataTable'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useFormatRecordEmployee } from '@/features/employees/hooks/useFormatRecordEmployee'
import { formatDate } from '@/utils/format-date'

import { attendanceDayStatusLabel, attendanceDayStatusTone } from '../lib/attendance-status'
import type { AttendanceDashboard } from '../types/attendance.types'

interface AttendanceCompanyDashboardProps {
  dashboard?: AttendanceDashboard
  isLoading: boolean
}

function formatDateTime(value: string | null): string {
  if (!value) return '—'
  return new Intl.DateTimeFormat('en-PH', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function AttendanceCompanyDashboard({
  dashboard,
  isLoading,
}: AttendanceCompanyDashboardProps) {
  const formatEmployee = useFormatRecordEmployee()

  const columns = useMemo<ColumnDef<AttendanceDashboard['employees'][number]>[]>(
    () => [
      {
        id: 'employee',
        header: 'Employee',
        cell: ({ row }) => <span className="font-medium">{formatEmployee(row.original)}</span>,
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: 'Today',
        cell: ({ row }) => (
          <StatusBadge
            label={attendanceDayStatusLabel(row.original.status)}
            tone={attendanceDayStatusTone(row.original.status)}
          />
        ),
      },
      {
        id: 'timeInToday',
        header: 'Time in',
        cell: ({ row }) => formatDateTime(row.original.timeInToday),
      },
      {
        id: 'timeOutToday',
        header: 'Time out',
        cell: ({ row }) => formatDateTime(row.original.timeOutToday),
      },
    ],
    [formatEmployee],
  )

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-12" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!dashboard) {
    return null
  }

  const summaryItems = [
    { label: 'Present', value: dashboard.summary.present },
    { label: 'Late', value: dashboard.summary.late },
    { label: 'Absent', value: dashboard.summary.absent },
    { label: 'On leave', value: dashboard.summary.onLeave },
    { label: 'Timed in', value: dashboard.summary.timedIn },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Users className="text-muted-foreground size-4" />
        <p className="text-muted-foreground text-sm">
          Company attendance for {formatDate(dashboard.date)}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {summaryItems.map((item) => (
          <Card key={item.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                {item.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold tabular-nums">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <DataTable
        columns={columns}
        data={dashboard.employees}
        emptyMessage="No employees to display."
        getRowId={(row) => row.employeeId}
      />
    </div>
  )
}
