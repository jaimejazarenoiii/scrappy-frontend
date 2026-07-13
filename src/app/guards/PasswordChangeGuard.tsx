import { Navigate, Outlet } from 'react-router'

import { ROUTES } from '@/constants/routes'
import { useAuthStore } from '@/store/auth.store'

/**
 * Blocks the rest of the app until a required password change completes.
 * The change-password route itself sits outside this guard.
 */
export function PasswordChangeGuard() {
  const passwordChangeRequired = useAuthStore(
    (state) => state.currentUser?.passwordChangeRequired === true,
  )

  if (passwordChangeRequired) {
    return <Navigate to={ROUTES.changePassword} replace />
  }

  return <Outlet />
}
