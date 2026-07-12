import { useQuery } from '@tanstack/react-query'

import { ExpenseService } from '../services/expense.service'
import { expenseKeys } from './expense-keys'

export function useExpense(id: string | undefined) {
  return useQuery({
    queryKey: expenseKeys.detail(id ?? ''),
    queryFn: () => ExpenseService.get(id ?? ''),
    enabled: Boolean(id),
  })
}
