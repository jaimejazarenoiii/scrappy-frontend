import type { ReactNode } from 'react'

/** Opaque permission key provided by the backend (e.g. "user.view"). */
export type Permission = string

export type PermissionMode = 'all' | 'any'

export interface PermissionCheck {
  permission?: Permission
  anyOf?: Permission[]
  allOf?: Permission[]
}

export interface PermissionGateProps extends PermissionCheck {
  fallback?: ReactNode
  children: ReactNode
}
