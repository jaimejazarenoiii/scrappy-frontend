import type { ListQueryParams } from '@/types/pagination.types'

import type {
  CreateExpenseInput,
  ExpenseDetail,
  ExpenseReferenceType,
  ExpenseStatus,
  ExpenseSummary,
  UpdateExpenseInput,
} from '../types/expense.types'

export interface ExpenseSummaryApi {
  id: string
  companyId: string
  expenseNumber: string | null
  status: string
  category?: string | null
  categoryId?: string | null
  categoryName?: string | null
  /** API field; prefer over legacy `referenceType`. */
  contextType?: string
  referenceType?: string
  referenceId?: string | null
  referenceLabel?: string | null
  branchId?: string | null
  warehouseId?: string | null
  vehicleId?: string | null
  tripId?: string | null
  description: string
  amount: number
  expenseDate: string
  notes?: string | null
  receiptCount?: number | null
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}

export type ExpenseDetailApi = ExpenseSummaryApi &
  Partial<{
    reference: ExpenseDetail['reference']
    attachments: ExpenseDetail['attachments']
    createdByUserId: string | null
    updatedByUserId: string | null
  }>

/** Legacy object shape — catalog is normally `string[]`. */
interface ExpenseCategoryObjectApi {
  id?: string
  name?: string
  label?: string
  categoryName?: string
  code?: string | null
}

const EXPENSE_STATUSES: ExpenseStatus[] = ['ACTIVE', 'ARCHIVED']
const REFERENCE_TYPES: ExpenseReferenceType[] = [
  'COMPANY',
  'BRANCH',
  'WAREHOUSE',
  'VEHICLE',
  'TRIP',
]

export function normalizeExpenseStatus(status: string): ExpenseStatus {
  if ((EXPENSE_STATUSES as string[]).includes(status)) {
    return status as ExpenseStatus
  }
  return 'ACTIVE'
}

export function normalizeReferenceType(type: string): ExpenseReferenceType {
  if ((REFERENCE_TYPES as string[]).includes(type)) {
    return type as ExpenseReferenceType
  }
  return 'COMPANY'
}

export function normalizeExpenseCategoryName(item: unknown): string | null {
  if (typeof item === 'string') {
    const trimmed = item.trim()
    return trimmed.length > 0 ? trimmed : null
  }

  if (item && typeof item === 'object') {
    const record = item as ExpenseCategoryObjectApi
    const name = record.name ?? record.label ?? record.categoryName ?? record.code ?? ''
    const trimmed = name.trim()
    return trimmed.length > 0 ? trimmed : null
  }

  return null
}

/** `GET /expenses/categories` → `data: string[]` (seeded defaults + custom names). */
export function normalizeExpenseCategoryList(payload: unknown): string[] {
  if (!Array.isArray(payload)) {
    if (payload && typeof payload === 'object' && 'items' in payload) {
      return normalizeExpenseCategoryList((payload as Record<string, unknown>).items)
    }
    return []
  }

  const names: string[] = []
  for (const item of payload) {
    const name = normalizeExpenseCategoryName(item)
    if (name) names.push(name)
  }

  return [...new Set(names)]
}

export function normalizeExpenseCategory(api: ExpenseSummaryApi): string | null {
  return api.category ?? api.categoryName ?? null
}

function resolveContextType(api: ExpenseSummaryApi): ExpenseReferenceType {
  return normalizeReferenceType(api.contextType ?? api.referenceType ?? 'COMPANY')
}

function resolveContextId(api: ExpenseSummaryApi): string | null {
  if (api.referenceId) return api.referenceId
  const contextType = resolveContextType(api)
  if (contextType === 'BRANCH') return api.branchId ?? null
  if (contextType === 'WAREHOUSE') return api.warehouseId ?? null
  if (contextType === 'VEHICLE') return api.vehicleId ?? null
  if (contextType === 'TRIP') return api.tripId ?? null
  return null
}

/** Maps UI reference fields to POST/PATCH body expected by `/expenses`. */
export function toExpenseContextPayload(
  referenceType: ExpenseReferenceType,
  referenceId?: string | null,
): Record<string, unknown> {
  const contextType = referenceType
  const trimmedId = referenceId?.trim()
  const id = trimmedId && trimmedId.length > 0 ? trimmedId : null
  const body: Record<string, unknown> = { contextType }

  if (contextType === 'BRANCH' && id) body.branchId = id
  if (contextType === 'WAREHOUSE' && id) body.warehouseId = id
  if (contextType === 'VEHICLE' && id) body.vehicleId = id
  if (contextType === 'TRIP' && id) body.tripId = id

  return body
}

function mergeDescriptionWithNotes(description: string, notes?: string | null): string {
  const trimmedNotes = notes?.trim()
  if (!trimmedNotes) return description
  return `${description}\n\n${trimmedNotes}`
}

export function normalizeExpenseSummary(api: ExpenseSummaryApi): ExpenseSummary {
  return {
    id: api.id,
    companyId: api.companyId,
    expenseNumber: api.expenseNumber,
    status: normalizeExpenseStatus(api.status),
    category: normalizeExpenseCategory(api),
    referenceType: resolveContextType(api),
    referenceId: resolveContextId(api),
    referenceLabel: api.referenceLabel ?? null,
    description: api.description,
    amount: api.amount,
    expenseDate: api.expenseDate,
    notes: api.notes ?? null,
    receiptCount: api.receiptCount ?? null,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
    deletedAt: api.deletedAt ?? null,
  }
}

export function normalizeExpenseDetail(api: ExpenseDetailApi): ExpenseDetail {
  const summary = normalizeExpenseSummary(api)
  return {
    ...summary,
    reference: api.reference ?? null,
    attachments: api.attachments ?? [],
    createdByUserId: api.createdByUserId ?? null,
    updatedByUserId: api.updatedByUserId ?? null,
  }
}

export function toExpenseListQueryParams(params: ListQueryParams): Record<string, string | number> {
  const query: Record<string, string | number> = {
    page: params.page,
    limit: params.pageSize,
  }

  if (params.search) query.search = params.search
  if (params.sort?.field) query.sortBy = params.sort.field
  if (params.sort?.direction) query.sortOrder = params.sort.direction

  const filters = params.filters ?? {}
  for (const [key, value] of Object.entries(filters)) {
    if (value) {
      // API list filter is `category` (name), not `categoryId`.
      // API uses `contextType`, not UI `referenceType`.
      const queryKey =
        key === 'categoryId' ? 'category' : key === 'referenceType' ? 'contextType' : key
      query[queryKey] = value
    }
  }

  return query
}

export function toExpenseCreateBody(input: CreateExpenseInput): Record<string, unknown> {
  return {
    category: input.category,
    description: mergeDescriptionWithNotes(input.description, input.notes),
    amount: input.amount,
    expenseDate: input.expenseDate,
    ...toExpenseContextPayload(input.referenceType, input.referenceId),
  }
}

export function toExpenseUpdateBody(input: UpdateExpenseInput): Record<string, unknown> {
  const body: Record<string, unknown> = {}
  if (input.category !== undefined) body.category = input.category
  if (input.description !== undefined || input.notes !== undefined) {
    const description = input.description ?? ''
    body.description =
      input.notes !== undefined ? mergeDescriptionWithNotes(description, input.notes) : description
  }
  if (input.amount !== undefined) body.amount = input.amount
  if (input.expenseDate !== undefined) body.expenseDate = input.expenseDate
  if (input.referenceType !== undefined) {
    Object.assign(body, toExpenseContextPayload(input.referenceType, input.referenceId))
  }
  return body
}
