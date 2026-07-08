import { useMemo } from 'react'

import { useAuthStore } from '@/store/auth.store'

export interface PermissionChecks {
  permissions: string[]
  has: (permission: string) => boolean
  hasAny: (required: string[]) => boolean
  hasAll: (required: string[]) => boolean
}

/**
 * Backend-driven permission checks. Permissions come from the current identity returned
 * by the backend; the frontend never hardcodes authorization rules.
 */
export function usePermissions(): PermissionChecks {
  const permissions = useAuthStore((state) => state.permissions)

  return useMemo(() => {
    const permissionSet = new Set(permissions)
    return {
      permissions,
      has: (permission: string) => permissionSet.has(permission),
      hasAny: (required: string[]) =>
        required.length === 0 || required.some((permission) => permissionSet.has(permission)),
      hasAll: (required: string[]) => required.every((permission) => permissionSet.has(permission)),
    }
  }, [permissions])
}
