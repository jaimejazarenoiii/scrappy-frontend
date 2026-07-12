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

import { tripStartSchema, type TripStartFormValues } from '../validation/trip-start.schema'

interface StartTripDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isLoading?: boolean
  onSubmit: (values: TripStartFormValues) => void
}

export function StartTripDialog({
  open,
  onOpenChange,
  isLoading = false,
  onSubmit,
}: StartTripDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TripStartFormValues>({
    resolver: zodResolver(tripStartSchema),
    defaultValues: { startingOdometer: 0 },
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
            <DialogTitle>Start trip?</DialogTitle>
            <DialogDescription>
              Record the starting odometer reading to begin this trip.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <FormField
              label="Starting odometer"
              htmlFor="startingOdometer"
              error={errors.startingOdometer?.message}
              required
            >
              <Input
                id="startingOdometer"
                type="number"
                min={0}
                step="0.1"
                {...register('startingOdometer')}
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
              {isLoading ? 'Starting…' : 'Start trip'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
