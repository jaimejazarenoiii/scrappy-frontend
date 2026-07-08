import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { NormalizedApiError } from '@/lib/axios'

import { TransactionService } from '../services/transaction.service'
import type {
  CreateTransactionItemInput,
  TransactionItem,
  UpdateTransactionItemInput,
} from '../types/transaction.types'
import { transactionItemsKeys } from './useTransactionItems'
import { transactionKeys } from './useTransactions'

function handleError(error: NormalizedApiError, fallback: string) {
  toast.error(error.message || fallback)
}

export function useAddTransactionItem(transactionId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateTransactionItemInput) =>
      TransactionService.addItem(transactionId, input),
    onSuccess: (item: TransactionItem) => {
      void queryClient.invalidateQueries({ queryKey: transactionItemsKeys.list(transactionId) })
      void queryClient.invalidateQueries({ queryKey: transactionKeys.detail(transactionId) })
      queryClient.setQueryData(
        transactionItemsKeys.list(transactionId),
        (prev?: unknown) => prev ?? item,
      )
      toast.success('Item added')
    },
    onError: (error: NormalizedApiError) => {
      handleError(error, 'Could not add item')
    },
  })
}

export function useUpdateTransactionItem(transactionId: string, itemId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateTransactionItemInput) =>
      TransactionService.updateItem(transactionId, itemId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: transactionItemsKeys.list(transactionId) })
      void queryClient.invalidateQueries({ queryKey: transactionKeys.detail(transactionId) })
      toast.success('Item updated')
    },
    onError: (error: NormalizedApiError) => {
      handleError(error, 'Could not update item')
    },
  })
}

export function useDeleteTransactionItem(transactionId: string, itemId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => TransactionService.deleteItem(transactionId, itemId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: transactionItemsKeys.list(transactionId) })
      void queryClient.invalidateQueries({ queryKey: transactionKeys.detail(transactionId) })
      toast.success('Item removed')
    },
    onError: (error: NormalizedApiError) => {
      handleError(error, 'Could not remove item')
    },
  })
}
