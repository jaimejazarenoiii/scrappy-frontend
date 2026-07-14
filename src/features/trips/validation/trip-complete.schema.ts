import { z } from 'zod'

export function createTripCompleteSchema(startingOdometer: number | null = null) {
  return z
    .object({
      endingOdometer: z.coerce
        .number({ invalid_type_error: 'Ending odometer must be a number' })
        .nonnegative('Ending odometer cannot be negative'),
    })
    .superRefine((values, ctx) => {
      if (startingOdometer != null && values.endingOdometer < startingOdometer) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['endingOdometer'],
          message: `Ending odometer must be ≥ starting odometer (${String(startingOdometer)}).`,
        })
      }
    })
}

export const tripCompleteSchema = createTripCompleteSchema()

export type TripCompleteFormValues = z.infer<typeof tripCompleteSchema>
