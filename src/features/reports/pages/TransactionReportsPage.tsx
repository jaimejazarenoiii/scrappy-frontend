import type { ColumnDef } from '@tanstack/react-table'
import { Link } from 'react-router'

import { PermissionGate } from '@/features/authorization/components/PermissionGate'
import { ReportDomainPage } from '@/features/reports/components/ReportDomainPage'
import { useTransactionReport } from '@/features/reports/hooks/useReportQueries'
import type { TransactionReportRow } from '@/features/reports/types/reports.types'
import { PERMISSIONS } from '@/constants/permissions'
import { buildRoute } from '@/constants/routes'
import { formatCurrency } from '@/utils/format-currency'

const columns: ColumnDef<TransactionReportRow>[] = [
  {
    id: 'transactionDate',
    accessorKey: 'date',
    header: 'Date',
    enableSorting: true,
  },
  {
    accessorKey: 'transactionNumber',
    header: 'Number',
    cell: ({ row }) =>
      row.original.id ? (
        <PermissionGate permission={PERMISSIONS.transactions.view}>
          <Link
            to={buildRoute.transactionDetail(row.original.id)}
            className="text-primary font-medium hover:underline"
          >
            {row.original.transactionNumber ?? row.original.id.slice(0, 8)}
          </Link>
        </PermissionGate>
      ) : (
        (row.original.transactionNumber ?? '—')
      ),
  },
  { accessorKey: 'type', header: 'Type' },
  { accessorKey: 'partyName', header: 'Party' },
  { accessorKey: 'status', header: 'Status' },
  {
    accessorKey: 'totalAmount',
    header: 'Amount',
    cell: ({ row }) =>
      row.original.totalAmount == null ? '—' : formatCurrency(row.original.totalAmount),
  },
  { accessorKey: 'employeeName', header: 'Employee' },
  { accessorKey: 'branchName', header: 'Branch' },
]

export default function TransactionReportsPage() {
  const query = useTransactionReport()

  return (
    <ReportDomainPage
      domain="transactions"
      title="Transaction reports"
      description="Inbound and outbound transaction details for the selected filters."
      query={query}
      columns={columns}
      renderMobileCard={(row) => (
        <div className="bg-card space-y-1 rounded-xl border p-4 text-sm">
          <p className="font-medium">{row.transactionNumber ?? row.id.slice(0, 8)}</p>
          <p className="text-muted-foreground">
            {row.date} · {row.type ?? '—'} ·{' '}
            {row.totalAmount == null ? '—' : formatCurrency(row.totalAmount)}
          </p>
        </div>
      )}
    />
  )
}
