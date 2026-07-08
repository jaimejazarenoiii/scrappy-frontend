import { z } from 'zod'

const optionalString = z
  .string()
  .trim()
  .max(500, 'This value is too long')
  .optional()
  .or(z.literal(''))

export const attendanceCorrectionSchema = z.object({
  timeInAt: optionalString,
  timeOutAt: optionalString,
  note: optionalString,
  correctionNote: z.string().min(1, 'Correction note is required').max(500, 'Note is too long'),
})

export type AttendanceCorrectionFormValues = z.infer<typeof attendanceCorrectionSchema>
