import { z } from 'zod'

const MAX_REPORT_RANGE_DAYS = 366

function spanDays(from: string, to: string): number {
  const start = Date.parse(`${from}T00:00:00.000Z`)
  const end = Date.parse(`${to}T23:59:59.999Z`)
  return (end - start) / (1000 * 60 * 60 * 24)
}

export const reportFilterSchema = z
  .object({
    from: z.string().min(1, 'Start date is required'),
    to: z.string().min(1, 'End date is required'),
    branchId: z.union([z.string().uuid(), z.null()]),
    warehouseId: z.union([z.string().uuid(), z.null()]),
    vehicleId: z.union([z.string().uuid(), z.null()]),
    employeeId: z.union([z.string().uuid(), z.null()]),
    tripId: z.union([z.string().uuid(), z.null()]),
    includeArchived: z.boolean(),
    search: z.union([z.string(), z.null()]),
    transactionType: z.union([z.string(), z.null()]),
    expenseCategory: z.union([z.string(), z.null()]),
    payrollPeriod: z.union([z.string(), z.null()]),
    tripStatus: z.union([z.string(), z.null()]),
    page: z.number().int().min(1),
    pageSize: z.number().int().min(1).max(100),
    sortField: z.union([z.string(), z.null()]),
    sortDirection: z.enum(['asc', 'desc']),
  })
  .superRefine((value, ctx) => {
    if (!value.from || !value.to) return

    if (value.from > value.to) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Start date must be on or before end date',
        path: ['to'],
      })
    }

    if (spanDays(value.from, value.to) > MAX_REPORT_RANGE_DAYS) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Date range cannot exceed ${String(MAX_REPORT_RANGE_DAYS)} days`,
        path: ['to'],
      })
    }
  })

export function isReportFilterValid(filters: z.input<typeof reportFilterSchema>): boolean {
  return reportFilterSchema.safeParse(filters).success
}

export function getReportFilterErrors(
  filters: z.input<typeof reportFilterSchema>,
): Partial<Record<'from' | 'to', string>> {
  const result = reportFilterSchema.safeParse(filters)
  if (result.success) return {}

  const errors: Partial<Record<'from' | 'to', string>> = {}
  for (const issue of result.error.issues) {
    const field = issue.path[0]
    if (field === 'from' || field === 'to') {
      errors[field] = issue.message
    }
  }
  return errors
}
