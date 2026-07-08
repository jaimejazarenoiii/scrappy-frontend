import type { EmployeeSummary } from '@/features/employees/types/employee.types'

export type PayrollStatus = 'PAYABLE' | 'PAID'

export interface Payroll {
  id: string
  companyId: string
  employeeId: string
  firstName?: string | null
  lastName?: string | null
  employeeNumber?: string | null
  employee?: EmployeeSummary
  payPeriodStart: string
  payPeriodEnd: string
  grossSalary: number
  cashAdvanceDeductions: number
  netPay: number
  status: PayrollStatus
  paidAt: string | null
  paymentReference: string | null
  createdAt: string
  updatedAt: string
}

export type PayrollDetail = Payroll

export interface GeneratePayrollInput {
  payPeriodStart: string
  payPeriodEnd: string
  employeeIds?: string[]
}

export interface MarkPayrollPaidInput {
  paymentReference?: string
}
