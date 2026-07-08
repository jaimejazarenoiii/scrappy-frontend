import type { Permission, PermissionMode } from '../types/authorization.types'
import { usePermissions } from './usePermissions'

/**
 * Convenience check for a single permission or a set of permissions.
 * mode 'all' (default) requires every key; 'any' requires at least one.
 */
export function useHasPermission(
  keys: Permission | Permission[],
  mode: PermissionMode = 'all',
): boolean {
  const { has, hasAll, hasAny } = usePermissions()

  if (typeof keys === 'string') {
    return has(keys)
  }

  return mode === 'any' ? hasAny(keys) : hasAll(keys)
}
