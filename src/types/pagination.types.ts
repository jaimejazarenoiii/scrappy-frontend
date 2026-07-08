export type SortDirection = 'asc' | 'desc'

export interface SortState {
  field: string
  direction: SortDirection
}

export interface ListQueryParams {
  search?: string
  filters?: Record<string, string>
  sort?: SortState
  page: number
  pageSize: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export const DEFAULT_PAGE_SIZE = 10

export const DEFAULT_LIST_PARAMS: ListQueryParams = {
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
}
