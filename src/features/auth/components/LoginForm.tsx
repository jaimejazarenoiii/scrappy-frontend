import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Navigate, useLocation } from 'react-router'

import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ROUTES } from '@/constants/routes'
import type { NormalizedApiError } from '@/lib/axios'
import { useAuthStore } from '@/store/auth.store'

import { useLogin } from '../hooks/useLogin'
import { loginSchema, type LoginFormValues } from '../validation/login.schema'

interface LocationState {
  from?: { pathname: string }
}

export function LoginForm() {
  const login = useLogin()
  const location = useLocation()
  const status = useAuthStore((state) => state.status)
  const [showPassword, setShowPassword] = useState(false)

  const redirectTo = (location.state as LocationState | null)?.from?.pathname ?? ROUTES.dashboard

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: '', password: '', remember: false },
  })

  if (status === 'authenticated') {
    return <Navigate to={redirectTo} replace />
  }

  const serverError = login.isError ? (login.error as NormalizedApiError) : null

  const onSubmit = handleSubmit((values) => {
    login.mutate(values)
  })

  const isBusy = isSubmitting || login.isPending

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
          Sign in
        </h1>
        <p className="text-muted-foreground text-sm">
          Enter your credentials to access your business workspace.
        </p>
      </div>

      {serverError ? (
        <div
          className="border-destructive/30 bg-destructive/10 text-destructive flex items-start gap-2 rounded-md border px-3 py-2 text-sm"
          role="alert"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>
            {serverError.status === 401
              ? 'Invalid email or password. Please try again.'
              : serverError.message}
          </span>
        </div>
      ) : null}

      <FormField
        label="Email or username"
        htmlFor="identifier"
        error={errors.identifier?.message}
        required
      >
        <Input
          id="identifier"
          type="text"
          autoComplete="username"
          autoFocus
          aria-invalid={Boolean(errors.identifier)}
          {...register('identifier')}
        />
      </FormField>

      <FormField label="Password" htmlFor="password" error={errors.password?.message} required>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            className="pr-10"
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => {
              setShowPassword((prev) => !prev)
            }}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer rounded-sm p-1 transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </FormField>

      <div className="flex items-center gap-2">
        <Checkbox id="remember" {...register('remember')} />
        <Label htmlFor="remember" className="cursor-pointer font-normal">
          Remember me on this device
        </Label>
      </div>

      <Button type="submit" className="w-full" disabled={isBusy}>
        {isBusy ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Signing in…
          </>
        ) : (
          'Sign in'
        )}
      </Button>
    </form>
  )
}
