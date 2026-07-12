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

import { tripCancelSchema, type TripCancelFormValues } from '../validation/trip-cancel.schema'

interface CancelTripDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isLoading?: boolean
  onSubmit: (values: TripCancelFormValues) => void
}

export function CancelTripDialog({
  open,
  onOpenChange,
  isLoading = false,
  onSubmit,
}: CancelTripDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TripCancelFormValues>({
    resolver: zodResolver(tripCancelSchema),
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
            <DialogTitle>Cancel trip?</DialogTitle>
            <DialogDescription>
              This will cancel the trip. You can optionally provide a reason.
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
              Keep trip
            </Button>
            <Button type="submit" variant="destructive" disabled={isLoading}>
              {isLoading ? 'Cancelling…' : 'Cancel trip'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
