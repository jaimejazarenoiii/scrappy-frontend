import { z } from 'zod'

const MAX_CUSTOM_RANGE_DAYS = 366

function customRangeSpanDays(from: string, to: string): number {
  const start = new Date(from)
  const end = new Date(to)
  const diffMs = end.getTime() - start.getTime()
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1
}

export const analyticsFilterSchema = z
  .object({
    period: z.enum(['TODAY', 'YESTERDAY', 'THIS_WEEK', 'THIS_MONTH', 'THIS_YEAR', 'CUSTOM']),
    from: z.string().nullable(),
    to: z.string().nullable(),
    branchId: z.union([z.string().uuid(), z.null()]),
    warehouseId: z.union([z.string().uuid(), z.null()]),
    vehicleId: z.union([z.string().uuid(), z.null()]),
    employeeId: z.union([z.string().uuid(), z.null()]),
    includeArchived: z.boolean(),
    limit: z.number().int().min(1).max(25),
  })
  .superRefine((value, ctx) => {
    if (value.period !== 'CUSTOM') return

    if (!value.from) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Start date is required for a custom range',
        path: ['from'],
      })
    }

    if (!value.to) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'End date is required for a custom range',
        path: ['to'],
      })
    }

    if (!value.from || !value.to) return

    if (value.from > value.to) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Start date must be on or before end date',
        path: ['to'],
      })
    }

    const spanDays = customRangeSpanDays(value.from, value.to)
    if (spanDays > MAX_CUSTOM_RANGE_DAYS) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Date range cannot exceed ${String(MAX_CUSTOM_RANGE_DAYS)} days`,
        path: ['to'],
      })
    }
  })

export function isAnalyticsFilterValid(filters: z.input<typeof analyticsFilterSchema>): boolean {
  return analyticsFilterSchema.safeParse(filters).success
}

export function getAnalyticsFilterErrors(
  filters: z.input<typeof analyticsFilterSchema>,
): Partial<Record<'from' | 'to' | 'limit', string>> {
  const result = analyticsFilterSchema.safeParse(filters)
  if (result.success) return {}

  const errors: Partial<Record<'from' | 'to' | 'limit', string>> = {}
  for (const issue of result.error.issues) {
    const field = issue.path[0]
    if (field === 'from' || field === 'to' || field === 'limit') {
      errors[field] = issue.message
    }
  }
  return errors
}
