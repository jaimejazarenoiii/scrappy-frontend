import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'

import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { useEmployeeOptions } from '@/features/employees/hooks/useEmployeeOptions'
import { useVehicles } from '@/features/vehicles/hooks/useVehicles'
import type { NormalizedApiError } from '@/lib/axios'
import { applyApiValidationErrors } from '@/utils/form-errors'

import { tripMemberRoleLabel } from '../lib/trip-member'
import { TRIP_MEMBER_ROLES, tripSchema, type TripFormValues } from '../validation/trip.schema'

interface TripFormProps {
  mode: 'create' | 'edit'
  defaultValues?: Partial<TripFormValues>
  onSubmit: (values: TripFormValues) => void
  onCancel: () => void
  isSubmitting: boolean
  apiError?: NormalizedApiError | null
}

export function TripForm({
  mode,
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
  apiError,
}: TripFormProps) {
  const vehiclesQuery = useVehicles({
    page: 1,
    pageSize: 100,
    filters: mode === 'create' ? { status: 'AVAILABLE' } : undefined,
  })
  const employeeOptions = useEmployeeOptions()

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<TripFormValues>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      origin: defaultValues?.origin ?? '',
      destination: defaultValues?.destination ?? '',
      scheduledStart: defaultValues?.scheduledStart ?? '',
      vehicleId: defaultValues?.vehicleId ?? '',
      notes: defaultValues?.notes ?? '',
      members: defaultValues?.members ?? [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'members',
  })

  useEffect(() => {
    if (apiError) {
      applyApiValidationErrors(apiError, setError)
    }
  }, [apiError, setError])

  return (
    <form
      onSubmit={(event) => {
        void handleSubmit(onSubmit)(event)
      }}
      className="space-y-6"
      noValidate
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Origin" htmlFor="origin" error={errors.origin?.message} required>
          <Input id="origin" aria-invalid={Boolean(errors.origin)} {...register('origin')} />
        </FormField>

        <FormField
          label="Destination"
          htmlFor="destination"
          error={errors.destination?.message}
          required
        >
          <Input
            id="destination"
            aria-invalid={Boolean(errors.destination)}
            {...register('destination')}
          />
        </FormField>

        <FormField
          label="Scheduled start"
          htmlFor="scheduledStart"
          error={errors.scheduledStart?.message}
          required
        >
          <Input
            id="scheduledStart"
            type="datetime-local"
            aria-invalid={Boolean(errors.scheduledStart)}
            {...register('scheduledStart')}
          />
        </FormField>

        <FormField label="Vehicle" htmlFor="vehicleId" error={errors.vehicleId?.message} required>
          {vehiclesQuery.isLoading ? (
            <Skeleton className="h-10 w-full rounded-md" />
          ) : (
            <Select
              id="vehicleId"
              aria-invalid={Boolean(errors.vehicleId)}
              {...register('vehicleId')}
              disabled={isSubmitting}
            >
              <option value="">Select vehicle</option>
              {(vehiclesQuery.data?.data ?? []).map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.plateNumber}
                  {vehicle.description ? ` — ${vehicle.description}` : ''}
                </option>
              ))}
            </Select>
          )}
        </FormField>
      </div>

      <FormField label="Notes" htmlFor="notes" error={errors.notes?.message}>
        <Textarea id="notes" rows={4} {...register('notes')} />
      </FormField>

      {mode === 'create' ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="font-medium">Trip members</h3>
              <p className="text-muted-foreground text-sm">
                Optional crew assignments for this trip.
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isSubmitting || employeeOptions.isLoading}
              onClick={() => {
                append({ employeeId: '', role: 'HELPER' })
              }}
            >
              <Plus className="size-4" />
              Add member
            </Button>
          </div>

          {fields.length === 0 ? (
            <p className="text-muted-foreground text-sm">No members added yet.</p>
          ) : (
            <ul className="space-y-3">
              {fields.map((field, index) => {
                const memberIndex = String(index)
                return (
                  <li
                    key={field.id}
                    className="grid gap-3 rounded-md border p-3 sm:grid-cols-[1fr_11rem_auto]"
                  >
                    <FormField
                      label="Employee"
                      htmlFor={`members.${memberIndex}.employeeId`}
                      error={errors.members?.[index]?.employeeId?.message}
                    >
                      <Select
                        id={`members.${memberIndex}.employeeId`}
                        {...register(`members.${memberIndex}.employeeId` as 'members.0.employeeId')}
                        disabled={employeeOptions.isLoading || isSubmitting}
                      >
                        <option value="">Select employee</option>
                        {(employeeOptions.data ?? []).map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Select>
                    </FormField>

                    <FormField
                      label="Role"
                      htmlFor={`members.${memberIndex}.role`}
                      error={errors.members?.[index]?.role?.message}
                    >
                      <Select
                        id={`members.${memberIndex}.role`}
                        {...register(`members.${memberIndex}.role` as 'members.0.role')}
                        disabled={isSubmitting}
                      >
                        {TRIP_MEMBER_ROLES.map((role) => (
                          <option key={role} value={role}>
                            {tripMemberRoleLabel(role)}
                          </option>
                        ))}
                      </Select>
                    </FormField>

                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Remove member"
                        disabled={isSubmitting}
                        onClick={() => {
                          remove(index)
                        }}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
          {mode === 'create' ? 'Create trip' : 'Save changes'}
        </Button>
        <Button type="button" variant="outline" disabled={isSubmitting} onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
