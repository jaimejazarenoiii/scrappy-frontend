import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table'

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
  isLoading?: boolean
  emptyMessage?: string
  className?: string
}

export function DataTable<TData>({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'No results found.',
  className,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading) {
    return (
      <div className={cn('space-y-3', className)}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-full" />
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

  return (
    <div className={cn('overflow-x-auto rounded-lg border', className)}>
      <table className="w-full min-w-[640px] text-sm">
        <thead className="bg-muted/50 sticky top-0">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b">
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="h-10 px-4 text-left align-middle font-medium">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-muted/30 border-b transition-colors last:border-0">
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
  )
}
