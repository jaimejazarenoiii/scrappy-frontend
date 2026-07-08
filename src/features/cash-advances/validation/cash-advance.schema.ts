import { z } from 'zod'

const optionalString = z
  .string()
  .trim()
  .max(500, 'This value is too long')
  .optional()
  .or(z.literal(''))

export const cashAdvanceSchema = z.object({
  employeeId: z.string().min(1, 'Employee is required'),
  amount: z.coerce.number().positive('Amount must be greater than zero'),
  reason: optionalString,
})

export type CashAdvanceFormValues = z.infer<typeof cashAdvanceSchema>
