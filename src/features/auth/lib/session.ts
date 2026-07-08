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
const ALL_PERMISSIONS: string[] = [
  ...Object.values(PERMISSIONS.company),
  ...Object.values(PERMISSIONS.user),
  ...Object.values(PERMISSIONS.employee),
]

const MANAGER_PERMISSIONS: string[] = [
  PERMISSIONS.company.view,
  ...Object.values(PERMISSIONS.user),
  ...Object.values(PERMISSIONS.employee),
]

const EMPLOYEE_PERMISSIONS: string[] = [PERMISSIONS.employee.view]

const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  OWNER: ALL_PERMISSIONS,
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
