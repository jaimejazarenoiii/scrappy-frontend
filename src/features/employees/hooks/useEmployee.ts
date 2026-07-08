import { useQuery } from '@tanstack/react-query'

import { EmployeeService } from '../services/employee.service'
import { employeeKeys } from './useEmployees'

export function useEmployee(id: string | undefined) {
  return useQuery({
    queryKey: employeeKeys.detail(id ?? ''),
    queryFn: () => EmployeeService.get(id ?? ''),
    enabled: Boolean(id),
  })
}
