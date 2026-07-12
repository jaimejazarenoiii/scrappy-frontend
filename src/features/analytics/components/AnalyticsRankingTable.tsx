import { cn } from '@/lib/utils'

export interface AnalyticsRankingColumn<T> {
  key: keyof T | 'actions'
  header: string
  cell: (row: T) => React.ReactNode
  className?: string
}

interface AnalyticsRankingTableProps<T> {
  title?: string
  rows: T[]
  columns: AnalyticsRankingColumn<T>[]
  emptyMessage?: string
  className?: string
  getRowKey?: (row: T, index: number) => string
}

export function AnalyticsRankingTable<T>({
  title,
  rows,
  columns,
  emptyMessage = 'No ranked items in this period.',
  className,
  getRowKey,
}: AnalyticsRankingTableProps<T>) {
  if (rows.length === 0) {
    return (
      <div className={cn('bg-card rounded-xl border p-4', className)}>
        {title ? <h3 className="mb-2 text-sm font-semibold">{title}</h3> : null}
        <p className="text-muted-foreground text-sm">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={cn('bg-card overflow-hidden rounded-xl border', className)}>
      {title ? (
        <div className="border-b px-4 py-3">
          <h3 className="text-sm font-semibold">{title}</h3>
        </div>
      ) : null}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  scope="col"
                  className={cn('px-4 py-3 text-left font-medium', column.className)}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={getRowKey?.(row, index) ?? `row-${String(index)}`} className="border-t">
                {columns.map((column) => (
                  <td key={String(column.key)} className={cn('px-4 py-3', column.className)}>
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
