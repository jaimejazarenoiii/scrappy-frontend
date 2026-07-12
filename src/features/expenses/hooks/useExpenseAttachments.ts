import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { ExpenseService } from '../services/expense.service'
import { expenseKeys } from './expense-keys'

export function useExpenseAttachments(expenseId: string | undefined) {
  return useQuery({
    queryKey: expenseKeys.attachments(expenseId ?? ''),
    queryFn: () => {
      if (!expenseId) throw new Error('Missing expense id')
      return ExpenseService.listAttachments(expenseId)
    },
    enabled: Boolean(expenseId),
    placeholderData: keepPreviousData,
  })
}
