import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { FormField } from '@/components/common/FormField'
import { MaterialSuggestionsPicker } from '@/features/transactions/components/MaterialSuggestionsPicker'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { NormalizedApiError } from '@/lib/axios'
import { applyApiValidationErrors } from '@/utils/form-errors'
import { blankToUndefined } from '@/utils/form-values'

import type { TripLoadItem } from '../types/trip-load.types'
import {
  TRIP_LOAD_ITEM_UNITS,
  tripLoadItemSchema,
  type TripLoadItemFormValues,
} from '../validation/trip-load-item.schema'

interface TripLoadItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item?: TripLoadItem | null
  isSubmitting: boolean
  apiError?: NormalizedApiError | null
  onSubmit: (values: TripLoadItemFormValues) => void
}

const defaultValues: TripLoadItemFormValues = {
  materialName: '',
  quantity: 1,
  unit: 'KG',
  notes: '',
}

function toFormValues(item: TripLoadItem): TripLoadItemFormValues {
  return {
    materialName: item.materialName,
    quantity: item.quantity,
    unit: item.unit,
    notes: item.notes ?? '',
  }
}

export function TripLoadItemDialog({
  open,
  onOpenChange,
  item,
  isSubmitting,
  apiError,
  onSubmit,
}: TripLoadItemDialogProps) {
  const isEdit = Boolean(item)

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<TripLoadItemFormValues>({
    resolver: zodResolver(tripLoadItemSchema),
    defaultValues,
  })

  useEffect(() => {
    if (!open) return
    reset(item ? toFormValues(item) : defaultValues)
  }, [open, item, reset])

  useEffect(() => {
    if (apiError) {
      applyApiValidationErrors(apiError, setError)
    }
  }, [apiError, setError])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit load item' : 'Add load item'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update material, quantity, or notes for this load line.'
              : 'Define a material and quantity expected on this trip.'}
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          noValidate
          onSubmit={(event) => {
            void handleSubmit((values) => {
              onSubmit({
                ...values,
                notes: blankToUndefined(values.notes) ?? '',
              })
            })(event)
          }}
        >
          <FormField
            label="Material"
            htmlFor="tripLoadMaterialName"
            error={errors.materialName?.message}
            required
          >
            <Controller
              name="materialName"
              control={control}
              render={({ field }) => (
                <MaterialSuggestionsPicker
                  id="tripLoadMaterialName"
                  value={field.value}
                  disabled={isSubmitting}
                  placeholder="Search materials…"
                  onChange={field.onChange}
                />
              )}
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Quantity"
              htmlFor="tripLoadQuantity"
              error={errors.quantity?.message}
              required
            >
              <Input
                id="tripLoadQuantity"
                type="number"
                min={0}
                step="any"
                aria-invalid={Boolean(errors.quantity)}
                disabled={isSubmitting}
                {...register('quantity')}
              />
            </FormField>

            <FormField label="Unit" htmlFor="tripLoadUnit" error={errors.unit?.message} required>
              <Select
                id="tripLoadUnit"
                aria-invalid={Boolean(errors.unit)}
                disabled={isSubmitting}
                {...register('unit')}
              >
                {TRIP_LOAD_ITEM_UNITS.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>

          <FormField label="Notes" htmlFor="tripLoadNotes" error={errors.notes?.message}>
            <Textarea id="tripLoadNotes" rows={3} disabled={isSubmitting} {...register('notes')} />
          </FormField>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => {
                onOpenChange(false)
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
              {isEdit ? 'Save changes' : 'Add item'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
