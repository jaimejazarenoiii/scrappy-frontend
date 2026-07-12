import { keepPreviousData, useQuery } from '@tanstack/react-query'

import type { ListQueryParams } from '@/types/pagination.types'

import { ExpenseService } from '../services/expense.service'
import { expenseKeys } from './expense-keys'

export function useExpenses(params: ListQueryParams) {
  return useQuery({
    queryKey: expenseKeys.list(params),
    queryFn: () => ExpenseService.list(params),
    placeholderData: keepPreviousData,
  })
}

export function useExpenseDashboard() {
  return useQuery({
    queryKey: expenseKeys.dashboard(),
    queryFn: () => ExpenseService.getDashboard(),
    retry: false,
  })
}
