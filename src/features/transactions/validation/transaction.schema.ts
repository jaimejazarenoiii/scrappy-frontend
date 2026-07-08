import { z } from 'zod'

import type { DirectionInput, LocationType } from '../types/transaction.types'

const optionalString = z
  .string()
  .trim()
  .max(500, 'This value is too long')
  .optional()
  .or(z.literal(''))

const directionSchema = z.enum(['INBOUND', 'OUTBOUND', 'BUY', 'SELL']) as z.ZodType<DirectionInput>

const locationTypeSchema = z.enum(['BRANCH', 'WAREHOUSE', 'OUTSIDE']) as z.ZodType<LocationType>

export const transactionDraftSchema = z
  .object({
    direction: directionSchema,
    partyName: z
      .string()
      .trim()
      .min(1, 'Party name is required')
      .max(200, 'Party name is too long'),
    partyContactNumber: optionalString,
    transactionDate: optionalString,
    locationType: locationTypeSchema,
    branchId: z.string().optional().or(z.literal('')),
    warehouseId: z.string().optional().or(z.literal('')),
    outsideLocationName: z.string().optional().or(z.literal('')),
    outsideAddress: z.string().optional().or(z.literal('')),
    notes: optionalString,
    assignedEmployeeIds: z
      .array(z.string().min(1))
      .min(1, 'At least one employee must be assigned'),
  })
  .superRefine((values, ctx) => {
    if (values.locationType === 'BRANCH' && !values.branchId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Branch is required for branch transactions',
        path: ['branchId'],
      })
    }

    if (values.locationType === 'WAREHOUSE' && !values.warehouseId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Warehouse is required for warehouse transactions',
        path: ['warehouseId'],
      })
    }

    if (
      values.locationType === 'OUTSIDE' &&
      (!values.outsideLocationName || !values.outsideAddress)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Outside location name and address are required',
        path: ['outsideLocationName'],
      })
    }
  })

export type TransactionDraftValues = z.infer<typeof transactionDraftSchema>
