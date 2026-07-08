import { Navigate, Outlet } from 'react-router'

import { ROUTES } from '@/constants/routes'
import { usePermissions } from '@/features/authorization/hooks/usePermissions'

interface PermissionGuardProps {
  /** Requires ALL of these permissions to enter the route. */
  permissions: string[]
}

/**
 * Route-level authorization. Assumes it renders inside an authenticated branch
 * (AuthGuard), so permissions are already loaded. Redirects to /403 when the user
 * lacks the required permissions.
 */
export function PermissionGuard({ permissions }: PermissionGuardProps) {
  const { hasAll } = usePermissions()

  if (!hasAll(permissions)) {
    return <Navigate to={ROUTES.forbidden} replace />
  }

  return <Outlet />
}
