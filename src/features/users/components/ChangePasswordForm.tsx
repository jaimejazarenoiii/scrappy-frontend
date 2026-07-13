import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'

import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ROUTES } from '@/constants/routes'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { useLogout } from '@/features/auth/hooks/useLogout'
import type { NormalizedApiError } from '@/lib/axios'
import { applyApiValidationErrors } from '@/utils/form-errors'

import { useChangePassword } from '../hooks/useChangePassword'
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from '../validation/change-password.schema'

export function ChangePasswordForm() {
  const navigate = useNavigate()
  const { currentUser } = useCurrentUser()
  const logout = useLogout()
  const changePassword = useChangePassword()
  const forced = currentUser?.passwordChangeRequired === true
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const serverError = changePassword.isError ? changePassword.error : null

  const onSubmit = handleSubmit((values) => {
    changePassword.mutate(values, {
      onSuccess: () => {
        void navigate(ROUTES.dashboard, { replace: true })
      },
      onError: (error: NormalizedApiError) => {
        applyApiValidationErrors(error, setError)
      },
    })
  })

  const isBusy = isSubmitting || changePassword.isPending

  return (
    <form
      onSubmit={(event) => {
        void onSubmit(event)
      }}
      className="space-y-5"
      noValidate
    >
      <div className="space-y-1.5 text-center sm:text-left">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight">
          {forced ? 'Set a new password' : 'Change password'}
        </h1>
        <p className="text-muted-foreground text-sm">
          {forced
            ? 'Your temporary password must be changed before you can continue.'
            : 'Choose a new password for your Scrappy account.'}
        </p>
      </div>

      {forced ? (
        <div
          className="flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-950 dark:text-amber-100"
          role="status"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>Password change required. Other parts of the app are locked until you finish.</span>
        </div>
      ) : null}

      {serverError && serverError.code !== 'VALIDATION_ERROR' ? (
        <div
          className="border-destructive/30 bg-destructive/10 text-destructive flex items-start gap-2 rounded-md border px-3 py-2 text-sm"
          role="alert"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{serverError.message}</span>
        </div>
      ) : null}

      <FormField
        label="Current password"
        htmlFor="currentPassword"
        error={errors.currentPassword?.message}
        required
      >
        <div className="relative">
          <Input
            id="currentPassword"
            type={showCurrent ? 'text' : 'password'}
            autoComplete="current-password"
            aria-invalid={Boolean(errors.currentPassword)}
            {...register('currentPassword')}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-1 size-8 -translate-y-1/2"
            onClick={() => {
              setShowCurrent((value) => !value)
            }}
            aria-label={showCurrent ? 'Hide current password' : 'Show current password'}
          >
            {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </Button>
        </div>
      </FormField>

      <FormField
        label="New password"
        htmlFor="newPassword"
        error={errors.newPassword?.message}
        required
      >
        <div className="relative">
          <Input
            id="newPassword"
            type={showNew ? 'text' : 'password'}
            autoComplete="new-password"
            aria-invalid={Boolean(errors.newPassword)}
            {...register('newPassword')}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-1 size-8 -translate-y-1/2"
            onClick={() => {
              setShowNew((value) => !value)
            }}
            aria-label={showNew ? 'Hide new password' : 'Show new password'}
          >
            {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </Button>
        </div>
      </FormField>

      <FormField
        label="Confirm new password"
        htmlFor="confirmPassword"
        error={errors.confirmPassword?.message}
        required
      >
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirm ? 'text' : 'password'}
            autoComplete="new-password"
            aria-invalid={Boolean(errors.confirmPassword)}
            {...register('confirmPassword')}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-1 size-8 -translate-y-1/2"
            onClick={() => {
              setShowConfirm((value) => !value)
            }}
            aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
          >
            {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </Button>
        </div>
      </FormField>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        {forced ? (
          <Button
            type="button"
            variant="outline"
            disabled={isBusy || logout.isPending}
            onClick={() => {
              logout.mutate()
            }}
          >
            Sign out
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            disabled={isBusy}
            onClick={() => {
              void navigate(-1)
            }}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isBusy}>
          {isBusy ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving…
            </>
          ) : (
            'Update password'
          )}
        </Button>
      </div>
    </form>
  )
}
