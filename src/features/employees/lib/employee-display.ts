import type { Employee } from '../types/employee.types'

export function formatEmployeeName(
  employee: Pick<Employee, 'firstName' | 'middleName' | 'lastName' | 'suffix'>,
): string {
  return [employee.firstName, employee.middleName, employee.lastName, employee.suffix]
    .filter((part): part is string => Boolean(part?.trim()))
    .join(' ')
}

export function isEmployeeArchived(employee: Pick<Employee, 'deletedAt'>): boolean {
  return employee.deletedAt != null
}
