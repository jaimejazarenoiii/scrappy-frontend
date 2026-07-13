import type { UserRole } from '@/features/auth/types/auth.types'

export type EmployeeStatus = 'ACTIVE' | 'INACTIVE'
export type LinkedUserStatus = 'ACTIVE' | 'INACTIVE'

export interface EmployeeSummary {
  id: string
  firstName: string
  lastName: string
  employeeNumber?: string | null
}

/** Nested user when an account was provisioned or access toggled. */
export interface EmployeeLinkedUser {
  id: string
  email: string
  role: UserRole
  status: LinkedUserStatus
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
  linkedUser?: EmployeeLinkedUser | null
}

export interface CreateEmployeeAccountInput {
  email: string
  password: string
  confirmPassword: string
  role: UserRole
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
  /** When true, `account` must be provided. Cannot combine with `userId`. */
  createAccount?: boolean
  account?: CreateEmployeeAccountInput
}

export type UpdateEmployeeInput = Partial<Omit<CreateEmployeeInput, 'createAccount' | 'account'>>

export interface LinkEmployeeUserInput {
  userId: string
}

/** `POST /employees/{id}/system-access` — create User + link. */
export type GrantSystemAccessInput = CreateEmployeeAccountInput
