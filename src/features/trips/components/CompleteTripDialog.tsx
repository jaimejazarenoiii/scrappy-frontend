import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
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

import {
  createTripCompleteSchema,
  type TripCompleteFormValues,
} from '../validation/trip-complete.schema'

interface CompleteTripDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isLoading?: boolean
  startingOdometer?: number | null
  onSubmit: (values: TripCompleteFormValues) => void
}

export function CompleteTripDialog({
  open,
  onOpenChange,
  isLoading = false,
  startingOdometer = null,
  onSubmit,
}: CompleteTripDialogProps) {
  const schema = useMemo(() => createTripCompleteSchema(startingOdometer), [startingOdometer])
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TripCompleteFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      endingOdometer: startingOdometer ?? 0,
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        endingOdometer: startingOdometer ?? 0,
      })
    }
  }, [open, reset, startingOdometer])

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
              Record the ending odometer reading to complete this trip
              {startingOdometer != null
                ? ` (started at ${startingOdometer.toLocaleString('en-PH', { maximumFractionDigits: 3 })}).`
                : '.'}
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
                min={startingOdometer ?? 0}
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
