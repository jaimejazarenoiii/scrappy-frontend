import { z } from 'zod'

import type { UserRole } from '@/features/auth/types/auth.types'

const optionalString = z
  .string()
  .trim()
  .max(120, 'This value is too long')
  .optional()
  .or(z.literal(''))

const accountRoleSchema = z.enum(['OWNER', 'MANAGER', 'EMPLOYEE'])

export const employeeSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required').max(120, 'First name is too long'),
    middleName: optionalString,
    lastName: z.string().min(1, 'Last name is required').max(120, 'Last name is too long'),
    suffix: optionalString,
    employeeNumber: optionalString,
    contactNumber: z
      .string()
      .trim()
      .max(40, 'Contact number is too long')
      .optional()
      .or(z.literal('')),
    weeklySalary: z.coerce
      .number({ invalid_type_error: 'Weekly salary is required' })
      .min(0, 'Weekly salary must be zero or greater'),
    linkUserId: z.string().optional().or(z.literal('')),
    createAccount: z.boolean(),
    accountEmail: z.string().optional().or(z.literal('')),
    accountPassword: z.string().optional().or(z.literal('')),
    accountConfirmPassword: z.string().optional().or(z.literal('')),
    accountRole: accountRoleSchema,
  })
  .superRefine((values, ctx) => {
    if (!values.createAccount) return

    const email = values.accountEmail?.trim() ?? ''
    if (!email) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Email is required when creating an account',
        path: ['accountEmail'],
      })
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Enter a valid email address',
        path: ['accountEmail'],
      })
    }

    const password = values.accountPassword ?? ''
    if (password.length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Password must be at least 8 characters',
        path: ['accountPassword'],
      })
    }

    if (password !== (values.accountConfirmPassword ?? '')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['accountConfirmPassword'],
      })
    }
  })

export type EmployeeFormValues = z.infer<typeof employeeSchema>

export const grantSystemAccessSchema = z
  .object({
    email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
    role: accountRoleSchema,
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type GrantSystemAccessFormValues = z.infer<typeof grantSystemAccessSchema>

/** Roles the current actor may assign when provisioning login. */
export function assignableAccountRoles(actorRole: UserRole | undefined): UserRole[] {
  if (actorRole === 'OWNER') return ['OWNER', 'MANAGER', 'EMPLOYEE']
  return ['EMPLOYEE']
}
