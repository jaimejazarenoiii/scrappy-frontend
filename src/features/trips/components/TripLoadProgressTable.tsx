import type { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'

import { DataTable } from '@/components/common/DataTable'
import { Card } from '@/components/ui/card'

import { RemainingQuantityBadge } from './RemainingQuantityBadge'
import { indicatorForSummaryItem, type TripLoadSummaryItem } from '../types/trip-load.types'

interface TripLoadProgressTableProps {
  items: TripLoadSummaryItem[]
}

function formatQuantity(value: number, unit: string): string {
  return `${new Intl.NumberFormat('en-PH', { maximumFractionDigits: 2 }).format(value)} ${unit}`
}

export function TripLoadProgressTable({ items }: TripLoadProgressTableProps) {
  const columns = useMemo<ColumnDef<TripLoadSummaryItem>[]>(
    () => [
      {
        accessorKey: 'materialName',
        header: 'Material',
        cell: ({ row }) => <span className="font-medium">{row.original.materialName}</span>,
      },
      {
        id: 'loaded',
        header: 'Loaded',
        cell: ({ row }) => formatQuantity(row.original.loadedQuantity, row.original.unit),
      },
      {
        id: 'outbound',
        header: 'Sold (outbound)',
        cell: ({ row }) => formatQuantity(row.original.outboundQuantity, row.original.unit),
      },
      {
        id: 'remaining',
        header: 'Remaining',
        cell: ({ row }) => formatQuantity(row.original.remainingQuantity, row.original.unit),
      },
      {
        id: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <RemainingQuantityBadge status={indicatorForSummaryItem(row.original)} />
        ),
      },
    ],
    [],
  )

  return (
    <DataTable
      columns={columns}
      data={items}
      getRowId={(row) => `${row.materialName}-${row.unit}`}
      emptyMessage="No load progress available."
      renderMobileCard={(row) => (
        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium">{row.materialName}</p>
              <RemainingQuantityBadge status={indicatorForSummaryItem(row)} />
            </div>
            <dl className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <dt className="text-muted-foreground">Loaded</dt>
                <dd className="font-medium">{formatQuantity(row.loadedQuantity, row.unit)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Sold</dt>
                <dd className="font-medium">{formatQuantity(row.outboundQuantity, row.unit)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Remaining</dt>
                <dd className="font-medium">{formatQuantity(row.remainingQuantity, row.unit)}</dd>
              </div>
            </dl>
          </div>
        </Card>
      )}
    />
  )
}
