import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { NormalizedApiError } from '@/lib/axios'

import { TransactionService } from '../services/transaction.service'
import type {
  CancelTransactionInput,
  ReopenTransactionInput,
  ReturnToDraftInput,
  SettleTransactionInput,
  TransactionDetail,
} from '../types/transaction.types'
import { transactionKeys } from './useTransactions'
import { useSettlementDialogStore } from './useSettlementDialogStore'

function invalidateSettlementQueries(queryClient: ReturnType<typeof useQueryClient>, id: string) {
  void queryClient.invalidateQueries({ queryKey: transactionKeys.all })
  void queryClient.invalidateQueries({ queryKey: transactionKeys.detail(id) })
  void queryClient.invalidateQueries({ queryKey: transactionKeys.receipt(id) })
}

function handleSettlementError(
  error: NormalizedApiError,
  queryClient: ReturnType<typeof useQueryClient>,
  id: string,
  fallback: string,
) {
  if (error.code === 'LIFECYCLE_CONFLICT' || error.code === 'BUSINESS_RULE_VIOLATION') {
    toast.error(error.message || fallback)
    invalidateSettlementQueries(queryClient, id)
    useSettlementDialogStore.getState().closeDialog()
    return
  }

  if (error.status === 403) {
    toast.error(error.message || 'You are not allowed to perform this action.')
    return
  }

  toast.error(error.message || fallback)
}

function useSettlementMutation<TInput>(
  id: string,
  mutationFn: (input: TInput) => Promise<TransactionDetail>,
  successMessage: string,
  errorFallback: string,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: (transaction: TransactionDetail) => {
      queryClient.setQueryData(transactionKeys.detail(id), transaction)
      invalidateSettlementQueries(queryClient, id)
      useSettlementDialogStore.getState().closeDialog()
      toast.success(successMessage)
    },
    onError: (error: NormalizedApiError) => {
      handleSettlementError(error, queryClient, id, errorFallback)
    },
  })
}

export function useFinishTransaction(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => TransactionService.finish(id),
    onSuccess: (transaction: TransactionDetail) => {
      queryClient.setQueryData(transactionKeys.detail(id), transaction)
      invalidateSettlementQueries(queryClient, id)
      useSettlementDialogStore.getState().closeDialog()
      toast.success('Transaction marked ready for payment')
    },
    onError: (error: NormalizedApiError) => {
      handleSettlementError(error, queryClient, id, 'Could not mark transaction ready for payment')
    },
  })
}

export function useSettleTransaction(id: string) {
  return useSettlementMutation(
    id,
    (input: SettleTransactionInput) => TransactionService.settle(id, input),
    'Transaction marked as paid',
    'Could not settle transaction',
  )
}

export function useCancelTransaction(id: string) {
  return useSettlementMutation(
    id,
    (input: CancelTransactionInput) => TransactionService.cancel(id, input),
    'Transaction cancelled',
    'Could not cancel transaction',
  )
}

export function useReturnToDraftTransaction(id: string) {
  return useSettlementMutation(
    id,
    (input: ReturnToDraftInput) => TransactionService.returnToDraft(id, input),
    'Transaction returned to draft',
    'Could not return transaction to draft',
  )
}

export function useReopenTransaction(id: string) {
  return useSettlementMutation(
    id,
    (input: ReopenTransactionInput) => TransactionService.reopen(id, input),
    'Transaction reopened',
    'Could not reopen transaction',
  )
}
