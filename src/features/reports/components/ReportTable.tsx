import type { ColumnDef } from '@tanstack/react-table'
import type { ReactNode } from 'react'

import { DataTable } from '@/components/common/DataTable'
import { Pagination } from '@/components/common/Pagination'
import type { SortState } from '@/types/pagination.types'

interface ReportTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
  isLoading?: boolean
  emptyMessage?: string
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  sort?: SortState
  onSortChange?: (sort: SortState) => void
  renderMobileCard?: (row: TData) => ReactNode
  getRowId?: (row: TData) => string
  className?: string
}

export function ReportTable<TData>({
  columns,
  data,
  isLoading,
  emptyMessage = 'No results for these filters.',
  page,
  pageSize,
  total,
  onPageChange,
  sort,
  onSortChange,
  renderMobileCard,
  getRowId,
  className,
}: ReportTableProps<TData>) {
  return (
    <div className={className}>
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        emptyMessage={emptyMessage}
        sort={sort}
        onSortChange={onSortChange}
        renderMobileCard={renderMobileCard}
        getRowId={getRowId}
        footer={
          <Pagination page={page} pageSize={pageSize} total={total} onPageChange={onPageChange} />
        }
      />
    </div>
  )
}
