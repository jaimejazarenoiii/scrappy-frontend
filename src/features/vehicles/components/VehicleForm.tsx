import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useBranchOptions } from '@/features/branches/hooks/useBranchOptions'
import { useWarehouseOptions } from '@/features/warehouses/hooks/useWarehouseOptions'
import type { NormalizedApiError } from '@/lib/axios'
import { applyApiValidationErrors } from '@/utils/form-errors'

import { vehicleSchema, type VehicleFormValues } from '../validation/vehicle.schema'

interface VehicleFormProps {
  mode: 'create' | 'edit'
  defaultValues?: Partial<VehicleFormValues>
  onSubmit: (values: VehicleFormValues) => void
  onCancel: () => void
  isSubmitting: boolean
  apiError?: NormalizedApiError | null
}

export function VehicleForm({
  mode,
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
  apiError,
}: VehicleFormProps) {
  const branchOptionsQuery = useBranchOptions()
  const warehouseOptionsQuery = useWarehouseOptions()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      plateNumber: defaultValues?.plateNumber ?? '',
      description: defaultValues?.description ?? '',
      vehicleType: defaultValues?.vehicleType ?? '',
      status: defaultValues?.status ?? 'AVAILABLE',
      branchId: defaultValues?.branchId ?? '',
      warehouseId: defaultValues?.warehouseId ?? '',
    },
  })

  useEffect(() => {
    if (apiError) {
      applyApiValidationErrors(apiError, setError)
    }
  }, [apiError, setError])

  const submitHandler = handleSubmit((values) => {
    onSubmit(values)
  })

  const branches = branchOptionsQuery.data ?? []
  const warehouses = warehouseOptionsQuery.data ?? []

  return (
    <form
      onSubmit={(event) => {
        void submitHandler(event)
      }}
      className="space-y-6"
      noValidate
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          label="Plate number"
          htmlFor="plateNumber"
          error={errors.plateNumber?.message}
          required
        >
          <Input
            id="plateNumber"
            aria-invalid={Boolean(errors.plateNumber)}
            {...register('plateNumber')}
          />
        </FormField>

        <FormField label="Vehicle type" htmlFor="vehicleType" error={errors.vehicleType?.message}>
          <Input id="vehicleType" placeholder="Truck, van, etc." {...register('vehicleType')} />
        </FormField>

        <FormField
          label="Description"
          htmlFor="description"
          error={errors.description?.message}
          className="sm:col-span-2"
        >
          <Input id="description" {...register('description')} />
        </FormField>

        <FormField label="Branch" htmlFor="branchId" error={errors.branchId?.message}>
          <Select id="branchId" {...register('branchId')} disabled={branchOptionsQuery.isLoading}>
            <option value="">No branch assigned</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Warehouse" htmlFor="warehouseId" error={errors.warehouseId?.message}>
          <Select
            id="warehouseId"
            {...register('warehouseId')}
            disabled={warehouseOptionsQuery.isLoading}
          >
            <option value="">No warehouse assigned</option>
            {warehouses.map((warehouse) => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Status" htmlFor="status" error={errors.status?.message}>
          <Select id="status" {...register('status')}>
            <option value="AVAILABLE">Available</option>
            <option value="IN_USE">In use</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="INACTIVE">Inactive</option>
          </Select>
        </FormField>
      </div>

      <div className="flex justify-end gap-2 border-t pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving…
            </>
          ) : mode === 'create' ? (
            'Create vehicle'
          ) : (
            'Save changes'
          )}
        </Button>
      </div>
    </form>
  )
}
