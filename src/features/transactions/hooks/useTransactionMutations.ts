import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { toast } from 'sonner'

import type { NormalizedApiError } from '@/lib/axios'

import { TransactionService } from '../services/transaction.service'
import type {
  CreateTransactionInput,
  TransactionDetail,
  UpdateTransactionInput,
} from '../types/transaction.types'
import { transactionKeys } from './useTransactions'

function handleMutationError(
  error: NormalizedApiError,
  queryClient: ReturnType<typeof useQueryClient>,
  fallback: string,
) {
  if (error.code === 'LIFECYCLE_CONFLICT' || error.code === 'BUSINESS_RULE_VIOLATION') {
    toast.error(error.message || fallback)
    // Refresh so UI can reconcile with backend state.
    void queryClient.invalidateQueries({ queryKey: transactionKeys.all })
    return
  }

  toast.error(error.message || fallback)
}

export function useCreateTransactionDraft() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateTransactionInput) => TransactionService.create(input),
    onSuccess: (transaction: TransactionDetail) => {
      void queryClient.invalidateQueries({ queryKey: transactionKeys.all })
      queryClient.setQueryData(transactionKeys.detail(transaction.id), transaction)
      toast.success('Transaction draft created')
    },
    onError: (error: NormalizedApiError) => {
      handleMutationError(error, queryClient, 'Could not create transaction draft')
    },
  })
}

export function useUpdateTransactionDraft(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateTransactionInput) => TransactionService.update(id, input),
    onSuccess: (transaction: TransactionDetail) => {
      queryClient.setQueryData(transactionKeys.detail(id), transaction)
      void queryClient.invalidateQueries({ queryKey: transactionKeys.all })
    },
    onError: (error: NormalizedApiError) => {
      handleMutationError(error, queryClient, 'Could not save transaction draft')
    },
  })
}

/** Silent draft persistence for debounced auto-save (no error toasts). */
export function useAutoSaveTransactionDraft(id: string) {
  const queryClient = useQueryClient()

  return useCallback(
    async (input: UpdateTransactionInput) => {
      const transaction = await TransactionService.update(id, input)
      queryClient.setQueryData(transactionKeys.detail(id), transaction)
      void queryClient.invalidateQueries({ queryKey: transactionKeys.all })
      return transaction
    },
    [id, queryClient],
  )
}
