import { create } from 'zustand'

import type { CurrentUser, SessionStatus, TenantContext } from '@/features/auth/types/auth.types'
import { queryClient } from '@/lib/query-client'
import {
  clearStoredSession,
  getRememberSession,
  persistSession,
  updateStoredRefreshToken,
} from '@/lib/token-storage'

interface SetSessionPayload {
  accessToken: string
  refreshToken?: string | null
  user: CurrentUser
  remember?: boolean
}

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  rememberSession: boolean
  status: SessionStatus
  currentUser: CurrentUser | null
  permissions: string[]
  tenant: TenantContext | null
  setStatus: (status: SessionStatus) => void
  setTokens: (accessToken: string, refreshToken?: string | null) => void
  setSession: (payload: SetSessionPayload) => void
  setCurrentUser: (user: CurrentUser) => void
  setPermissions: (permissions: string[]) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  rememberSession: getRememberSession(),
  status: 'idle',
  currentUser: null,
  permissions: [],
  tenant: null,
  setStatus: (status) => {
    set({ status })
  },
  setTokens: (accessToken, refreshToken) => {
    set((state) => {
      const nextRefresh = refreshToken === undefined ? state.refreshToken : refreshToken
      updateStoredRefreshToken(nextRefresh)
      return { accessToken, refreshToken: nextRefresh, isAuthenticated: true }
    })
  },
  setSession: ({ accessToken, refreshToken, user, remember }) => {
    set((state) => {
      const nextRemember = remember ?? state.rememberSession
      const nextRefresh = refreshToken ?? null
      persistSession(nextRefresh, nextRemember)
      return {
        accessToken,
        refreshToken: nextRefresh,
        rememberSession: nextRemember,
        isAuthenticated: true,
        status: 'authenticated',
        currentUser: user,
        permissions: user.permissions,
        tenant: user.tenant,
      }
    })
  },
  setCurrentUser: (user) => {
    set({
      currentUser: user,
      permissions: user.permissions,
      tenant: user.tenant,
      isAuthenticated: true,
      status: 'authenticated',
    })
  },
  setPermissions: (permissions) => {
    set({ permissions })
  },
  clearSession: () => {
    clearStoredSession()
    // Prevent cross-tenant/cross-identity data reuse.
    queryClient.clear()
    set({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      status: 'unauthenticated',
      currentUser: null,
      permissions: [],
      tenant: null,
    })
  },
}))
