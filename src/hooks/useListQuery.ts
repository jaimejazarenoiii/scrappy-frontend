import { useMemo } from 'react'
import { useSearchParams } from 'react-router'

import { DEFAULT_PAGE_SIZE, type ListQueryParams, type SortState } from '@/types/pagination.types'

const RESERVED_KEYS = new Set(['q', 'page', 'pageSize', 'sort'])

interface UseListQueryOptions {
  defaultPageSize?: number
  defaultSort?: SortState
}

export interface UseListQueryResult {
  params: ListQueryParams
  setSearch: (value: string) => void
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  setSort: (sort: SortState) => void
  setFilter: (key: string, value?: string) => void
  clearFilters: () => void
}

/**
 * List query state synced to the URL search params so lists are bookmarkable and
 * shareable (Constitution IV). Changing search, sort, or a filter resets to page 1.
 */
export function useListQuery(options?: UseListQueryOptions): UseListQueryResult {
  const { defaultPageSize = DEFAULT_PAGE_SIZE, defaultSort } = options ?? {}
  const [searchParams, setSearchParams] = useSearchParams()

  const params = useMemo<ListQueryParams>(() => {
    const search = searchParams.get('q') ?? undefined
    const page = Number(searchParams.get('page') ?? '1') || 1
    const pageSize =
      Number(searchParams.get('pageSize') ?? String(defaultPageSize)) || defaultPageSize

    const sortRaw = searchParams.get('sort')
    let sort: SortState | undefined = defaultSort
    if (sortRaw) {
      const [field, direction] = sortRaw.split(':')
      if (field) {
        sort = { field, direction: direction === 'desc' ? 'desc' : 'asc' }
      }
    }

    const filters: Record<string, string> = {}
    for (const [key, value] of searchParams.entries()) {
      if (!RESERVED_KEYS.has(key) && value) {
        filters[key] = value
      }
    }

    return {
      search,
      page,
      pageSize,
      sort,
      filters: Object.keys(filters).length > 0 ? filters : undefined,
    }
  }, [searchParams, defaultPageSize, defaultSort])

  function mutate(mutator: (next: URLSearchParams) => void, resetPage = false): void {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        mutator(next)
        if (resetPage) next.set('page', '1')
        return next
      },
      { replace: true },
    )
  }

  return {
    params,
    setSearch: (value) => {
      mutate((next) => {
        if (value) next.set('q', value)
        else next.delete('q')
      }, true)
    },
    setPage: (page) => {
      mutate((next) => {
        next.set('page', String(Math.max(1, page)))
      })
    },
    setPageSize: (pageSize) => {
      mutate((next) => {
        next.set('pageSize', String(pageSize))
      }, true)
    },
    setSort: (sort: SortState) => {
      mutate((next) => {
        next.set('sort', `${sort.field}:${sort.direction}`)
      }, true)
    },
    setFilter: (key, value) => {
      mutate((next) => {
        if (value) next.set(key, value)
        else next.delete(key)
      }, true)
    },
    clearFilters: () => {
      mutate((next) => {
        for (const key of [...next.keys()]) {
          if (!RESERVED_KEYS.has(key)) next.delete(key)
        }
        next.delete('q')
      }, true)
    },
  }
}
