import { apiClient } from '@/lib/axios'
import { unwrap, unwrapList } from '@/lib/api-envelope'
import type { ApiEnvelope } from '@/types/api.types'
import type { ListQueryParams, PaginatedResponse } from '@/types/pagination.types'

import type {
  ActivityLog,
  ActivityLogListParams,
  ActivitySearchBy,
  ActivitySortBy,
} from '../types/activity-log.types'

export const ACTIVITY_LOG_ENDPOINTS = {
  base: '/activity-logs',
  detail: (activityLogId: string) => `/activity-logs/${activityLogId}`,
} as const

function toActivityLogQuery(params: ListQueryParams): Record<string, string | number> {
  const query: Record<string, string | number> = {
    page: params.page,
    limit: params.pageSize,
  }

  const sortField = (params.sort?.field ?? 'createdAt') as ActivitySortBy
  query.sortBy = sortField
  query.sortOrder = params.sort?.direction ?? 'desc'

  const filters = params.filters ?? {}
  const searchBy = filters.searchBy as ActivitySearchBy | undefined
  if (params.search?.trim()) {
    query.q = params.search.trim()
    if (searchBy) query.searchBy = searchBy
  }

  for (const key of ['module', 'action', 'userId', 'eventType', 'dateFrom', 'dateTo'] as const) {
    const value = filters[key]
    if (value) query[key] = value
  }

  return query
}

export const ActivityLogService = {
  async list(params: ListQueryParams): Promise<PaginatedResponse<ActivityLog>> {
    const response = await apiClient.get<ApiEnvelope<ActivityLog[]>>(ACTIVITY_LOG_ENDPOINTS.base, {
      params: toActivityLogQuery(params),
    })
    return unwrapList(response)
  },

  async get(activityLogId: string): Promise<ActivityLog> {
    const response = await apiClient.get<ApiEnvelope<ActivityLog>>(
      ACTIVITY_LOG_ENDPOINTS.detail(activityLogId),
    )
    return unwrap(response)
  },

  /** Direct API-shaped list helper when callers already have ActivityLogListParams. */
  async listWithParams(params: ActivityLogListParams): Promise<PaginatedResponse<ActivityLog>> {
    const response = await apiClient.get<ApiEnvelope<ActivityLog[]>>(ACTIVITY_LOG_ENDPOINTS.base, {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 20,
        sortBy: params.sortBy ?? 'createdAt',
        sortOrder: params.sortOrder ?? 'desc',
        ...(params.q
          ? { q: params.q, ...(params.searchBy ? { searchBy: params.searchBy } : {}) }
          : {}),
        ...(params.module ? { module: params.module } : {}),
        ...(params.action ? { action: params.action } : {}),
        ...(params.userId ? { userId: params.userId } : {}),
        ...(params.eventType ? { eventType: params.eventType } : {}),
        ...(params.dateFrom ? { dateFrom: params.dateFrom } : {}),
        ...(params.dateTo ? { dateTo: params.dateTo } : {}),
      },
    })
    return unwrapList(response)
  },
}
