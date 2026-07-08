import { keepPreviousData, useQuery } from '@tanstack/react-query'

import type { ListQueryParams } from '@/types/pagination.types'

import { PayrollService } from '../services/payroll.service'

export const payrollKeys = {
  all: ['payroll'] as const,
  list: (params: ListQueryParams) => ['payroll', 'list', params] as const,
  detail: (id: string) => ['payroll', 'detail', id] as const,
}

export function usePayrolls(params: ListQueryParams) {
  return useQuery({
    queryKey: payrollKeys.list(params),
    queryFn: () => PayrollService.list(params),
    placeholderData: keepPreviousData,
  })
}
