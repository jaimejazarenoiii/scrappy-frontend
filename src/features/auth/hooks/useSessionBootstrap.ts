import { useEffect, useRef } from 'react'

import { getStoredRefreshToken } from '@/lib/token-storage'
import { useAuthStore } from '@/store/auth.store'

import { hydrateSession } from '../lib/session'
import { AuthService } from '../services/auth.service'

/**
 * Restores session on app load: refresh tokens, then hydrate identity from `/users/me` and
 * `/companies/me`.
 */
export function useSessionBootstrap(): void {
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    const { setStatus, setTokens, setCurrentUser, clearSession } = useAuthStore.getState()
    const storedRefreshToken = getStoredRefreshToken()

    if (!storedRefreshToken) {
      setStatus('unauthenticated')
      return
    }

    setStatus('loading')

    void (async () => {
      try {
        const login = await AuthService.refresh(storedRefreshToken)
        setTokens(login.accessToken, login.refreshToken ?? undefined)
        const user = await hydrateSession()
        setCurrentUser(user)
      } catch {
        clearSession()
      }
    })()
  }, [])
}
