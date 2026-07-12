import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { transactionKeys } from '@/features/transactions/hooks/useTransactions'
import { TransactionService } from '@/features/transactions/services/transaction.service'
import type { ListQueryParams } from '@/types/pagination.types'

const READY_FOR_PAYMENT_PARAMS: ListQueryParams = {
  page: 1,
  pageSize: 8,
  sort: { field: 'transactionDate', direction: 'desc' },
  filters: { status: 'READY_FOR_PAYMENT' },
}

export function useReadyForPaymentQueue(enabled: boolean) {
  return useQuery({
    queryKey: transactionKeys.list('company', READY_FOR_PAYMENT_PARAMS),
    queryFn: () =>
      TransactionService.list({
        page: READY_FOR_PAYMENT_PARAMS.page,
        limit: READY_FOR_PAYMENT_PARAMS.pageSize,
        sortBy: 'transactionDate',
        sortOrder: 'desc',
        status: 'READY_FOR_PAYMENT',
      }),
    enabled,
    placeholderData: keepPreviousData,
    retry: false,
  })
}

export function useReadyForPaymentTotal(enabled: boolean): {
  total: number
  isLoading: boolean
} {
  const query = useReadyForPaymentQueue(enabled)
  return {
    total: query.data?.total ?? 0,
    isLoading: query.isLoading,
  }
}
