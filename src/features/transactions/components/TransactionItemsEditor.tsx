import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { DataTable } from '@/components/common/DataTable'
import { FormField } from '@/components/common/FormField'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { ColumnDef } from '@tanstack/react-table'

import {
  useAddTransactionItem,
  useDeleteTransactionItem,
  useUpdateTransactionItem,
} from '../hooks/useTransactionItemsMutations'
import { useTransactionItems } from '../hooks/useTransactionItems'
import type { TransactionItem } from '../types/transaction.types'
import {
  transactionItemSchema,
  type TransactionItemValues,
} from '../validation/transaction-item.schema'
import { MaterialSuggestionsPicker } from './MaterialSuggestionsPicker'
import { PriceSuggestionsPanel } from './PriceSuggestionsPanel'

interface TransactionItemsEditorProps {
  transactionId: string
  disabled?: boolean
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount)
}

const defaultItemValues: TransactionItemValues = {
  materialName: '',
  weight: 1,
  unit: 'KG',
  price: 0,
  notes: '',
}

export function TransactionItemsEditor({
  transactionId,
  disabled = false,
}: TransactionItemsEditorProps) {
  const itemsQuery = useTransactionItems(transactionId)
  const addItem = useAddTransactionItem(transactionId)

  const [editingItem, setEditingItem] = useState<TransactionItem | null>(null)
  const [deletingItem, setDeletingItem] = useState<TransactionItem | null>(null)
  const [showForm, setShowForm] = useState(false)

  const updateItem = useUpdateTransactionItem(transactionId, editingItem?.id ?? '')
  const deleteItem = useDeleteTransactionItem(transactionId, deletingItem?.id ?? '')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionItemValues>({
    resolver: zodResolver(transactionItemSchema),
    defaultValues: defaultItemValues,
  })

  const materialName = watch('materialName')

  const columns: ColumnDef<TransactionItem>[] = [
    {
      id: 'materialName',
      header: 'Material',
      cell: ({ row }) => <span className="font-medium">{row.original.materialName}</span>,
    },
    {
      id: 'weight',
      header: 'Weight',
      cell: ({ row }) => `${String(row.original.weight)} ${row.original.unit}`,
    },
    {
      id: 'price',
      header: 'Unit price',
      cell: ({ row }) => formatCurrency(row.original.price),
    },
    {
      id: 'total',
      header: 'Total',
      cell: ({ row }) => formatCurrency(row.original.total),
    },
    {
      id: 'actions',
      header: '',
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={() => {
              setEditingItem(row.original)
              setShowForm(true)
              reset({
                materialName: row.original.materialName,
                weight: row.original.weight,
                unit: row.original.unit,
                price: row.original.price,
                notes: row.original.notes ?? '',
              })
            }}
          >
            <Pencil className="size-4" />
            Edit
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={() => {
              setDeletingItem(row.original)
            }}
          >
            <Trash2 className="size-4" />
            Remove
          </Button>
        </div>
      ),
    },
  ]

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      materialName: values.materialName,
      weight: values.weight,
      unit: values.unit,
      price: values.price,
      notes: values.notes?.trim() ? values.notes : undefined,
    }

    if (editingItem) {
      await updateItem.mutateAsync(payload)
    } else {
      await addItem.mutateAsync(payload)
    }

    setShowForm(false)
    setEditingItem(null)
    reset(defaultItemValues)
  })

  return (
    <section className="space-y-4" aria-labelledby="transaction-items-heading">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="transaction-items-heading" className="text-lg font-semibold">
            Items
          </h2>
          <p className="text-muted-foreground text-sm">
            Add materials, weights, and prices to this draft.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          disabled={disabled}
          onClick={() => {
            setEditingItem(null)
            setShowForm(true)
            reset(defaultItemValues)
          }}
        >
          <Plus className="size-4" />
          Add item
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={itemsQuery.data ?? []}
        isLoading={itemsQuery.isLoading}
        emptyMessage="No items yet. Add your first item to this draft."
        getRowId={(row) => row.id}
        renderMobileCard={(item) => (
          <Card className="gap-3 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{item.materialName}</p>
                <p className="text-muted-foreground text-sm">
                  {item.weight} {item.unit} · {formatCurrency(item.price)}
                </p>
              </div>
              <p className="font-medium">{formatCurrency(item.total)}</p>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex-1"
                disabled={disabled}
                onClick={() => {
                  setEditingItem(item)
                  setShowForm(true)
                  reset({
                    materialName: item.materialName,
                    weight: item.weight,
                    unit: item.unit,
                    price: item.price,
                    notes: item.notes ?? '',
                  })
                }}
              >
                Edit
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex-1"
                disabled={disabled}
                onClick={() => {
                  setDeletingItem(item)
                }}
              >
                Remove
              </Button>
            </div>
          </Card>
        )}
      />

      {showForm ? (
        <Card className="gap-4 p-4">
          <h3 className="font-medium">{editingItem ? 'Edit item' : 'Add item'}</h3>
          <form
            onSubmit={(event) => {
              void onSubmit(event)
            }}
            className="grid gap-4 sm:grid-cols-2"
            noValidate
          >
            <FormField
              label="Material"
              htmlFor="materialName"
              error={errors.materialName?.message}
              required
              className="sm:col-span-2"
            >
              <MaterialSuggestionsPicker
                value={materialName}
                disabled={disabled}
                onChange={(next) => {
                  setValue('materialName', next, { shouldDirty: true, shouldValidate: true })
                }}
              />
            </FormField>

            <FormField label="Weight" htmlFor="weight" error={errors.weight?.message} required>
              <Input
                id="weight"
                type="number"
                step="0.01"
                min="0"
                {...register('weight')}
                disabled={disabled}
              />
            </FormField>

            <FormField label="Unit" htmlFor="unit" error={errors.unit?.message} required>
              <Select id="unit" {...register('unit')} disabled={disabled}>
                <option value="KG">KG</option>
                <option value="G">G</option>
                <option value="TON">TON</option>
                <option value="LB">LB</option>
                <option value="PIECE">PIECE</option>
                <option value="BUNDLE">BUNDLE</option>
                <option value="SACK">SACK</option>
              </Select>
            </FormField>

            <FormField label="Unit price" htmlFor="price" error={errors.price?.message} required>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                {...register('price')}
                disabled={disabled}
              />
            </FormField>

            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-medium">Suggested prices</p>
              <PriceSuggestionsPanel
                materialName={materialName}
                onSelectPrice={(price) => {
                  setValue('price', price, { shouldDirty: true, shouldValidate: true })
                }}
              />
            </div>

            <FormField
              label="Notes"
              htmlFor="notes"
              error={errors.notes?.message}
              className="sm:col-span-2"
            >
              <Textarea id="notes" {...register('notes')} disabled={disabled} />
            </FormField>

            <div className="flex justify-end gap-2 sm:col-span-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false)
                  setEditingItem(null)
                  reset(defaultItemValues)
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={disabled || isSubmitting || addItem.isPending || updateItem.isPending}
              >
                {isSubmitting || addItem.isPending || updateItem.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Saving…
                  </>
                ) : editingItem ? (
                  'Update item'
                ) : (
                  'Add item'
                )}
              </Button>
            </div>
          </form>
        </Card>
      ) : null}

      <ConfirmDialog
        open={Boolean(deletingItem)}
        onOpenChange={(open) => {
          if (!open) setDeletingItem(null)
        }}
        title="Remove item?"
        description="This item will be removed from the draft transaction."
        confirmLabel="Remove"
        variant="destructive"
        isLoading={deleteItem.isPending}
        onConfirm={() => {
          if (!deletingItem) return
          void deleteItem.mutateAsync().then(() => {
            setDeletingItem(null)
          })
        }}
      />
    </section>
  )
}
