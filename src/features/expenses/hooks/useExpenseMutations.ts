import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { NormalizedApiError } from '@/lib/axios'

import { ExpenseService } from '../services/expense.service'
import type { CreateExpenseInput, ExpenseDetail, UpdateExpenseInput } from '../types/expense.types'
import { expenseKeys } from './expense-keys'

function invalidateExpenseQueries(queryClient: ReturnType<typeof useQueryClient>, id?: string) {
  void queryClient.invalidateQueries({ queryKey: expenseKeys.all })
  if (id) {
    void queryClient.invalidateQueries({ queryKey: expenseKeys.detail(id) })
    void queryClient.invalidateQueries({ queryKey: expenseKeys.attachments(id) })
  }
}

export function useCreateExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateExpenseInput) => ExpenseService.create(input),
    onSuccess: (expense: ExpenseDetail) => {
      queryClient.setQueryData(expenseKeys.detail(expense.id), expense)
      invalidateExpenseQueries(queryClient, expense.id)
      toast.success('Expense created')
    },
    onError: (error: NormalizedApiError) => {
      toast.error(error.message || 'Could not create expense')
    },
  })
}

export function useUpdateExpense(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateExpenseInput) => ExpenseService.update(id, input),
    onSuccess: (expense: ExpenseDetail) => {
      queryClient.setQueryData(expenseKeys.detail(id), expense)
      invalidateExpenseQueries(queryClient, id)
      toast.success('Expense updated')
    },
    onError: (error: NormalizedApiError) => {
      if (error.status === 409) {
        void queryClient.invalidateQueries({ queryKey: expenseKeys.detail(id) })
      }
      toast.error(error.message || 'Could not update expense')
    },
  })
}

export function useDeleteExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => ExpenseService.delete(id),
    onSuccess: () => {
      invalidateExpenseQueries(queryClient)
      toast.success('Expense deleted')
    },
    onError: (error: NormalizedApiError) => {
      toast.error(error.message || 'Could not delete expense')
    },
  })
}

export function useArchiveExpense() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => ExpenseService.archive(id),
    onSuccess: (expense: ExpenseDetail) => {
      queryClient.setQueryData(expenseKeys.detail(expense.id), expense)
      invalidateExpenseQueries(queryClient, expense.id)
      toast.success('Expense archived')
    },
    onError: (error: NormalizedApiError) => {
      if (error.status === 409) {
        toast.error(error.message || 'This expense cannot be archived in its current state')
      } else {
        toast.error(error.message || 'Could not archive expense')
      }
    },
  })
}
