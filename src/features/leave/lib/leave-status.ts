import type { StatusTone } from '@/components/common/StatusBadge'
import { formatRecordEmployeeLabel } from '@/features/employees/lib/employee-display'

import type { Leave, LeaveStatus, LeaveType } from '../types/leave.types'

export function leaveStatusLabel(status: LeaveStatus): string {
  const labels: Record<LeaveStatus, string> = {
    PENDING: 'Pending',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
    CANCELLED: 'Cancelled',
  }
  return labels[status]
}

export function leaveStatusTone(status: LeaveStatus): StatusTone {
  switch (status) {
    case 'PENDING':
      return 'neutral'
    case 'APPROVED':
      return 'active'
    case 'REJECTED':
      return 'archived'
    case 'CANCELLED':
      return 'inactive'
    default:
      return 'neutral'
  }
}

export function leaveTypeLabel(leaveType: LeaveType): string {
  return leaveType === 'HALF_DAY' ? 'Half day' : 'Full day'
}

export function canManageLeave(leave: Pick<Leave, 'status'>): boolean {
  return leave.status === 'PENDING'
}

export function formatLeaveEmployee(
  leave: Pick<Leave, 'employeeId' | 'firstName' | 'lastName' | 'employeeNumber' | 'employee'>,
  labelById?: ReadonlyMap<string, string>,
): string {
  return formatRecordEmployeeLabel(leave, labelById)
}
