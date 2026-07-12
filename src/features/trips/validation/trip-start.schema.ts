import { z } from 'zod'

export const tripStartSchema = z.object({
  startingOdometer: z.coerce
    .number({ invalid_type_error: 'Starting odometer must be a number' })
    .nonnegative('Starting odometer cannot be negative'),
})

export type TripStartFormValues = z.infer<typeof tripStartSchema>
