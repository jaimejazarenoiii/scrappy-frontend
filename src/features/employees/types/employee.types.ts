export type EmployeeStatus = 'ACTIVE' | 'INACTIVE'

export interface EmployeeSummary {
  id: string
  firstName: string
  lastName: string
  employeeNumber?: string | null
}

export interface Employee {
  id: string
  companyId: string
  userId: string | null
  employeeNumber: string | null
  firstName: string
  middleName: string | null
  lastName: string
  suffix: string | null
  contactNumber: string | null
  weeklySalary: number
  status: EmployeeStatus
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface CreateEmployeeInput {
  firstName: string
  lastName: string
  weeklySalary: number
  employeeNumber?: string
  middleName?: string
  suffix?: string
  contactNumber?: string
  status?: EmployeeStatus
}

export type UpdateEmployeeInput = Partial<CreateEmployeeInput>

export interface LinkEmployeeUserInput {
  userId: string
}
