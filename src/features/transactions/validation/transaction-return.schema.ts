import { z } from 'zod'

export const returnToDraftSchema = z.object({
  reason: z.string().trim().max(500, 'Reason is too long').optional().or(z.literal('')),
})

export type ReturnToDraftValues = z.infer<typeof returnToDraftSchema>
