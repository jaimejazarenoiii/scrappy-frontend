import type { AxiosResponse } from 'axios'

import type { ApiEnvelope, PaginationMeta } from '@/types/api.types'
import type { PaginatedResponse } from '@/types/pagination.types'

/** Unwraps envelope `data` for non-paginated responses. */
export function unwrap<T>(response: AxiosResponse<ApiEnvelope<T>>): T {
  return response.data.data
}

/** Unwraps envelope and returns payload + meta (e.g. trip-load `warnings`). */
export function unwrapWithMeta<T>(response: AxiosResponse<ApiEnvelope<T>>): {
  data: T
  meta: ApiEnvelope<T>['meta']
} {
  return { data: response.data.data, meta: response.data.meta }
}

/**
 * Unwraps a paginated envelope (`data: T[]` + `meta` pagination) into the app's internal
 * PaginatedResponse shape so hooks/pages stay contract-agnostic.
 */
export function unwrapList<T>(response: AxiosResponse<ApiEnvelope<T[]>>): PaginatedResponse<T> {
  const items = response.data.data
  const meta = response.data.meta as Partial<PaginationMeta>
  return {
    data: items,
    total: meta.total ?? items.length,
    page: meta.page ?? 1,
    pageSize: meta.limit ?? items.length,
  }
}
