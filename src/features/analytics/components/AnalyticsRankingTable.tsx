import type { ReactNode } from 'react'

import { useIsMobile } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'

export interface AnalyticsRankingColumn<T> {
  key: keyof T | 'actions'
  header: string
  cell: (row: T) => ReactNode
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
  const isMobile = useIsMobile()
  const primaryColumn = columns[0]
  const detailColumns = columns.slice(1)

  if (rows.length === 0) {
    return (
      <div className={cn('bg-card rounded-xl border p-4', className)}>
        {title ? <h3 className="mb-2 text-sm font-semibold">{title}</h3> : null}
        <p className="text-muted-foreground text-sm">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={cn('bg-card min-w-0 overflow-hidden rounded-xl border', className)}>
      {title ? (
        <div className="border-b px-4 py-3">
          <h3 className="text-sm font-semibold">{title}</h3>
        </div>
      ) : null}

      {isMobile ? (
        <ul className="divide-y">
          {rows.map((row, index) => (
            <li
              key={getRowKey?.(row, index) ?? `row-${String(index)}`}
              className="space-y-2 px-4 py-3"
            >
              <div className={cn('min-w-0 font-medium', primaryColumn.className)}>
                {primaryColumn.cell(row)}
              </div>
              {detailColumns.length > 0 ? (
                <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                  {detailColumns.map((column) => (
                    <div key={String(column.key)} className={cn('min-w-0', column.className)}>
                      <dt className="text-muted-foreground text-xs">{column.header}</dt>
                      <dd className="mt-0.5">{column.cell(row)}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <div className="w-full max-w-full min-w-0 overflow-x-auto overscroll-x-contain">
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
      )}
    </div>
  )
}
