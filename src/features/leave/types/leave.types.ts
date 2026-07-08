import type { EmployeeSummary } from '@/features/employees/types/employee.types'

export type LeaveType = 'HALF_DAY' | 'FULL_DAY'
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'

export interface Leave {
  id: string
  companyId: string
  employeeId: string
  firstName?: string | null
  lastName?: string | null
  employeeNumber?: string | null
  employee?: EmployeeSummary
  leaveType: LeaveType
  leaveDate: string
  reason: string | null
  status: LeaveStatus
  managerNote: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateLeaveInput {
  leaveType: LeaveType
  leaveDate: string
  reason?: string
  employeeId?: string
}

export interface ManageLeaveInput {
  status?: Exclude<LeaveStatus, 'PENDING'>
  managerNote?: string
  leaveType?: LeaveType
  leaveDate?: string
  reason?: string
}

export interface LeaveEmployeeDaySummary {
  employeeId: string
  employeeNumber?: string | null
  firstName?: string | null
  lastName?: string | null
  pendingLeaveCount: number
  onLeaveToday: boolean
  approvedThisWeek: number
}

export interface LeaveCompanySummary {
  pendingRequests: number
  onLeaveToday: number
  approvedThisWeek: number
}

export interface LeaveDashboard {
  employees: LeaveEmployeeDaySummary[]
  summary: LeaveCompanySummary
}
