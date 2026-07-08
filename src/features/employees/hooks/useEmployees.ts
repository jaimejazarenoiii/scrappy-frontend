import { keepPreviousData, useQuery } from '@tanstack/react-query'

import type { ListQueryParams } from '@/types/pagination.types'

import { EmployeeService } from '../services/employee.service'

export const employeeKeys = {
  all: ['employees'] as const,
  list: (params: ListQueryParams) => ['employees', 'list', params] as const,
  detail: (id: string) => ['employees', 'detail', id] as const,
}

export function useEmployees(params: ListQueryParams) {
  return useQuery({
    queryKey: employeeKeys.list(params),
    queryFn: () => EmployeeService.list(params),
    placeholderData: keepPreviousData,
  })
}
