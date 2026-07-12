import { z } from 'zod'

import {
  EXPENSE_REFERENCE_TYPE_OPTIONS,
  referenceTypeRequiresEntityId,
} from '../lib/expense-reference'
import type { ExpenseReferenceType } from '../types/expense.types'

const referenceTypeSchema = z.enum(
  EXPENSE_REFERENCE_TYPE_OPTIONS as [ExpenseReferenceType, ...ExpenseReferenceType[]],
)

export const expenseSchema = z
  .object({
    category: z.string().trim().min(1, 'Category is required'),
    referenceType: referenceTypeSchema,
    referenceId: z.string().optional(),
    description: z
      .string()
      .trim()
      .min(1, 'Description is required')
      .max(500, 'Description is too long'),
    amount: z.coerce
      .number({ invalid_type_error: 'Amount must be a number' })
      .positive('Amount must be greater than zero'),
    expenseDate: z.string().min(1, 'Expense date is required'),
    notes: z.string().max(2000, 'Notes are too long').optional(),
  })
  .superRefine((values, ctx) => {
    if (referenceTypeRequiresEntityId(values.referenceType) && !values.referenceId?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Reference entity is required',
        path: ['referenceId'],
      })
    }
  })

export type ExpenseFormValues = z.infer<typeof expenseSchema>
