import type { ColumnDef } from '@tanstack/react-table'
import { Link } from 'react-router'

import { PermissionGate } from '@/features/authorization/components/PermissionGate'
import { ReportDomainPage } from '@/features/reports/components/ReportDomainPage'
import { useExpenseReport } from '@/features/reports/hooks/useReportQueries'
import type { ExpenseReportRow } from '@/features/reports/types/reports.types'
import { PERMISSIONS } from '@/constants/permissions'
import { buildRoute } from '@/constants/routes'
import { formatCurrency } from '@/utils/format-currency'

const columns: ColumnDef<ExpenseReportRow>[] = [
  { accessorKey: 'date', header: 'Date', enableSorting: true },
  {
    accessorKey: 'expenseNumber',
    header: 'Expense',
    cell: ({ row }) => (
      <PermissionGate permission={PERMISSIONS.expenses.view}>
        <Link
          to={buildRoute.expenseDetail(row.original.id)}
          className="text-primary font-medium hover:underline"
        >
          {row.original.expenseNumber ?? row.original.description}
        </Link>
      </PermissionGate>
    ),
  },
  { accessorKey: 'category', header: 'Category' },
  { accessorKey: 'referenceType', header: 'Reference type' },
  { accessorKey: 'referenceLabel', header: 'Reference' },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => formatCurrency(row.original.amount),
  },
  { accessorKey: 'status', header: 'Status' },
]

export default function ExpenseReportsPage() {
  const query = useExpenseReport()

  return (
    <ReportDomainPage
      domain="expenses"
      title="Expense reports"
      description="Expense details by category and reference type."
      query={query}
      columns={columns}
      renderMobileCard={(row) => (
        <div className="bg-card space-y-1 rounded-xl border p-4 text-sm">
          <p className="font-medium">{row.description}</p>
          <p className="text-muted-foreground">
            {row.date} · {row.category ?? '—'} · {formatCurrency(row.amount)}
          </p>
        </div>
      )}
    />
  )
}
