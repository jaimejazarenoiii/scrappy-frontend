import { zodResolver } from '@hookform/resolvers/zod'
import type { ColumnDef } from '@tanstack/react-table'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'

import { DataTable } from '@/components/common/DataTable'
import { FormField } from '@/components/common/FormField'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

import {
  useAddTransactionItem,
  useUpdateTransactionItem,
} from '../hooks/useTransactionItemsMutations'
import { transactionItemsKeys, useTransactionItems } from '../hooks/useTransactionItems'
import { groupTransactionItems, type TransactionItemGroup } from '../lib/transaction-item-groups'
import { TransactionService } from '../services/transaction.service'
import type { TransactionItem } from '../types/transaction.types'
import {
  transactionItemSchema,
  type TransactionItemValues,
} from '../validation/transaction-item.schema'
import { transactionKeys } from '../hooks/useTransactions'
import { MaterialSuggestionsPicker } from './MaterialSuggestionsPicker'
import { PriceSuggestionsPanel } from './PriceSuggestionsPanel'
import { TransactionAddQuantityDialog } from './TransactionAddQuantityDialog'

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

function itemFormValues(item: TransactionItem): TransactionItemValues {
  return {
    materialName: item.materialName,
    weight: item.weight,
    unit: item.unit,
    price: item.price,
    notes: item.notes ?? '',
  }
}

