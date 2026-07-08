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
  returnToDraftSchema,
  type ReturnToDraftValues,
} from '../validation/transaction-return.schema'

interface ReturnToDraftDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isLoading?: boolean
  onSubmit: (values: ReturnToDraftValues) => void
}

export function ReturnToDraftDialog({
  open,
  onOpenChange,
  isLoading = false,
  onSubmit,
}: ReturnToDraftDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReturnToDraftValues>({
    resolver: zodResolver(returnToDraftSchema),
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
            <DialogTitle>Return to draft?</DialogTitle>
            <DialogDescription>
              Send this transaction back to draft so assigned employees can make corrections.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <FormField label="Reason" htmlFor="reason" error={errors.reason?.message}>
              <Textarea id="reason" placeholder="Optional reason…" {...register('reason')} />
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
              {isLoading ? 'Returning…' : 'Return to draft'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
