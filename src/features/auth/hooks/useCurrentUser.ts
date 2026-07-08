import { useAuthStore } from '@/store/auth.store'

export function useCurrentUser() {
  const currentUser = useAuthStore((state) => state.currentUser)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const permissions = useAuthStore((state) => state.permissions)
  const tenant = useAuthStore((state) => state.tenant)

  return { currentUser, isAuthenticated, permissions, tenant }
}