export function TransactionItemsEditor({
  transactionId,
  disabled = false,
}: TransactionItemsEditorProps) {
  const queryClient = useQueryClient()
  const itemsQuery = useTransactionItems(transactionId)
  const addItem = useAddTransactionItem(transactionId)

  const [editingItem, setEditingItem] = useState<TransactionItem | null>(null)
  const [editingGroup, setEditingGroup] = useState<TransactionItemGroup | null>(null)
  const [addingQuantityGroup, setAddingQuantityGroup] = useState<TransactionItemGroup | null>(null)
  const [deletingGroup, setDeletingGroup] = useState<TransactionItemGroup | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [isAddingQuantity, setIsAddingQuantity] = useState(false)
  const [isRemovingGroup, setIsRemovingGroup] = useState(false)

  const updateItem = useUpdateTransactionItem(transactionId, editingItem?.id ?? '')
  const quantityItemId = addingQuantityGroup?.primaryItem.id ?? ''
  const updateQuantityItem = useUpdateTransactionItem(transactionId, quantityItemId)

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
  const items = useMemo(() => itemsQuery.data ?? [], [itemsQuery.data])
  const itemGroups = useMemo(() => groupTransactionItems(items), [items])

  async function refreshItems() {
    await queryClient.invalidateQueries({ queryKey: transactionItemsKeys.list(transactionId) })
    await queryClient.invalidateQueries({ queryKey: transactionKeys.detail(transactionId) })
  }

  function openAddItemForm() {
    setEditingGroup(null)
    setEditingItem(null)
    setShowForm(true)
    reset(defaultItemValues)
  }

  function openEditItemForm(group: TransactionItemGroup) {
    setEditingGroup(group)
    setEditingItem(group.primaryItem)
    setShowForm(true)
    reset({
      ...itemFormValues(group.primaryItem),
      weight: group.totalWeight,
    })
  }

  function closeItemForm() {
    setShowForm(false)
    setEditingItem(null)
    setEditingGroup(null)
    reset(defaultItemValues)
  }

  async function consolidateExtraItems(group: TransactionItemGroup) {
    const extraItems = group.items.filter((item) => item.id !== group.primaryItem.id)
    if (extraItems.length === 0) return

    await Promise.all(
      extraItems.map((item) => TransactionService.deleteItem(transactionId, item.id)),
    )
    await refreshItems()
  }

  async function addQuantityToGroup(group: TransactionItemGroup, quantity: number) {
    const nextWeight = group.totalWeight + quantity
    await updateQuantityItem.mutateAsync({ weight: nextWeight })
    await consolidateExtraItems(group)
  }

  async function removeItemGroup(group: TransactionItemGroup) {
    await Promise.all(
      group.items.map((item) => TransactionService.deleteItem(transactionId, item.id)),
    )
    await refreshItems()
  }

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
      if (editingGroup) {
        await consolidateExtraItems(editingGroup)
      }
    } else {
      await addItem.mutateAsync(payload)
    }

    closeItemForm()
  })

  const columns: ColumnDef<TransactionItemGroup>[] = [
    {
      id: 'materialName',
      header: 'Material',
      cell: ({ row }) => <span className="font-medium">{row.original.materialName}</span>,
    },
    {
      id: 'quantity',
      header: 'Quantity',
      cell: ({ row }) => `${String(row.original.totalWeight)} ${row.original.unit}`,
    },
    {
      id: 'price',
      header: 'Unit price',
      cell: ({ row }) => formatCurrency(row.original.price),
    },
    {
      id: 'total',
      header: 'Total',
      cell: ({ row }) => formatCurrency(row.original.totalAmount),
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
              setAddingQuantityGroup(row.original)
            }}
          >
            <Plus className="size-4" />
            Add qty
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={() => {
              openEditItemForm(row.original)
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
              setDeletingGroup(row.original)
            }}
          >
            <Trash2 className="size-4" />
            Remove
          </Button>
        </div>
      ),
    },
  ]

  return (
    <section className="space-y-4" aria-labelledby="transaction-items-heading">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="transaction-items-heading" className="text-lg font-semibold">
            Items
          </h2>
          <p className="text-muted-foreground text-sm">
            Add an item once, then use Add qty when you need another scale reading for the same
            material.
          </p>
        </div>
        <Button type="button" size="sm" disabled={disabled} onClick={openAddItemForm}>
          <Plus className="size-4" />
          Add item
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={itemGroups}
        isLoading={itemsQuery.isLoading}
        emptyMessage="No items yet. Add your first item to this draft."
        getRowId={(row) => row.key}
        renderMobileCard={(group) => (
          <Card className="gap-3 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{group.materialName}</p>
                <p className="text-muted-foreground text-sm">
                  {group.totalWeight} {group.unit} · {formatCurrency(group.price)}
                </p>
              </div>
              <p className="font-medium">{formatCurrency(group.totalAmount)}</p>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex-1"
                disabled={disabled}
                onClick={() => {
                  setAddingQuantityGroup(group)
                }}
              >
                Add qty
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex-1"
                disabled={disabled}
                onClick={() => {
                  openEditItemForm(group)
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
                  setDeletingGroup(group)
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

            <FormField label="Quantity" htmlFor="weight" error={errors.weight?.message} required>
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
              <Button type="button" variant="outline" onClick={closeItemForm}>
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

      <TransactionAddQuantityDialog
        open={Boolean(addingQuantityGroup)}
        onOpenChange={(open) => {
          if (!open) setAddingQuantityGroup(null)
        }}
        item={addingQuantityGroup}
        currentQuantity={addingQuantityGroup?.totalWeight ?? 0}
        isLoading={isAddingQuantity || updateQuantityItem.isPending}
        onSubmit={(quantity) => {
          if (!addingQuantityGroup) return
          setIsAddingQuantity(true)
          void addQuantityToGroup(addingQuantityGroup, quantity)
            .then(() => {
              setAddingQuantityGroup(null)
            })
            .finally(() => {
              setIsAddingQuantity(false)
            })
        }}
      />

      <ConfirmDialog
        open={Boolean(deletingGroup)}
        onOpenChange={(open) => {
          if (!open) setDeletingGroup(null)
        }}
        title="Remove item?"
        description="This material line will be removed from the draft transaction."
        confirmLabel="Remove"
        variant="destructive"
        isLoading={isRemovingGroup}
        onConfirm={() => {
          if (!deletingGroup) return
          setIsRemovingGroup(true)
          void removeItemGroup(deletingGroup)
            .then(() => {
              setDeletingGroup(null)
            })
            .finally(() => {
              setIsRemovingGroup(false)
            })
        }}
      />
    </section>
  )
}
