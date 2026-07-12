import { z } from 'zod'

const optionalString = z
  .string()
  .trim()
  .max(255, 'This value is too long')
  .optional()
  .or(z.literal(''))

export const companySchema = z.object({
  name: z.string().min(1, 'Business name is required').max(160, 'Business name is too long'),
  email: z.string().trim().email('Enter a valid email address').optional().or(z.literal('')),
  contactNumber: optionalString,
  address: optionalString,
})

export type CompanyFormValues = z.infer<typeof companySchema>
