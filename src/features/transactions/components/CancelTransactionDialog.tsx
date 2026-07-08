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
  cancelTransactionSchema,
  type CancelTransactionValues,
} from '../validation/transaction-cancel.schema'

interface CancelTransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isLoading?: boolean
  onSubmit: (values: CancelTransactionValues) => void
}

export function CancelTransactionDialog({
  open,
  onOpenChange,
  isLoading = false,
  onSubmit,
}: CancelTransactionDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CancelTransactionValues>({
    resolver: zodResolver(cancelTransactionSchema),
    defaultValues: { cancellationReason: '' },
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
            <DialogTitle>Cancel transaction?</DialogTitle>
            <DialogDescription>
              This will cancel the transaction. You can optionally provide a reason.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <FormField
              label="Cancellation reason"
              htmlFor="cancellationReason"
              error={errors.cancellationReason?.message}
            >
              <Textarea
                id="cancellationReason"
                placeholder="Optional reason…"
                {...register('cancellationReason')}
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
              Keep transaction
            </Button>
            <Button type="submit" variant="destructive" disabled={isLoading}>
              {isLoading ? 'Cancelling…' : 'Cancel transaction'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
