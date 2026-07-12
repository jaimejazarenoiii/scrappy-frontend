import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { FormField } from '@/components/common/FormField'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import type { TransactionItem } from '../types/transaction.types'

const addQuantitySchema = z.object({
  quantity: z.coerce.number().positive('Quantity must be greater than zero'),
})

type AddQuantityValues = z.infer<typeof addQuantitySchema>

interface TransactionAddQuantityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: Pick<TransactionItem, 'materialName' | 'unit' | 'price'> | null
  currentQuantity: number
  isLoading?: boolean
  onSubmit: (quantity: number) => void
}

function formatQuantity(quantity: number, unit: string): string {
  return `${String(quantity)} ${unit}`
}

export function TransactionAddQuantityDialog({
  open,
  onOpenChange,
  item,
  currentQuantity,
  isLoading = false,
  onSubmit,
}: TransactionAddQuantityDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<AddQuantityValues>({
    resolver: zodResolver(addQuantitySchema),
    defaultValues: { quantity: 1 },
  })

  const addedQuantity = watch('quantity')
  const parsedAddedQuantity =
    typeof addedQuantity === 'number' ? addedQuantity : Number(addedQuantity)
  const newTotal =
    Number.isFinite(parsedAddedQuantity) && parsedAddedQuantity > 0
      ? currentQuantity + parsedAddedQuantity
      : currentQuantity

  useEffect(() => {
    if (!open) return
    reset({ quantity: 1 })
  }, [open, reset])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add quantity{item ? ` · ${item.materialName}` : ''}</DialogTitle>
          <DialogDescription>
            Enter how much to add from another scale reading. The line total updates automatically.
          </DialogDescription>
        </DialogHeader>

        {item ? (
          <form
            className="space-y-4"
            onSubmit={(event) => {
              void handleSubmit((values) => {
                onSubmit(values.quantity)
              })(event)
            }}
          >
            <div className="bg-muted/40 rounded-lg border px-4 py-3 text-sm">
              <p>
                Current:{' '}
                <span className="font-medium">{formatQuantity(currentQuantity, item.unit)}</span>
              </p>
              <p className="mt-1">
                New total:{' '}
                <span className="font-medium">{formatQuantity(newTotal, item.unit)}</span>
              </p>
            </div>

            <FormField
              label="Quantity to add"
              htmlFor="quantity"
              error={errors.quantity?.message}
              required
            >
              <Input
                id="quantity"
                type="number"
                step="0.01"
                min="0"
                autoFocus
                {...register('quantity')}
              />
            </FormField>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false)
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Adding…
                  </>
                ) : (
                  'Add to total'
                )}
              </Button>
            </DialogFooter>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
