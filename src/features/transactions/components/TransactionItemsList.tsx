import type { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'

import { DataTable } from '@/components/common/DataTable'
import { Card } from '@/components/ui/card'
import { formatCurrency } from '@/utils/format-currency'

import { groupTransactionItems, type TransactionItemGroup } from '../lib/transaction-item-groups'
import type { TransactionItem } from '../types/transaction.types'

interface TransactionItemsListProps {
  items: TransactionItem[]
  totalAmount?: number
}

function groupNotes(group: TransactionItemGroup): string | null {
  const notes = group.items
    .map((item) => item.notes?.trim())
    .filter((note): note is string => Boolean(note))
  if (!notes.length) return null
  return [...new Set(notes)].join(' · ')
}

export function TransactionItemsList({ items, totalAmount }: TransactionItemsListProps) {
  const itemGroups = useMemo(() => groupTransactionItems(items), [items])

  const columns = useMemo<ColumnDef<TransactionItemGroup>[]>(
    () => [
      {
        id: 'materialName',
        header: 'Material',
        cell: ({ row }) => {
          const notes = groupNotes(row.original)
          return (
            <div className="min-w-0">
              <p className="font-medium">{row.original.materialName}</p>
              {notes ? <p className="text-muted-foreground text-xs">{notes}</p> : null}
            </div>
          )
        },
      },
      {
        id: 'quantity',
        header: 'Quantity',
        cell: ({ row }) => (
          <span className="tabular-nums">
            {String(row.original.totalWeight)} {row.original.unit}
          </span>
        ),
      },
      {
        id: 'price',
        header: 'Unit price',
        cell: ({ row }) => (
          <span className="tabular-nums">{formatCurrency(row.original.price)}</span>
        ),
      },
      {
        id: 'total',
        header: 'Total',
        cell: ({ row }) => (
          <span className="font-medium tabular-nums">
            {formatCurrency(row.original.totalAmount)}
          </span>
        ),
      },
    ],
    [],
  )

  return (
    <section className="space-y-4" aria-labelledby="transaction-items-list-heading">
      <h2 id="transaction-items-list-heading" className="text-lg font-semibold">
        Items
      </h2>

      <DataTable
        columns={columns}
        data={itemGroups}
        emptyMessage="No items on this transaction."
        getRowId={(row) => row.key}
        renderMobileCard={(group) => {
          const notes = groupNotes(group)
          return (
            <Card className="gap-2 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium">{group.materialName}</p>
                  <p className="text-muted-foreground text-sm tabular-nums">
                    {group.totalWeight} {group.unit} · {formatCurrency(group.price)}
                  </p>
                  {notes ? <p className="text-muted-foreground mt-1 text-xs">{notes}</p> : null}
                </div>
                <p className="shrink-0 font-medium tabular-nums">
                  {formatCurrency(group.totalAmount)}
                </p>
              </div>
            </Card>
          )
        }}
        footer={
          totalAmount !== undefined && itemGroups.length > 0 ? (
            <div className="flex justify-end border-t px-4 py-3">
              <dl className="text-right">
                <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  Grand total
                </dt>
                <dd className="text-lg font-semibold tabular-nums">
                  {formatCurrency(totalAmount)}
                </dd>
              </dl>
            </div>
          ) : null
        }
      />
    </section>
  )
}
