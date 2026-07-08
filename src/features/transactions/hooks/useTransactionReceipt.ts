import { useQuery } from '@tanstack/react-query'

import { TransactionService } from '../services/transaction.service'
import type { TransactionStatus } from '../types/transaction.types'
import { transactionKeys } from './useTransactions'

export function useTransactionReceipt(
  transactionId: string | undefined,
  status: TransactionStatus | undefined,
) {
  return useQuery({
    queryKey: transactionKeys.receipt(transactionId ?? ''),
    queryFn: () => TransactionService.getReceipt(transactionId ?? ''),
    enabled: Boolean(transactionId) && status === 'PAID',
  })
}
