export type UserRole = 'OWNER' | 'MANAGER' | 'EMPLOYEE'

export interface Credentials {
  identifier: string
  password: string
  remember: boolean
}

export interface AuthTokens {
  accessToken: string
  refreshToken?: string
  expiresIn?: number
}

/** Company summary returned inline by login/refresh. */
export interface AuthCompany {
  id: string
  name: string
  status: 'ACTIVE' | 'INACTIVE'
}

/** User summary returned inline by login/refresh. */
export interface AuthUser {
  id: string
  email: string
  role: UserRole
}

/** `POST /auth/login` and `POST /auth/refresh` response data. */
export interface LoginResponse extends AuthTokens {
  company: AuthCompany
  user: AuthUser
}

export interface Role {
  id: string
  name: string
  permissions: string[]
}

export interface TenantContext {
  companyId: string
  companyName: string
}

export interface CurrentUser {
  id: string
  name: string
  email: string
  role: UserRole
  employeeId: string | null
  roles: Role[]
  permissions: string[]
  tenant: TenantContext
  status: 'active' | 'inactive'
}

export type SessionStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated'
