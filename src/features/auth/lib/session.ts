import { PERMISSIONS } from '@/constants/permissions'
import { CompanyService } from '@/features/company/services/company.service'
import type { Company } from '@/features/company/types/company.types'
import { UserService } from '@/features/users/services/user.service'
import type { UserMe } from '@/features/users/types/user.types'

import type { CurrentUser, UserRole } from '../types/auth.types'

/**
 * Client-side role → permission derivation.
 *
 * The API exposes a single `role` on the identity, not an explicit permission list. Until the
 * backend returns permissions, map the role to P001 permission keys for menu gating and guards.
 */
const OWNER_PERMISSIONS: string[] = [
  ...Object.values(PERMISSIONS.company),
  ...Object.values(PERMISSIONS.user),
  ...Object.values(PERMISSIONS.employee),
  ...Object.values(PERMISSIONS.branch),
  ...Object.values(PERMISSIONS.warehouse),
  ...Object.values(PERMISSIONS.vehicle),
  PERMISSIONS.attendance.view,
  PERMISSIONS.attendance.correct,
  PERMISSIONS.leave.view,
  PERMISSIONS.leave.create,
  PERMISSIONS.leave.update,
  PERMISSIONS.leave.approve,
  PERMISSIONS.leave.reject,
  PERMISSIONS.leave.cancel,
  ...Object.values(PERMISSIONS.cashAdvance),
  ...Object.values(PERMISSIONS.payroll),
  ...Object.values(PERMISSIONS.transactions),
]

const MANAGER_PERMISSIONS: string[] = [
  PERMISSIONS.company.view,
  ...Object.values(PERMISSIONS.user),
  ...Object.values(PERMISSIONS.employee),
  ...Object.values(PERMISSIONS.branch),
  ...Object.values(PERMISSIONS.warehouse),
  ...Object.values(PERMISSIONS.vehicle),
  ...Object.values(PERMISSIONS.attendance),
  PERMISSIONS.leave.view,
  PERMISSIONS.leave.create,
  PERMISSIONS.leave.update,
  PERMISSIONS.leave.cancel,
  PERMISSIONS.leave.approve,
  PERMISSIONS.leave.reject,
  ...Object.values(PERMISSIONS.cashAdvance),
  ...Object.values(PERMISSIONS.payroll),
  ...Object.values(PERMISSIONS.transactions),
]

const EMPLOYEE_PERMISSIONS: string[] = [
  PERMISSIONS.employee.view,
  PERMISSIONS.branch.view,
  PERMISSIONS.warehouse.view,
  PERMISSIONS.vehicle.view,
  PERMISSIONS.attendance.view,
  PERMISSIONS.attendance.timeIn,
  PERMISSIONS.attendance.timeOut,
  PERMISSIONS.leave.view,
  PERMISSIONS.leave.create,
  PERMISSIONS.leave.cancel,
  PERMISSIONS.cashAdvance.view,
  PERMISSIONS.payroll.view,
  PERMISSIONS.transactions.view,
  PERMISSIONS.transactions.create,
  PERMISSIONS.transactions.update,
  PERMISSIONS.transactions.finish,
  PERMISSIONS.transactions.cancel,
]

const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  OWNER: OWNER_PERMISSIONS,
  MANAGER: MANAGER_PERMISSIONS,
  EMPLOYEE: EMPLOYEE_PERMISSIONS,
}

export function permissionsForRole(role: UserRole): string[] {
  return ROLE_PERMISSIONS[role]
}

export function buildCurrentUser(me: UserMe, company: Company): CurrentUser {
  const permissions = permissionsForRole(me.role)

  return {
    id: me.id,
    name: me.email,
    email: me.email,
    role: me.role,
    employeeId: me.employeeId,
    roles: [{ id: me.role, name: me.role, permissions }],
    permissions,
    tenant: {
      companyId: company.id,
      companyName: company.name,
    },
    status: me.status === 'ACTIVE' ? 'active' : 'inactive',
  }
}

/** Resolves the session identity from token-scoped convenience endpoints. */
export async function hydrateSession(): Promise<CurrentUser> {
  const [me, company] = await Promise.all([UserService.me(), CompanyService.getMe()])
  return buildCurrentUser(me, company)
}
