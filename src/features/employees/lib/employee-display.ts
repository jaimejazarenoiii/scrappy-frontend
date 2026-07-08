import type { Employee, EmployeeSummary } from '../types/employee.types'

export function formatEmployeeName(
  employee: Pick<Employee, 'firstName' | 'middleName' | 'lastName' | 'suffix'>,
): string {
  return [employee.firstName, employee.middleName, employee.lastName, employee.suffix]
    .filter((part): part is string => Boolean(part?.trim()))
    .join(' ')
}

export function formatEmployeeSummaryName(employee: EmployeeSummary): string {
  const name = `${employee.firstName} ${employee.lastName}`.trim()
  return employee.employeeNumber ? `${name} (${employee.employeeNumber})` : name
}

/** Breadcrumb/list label: "Jane Doe - EMP-001" */
export function formatEmployeeBreadcrumbLabel(employee: {
  employeeId?: string
  id?: string
  firstName?: string | null
  lastName?: string | null
  employeeNumber?: string | null
}): string {
  const name = [employee.firstName, employee.lastName].filter(Boolean).join(' ').trim()
  const number = employee.employeeNumber?.trim()

  if (name && number) return `${name} - ${number}`
  if (name) return name
  if (number) return number

  return employee.employeeId ?? employee.id ?? 'Details'
}

export function formatWorkforceEmployeeDisplay(employee: {
  employeeId: string
  firstName?: string | null
  lastName?: string | null
  employeeNumber?: string | null
}): string {
  return formatEmployeeBreadcrumbLabel(employee)
}

export interface WorkforceEmployeeRecord {
  employeeId: string
  firstName?: string | null
  lastName?: string | null
  employeeNumber?: string | null
  employee?: EmployeeSummary
}

/** Prefer inline API fields, then nested employee, then lookup map, then id fallback. */
export function formatRecordEmployeeLabel(
  record: WorkforceEmployeeRecord,
  labelById?: ReadonlyMap<string, string>,
): string {
  if (record.firstName || record.lastName || record.employeeNumber) {
    return formatEmployeeBreadcrumbLabel(record)
  }

  if (record.employee) {
    return formatEmployeeBreadcrumbLabel({
      ...record.employee,
      employeeId: record.employeeId,
      id: record.employee.id,
    })
  }

  const cached = labelById?.get(record.employeeId)
  if (cached) return cached

  return formatEmployeeBreadcrumbLabel({ employeeId: record.employeeId })
}

export function isEmployeeArchived(employee: Pick<Employee, 'deletedAt'>): boolean {
  return employee.deletedAt != null
}
