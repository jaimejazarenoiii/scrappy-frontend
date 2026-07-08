import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { TransactionService } from '../services/transaction.service'
import type { TransactionItem } from '../types/transaction.types'

export const transactionItemsKeys = {
  all: ['transactions', 'items'] as const,
  list: (transactionId: string) => ['transactions', 'items', transactionId] as const,
}

export function useTransactionItems(transactionId?: string) {
  return useQuery({
    queryKey: transactionId
      ? transactionItemsKeys.list(transactionId)
      : transactionItemsKeys.list(''),
    enabled: Boolean(transactionId),
    placeholderData: keepPreviousData,
    queryFn: () => {
      if (!transactionId) throw new Error('Missing transaction id')
      return TransactionService.listItems(transactionId)
    },
  })
}

export type { TransactionItem }
