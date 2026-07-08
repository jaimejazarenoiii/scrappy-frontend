import { z } from 'zod'

export const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or username is required').max(255, 'This value is too long'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean(),
})

export type LoginFormValues = z.infer<typeof loginSchema>
