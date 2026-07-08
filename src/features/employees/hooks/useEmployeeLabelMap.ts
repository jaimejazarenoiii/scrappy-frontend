import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import { formatEmployeeBreadcrumbLabel } from '../lib/employee-display'
import { EmployeeService } from '../services/employee.service'
import { employeeKeys } from './useEmployees'

export function useEmployeeLabelMap(): ReadonlyMap<string, string> {
  const query = useQuery({
    queryKey: employeeKeys.picker,
    queryFn: () => EmployeeService.listAll(),
    staleTime: 60_000,
  })

  return useMemo(() => {
    const map = new Map<string, string>()
    for (const employee of query.data ?? []) {
      map.set(
        employee.id,
        formatEmployeeBreadcrumbLabel({
          id: employee.id,
          firstName: employee.firstName,
          lastName: employee.lastName,
          employeeNumber: employee.employeeNumber,
        }),
      )
    }
    return map
  }, [query.data])
}
