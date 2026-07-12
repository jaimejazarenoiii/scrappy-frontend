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
import { Input } from '@/components/ui/input'

import { tripCompleteSchema, type TripCompleteFormValues } from '../validation/trip-complete.schema'

interface CompleteTripDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isLoading?: boolean
  onSubmit: (values: TripCompleteFormValues) => void
}

export function CompleteTripDialog({
  open,
  onOpenChange,
  isLoading = false,
  onSubmit,
}: CompleteTripDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TripCompleteFormValues>({
    resolver: zodResolver(tripCompleteSchema),
    defaultValues: { endingOdometer: 0 },
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
            <DialogTitle>Complete trip?</DialogTitle>
            <DialogDescription>
              Record the ending odometer reading to complete this trip.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <FormField
              label="Ending odometer"
              htmlFor="endingOdometer"
              error={errors.endingOdometer?.message}
              required
            >
              <Input
                id="endingOdometer"
                type="number"
                min={0}
                step="0.1"
                {...register('endingOdometer')}
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
              {isLoading ? 'Completing…' : 'Complete trip'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
