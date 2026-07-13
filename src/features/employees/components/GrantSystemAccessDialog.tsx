import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { FormField } from '@/components/common/FormField'
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
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import type { UserRole } from '@/features/auth/types/auth.types'

import { useGrantSystemAccess } from '../hooks/useEmployeeMutations'
import {
  assignableAccountRoles,
  grantSystemAccessSchema,
  type GrantSystemAccessFormValues,
} from '../validation/employee.schema'

interface GrantSystemAccessDialogProps {
  employeeId: string
  employeeName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ROLE_LABELS: Record<UserRole, string> = {
  OWNER: 'Owner',
  MANAGER: 'Manager',
  EMPLOYEE: 'Employee',
}

export function GrantSystemAccessDialog({
  employeeId,
  employeeName,
  open,
  onOpenChange,
}: GrantSystemAccessDialogProps) {
  const { currentUser } = useCurrentUser()
  const roleOptions = assignableAccountRoles(currentUser?.role)
  const grantAccess = useGrantSystemAccess(employeeId)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GrantSystemAccessFormValues>({
    resolver: zodResolver(grantSystemAccessSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      role: 'EMPLOYEE',
    },
  })

  useEffect(() => {
    if (!open) {
      reset({
        email: '',
        password: '',
        confirmPassword: '',
        role: 'EMPLOYEE',
      })
    }
  }, [open, reset])

  const submitHandler = handleSubmit((values) => {
    grantAccess.mutate(values, {
      onSuccess: () => {
        onOpenChange(false)
      },
    })
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create login account</DialogTitle>
          <DialogDescription>
            Grant system access for {employeeName}. They will sign in with this email and password.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(event) => {
            void submitHandler(event)
          }}
          className="space-y-4"
          noValidate
        >
          <FormField label="Email" htmlFor="grantEmail" error={errors.email?.message} required>
            <Input
              id="grantEmail"
              type="email"
              autoComplete="off"
              aria-invalid={Boolean(errors.email)}
              {...register('email')}
            />
          </FormField>

          <FormField
            label="Password"
            htmlFor="grantPassword"
            error={errors.password?.message}
            required
          >
            <Input
              id="grantPassword"
              type="password"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.password)}
              {...register('password')}
            />
          </FormField>

          <FormField
            label="Confirm password"
            htmlFor="grantConfirmPassword"
            error={errors.confirmPassword?.message}
            required
          >
            <Input
              id="grantConfirmPassword"
              type="password"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.confirmPassword)}
              {...register('confirmPassword')}
            />
          </FormField>

          <FormField label="Role" htmlFor="grantRole" error={errors.role?.message} required>
            <Select id="grantRole" aria-invalid={Boolean(errors.role)} {...register('role')}>
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {ROLE_LABELS[role]}
                </option>
              ))}
            </Select>
          </FormField>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={grantAccess.isPending}
              onClick={() => {
                onOpenChange(false)
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={grantAccess.isPending}>
              {grantAccess.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Creating…
                </>
              ) : (
                'Create account'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
