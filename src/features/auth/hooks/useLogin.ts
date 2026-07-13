import { useMutation } from '@tanstack/react-query'

import { useAuthStore } from '@/store/auth.store'

import { hydrateSession } from '../lib/session'
import { AuthService } from '../services/auth.service'
import type { Credentials } from '../types/auth.types'

/**
 * Authenticates via `POST /auth/login`, then hydrates identity from `GET /users/me` and
 * `GET /companies/me` per the Scrappy API bootstrap flow.
 */
export function useLogin() {
  return useMutation({
    mutationFn: async (credentials: Credentials) => {
      const login = await AuthService.login(credentials)
      useAuthStore.getState().setTokens(login.accessToken, login.refreshToken ?? undefined)
      const user = await hydrateSession({ fallbackCompany: login.company })
      return { login, user, remember: credentials.remember }
    },
    onSuccess: ({ login, user, remember }) => {
      useAuthStore.getState().setSession({
        accessToken: login.accessToken,
        refreshToken: login.refreshToken ?? null,
        user,
        remember,
      })
    },
    onError: () => {
      useAuthStore.getState().clearSession()
    },
  })
}
