/**
 * Remember-session token storage.
 *
 * The access token is never persisted (kept in memory in the auth store). Only the
 * refresh token and the "remember session" preference are persisted here:
 *   - remember = true  → localStorage (survives browser restarts)
 *   - remember = false → sessionStorage (cleared when the tab closes)
 *
 * If the backend issues an httpOnly refresh cookie, `refreshToken` will simply be null
 * and this module becomes a no-op for the token itself while still tracking the
 * "remember" preference.
 */
import type { CurrentUser } from '@/features/auth/types/auth.types'

const REFRESH_TOKEN_KEY = 'scrappy.refreshToken'
const REMEMBER_KEY = 'scrappy.rememberSession'
const IDENTITY_KEY = 'scrappy.identity'

function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

export function getRememberSession(): boolean {
  if (!isBrowser()) return false
  return window.localStorage.getItem(REMEMBER_KEY) === 'true'
}

function activeStore(): Storage | null {
  if (!isBrowser()) return null
  return getRememberSession() ? window.localStorage : window.sessionStorage
}

export function getStoredRefreshToken(): string | null {
  if (!isBrowser()) return null
  return (
    window.localStorage.getItem(REFRESH_TOKEN_KEY) ??
    window.sessionStorage.getItem(REFRESH_TOKEN_KEY)
  )
}

export function persistSession(refreshToken: string | null, remember: boolean): void {
  if (!isBrowser()) return

  window.localStorage.setItem(REMEMBER_KEY, String(remember))

  // Clear any prior token from both stores before writing to the active one.
  window.localStorage.removeItem(REFRESH_TOKEN_KEY)
  window.sessionStorage.removeItem(REFRESH_TOKEN_KEY)

  if (refreshToken) {
    const store = remember ? window.localStorage : window.sessionStorage
    store.setItem(REFRESH_TOKEN_KEY, refreshToken)
  }
}

export function clearStoredSession(): void {
  if (!isBrowser()) return
  window.localStorage.removeItem(REFRESH_TOKEN_KEY)
  window.sessionStorage.removeItem(REFRESH_TOKEN_KEY)
  window.localStorage.removeItem(REMEMBER_KEY)
  window.localStorage.removeItem(IDENTITY_KEY)
  window.sessionStorage.removeItem(IDENTITY_KEY)
}

/**
 * Persists the current identity alongside the refresh token so a reload can restore the
 * session without an extra network round-trip (the login response is the source of truth).
 */
export function persistIdentity(user: CurrentUser | null, remember: boolean): void {
  if (!isBrowser()) return

  window.localStorage.removeItem(IDENTITY_KEY)
  window.sessionStorage.removeItem(IDENTITY_KEY)

  if (user) {
    const store = remember ? window.localStorage : window.sessionStorage
    store.setItem(IDENTITY_KEY, JSON.stringify(user))
  }
}

export function getStoredIdentity(): CurrentUser | null {
  if (!isBrowser()) return null
  const raw =
    window.localStorage.getItem(IDENTITY_KEY) ?? window.sessionStorage.getItem(IDENTITY_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as CurrentUser
  } catch {
    return null
  }
}

export function updateStoredRefreshToken(refreshToken: string | null): void {
  const store = activeStore()
  if (!store) return
  if (refreshToken) {
    store.setItem(REFRESH_TOKEN_KEY, refreshToken)
  } else {
    store.removeItem(REFRESH_TOKEN_KEY)
  }
}
