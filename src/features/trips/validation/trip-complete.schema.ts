import { z } from 'zod'

export const tripCompleteSchema = z.object({
  endingOdometer: z.coerce
    .number({ invalid_type_error: 'Ending odometer must be a number' })
    .nonnegative('Ending odometer cannot be negative'),
})

export type TripCompleteFormValues = z.infer<typeof tripCompleteSchema>
