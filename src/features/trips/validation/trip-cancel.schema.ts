import { z } from 'zod'

export const tripCancelSchema = z.object({
  cancellationReason: z.string().trim().max(500, 'Reason is too long').optional().or(z.literal('')),
})

export type TripCancelFormValues = z.infer<typeof tripCancelSchema>
