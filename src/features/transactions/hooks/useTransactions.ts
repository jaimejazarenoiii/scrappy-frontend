import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { isCompanyViewer } from '@/features/workforce/lib/workforce-roles'
import type { ListQueryParams } from '@/types/pagination.types'

import { TransactionService } from '../services/transaction.service'
import type {
  TransactionListParams,
  TransactionStatus,
  Direction,
  LocationType,
} from '../types/transaction.types'

export const transactionKeys = {
  all: ['transactions'] as const,
  dashboard: ['transactions', 'dashboard'] as const,
  list: (scope: 'mine' | 'company', params: ListQueryParams) =>
    ['transactions', 'list', scope, params] as const,
  detail: (id: string) => ['transactions', 'detail', id] as const,
  drafts: (params: ListQueryParams) => ['transactions', 'drafts', params] as const,
}

function toTransactionListParams(params: ListQueryParams): TransactionListParams {
  const filters = params.filters ?? {}

  return {
    page: params.page,
    limit: params.pageSize,
    sortBy: params.sort?.field as TransactionListParams['sortBy'] | undefined,
    sortOrder: params.sort?.direction,
    search: params.search,

    direction: filters.direction as Direction | undefined,
    status: filters.status as TransactionStatus | undefined,
    locationType: filters.locationType as LocationType | undefined,
    branchId: filters.branchId,
    warehouseId: filters.warehouseId,

    fromDate: filters.fromDate,
    toDate: filters.toDate,
    includeArchived: filters.includeArchived ? filters.includeArchived === 'true' : undefined,
  }
}

export function useTransactions(params: ListQueryParams) {
  const { currentUser } = useCurrentUser()
  const scope = isCompanyViewer(currentUser?.role) ? 'company' : 'mine'

  return useQuery({
    queryKey: transactionKeys.list(scope, params),
    placeholderData: keepPreviousData,
    queryFn: () =>
      scope === 'company'
        ? TransactionService.list(toTransactionListParams(params))
        : TransactionService.listAssigned(toTransactionListParams(params)),
  })
}
