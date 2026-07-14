import type { ColumnDef } from '@tanstack/react-table'
import { Pencil, Trash2 } from 'lucide-react'
import { useMemo } from 'react'

import { DataTable } from '@/components/common/DataTable'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

import type { TripLoadItem } from '../types/trip-load.types'

interface TripLoadEditableTableProps {
  items: TripLoadItem[]
  canManage: boolean
  isMutating?: boolean
  onEdit: (item: TripLoadItem) => void
  onRemove: (item: TripLoadItem) => void
}

function formatQuantity(value: number, unit: string): string {
  return `${new Intl.NumberFormat('en-PH', { maximumFractionDigits: 2 }).format(value)} ${unit}`
}

export function TripLoadEditableTable({
  items,
  canManage,
  isMutating = false,
  onEdit,
  onRemove,
}: TripLoadEditableTableProps) {
  const columns = useMemo<ColumnDef<TripLoadItem>[]>(
    () => [
      {
        accessorKey: 'materialName',
        header: 'Material',
        cell: ({ row }) => <span className="font-medium">{row.original.materialName}</span>,
      },
      {
        id: 'quantity',
        header: 'Quantity',
        cell: ({ row }) => formatQuantity(row.original.quantity, row.original.unit),
      },
      {
        accessorKey: 'notes',
        header: 'Notes',
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.notes ?? '—'}</span>
        ),
      },
      ...(canManage
        ? [
            {
              id: 'actions',
              header: () => <span className="sr-only">Actions</span>,
              cell: ({ row }: { row: { original: TripLoadItem } }) => (
                <div className="flex justify-end gap-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="min-h-11 min-w-11"
                    disabled={isMutating}
                    aria-label={`Edit ${row.original.materialName}`}
                    onClick={() => {
                      onEdit(row.original)
                    }}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="text-destructive min-h-11 min-w-11"
                    disabled={isMutating}
                    aria-label={`Remove ${row.original.materialName}`}
                    onClick={() => {
                      onRemove(row.original)
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ),
            } satisfies ColumnDef<TripLoadItem>,
          ]
        : []),
    ],
    [canManage, isMutating, onEdit, onRemove],
  )

  return (
    <DataTable
      columns={columns}
      data={items}
      getRowId={(row) => row.id}
      emptyMessage="No load items yet."
      renderMobileCard={(item) => (
        <Card className="p-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium">{item.materialName}</p>
              {canManage ? (
                <div className="flex shrink-0 gap-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="min-h-11"
                    disabled={isMutating}
                    onClick={() => {
                      onEdit(item)
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="text-destructive min-h-11"
                    disabled={isMutating}
                    onClick={() => {
                      onRemove(item)
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : null}
            </div>
            <p className="text-muted-foreground text-sm">
              {formatQuantity(item.quantity, item.unit)}
            </p>
            {item.notes ? <p className="text-muted-foreground text-sm">{item.notes}</p> : null}
          </div>
        </Card>
      )}
    />
  )
}
