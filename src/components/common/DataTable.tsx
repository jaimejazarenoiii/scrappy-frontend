import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'
import type { ReactNode } from 'react'

import { Skeleton } from '@/components/ui/skeleton'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'
import type { SortState } from '@/types/pagination.types'

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
  isLoading?: boolean
  emptyMessage?: string
  className?: string
  /** Current sort state (controlled). Enables sortable headers when paired with onSortChange. */
  sort?: SortState
  onSortChange?: (sort: SortState) => void
  /** When provided, renders a card list instead of a table on mobile viewports. */
  renderMobileCard?: (row: TData) => ReactNode
  /** Optional footer slot, typically pagination. */
  footer?: ReactNode
  getRowId?: (row: TData) => string
}

export function DataTable<TData>({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'No results found.',
  className,
  sort,
  onSortChange,
  renderMobileCard,
  footer,
  getRowId,
}: DataTableProps<TData>) {
  const isMobile = useIsMobile()

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId,
  })

  if (isLoading) {
    return (
      <div className={cn('space-y-3', className)}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div
        className={cn(
          'text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm',
          className,
        )}
      >
        {emptyMessage}
      </div>
    )
  }

  // Mobile card layout.
  if (isMobile && renderMobileCard) {
    return (
      <div className={cn('space-y-3', className)}>
        {table.getRowModel().rows.map((row) => (
          <div key={row.id}>{renderMobileCard(row.original)}</div>
        ))}
        {footer ? <div className="pt-2">{footer}</div> : null}
      </div>
    )
  }

  return (
    <div className={cn('min-w-0 space-y-4', className)}>
      {/* min-w-0 keeps horizontal scroll working inside flex + overflow-x-hidden layouts */}
      <div className="w-full max-w-full min-w-0 overflow-x-auto overscroll-x-contain rounded-lg border">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-muted/50 sticky top-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b">
                {headerGroup.headers.map((header) => {
                  const field = header.column.id
                  const canSort =
                    Boolean(onSortChange) && header.column.columnDef.enableSorting !== false
                  const sortedDirection = sort?.field === field ? sort.direction : null
                  const headerContent = header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())

                  return (
                    <th key={header.id} className="h-11 px-4 text-left align-middle font-medium">
                      {canSort ? (
                        <button
                          type="button"
                          className="hover:text-foreground text-muted-foreground inline-flex items-center gap-1.5 font-medium transition-colors"
                          onClick={() => {
                            const nextDirection = sortedDirection === 'asc' ? 'desc' : 'asc'
                            onSortChange?.({ field, direction: nextDirection })
                          }}
                          aria-label={`Sort by ${field}`}
                        >
                          <span className="text-foreground">{headerContent}</span>
                          {sortedDirection === null ? (
                            <ChevronsUpDown className="size-3.5 opacity-50" />
                          ) : sortedDirection === 'asc' ? (
                            <ArrowUp className="size-3.5" />
                          ) : (
                            <ArrowDown className="size-3.5" />
                          )}
                        </button>
                      ) : (
                        headerContent
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-muted/30 border-b transition-colors last:border-0"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {footer}
    </div>
  )
}
