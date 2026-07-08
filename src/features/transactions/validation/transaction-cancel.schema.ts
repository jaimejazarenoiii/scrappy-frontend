import { z } from 'zod'

export const cancelTransactionSchema = z.object({
  cancellationReason: z.string().trim().max(500, 'Reason is too long').optional().or(z.literal('')),
})

export type CancelTransactionValues = z.infer<typeof cancelTransactionSchema>
