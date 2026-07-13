import { apiClient } from '@/lib/axios'
import { unwrap } from '@/lib/api-envelope'
import type { ApiEnvelope } from '@/types/api.types'
import type { ListQueryParams, PaginatedResponse } from '@/types/pagination.types'

import { formatEmployeeName } from '../lib/employee-display'
import type {
  CreateEmployeeInput,
  Employee,
  EmployeePasswordResetResult,
  GrantSystemAccessInput,
  LinkEmployeeUserInput,
  UpdateEmployeeInput,
} from '../types/employee.types'

export const EMPLOYEE_ENDPOINTS = {
  base: '/employees',
  me: '/employees/me',
  detail: (employeeId: string) => `/employees/${employeeId}`,
  archive: (employeeId: string) => `/employees/${employeeId}/archive`,
  userLink: (employeeId: string) => `/employees/${employeeId}/user-link`,
  systemAccess: (employeeId: string) => `/employees/${employeeId}/system-access`,
  systemAccessDisable: (employeeId: string) => `/employees/${employeeId}/system-access/disable`,
  systemAccessEnable: (employeeId: string) => `/employees/${employeeId}/system-access/enable`,
  passwordReset: (employeeId: string) => `/employees/${employeeId}/password-reset`,
} as const

function filterAndPaginate(
  employees: Employee[],
  params: ListQueryParams,
): PaginatedResponse<Employee> {
  let filtered = [...employees]

  if (params.search) {
    const query = params.search.toLowerCase()
    filtered = filtered.filter(
      (employee) =>
        formatEmployeeName(employee).toLowerCase().includes(query) ||
        (employee.employeeNumber?.toLowerCase().includes(query) ?? false) ||
        (employee.contactNumber?.toLowerCase().includes(query) ?? false),
    )
  }

  const statusFilter = params.filters?.status
  if (statusFilter === 'active' || !statusFilter) {
    filtered = filtered.filter(
      (employee) => employee.deletedAt == null && employee.status === 'ACTIVE',
    )
  } else if (statusFilter === 'archived') {
    filtered = filtered.filter((employee) => employee.deletedAt != null)
  }

  if (params.sort) {
    const { field, direction } = params.sort
    const factor = direction === 'asc' ? 1 : -1
    filtered.sort((a, b) => {
      const left =
        field === 'name'
          ? formatEmployeeName(a)
          : field === 'status'
            ? a.status
            : (a.employeeNumber ?? '')
      const right =
        field === 'name'
          ? formatEmployeeName(b)
          : field === 'status'
            ? b.status
            : (b.employeeNumber ?? '')
      return left.localeCompare(right) * factor
    })
  }

  const total = filtered.length
  const start = (params.page - 1) * params.pageSize
  const data = filtered.slice(start, start + params.pageSize)

  return {
    data,
    total,
    page: params.page,
    pageSize: params.pageSize,
  }
}

export const EmployeeService = {
  /** Active employees for the current company (non-paginated). */
  async listAll(): Promise<Employee[]> {
    const response = await apiClient.get<ApiEnvelope<Employee[]>>(EMPLOYEE_ENDPOINTS.base)
    return unwrap(response)
  },

  /** Client-side filter/sort/pagination over the company employee list. */
  async list(params: ListQueryParams): Promise<PaginatedResponse<Employee>> {
    const employees = await EmployeeService.listAll()
    return filterAndPaginate(employees, params)
  },

  async me(): Promise<Employee> {
    const response = await apiClient.get<ApiEnvelope<Employee>>(EMPLOYEE_ENDPOINTS.me)
    return unwrap(response)
  },

  async get(employeeId: string): Promise<Employee> {
    const response = await apiClient.get<ApiEnvelope<Employee>>(
      EMPLOYEE_ENDPOINTS.detail(employeeId),
    )
    return unwrap(response)
  },

  async create(input: CreateEmployeeInput): Promise<Employee> {
    const response = await apiClient.post<ApiEnvelope<Employee>>(EMPLOYEE_ENDPOINTS.base, input)
    return unwrap(response)
  },

  async update(employeeId: string, input: UpdateEmployeeInput): Promise<Employee> {
    const response = await apiClient.patch<ApiEnvelope<Employee>>(
      EMPLOYEE_ENDPOINTS.detail(employeeId),
      input,
    )
    return unwrap(response)
  },

  async archive(employeeId: string): Promise<Employee> {
    const response = await apiClient.post<ApiEnvelope<Employee>>(
      EMPLOYEE_ENDPOINTS.archive(employeeId),
    )
    return unwrap(response)
  },

  async linkUser(employeeId: string, input: LinkEmployeeUserInput): Promise<Employee> {
    const response = await apiClient.post<ApiEnvelope<Employee>>(
      EMPLOYEE_ENDPOINTS.userLink(employeeId),
      input,
    )
    return unwrap(response)
  },

  async grantSystemAccess(employeeId: string, input: GrantSystemAccessInput): Promise<Employee> {
    const response = await apiClient.post<ApiEnvelope<Employee>>(
      EMPLOYEE_ENDPOINTS.systemAccess(employeeId),
      input,
    )
    return unwrap(response)
  },

  async disableSystemAccess(employeeId: string): Promise<Employee> {
    const response = await apiClient.post<ApiEnvelope<Employee>>(
      EMPLOYEE_ENDPOINTS.systemAccessDisable(employeeId),
    )
    return unwrap(response)
  },

  async enableSystemAccess(employeeId: string): Promise<Employee> {
    const response = await apiClient.post<ApiEnvelope<Employee>>(
      EMPLOYEE_ENDPOINTS.systemAccessEnable(employeeId),
    )
    return unwrap(response)
  },

  async resetPassword(employeeId: string): Promise<EmployeePasswordResetResult> {
    const response = await apiClient.post<ApiEnvelope<EmployeePasswordResetResult>>(
      EMPLOYEE_ENDPOINTS.passwordReset(employeeId),
      {},
    )
    return unwrap(response)
  },
}
