import { useQuery } from '@tanstack/react-query'

import { formatEmployeeBreadcrumbLabel } from '../lib/employee-display'
import { EmployeeService } from '../services/employee.service'
import { employeeKeys } from './useEmployees'

/** Active employees for select pickers in leave/cash-advance forms. */
export function useEmployeeOptions() {
  return useQuery({
    queryKey: employeeKeys.picker,
    queryFn: async () => {
      const employees = await EmployeeService.listAll()
      return employees
        .filter((employee) => employee.deletedAt == null && employee.status === 'ACTIVE')
        .map((employee) => ({
          value: employee.id,
          label: formatEmployeeBreadcrumbLabel({
            id: employee.id,
            firstName: employee.firstName,
            lastName: employee.lastName,
            employeeNumber: employee.employeeNumber,
          }),
        }))
    },
    staleTime: 60_000,
  })
}
