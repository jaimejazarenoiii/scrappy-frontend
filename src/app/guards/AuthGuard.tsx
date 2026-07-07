import { Outlet } from 'react-router'

export function AuthGuard() {
  // TODO(Spec 002): Redirect unauthenticated users to /login
  return <Outlet />
}
