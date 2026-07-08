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

import {
  leaveSchemaForMode,
  type AnyLeaveFormValues,
  type LeaveFormMode,
} from '../validation/leave.schema'

interface LeaveFormProps {
  mode: 'create' | 'edit'
  employeeMode: LeaveFormMode
  defaultValues?: Partial<AnyLeaveFormValues>
  onSubmit: (values: AnyLeaveFormValues) => void
  onCancel: () => void
  isSubmitting: boolean
  apiError?: NormalizedApiError | null
  submitLabel?: string
}

export function LeaveForm({
  mode,
  employeeMode,
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
  apiError,
  submitLabel,
}: LeaveFormProps) {
  const employeeOptions = useEmployeeOptions()
  const schema = leaveSchemaForMode(employeeMode)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<AnyLeaveFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      leaveType: defaultValues?.leaveType ?? 'FULL_DAY',
      leaveDate: defaultValues?.leaveDate ?? '',
      reason: defaultValues?.reason ?? '',
      employeeId: defaultValues?.employeeId ?? '',
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

  const showEmployeePicker = employeeMode !== 'self'
  const employeeRequired = employeeMode === 'required-employee'

  return (
    <form
      onSubmit={(event) => {
        void submitHandler(event)
      }}
      className="space-y-6"
      noValidate
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {showEmployeePicker ? (
          <FormField
            label="Employee"
            htmlFor="employeeId"
            error={errors.employeeId?.message}
            required={employeeRequired}
            className="sm:col-span-2"
          >
            <Select
              id="employeeId"
              aria-invalid={Boolean(errors.employeeId)}
              {...register('employeeId')}
            >
              <option value="">{employeeRequired ? 'Select employee' : 'Myself (default)'}</option>
              {(employeeOptions.data ?? []).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FormField>
        ) : null}

        <FormField
          label="Leave type"
          htmlFor="leaveType"
          error={errors.leaveType?.message}
          required
        >
          <Select
            id="leaveType"
            aria-invalid={Boolean(errors.leaveType)}
            {...register('leaveType')}
          >
            <option value="FULL_DAY">Full day</option>
            <option value="HALF_DAY">Half day</option>
          </Select>
        </FormField>

        <FormField
          label="Leave date"
          htmlFor="leaveDate"
          error={errors.leaveDate?.message}
          required
        >
          <Input id="leaveDate" type="date" {...register('leaveDate')} />
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
          ) : (
            (submitLabel ?? (mode === 'create' ? 'Create leave request' : 'Save changes'))
          )}
        </Button>
      </div>
    </form>
  )
}
