import { z } from 'zod'

const optionalString = z
  .string()
  .trim()
  .max(160, 'This value is too long')
  .optional()
  .or(z.literal(''))

export const warehouseSchema = z.object({
  name: z.string().min(1, 'Name is required').max(160, 'Name is too long'),
  address: optionalString,
  contactNumber: z
    .string()
    .trim()
    .max(40, 'Contact number is too long')
    .optional()
    .or(z.literal('')),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  branchId: z.string().optional().or(z.literal('')),
})

export type WarehouseFormValues = z.infer<typeof warehouseSchema>
