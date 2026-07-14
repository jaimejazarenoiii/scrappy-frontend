import { z } from 'zod'

import type { ItemUnit } from '@/features/transactions/types/transaction.types'

export const TRIP_LOAD_ITEM_UNITS = [
  'KG',
  'G',
  'TON',
  'LB',
  'PIECE',
  'BUNDLE',
  'SACK',
] as const satisfies readonly ItemUnit[]

const unitSchema = z.enum(TRIP_LOAD_ITEM_UNITS) as z.ZodType<ItemUnit>

const optionalNotes = z.string().trim().max(500, 'Notes are too long').optional().or(z.literal(''))

export const tripLoadItemSchema = z.object({
  materialName: z.string().trim().min(1, 'Material is required').max(200, 'Material is too long'),
  quantity: z.coerce.number().positive('Quantity must be greater than zero'),
  unit: unitSchema,
  notes: optionalNotes,
})

export type TripLoadItemFormValues = z.infer<typeof tripLoadItemSchema>
