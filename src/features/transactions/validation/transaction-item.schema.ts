import { z } from 'zod'

import type { ItemUnit } from '../types/transaction.types'

const optionalString = z
  .string()
  .trim()
  .max(500, 'This value is too long')
  .optional()
  .or(z.literal(''))

const unitSchema = z.enum([
  'KG',
  'G',
  'TON',
  'LB',
  'PIECE',
  'BUNDLE',
  'SACK',
]) as z.ZodType<ItemUnit>

export const transactionItemSchema = z.object({
  materialName: z.string().trim().min(1, 'Material is required').max(200, 'Material is too long'),
  weight: z.coerce.number().positive('Weight must be greater than zero'),
  unit: unitSchema,
  price: z.coerce.number().positive('Unit price must be greater than zero'),
  notes: optionalString,
})

export type TransactionItemValues = z.infer<typeof transactionItemSchema>
