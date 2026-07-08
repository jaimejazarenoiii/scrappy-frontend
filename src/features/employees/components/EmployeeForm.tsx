import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { employeeSchema, type EmployeeFormValues } from '../validation/employee.schema'

interface EmployeeFormProps {
  mode: 'create' | 'edit'
  defaultValues?: Partial<EmployeeFormValues>
  onSubmit: (values: EmployeeFormValues) => void
  onCancel: () => void
  isSubmitting: boolean
}

export function EmployeeForm({
  mode,
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
}: EmployeeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      firstName: defaultValues?.firstName ?? '',
      middleName: defaultValues?.middleName ?? '',
      lastName: defaultValues?.lastName ?? '',
      suffix: defaultValues?.suffix ?? '',
      employeeNumber: defaultValues?.employeeNumber ?? '',
      contactNumber: defaultValues?.contactNumber ?? '',
      weeklySalary: defaultValues?.weeklySalary ?? 0,
      linkUserId: defaultValues?.linkUserId ?? '',
    },
  })

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
          label="First name"
          htmlFor="firstName"
          error={errors.firstName?.message}
          required
        >
          <Input
            id="firstName"
            aria-invalid={Boolean(errors.firstName)}
            {...register('firstName')}
          />
        </FormField>

        <FormField label="Last name" htmlFor="lastName" error={errors.lastName?.message} required>
          <Input id="lastName" aria-invalid={Boolean(errors.lastName)} {...register('lastName')} />
        </FormField>

        <FormField label="Middle name" htmlFor="middleName" error={errors.middleName?.message}>
          <Input id="middleName" {...register('middleName')} />
        </FormField>

        <FormField label="Suffix" htmlFor="suffix" error={errors.suffix?.message}>
          <Input id="suffix" placeholder="Jr., Sr., III" {...register('suffix')} />
        </FormField>

        <FormField
          label="Employee number"
          htmlFor="employeeNumber"
          error={errors.employeeNumber?.message}
        >
          <Input id="employeeNumber" placeholder="EMP-001" {...register('employeeNumber')} />
        </FormField>

        <FormField
          label="Contact number"
          htmlFor="contactNumber"
          error={errors.contactNumber?.message}
        >
          <Input id="contactNumber" {...register('contactNumber')} />
        </FormField>

        <FormField
          label="Weekly salary"
          htmlFor="weeklySalary"
          error={errors.weeklySalary?.message}
          required
        >
          <Input
            id="weeklySalary"
            type="number"
            min={0}
            step="0.01"
            aria-invalid={Boolean(errors.weeklySalary)}
            {...register('weeklySalary')}
          />
        </FormField>

        {mode === 'edit' ? (
          <FormField
            label="Link user account"
            htmlFor="linkUserId"
            hint="User UUID to associate with this employee (POST /employees/{id}/user-link)."
            className="sm:col-span-2"
          >
            <Input id="linkUserId" placeholder="User UUID" {...register('linkUserId')} />
          </FormField>
        ) : null}
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
            'Create employee'
          ) : (
            'Save changes'
          )}
        </Button>
      </div>
    </form>
  )
}
