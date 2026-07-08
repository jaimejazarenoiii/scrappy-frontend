import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { NormalizedApiError } from '@/lib/axios'

import { TransactionService } from '../services/transaction.service'
import type { TransactionAttachment } from '../types/transaction.types'
import { transactionAttachmentsKeys } from './useTransactionAttachments'
import { transactionKeys } from './useTransactions'

function handleError(error: NormalizedApiError, fallback: string) {
  toast.error(error.message || fallback)
}

export function useUploadTransactionAttachment(transactionId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ file, onProgress }: { file: File; onProgress?: (percent: number) => void }) =>
      TransactionService.uploadAttachment(transactionId, file, onProgress),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: transactionAttachmentsKeys.list(transactionId),
      })
      void queryClient.invalidateQueries({ queryKey: transactionKeys.detail(transactionId) })
      toast.success('Photo uploaded')
    },
    onError: (error: NormalizedApiError) => {
      handleError(error, 'Could not upload photo')
    },
  })
}

export function useDeleteTransactionAttachment(transactionId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (attachmentId: string) =>
      TransactionService.deleteAttachment(transactionId, attachmentId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: transactionAttachmentsKeys.list(transactionId),
      })
      void queryClient.invalidateQueries({ queryKey: transactionKeys.detail(transactionId) })
      toast.success('Photo removed')
    },
    onError: (error: NormalizedApiError) => {
      handleError(error, 'Could not remove photo')
    },
  })
}

export type { TransactionAttachment }
