import type { AxiosResponse } from 'axios'

import type { ApiEnvelope, PaginationMeta } from '@/types/api.types'
import type { PaginatedResponse } from '@/types/pagination.types'

import type { ReportDomain, ReportFilterSet, ReportSummary } from '../types/reports.types'

export const MAX_REPORT_RANGE_DAYS = 366

export function dateInputToIsoStart(date: string): string {
  return new Date(`${date}T00:00:00.000Z`).toISOString()
}

export function dateInputToIsoEnd(date: string): string {
  return new Date(`${date}T23:59:59.999Z`).toISOString()
}

export function isReportRangeValid(from: string, to: string): boolean {
  if (!from || !to) return false
  const fromMs = Date.parse(dateInputToIsoStart(from))
  const toMs = Date.parse(dateInputToIsoEnd(to))
  if (Number.isNaN(fromMs) || Number.isNaN(toMs) || fromMs > toMs) return false
  const spanDays = (toMs - fromMs) / (1000 * 60 * 60 * 24)
  return spanDays <= MAX_REPORT_RANGE_DAYS
}

export function reportSearchParam(search?: string | null): string | undefined {
  const trimmed = search?.trim()
  if (!trimmed || trimmed.length < 2) return undefined
  return trimmed
}

/** UI filter keys → Backend P009 query param names. */
const DOMAIN_EXTRA_PARAMS: Record<ReportDomain, Partial<Record<keyof ReportFilterSet, string>>> = {
  transactions: { transactionType: 'direction' },
  trips: { tripStatus: 'status' },
  expenses: { expenseCategory: 'category' },
  payroll: {},
  attendance: {},
}

const SHARED_ENTITY_KEYS = ['branchId', 'warehouseId', 'vehicleId', 'employeeId', 'tripId'] as const

/** Map UI/column sort ids to Backend P009 `sortBy` enums per domain. */
const SORT_FIELD_ALIASES: Record<ReportDomain, Record<string, string>> = {
  transactions: {
    date: 'transactionDate',
    transactionDate: 'transactionDate',
    transactionNumber: 'transactionNumber',
    createdAt: 'createdAt',
    partyName: 'partyName',
    status: 'status',
  },
  trips: {
    date: 'scheduledStart',
    scheduledStart: 'scheduledStart',
    tripNumber: 'tripNumber',
    status: 'status',
    createdAt: 'createdAt',
  },
  expenses: {
    date: 'date',
    expenseDate: 'date',
    amount: 'amount',
    category: 'category',
    categoryName: 'category',
  },
  payroll: {
    period: 'payPeriodStart',
    payPeriodStart: 'payPeriodStart',
    payPeriodEnd: 'payPeriodEnd',
    date: 'payPeriodStart',
    status: 'status',
  },
  attendance: {
    date: 'timeInAt',
    timeInAt: 'timeInAt',
    timeIn: 'timeInAt',
    status: 'status',
  },
}

export function toReportSortBy(domain: ReportDomain, sortField: string | null): string | null {
  if (!sortField) return null
  return SORT_FIELD_ALIASES[domain][sortField] ?? sortField
}

export function buildReportQueryParams(
  domain: ReportDomain,
  filters: ReportFilterSet,
): Record<string, string | number | boolean> {
  const query: Record<string, string | number | boolean> = {
    from: dateInputToIsoStart(filters.from),
    to: dateInputToIsoEnd(filters.to),
    page: filters.page,
    limit: filters.pageSize,
    includeArchived: filters.includeArchived,
  }

  const search = reportSearchParam(filters.search)
  if (search) query.search = search

  const sortBy = toReportSortBy(domain, filters.sortField)
  if (sortBy) {
    query.sortBy = sortBy
    query.sortOrder = filters.sortDirection
  }

  for (const key of SHARED_ENTITY_KEYS) {
    const value = filters[key]
    // Omit empty / null — "All …" filters must not send a UUID param.
    if (typeof value === 'string' && value.trim().length > 0) {
      query[key] = value.trim()
    }
  }

  for (const [filterKey, paramName] of Object.entries(DOMAIN_EXTRA_PARAMS[domain])) {
    const value = filters[filterKey as keyof ReportFilterSet]
    if (typeof value === 'string' && value) {
      query[paramName] = value
    }
  }

  return query
}

/**
 * Backend P009 list envelope: `data: { items, appliedCriteria, generatedAt }` + pagination in `meta`.
 */
export function unwrapReportList<T>(
  response: AxiosResponse<ApiEnvelope<unknown>>,
): PaginatedResponse<T> & {
  generatedAt: string | null
  appliedCriteria: Record<string, unknown> | null
  summary: ReportSummary | null
} {
  const payload = asRecord(response.data.data)
  const itemsRaw = payload.items
  const items = Array.isArray(itemsRaw) ? (itemsRaw as T[]) : []
  const meta = response.data.meta as Partial<PaginationMeta>
  const reportMeta = parseReportMeta({
    ...asRecord(response.data.meta),
    generatedAt: payload.generatedAt,
    appliedCriteria: payload.appliedCriteria,
    summary: payload.summary ?? asRecord(response.data.meta).summary,
  })

  return {
    data: items,
    total: meta.total ?? items.length,
    page: meta.page ?? 1,
    pageSize: meta.limit ?? items.length,
    ...reportMeta,
  }
}

export function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

export function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

export function asNullableString(value: unknown): string | null {
  return typeof value === 'string' ? value : null
}

/** Prefer YYYY-MM-DD when value is an ISO datetime string. */
export function asDateString(value: unknown, fallback = ''): string {
  if (typeof value !== 'string' || !value) return fallback
  return value.includes('T') ? value.slice(0, 10) : value
}

export function asIsoString(value: unknown): string | null {
  if (typeof value === 'string' && value) return value
  return null
}

export function asNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return fallback
}

export function asNullableNumber(value: unknown): number | null {
  if (value == null) return null
  const num = asNumber(value, Number.NaN)
  return Number.isFinite(num) ? num : null
}

export function parseReportMeta(meta: Record<string, unknown>): {
  generatedAt: string | null
  appliedCriteria: Record<string, unknown> | null
  summary: ReportSummary | null
} {
  const summaryRaw = meta.summary
  let summary: ReportSummary | null = null
  if (summaryRaw && typeof summaryRaw === 'object' && !Array.isArray(summaryRaw)) {
    summary = summaryRaw as ReportSummary
  }

  return {
    generatedAt: typeof meta.generatedAt === 'string' ? meta.generatedAt : null,
    appliedCriteria:
      meta.appliedCriteria && typeof meta.appliedCriteria === 'object'
        ? (meta.appliedCriteria as Record<string, unknown>)
        : null,
    summary,
  }
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.rel = 'noopener'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

export function filenameFromContentDisposition(
  header: string | undefined,
  fallback: string,
): string {
  if (!header) return fallback
  const utfMatch = /filename\*=UTF-8''([^;]+)/i.exec(header)
  if (utfMatch?.[1]) {
    try {
      return decodeURIComponent(utfMatch[1])
    } catch {
      return utfMatch[1]
    }
  }
  const plainMatch = /filename="?([^";]+)"?/i.exec(header)
  return plainMatch?.[1] ?? fallback
}
