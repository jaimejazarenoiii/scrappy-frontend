import type { ColumnDef } from '@tanstack/react-table'
import { Link } from 'react-router'

import { PermissionGate } from '@/features/authorization/components/PermissionGate'
import { ReportDomainPage } from '@/features/reports/components/ReportDomainPage'
import { usePayrollReport } from '@/features/reports/hooks/useReportQueries'
import type { PayrollReportRow } from '@/features/reports/types/reports.types'
import { PERMISSIONS } from '@/constants/permissions'
import { buildRoute } from '@/constants/routes'
import { formatCurrency } from '@/utils/format-currency'

const columns: ColumnDef<PayrollReportRow>[] = [
  {
    id: 'payPeriodStart',
    accessorKey: 'period',
    header: 'Period',
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
  {
    accessorKey: 'gross',
    header: 'Gross',
    cell: ({ row }) => (row.original.gross == null ? '—' : formatCurrency(row.original.gross)),
  },
  {
    accessorKey: 'net',
    header: 'Net',
    cell: ({ row }) => (row.original.net == null ? '—' : formatCurrency(row.original.net)),
  },
  { accessorKey: 'status', header: 'Status' },
]

export default function PayrollReportsPage() {
  const query = usePayrollReport()

  return (
    <ReportDomainPage
      domain="payroll"
      title="Payroll reports"
      description="Payroll by period and employee from backend report data."
      query={query}
      columns={columns}
      renderMobileCard={(row) => (
        <div className="bg-card space-y-1 rounded-xl border p-4 text-sm">
          <p className="font-medium">{row.employeeName ?? 'Employee'}</p>
          <p className="text-muted-foreground">
            {row.period ?? '—'} · {row.net == null ? '—' : formatCurrency(row.net)}
          </p>
        </div>
      )}
    />
  )
}
