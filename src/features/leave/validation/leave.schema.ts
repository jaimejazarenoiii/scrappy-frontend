import { z } from 'zod'

const optionalString = z
  .string()
  .trim()
  .max(500, 'This value is too long')
  .optional()
  .or(z.literal(''))

const baseLeaveFields = {
  leaveType: z.enum(['HALF_DAY', 'FULL_DAY']),
  leaveDate: z.string().min(1, 'Leave date is required'),
  reason: optionalString,
}

export const leaveSchema = z.object(baseLeaveFields)

export const leaveWithEmployeeSchema = z.object({
  ...baseLeaveFields,
  employeeId: z.string().optional().or(z.literal('')),
})

export const leaveWithRequiredEmployeeSchema = z.object({
  ...baseLeaveFields,
  employeeId: z.string().min(1, 'Employee is required'),
})

export interface LeaveFormFields {
  leaveType: 'HALF_DAY' | 'FULL_DAY'
  leaveDate: string
  reason?: string
  employeeId?: string
}

export type LeaveFormValues = z.infer<typeof leaveSchema>
export type LeaveWithEmployeeFormValues = z.infer<typeof leaveWithEmployeeSchema>
export type LeaveWithRequiredEmployeeFormValues = z.infer<typeof leaveWithRequiredEmployeeSchema>

export type LeaveFormMode = 'self' | 'optional-employee' | 'required-employee'

export function leaveSchemaForMode(mode: LeaveFormMode) {
  switch (mode) {
    case 'required-employee':
      return leaveWithRequiredEmployeeSchema
    case 'optional-employee':
      return leaveWithEmployeeSchema
    default:
      return leaveSchema
  }
}

export type AnyLeaveFormValues = LeaveFormFields
