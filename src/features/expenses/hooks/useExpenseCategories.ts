import { useQuery } from '@tanstack/react-query'

import { ExpenseService } from '../services/expense.service'
import { expenseKeys } from './expense-keys'

export function useExpenseCategories() {
  return useQuery({
    queryKey: expenseKeys.categories(),
    queryFn: () => ExpenseService.listCategories(),
    staleTime: 60_000,
  })
}
