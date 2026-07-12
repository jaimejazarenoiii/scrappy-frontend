import { z } from 'zod'

import type { TripMemberRole } from '../types/trip.types'

export const TRIP_MEMBER_ROLES = [
  'DRIVER',
  'HELPER',
  'BUYER',
  'SUPERVISOR',
] as const satisfies readonly TripMemberRole[]

export const tripMemberInputSchema = z.object({
  employeeId: z.string().trim().min(1, 'Employee is required'),
  role: z.enum(TRIP_MEMBER_ROLES),
})

export const tripSchema = z.object({
  origin: z.string().trim().min(1, 'Origin is required').max(500, 'Origin is too long'),
  destination: z
    .string()
    .trim()
    .min(1, 'Destination is required')
    .max(500, 'Destination is too long'),
  scheduledStart: z.string().trim().min(1, 'Scheduled start is required'),
  vehicleId: z.string().trim().min(1, 'Vehicle is required'),
  notes: z.string().trim().max(2000, 'Notes are too long').optional().or(z.literal('')),
  members: z.array(tripMemberInputSchema).optional(),
})

export type TripFormValues = z.infer<typeof tripSchema>
