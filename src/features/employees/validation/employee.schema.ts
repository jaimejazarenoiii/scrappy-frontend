import { z } from 'zod'

const optionalString = z
  .string()
  .trim()
  .max(120, 'This value is too long')
  .optional()
  .or(z.literal(''))

export const employeeSchema = z.object({
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
})

export type EmployeeFormValues = z.infer<typeof employeeSchema>
