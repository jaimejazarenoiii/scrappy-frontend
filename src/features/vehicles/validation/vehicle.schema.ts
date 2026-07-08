import { z } from 'zod'

const optionalString = z
  .string()
  .trim()
  .max(200, 'This value is too long')
  .optional()
  .or(z.literal(''))

export const vehicleSchema = z.object({
  plateNumber: z.string().min(1, 'Plate number is required').max(20, 'Plate number is too long'),
  description: optionalString,
  vehicleType: optionalString,
  status: z.enum(['AVAILABLE', 'IN_USE', 'MAINTENANCE', 'INACTIVE']).optional(),
  branchId: z.string().optional().or(z.literal('')),
  warehouseId: z.string().optional().or(z.literal('')),
})

export type VehicleFormValues = z.infer<typeof vehicleSchema>
