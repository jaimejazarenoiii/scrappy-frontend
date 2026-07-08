import { useQuery } from '@tanstack/react-query'

import { TransactionService } from '../services/transaction.service'
import { transactionKeys } from './useTransactions'

export function useTransaction(id?: string) {
  return useQuery({
    queryKey: id ? transactionKeys.detail(id) : ['transactions', 'detail', ''],
    queryFn: () => {
      if (!id) throw new Error('Missing transaction id')
      return TransactionService.get(id)
    },
    enabled: Boolean(id),
  })
}
