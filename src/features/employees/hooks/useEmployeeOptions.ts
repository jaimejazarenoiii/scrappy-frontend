import { useQuery } from '@tanstack/react-query'

import { formatEmployeeBreadcrumbLabel } from '../lib/employee-display'
import { EmployeeService } from '../services/employee.service'
import { employeeKeys } from './useEmployees'

export interface EmployeeOption {
  value: string
  label: string
}

/** Active employees for select pickers in leave/cash-advance/transaction forms. */
export function useEmployeeOptions() {
  return useQuery({
    queryKey: employeeKeys.picker,
    queryFn: () => EmployeeService.listAll(),
    staleTime: 60_000,
    // Use `select` so the cached query data stays `Employee[]` for other hooks
    // (e.g. `useEmployeeLabelMap`) that share `employeeKeys.picker`.
    select: (employees): EmployeeOption[] =>
      employees
        .filter((employee) => employee.deletedAt == null && employee.status === 'ACTIVE')
        .map((employee) => ({
          value: employee.id,
          label: formatEmployeeBreadcrumbLabel({
            id: employee.id,
            firstName: employee.firstName,
            lastName: employee.lastName,
            employeeNumber: employee.employeeNumber,
          }),
        })),
  })
}
