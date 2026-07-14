import type { ListQueryParams } from '@/types/pagination.types'

export const tripKeys = {
  all: ['trips'] as const,
  lists: () => ['trips', 'list'] as const,
  list: (params: ListQueryParams) => ['trips', 'list', params] as const,
  details: () => ['trips', 'detail'] as const,
  detail: (id: string) => ['trips', 'detail', id] as const,
  dashboard: () => ['trips', 'dashboard'] as const,
  members: (id: string) => ['trips', 'detail', id, 'members'] as const,
  transactions: (id: string) => ['trips', 'detail', id, 'transactions'] as const,
  linkableTransactions: (id: string, params: ListQueryParams) =>
    ['trips', 'detail', id, 'linkable-transactions', params] as const,
  timeline: (id: string) => ['trips', 'detail', id, 'timeline'] as const,
}

export const tripLoadKeys = {
  all: ['trips', 'load'] as const,
  details: () => ['trips', 'load', 'detail'] as const,
  detail: (tripId: string) => ['trips', 'load', 'detail', tripId] as const,
  progress: (tripId: string) => ['trips', 'load', 'progress', tripId] as const,
  validate: (tripId: string, itemsKey: string) =>
    ['trips', 'load', 'validate', tripId, itemsKey] as const,
}
