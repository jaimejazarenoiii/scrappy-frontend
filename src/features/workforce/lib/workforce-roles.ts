import type { UserRole } from '@/features/auth/types/auth.types'

export function isCompanyViewer(role: UserRole | undefined): boolean {
  return role === 'OWNER' || role === 'MANAGER'
}

/** Owners are exempt from time-in/out; managers and employees must clock in. */
export function canClockAttendance(role: UserRole | undefined): boolean {
  return role === 'MANAGER' || role === 'EMPLOYEE'
}

/** All roles can create leave, but with different employee targeting rules. */
export function canCreateLeave(role: UserRole | undefined): boolean {
  return role === 'OWNER' || role === 'MANAGER' || role === 'EMPLOYEE'
}

/** Owners must pick an employee; they cannot request leave for themselves. */
export function requiresLeaveEmployeePicker(role: UserRole | undefined): boolean {
  return role === 'OWNER'
}

/** Managers may optionally create leave on behalf of another employee. */
export function showsOptionalLeaveEmployeePicker(role: UserRole | undefined): boolean {
  return role === 'MANAGER'
}

/** Owners and managers can PATCH manage leave records (approve/reject/edit). */
export function canManageLeaveRecords(role: UserRole | undefined): boolean {
  return role === 'OWNER' || role === 'MANAGER'
}
