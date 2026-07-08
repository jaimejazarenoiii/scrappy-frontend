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
  reopenTransactionSchema,
  type ReopenTransactionValues,
} from '../validation/transaction-reopen.schema'

interface ReopenTransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isLoading?: boolean
  onSubmit: (values: ReopenTransactionValues) => void
}

export function ReopenTransactionDialog({
  open,
  onOpenChange,
  isLoading = false,
  onSubmit,
}: ReopenTransactionDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReopenTransactionValues>({
    resolver: zodResolver(reopenTransactionSchema),
    defaultValues: { reason: '' },
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
            <DialogTitle>Reopen transaction?</DialogTitle>
            <DialogDescription>
              This returns a paid transaction to a settlement-capable state. A reason is required.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <FormField label="Reason" htmlFor="reason" error={errors.reason?.message} required>
              <Textarea
                id="reason"
                placeholder="Why is this being reopened?"
                {...register('reason')}
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
            <Button type="submit" variant="destructive" disabled={isLoading}>
              {isLoading ? 'Reopening…' : 'Reopen transaction'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
