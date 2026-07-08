import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'

import { ROUTES } from '@/constants/routes'
import { useAuthStore } from '@/store/auth.store'

import { AuthService } from '../services/auth.service'

/**
 * Logs the user out: best-effort server logout, then clears the local session and cache
 * (tenant isolation) and returns to the login screen.
 */
export function useLogout() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async () => {
      try {
        await AuthService.logout()
      } catch {
        // Ignore server errors on logout — the local session is cleared regardless.
      }
    },
    onSettled: () => {
      useAuthStore.getState().clearSession()
      void navigate(ROUTES.login, { replace: true })
    },
  })
}
