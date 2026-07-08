import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { TransactionService } from '../services/transaction.service'
import type { TransactionAttachment } from '../types/transaction.types'

export const transactionAttachmentsKeys = {
  all: ['transactions', 'attachments'] as const,
  list: (transactionId: string) => ['transactions', 'attachments', transactionId] as const,
}

export function useTransactionAttachments(transactionId?: string) {
  return useQuery({
    queryKey: transactionId
      ? transactionAttachmentsKeys.list(transactionId)
      : transactionAttachmentsKeys.list(''),
    enabled: Boolean(transactionId),
    placeholderData: keepPreviousData,
    queryFn: () => {
      if (!transactionId) throw new Error('Missing transaction id')
      return TransactionService.listAttachments(transactionId)
    },
  })
}

export type { TransactionAttachment }
