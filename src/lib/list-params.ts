import type { ListQueryParams } from '@/types/pagination.types'

/**
 * Serializes ListQueryParams into the query object the Scrappy API expects:
 * `page`, `limit`, `sortBy`, `sortOrder`, `search`, plus flat filter keys
 * (e.g. `status`, `direction`, `locationType`).
 */
export function toQueryParams(params: ListQueryParams): Record<string, string | number> {
  const query: Record<string, string | number> = {
    page: params.page,
    limit: params.pageSize,
  }

  if (params.search) {
    query.search = params.search
  }

  if (params.sort) {
    query.sortBy = params.sort.field
    query.sortOrder = params.sort.direction
  }

  if (params.filters) {
    for (const [key, value] of Object.entries(params.filters)) {
      if (value) {
        query[key] = value
      }
    }
  }

  return query
}
