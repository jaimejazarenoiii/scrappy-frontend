import { z } from 'zod'

export const settleTransactionSchema = z.object({
  settlementNote: z.string().trim().max(500, 'Note is too long').optional().or(z.literal('')),
})

export type SettleTransactionValues = z.infer<typeof settleTransactionSchema>
