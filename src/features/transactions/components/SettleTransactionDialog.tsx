import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

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
import { Textarea } from '@/components/ui/textarea'

import {
  settleTransactionSchema,
  type SettleTransactionValues,
} from '../validation/transaction-settle.schema'

interface SettleTransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isLoading?: boolean
  onSubmit: (values: SettleTransactionValues) => void
}

export function SettleTransactionDialog({
  open,
  onOpenChange,
  isLoading = false,
  onSubmit,
}: SettleTransactionDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SettleTransactionValues>({
    resolver: zodResolver(settleTransactionSchema),
    defaultValues: { settlementNote: '' },
  })

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset()
        onOpenChange(next)
      }}
    >
      <DialogContent>
        <form
          onSubmit={(event) => {
            void handleSubmit((values) => {
              onSubmit(values)
            })(event)
          }}
        >
          <DialogHeader>
            <DialogTitle>Mark transaction as paid?</DialogTitle>
            <DialogDescription>
              This will settle the transaction using backend payment totals. You can add an optional
              settlement note.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <FormField
              label="Settlement note"
              htmlFor="settlementNote"
              error={errors.settlementNote?.message}
            >
              <Textarea
                id="settlementNote"
                placeholder="Optional note…"
                {...register('settlementNote')}
              />
            </FormField>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={() => {
                onOpenChange(false)
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Settling…' : 'Mark as paid'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
