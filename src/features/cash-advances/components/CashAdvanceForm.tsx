import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useEmployeeOptions } from '@/features/employees/hooks/useEmployeeOptions'
import type { NormalizedApiError } from '@/lib/axios'
import { applyApiValidationErrors } from '@/utils/form-errors'

import { cashAdvanceSchema, type CashAdvanceFormValues } from '../validation/cash-advance.schema'

interface CashAdvanceFormProps {
  mode: 'create' | 'edit'
  defaultValues?: Partial<CashAdvanceFormValues>
  onSubmit: (values: CashAdvanceFormValues) => void
  onCancel: () => void
  isSubmitting: boolean
  apiError?: NormalizedApiError | null
}

export function CashAdvanceForm({
  mode,
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
  apiError,
}: CashAdvanceFormProps) {
  const employeeOptions = useEmployeeOptions()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CashAdvanceFormValues>({
    resolver: zodResolver(cashAdvanceSchema),
    defaultValues: {
      employeeId: defaultValues?.employeeId ?? '',
      amount: defaultValues?.amount ?? 0,
      reason: defaultValues?.reason ?? '',
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
        <FormField
          label="Employee"
          htmlFor="employeeId"
          error={errors.employeeId?.message}
          required
        >
          <Select
            id="employeeId"
            aria-invalid={Boolean(errors.employeeId)}
            {...register('employeeId')}
          >
            <option value="">Select employee</option>
            {(employeeOptions.data ?? []).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Amount" htmlFor="amount" error={errors.amount?.message} required>
          <Input id="amount" type="number" step="0.01" min="0" {...register('amount')} />
        </FormField>

        <FormField
          label="Reason"
          htmlFor="reason"
          error={errors.reason?.message}
          className="sm:col-span-2"
        >
          <Input id="reason" {...register('reason')} />
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
            'Issue cash advance'
          ) : (
            'Save changes'
          )}
        </Button>
      </div>
    </form>
  )
}
