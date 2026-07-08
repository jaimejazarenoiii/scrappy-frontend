import { z } from 'zod'

export const reopenTransactionSchema = z.object({
  reason: z.string().trim().min(1, 'Reason is required').max(500, 'Reason is too long'),
})

export type ReopenTransactionValues = z.infer<typeof reopenTransactionSchema>
