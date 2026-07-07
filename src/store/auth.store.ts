import { create } from 'zustand'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  setTokens: (access: string, refresh: string) => void
  clearTokens: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  setTokens: (accessToken, refreshToken) => {
    set({ accessToken, refreshToken, isAuthenticated: true })
  },
  clearTokens: () => {
    set({ accessToken: null, refreshToken: null, isAuthenticated: false })
  },
}))
