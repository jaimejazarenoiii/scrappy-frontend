import { apiClient } from '@/lib/axios'
import { unwrap } from '@/lib/api-envelope'
import type { ApiEnvelope } from '@/types/api.types'

import type { ChangePasswordInput, PasswordStatus, UserMe } from '../types/user.types'

export const USER_ENDPOINTS = {
  me: '/users/me',
  passwordStatus: '/users/me/password-status',
  password: '/users/me/password',
} as const

export const UserService = {
  async me(): Promise<UserMe> {
    const response = await apiClient.get<ApiEnvelope<UserMe>>(USER_ENDPOINTS.me)
    return unwrap(response)
  },

  async passwordStatus(): Promise<PasswordStatus> {
    const response = await apiClient.get<ApiEnvelope<PasswordStatus>>(USER_ENDPOINTS.passwordStatus)
    return unwrap(response)
  },

  async changePassword(input: ChangePasswordInput): Promise<void> {
    await apiClient.post<ApiEnvelope<unknown>>(USER_ENDPOINTS.password, input)
  },
}
