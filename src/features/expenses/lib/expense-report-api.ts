import type { ListQueryParams } from '@/types/pagination.types'

import { normalizeExpenseStatus, normalizeReferenceType } from './expense-api'
import type { ExpenseReportListResponse, ExpenseReportRow } from '../types/expense.types'

/** Row shape from GET /reports/expenses — uses `date`, not `expenseDate`. */
export interface ExpenseReportRowApi {
  id: string
  date?: string
  expenseDate?: string
  description: string
  amount: number
  category?: string | null
  categoryName?: string | null
  categoryId?: string | null
  expenseNumber?: string | null
  referenceType?: string
  referenceId?: string | null
  referenceLabel?: string | null
  branchId?: string | null
  warehouseId?: string | null
  vehicleId?: string | null
  employeeId?: string | null
  tripId?: string | null
  status?: string
  notes?: string | null
}

export interface ExpenseReportQueryParams {
  from: string
  to: string
  page: number
  pageSize: number
  search?: string
}

/** Shared report filters from GET /reports/* query contract. */
export const EXPENSE_REPORT_FILTER_KEYS = [
  'branchId',
  'warehouseId',
  'vehicleId',
  'employeeId',
  'tripId',
  'includeArchived',
] as const

const REPORT_SORT_FIELD_ALIASES: Record<string, string> = {
  expenseDate: 'date',
  date: 'date',
  amount: 'amount',
  description: 'description',
  categoryName: 'categoryName',
}

const MAX_REPORT_RANGE_DAYS = 366

export function defaultExpenseReportRange(): { from: string; to: string } {
  const now = new Date()
  const from = new Date(now.getFullYear(), now.getMonth(), 1)
  return {
    from: from.toISOString().slice(0, 10),
    to: now.toISOString().slice(0, 10),
  }
}

/** Date input (YYYY-MM-DD) → ISO8601 start of UTC day for `from`. */
export function dateInputToIsoStart(date: string): string {
  return new Date(`${date}T00:00:00.000Z`).toISOString()
}

/** Date input (YYYY-MM-DD) → ISO8601 end of UTC day for `to`. */
export function dateInputToIsoEnd(date: string): string {
  return new Date(`${date}T23:59:59.999Z`).toISOString()
}

export function isExpenseReportRangeValid(from: string, to: string): boolean {
  if (!from || !to) return false
  const fromMs = Date.parse(dateInputToIsoStart(from))
  const toMs = Date.parse(dateInputToIsoEnd(to))
  if (Number.isNaN(fromMs) || Number.isNaN(toMs) || fromMs > toMs) return false
  const spanDays = (toMs - fromMs) / (1000 * 60 * 60 * 24)
  return spanDays <= MAX_REPORT_RANGE_DAYS
}

export function expenseReportSearchParam(search?: string): string | undefined {
  const trimmed = search?.trim()
  if (!trimmed || trimmed.length < 2) return undefined
  return trimmed
}

export function normalizeExpenseReportRow(api: ExpenseReportRowApi): ExpenseReportRow {
  const date = api.date ?? api.expenseDate ?? ''

  return {
    id: api.id,
    date,
    description: api.description,
    amount: api.amount,
    category: api.category ?? api.categoryName ?? null,
    expenseNumber: api.expenseNumber ?? null,
    referenceType: api.referenceType ? normalizeReferenceType(api.referenceType) : null,
    referenceId: api.referenceId ?? null,
    referenceLabel: api.referenceLabel ?? null,
    branchId: api.branchId ?? null,
    warehouseId: api.warehouseId ?? null,
    vehicleId: api.vehicleId ?? null,
    employeeId: api.employeeId ?? null,
    tripId: api.tripId ?? null,
    status: api.status ? normalizeExpenseStatus(api.status) : null,
    notes: api.notes ?? null,
  }
}

export function toExpenseReportQueryParams(
  params: ExpenseReportQueryParams & Pick<ListQueryParams, 'sort' | 'filters'>,
): Record<string, string | number | boolean> {
  const query: Record<string, string | number | boolean> = {
    from: dateInputToIsoStart(params.from),
    to: dateInputToIsoEnd(params.to),
    page: params.page,
    limit: params.pageSize,
  }

  const search = expenseReportSearchParam(params.search)
  if (search) {
    query.search = search
  }

  if (params.sort?.field) {
    query.sortBy = REPORT_SORT_FIELD_ALIASES[params.sort.field] ?? params.sort.field
    query.sortOrder = params.sort.direction
  } else {
    query.sortBy = 'date'
    query.sortOrder = 'desc'
  }

  const filters = params.filters ?? {}
  for (const key of EXPENSE_REPORT_FILTER_KEYS) {
    const value = filters[key]
    if (value) {
      query[key] = key === 'includeArchived' ? value === 'true' : value
    }
  }

  return query
}

export function parseExpenseReportMeta(
  meta: Record<string, unknown>,
): Pick<ExpenseReportListResponse, 'generatedAt' | 'appliedCriteria'> {
  return {
    generatedAt: typeof meta.generatedAt === 'string' ? meta.generatedAt : undefined,
    appliedCriteria:
      meta.appliedCriteria && typeof meta.appliedCriteria === 'object'
        ? (meta.appliedCriteria as Record<string, unknown>)
        : undefined,
  }
}
