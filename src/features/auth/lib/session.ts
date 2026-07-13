import { PERMISSIONS } from '@/constants/permissions'
import { CompanyService } from '@/features/company/services/company.service'
import type { Company } from '@/features/company/types/company.types'
import { UserService } from '@/features/users/services/user.service'
import type { UserMe } from '@/features/users/types/user.types'
import type { NormalizedApiError } from '@/types/api.types'

import type { AuthCompany, CurrentUser, UserRole } from '../types/auth.types'

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
  PERMISSIONS.transactions.finish,
  PERMISSIONS.transactions.cancel,
  ...Object.values(PERMISSIONS.trips),
  ...Object.values(PERMISSIONS.expenses),
  ...Object.values(PERMISSIONS.analytics),
  ...Object.values(PERMISSIONS.reports),
  ...Object.values(PERMISSIONS.activityLogs),
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
  PERMISSIONS.transactions.finish,
  PERMISSIONS.transactions.cancel,
  ...Object.values(PERMISSIONS.trips),
  ...Object.values(PERMISSIONS.expenses),
  ...Object.values(PERMISSIONS.analytics),
  ...Object.values(PERMISSIONS.reports),
  ...Object.values(PERMISSIONS.activityLogs),
]

const EMPLOYEE_PERMISSIONS: string[] = [
  // Day-to-day ops only — no org admin (employees/branches/warehouses/vehicles),
  // analytics, reports, or activity logs. Branch/warehouse/vehicle list APIs remain
  // available for transaction pickers via backend role authorize, not nav permissions.
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
    passwordChangeRequired: me.passwordChangeRequired === true,
  }
}

function companyFromAuth(company: AuthCompany): Company {
  return {
    id: company.id,
    name: company.name,
    logoUrl: null,
    contactNumber: null,
    email: null,
    address: null,
    status: company.status,
  }
}

function stubCompany(companyId: string): Company {
  return {
    id: companyId,
    name: 'Your business',
    logoUrl: null,
    contactNumber: null,
    email: null,
    address: null,
    status: 'ACTIVE',
  }
}

function isPasswordChangeRequiredError(error: unknown): boolean {
  const normalized = error as NormalizedApiError | undefined
  return normalized?.code === 'PASSWORD_CHANGE_REQUIRED' || normalized?.status === 403
}

/**
 * Resolves the session identity from token-scoped convenience endpoints.
 * When a password change is required, `/companies/me` is not allowlisted — use the
 * login/refresh company snapshot instead.
 */
export async function hydrateSession(options?: {
  fallbackCompany?: AuthCompany
}): Promise<CurrentUser> {
  const me = await UserService.me()

  if (me.passwordChangeRequired) {
    const company = options?.fallbackCompany
      ? companyFromAuth(options.fallbackCompany)
      : stubCompany(me.companyId)
    return buildCurrentUser(me, company)
  }

  try {
    const company = await CompanyService.getMe()
    return buildCurrentUser(me, company)
  } catch (error) {
    if (isPasswordChangeRequiredError(error) && options?.fallbackCompany) {
      return buildCurrentUser(
        { ...me, passwordChangeRequired: true },
        companyFromAuth(options.fallbackCompany),
      )
    }
    throw error
  }
}
