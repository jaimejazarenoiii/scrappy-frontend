import type { PermissionGateProps } from '../types/authorization.types'
import { usePermissions } from '../hooks/usePermissions'

/**
 * Conditionally renders children based on the current identity's permissions.
 * Use for buttons, menu items, and any permission-gated UI.
 */
export function PermissionGate({
  permission,
  anyOf,
  allOf,
  fallback = null,
  children,
}: PermissionGateProps) {
  const { has, hasAny, hasAll } = usePermissions()

  const allowed =
    (permission ? has(permission) : true) &&
    (anyOf ? hasAny(anyOf) : true) &&
    (allOf ? hasAll(allOf) : true)

  return <>{allowed ? children : fallback}</>
}
