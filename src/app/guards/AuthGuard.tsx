import { Navigate, Outlet, useLocation } from 'react-router'

import { FullPageLoader } from '@/components/feedback/FullPageLoader'
import { ROUTES } from '@/constants/routes'
import { useAuthStore } from '@/store/auth.store'

export function AuthGuard() {
  const status = useAuthStore((state) => state.status)
  const location = useLocation()

  // Session bootstrap not yet resolved — avoid a flash of the login redirect.
  if (status === 'idle' || status === 'loading') {
    return <FullPageLoader label="Checking your session…" />
  }

  if (status !== 'authenticated') {
    return <Navigate to={ROUTES.login} replace state={{ from: location }} />
  }

  return <Outlet />
}
