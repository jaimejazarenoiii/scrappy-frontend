import type { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'

import { DataTable } from '@/components/common/DataTable'
import { Card } from '@/components/ui/card'

import { RemainingQuantityBadge } from './RemainingQuantityBadge'
import type { TripLoadProgressRow } from '../types/trip-load.types'

interface TripLoadProgressTableProps {
  rows: TripLoadProgressRow[]
}

function formatQuantity(value: number, unit: string): string {
  return `${new Intl.NumberFormat('en-PH', { maximumFractionDigits: 2 }).format(value)} ${unit}`
}

export function TripLoadProgressTable({ rows }: TripLoadProgressTableProps) {
  const columns = useMemo<ColumnDef<TripLoadProgressRow>[]>(
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
        id: 'sold',
        header: 'Sold',
        cell: ({ row }) => formatQuantity(row.original.soldQuantity, row.original.unit),
      },
      {
        id: 'remaining',
        header: 'Remaining',
        cell: ({ row }) => formatQuantity(row.original.remainingQuantity, row.original.unit),
      },
      {
        id: 'status',
        header: 'Status',
        cell: ({ row }) => <RemainingQuantityBadge status={row.original.indicatorStatus} />,
      },
    ],
    [],
  )

  return (
    <DataTable
      columns={columns}
      data={rows}
      getRowId={(row) => `${row.materialName}-${row.unit}`}
      emptyMessage="No load progress available."
      renderMobileCard={(row) => (
        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium">{row.materialName}</p>
              <RemainingQuantityBadge status={row.indicatorStatus} />
            </div>
            <dl className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <dt className="text-muted-foreground">Loaded</dt>
                <dd className="font-medium">{formatQuantity(row.loadedQuantity, row.unit)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Sold</dt>
                <dd className="font-medium">{formatQuantity(row.soldQuantity, row.unit)}</dd>
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
