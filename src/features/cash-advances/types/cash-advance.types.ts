import type { EmployeeSummary } from '@/features/employees/types/employee.types'

export type CashAdvanceStatus = 'OUTSTANDING' | 'SETTLED'

export interface CashAdvance {
  id: string
  companyId: string
  employeeId: string
  firstName?: string | null
  lastName?: string | null
  employeeNumber?: string | null
  employee?: EmployeeSummary
  amount: number
  deductedAmount: number
  remainingAmount: number
  status: CashAdvanceStatus
  reason: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateCashAdvanceInput {
  employeeId: string
  amount: number
  reason?: string
}
