import type { ColumnDef } from '@tanstack/react-table'
import { Link } from 'react-router'

import { PermissionGate } from '@/features/authorization/components/PermissionGate'
import { ReportDomainPage } from '@/features/reports/components/ReportDomainPage'
import { useAttendanceReport } from '@/features/reports/hooks/useReportQueries'
import type { AttendanceReportRow } from '@/features/reports/types/reports.types'
import { PERMISSIONS } from '@/constants/permissions'
import { buildRoute } from '@/constants/routes'

const columns: ColumnDef<AttendanceReportRow>[] = [
  {
    id: 'timeInAt',
    accessorKey: 'date',
    header: 'Date',
    enableSorting: true,
  },
  {
    accessorKey: 'employeeName',
    header: 'Employee',
    cell: ({ row }) =>
      row.original.employeeId ? (
        <PermissionGate permission={PERMISSIONS.employee.view}>
          <Link
            to={buildRoute.employeeDetail(row.original.employeeId)}
            className="text-primary hover:underline"
          >
            {row.original.employeeName ?? row.original.employeeId.slice(0, 8)}
          </Link>
        </PermissionGate>
      ) : (
        (row.original.employeeName ?? '—')
      ),
  },
  { accessorKey: 'timeIn', header: 'Time in' },
  { accessorKey: 'timeOut', header: 'Time out' },
  { accessorKey: 'status', header: 'Status' },
]

export default function AttendanceReportsPage() {
  const query = useAttendanceReport()

  return (
    <ReportDomainPage
      domain="attendance"
      title="Attendance reports"
      description="Employee attendance details for the selected range."
      query={query}
      columns={columns}
      renderMobileCard={(row) => (
        <div className="bg-card space-y-1 rounded-xl border p-4 text-sm">
          <p className="font-medium">{row.employeeName ?? 'Employee'}</p>
          <p className="text-muted-foreground">
            {row.date} · {row.timeIn ?? '—'} – {row.timeOut ?? '—'}
          </p>
        </div>
      )}
    />
  )
}
