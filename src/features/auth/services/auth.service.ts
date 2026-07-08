import { apiClient } from '@/lib/axios'
import { unwrap } from '@/lib/api-envelope'
import type { ApiEnvelope } from '@/types/api.types'

import type { Credentials, LoginResponse } from '../types/auth.types'

export const AUTH_ENDPOINTS = {
  login: '/auth/login',
  logout: '/auth/logout',
  refresh: '/auth/refresh',
  forgotPassword: '/auth/forgot-password',
} as const

export const AuthService = {
  async login(credentials: Credentials): Promise<LoginResponse> {
    const response = await apiClient.post<ApiEnvelope<LoginResponse>>(AUTH_ENDPOINTS.login, {
      identifier: credentials.identifier,
      password: credentials.password,
    })
    return unwrap(response)
  },

  async logout(): Promise<void> {
    await apiClient.post(AUTH_ENDPOINTS.logout)
  },

  async refresh(refreshToken: string | null): Promise<LoginResponse> {
    const response = await apiClient.post<ApiEnvelope<LoginResponse>>(
      AUTH_ENDPOINTS.refresh,
      refreshToken ? { refreshToken } : {},
    )
    return unwrap(response)
  },
}
