import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import type { UserRole } from '@/features/auth/types/auth.types'
import {
  assignableAccountRoles,
  employeeSchema,
  type EmployeeFormValues,
} from '../validation/employee.schema'

interface EmployeeFormProps {
  mode: 'create' | 'edit'
  defaultValues?: Partial<EmployeeFormValues>
  onSubmit: (values: EmployeeFormValues) => void
  onCancel: () => void
  isSubmitting: boolean
}

const ROLE_LABELS: Record<UserRole, string> = {
  OWNER: 'Owner',
  MANAGER: 'Manager',
  EMPLOYEE: 'Employee',
}

export function EmployeeForm({
  mode,
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
}: EmployeeFormProps) {
  const { currentUser } = useCurrentUser()
  const roleOptions = assignableAccountRoles(currentUser?.role)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
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
      createAccount: defaultValues?.createAccount ?? false,
      accountEmail: defaultValues?.accountEmail ?? '',
      accountPassword: defaultValues?.accountPassword ?? '',
      accountConfirmPassword: defaultValues?.accountConfirmPassword ?? '',
      accountRole: defaultValues?.accountRole ?? 'EMPLOYEE',
    },
  })

  const createAccount = watch('createAccount')

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
            label="Link existing user"
            htmlFor="linkUserId"
            hint="Optional. Paste an existing user UUID to link without creating a new login."
            className="sm:col-span-2"
          >
            <Input id="linkUserId" placeholder="User UUID" {...register('linkUserId')} />
          </FormField>
        ) : null}
      </div>

      {mode === 'create' ? (
        <div className="space-y-4 rounded-lg border p-4">
          <div className="flex items-start gap-3">
            <Checkbox
              id="createAccount"
              checked={createAccount}
              onChange={(event) => {
                setValue('createAccount', event.target.checked, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }}
            />
            <div className="space-y-1">
              <Label htmlFor="createAccount" className="cursor-pointer font-medium">
                Create login account
              </Label>
              <p className="text-muted-foreground text-sm">
                Lets this employee sign in. Leave unchecked to save workforce details only.
              </p>
            </div>
          </div>

          {createAccount ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="Email"
                htmlFor="accountEmail"
                error={errors.accountEmail?.message}
                required
                className="sm:col-span-2"
              >
                <Input
                  id="accountEmail"
                  type="email"
                  autoComplete="off"
                  aria-invalid={Boolean(errors.accountEmail)}
                  {...register('accountEmail')}
                />
              </FormField>

              <FormField
                label="Password"
                htmlFor="accountPassword"
                error={errors.accountPassword?.message}
                required
              >
                <Input
                  id="accountPassword"
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={Boolean(errors.accountPassword)}
                  {...register('accountPassword')}
                />
              </FormField>

              <FormField
                label="Confirm password"
                htmlFor="accountConfirmPassword"
                error={errors.accountConfirmPassword?.message}
                required
              >
                <Input
                  id="accountConfirmPassword"
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={Boolean(errors.accountConfirmPassword)}
                  {...register('accountConfirmPassword')}
                />
              </FormField>

              <FormField
                label="Role"
                htmlFor="accountRole"
                error={errors.accountRole?.message}
                required
                className="sm:col-span-2"
              >
                <Select
                  id="accountRole"
                  aria-invalid={Boolean(errors.accountRole)}
                  {...register('accountRole')}
                >
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>
                      {ROLE_LABELS[role]}
                    </option>
                  ))}
                </Select>
              </FormField>
            </div>
          ) : null}
        </div>
      ) : null}

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
