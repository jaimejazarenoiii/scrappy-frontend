import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { NormalizedApiError } from '@/lib/axios'

import { ExpenseService } from '../services/expense.service'
import type { ExpenseAttachment } from '../types/expense.types'
import { expenseKeys } from './expense-keys'

export function useUploadExpenseAttachment(expenseId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ file, onProgress }: { file: File; onProgress?: (percent: number) => void }) =>
      ExpenseService.uploadAttachment(expenseId, file, onProgress),
    onSuccess: (attachment) => {
      queryClient.setQueryData<ExpenseAttachment[]>(
        expenseKeys.attachments(expenseId),
        (current) => {
          const list = current ?? []
          if (list.some((item) => item.id === attachment.id)) return list
          return [...list, attachment]
        },
      )
      void queryClient.invalidateQueries({ queryKey: expenseKeys.attachments(expenseId) })
      void queryClient.invalidateQueries({ queryKey: expenseKeys.detail(expenseId) })
      toast.success('Receipt uploaded')
    },
    onError: (error: NormalizedApiError) => {
      toast.error(error.message || 'Could not upload receipt')
    },
  })
}

export function useDeleteExpenseAttachment(expenseId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (attachmentId: string) => ExpenseService.deleteAttachment(expenseId, attachmentId),
    onSuccess: (_result, attachmentId) => {
      queryClient.setQueryData<ExpenseAttachment[]>(expenseKeys.attachments(expenseId), (current) =>
        (current ?? []).filter((item) => item.id !== attachmentId),
      )
      void queryClient.invalidateQueries({ queryKey: expenseKeys.attachments(expenseId) })
      void queryClient.invalidateQueries({ queryKey: expenseKeys.detail(expenseId) })
      toast.success('Receipt removed')
    },
    onError: (error: NormalizedApiError) => {
      toast.error(error.message || 'Could not remove receipt')
    },
  })
}
