import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useBranchOptions } from '@/features/branches/hooks/useBranchOptions'
import type { NormalizedApiError } from '@/lib/axios'
import { applyApiValidationErrors } from '@/utils/form-errors'

import { warehouseSchema, type WarehouseFormValues } from '../validation/warehouse.schema'

interface WarehouseFormProps {
  mode: 'create' | 'edit'
  defaultValues?: Partial<WarehouseFormValues>
  onSubmit: (values: WarehouseFormValues) => void
  onCancel: () => void
  isSubmitting: boolean
  apiError?: NormalizedApiError | null
}

export function WarehouseForm({
  mode,
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
  apiError,
}: WarehouseFormProps) {
  const branchOptionsQuery = useBranchOptions()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<WarehouseFormValues>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      address: defaultValues?.address ?? '',
      contactNumber: defaultValues?.contactNumber ?? '',
      status: defaultValues?.status ?? 'ACTIVE',
      branchId: defaultValues?.branchId ?? '',
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

  return (
    <form
      onSubmit={(event) => {
        void submitHandler(event)
      }}
      className="space-y-6"
      noValidate
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Name" htmlFor="name" error={errors.name?.message} required>
          <Input id="name" aria-invalid={Boolean(errors.name)} {...register('name')} />
        </FormField>

        <FormField
          label="Contact number"
          htmlFor="contactNumber"
          error={errors.contactNumber?.message}
        >
          <Input id="contactNumber" {...register('contactNumber')} />
        </FormField>

        <FormField
          label="Address"
          htmlFor="address"
          error={errors.address?.message}
          className="sm:col-span-2"
        >
          <Input id="address" {...register('address')} />
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

        <FormField label="Status" htmlFor="status" error={errors.status?.message}>
          <Select id="status" {...register('status')}>
            <option value="ACTIVE">Active</option>
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
            'Create warehouse'
          ) : (
            'Save changes'
          )}
        </Button>
      </div>
    </form>
  )
}
