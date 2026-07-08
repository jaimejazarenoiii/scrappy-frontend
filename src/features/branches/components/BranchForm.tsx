import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import type { NormalizedApiError } from '@/lib/axios'
import { applyApiValidationErrors } from '@/utils/form-errors'

import { branchSchema, type BranchFormValues } from '../validation/branch.schema'

interface BranchFormProps {
  mode: 'create' | 'edit'
  defaultValues?: Partial<BranchFormValues>
  onSubmit: (values: BranchFormValues) => void
  onCancel: () => void
  isSubmitting: boolean
  apiError?: NormalizedApiError | null
}

export function BranchForm({
  mode,
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
  apiError,
}: BranchFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      address: defaultValues?.address ?? '',
      contactNumber: defaultValues?.contactNumber ?? '',
      status: defaultValues?.status ?? 'ACTIVE',
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
            'Create branch'
          ) : (
            'Save changes'
          )}
        </Button>
      </div>
    </form>
  )
}
