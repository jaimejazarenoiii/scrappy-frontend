import type { ListQueryParams } from '@/types/pagination.types'

export const expenseKeys = {
  all: ['expenses'] as const,
  lists: () => [...expenseKeys.all, 'list'] as const,
  list: (params: ListQueryParams) => [...expenseKeys.lists(), params] as const,
  reports: () => [...expenseKeys.all, 'report'] as const,
  report: (params: unknown) => [...expenseKeys.reports(), params] as const,
  details: () => [...expenseKeys.all, 'detail'] as const,
  detail: (id: string) => [...expenseKeys.details(), id] as const,
  categories: () => [...expenseKeys.all, 'categories'] as const,
  dashboard: () => [...expenseKeys.all, 'dashboard'] as const,
  attachments: (expenseId: string) => [...expenseKeys.detail(expenseId), 'attachments'] as const,
}
