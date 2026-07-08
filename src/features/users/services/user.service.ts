import { apiClient } from '@/lib/axios'
import { unwrap } from '@/lib/api-envelope'
import type { ApiEnvelope } from '@/types/api.types'

import type { UserMe } from '../types/user.types'

export const USER_ENDPOINTS = {
  me: '/users/me',
} as const

export const UserService = {
  async me(): Promise<UserMe> {
    const response = await apiClient.get<ApiEnvelope<UserMe>>(USER_ENDPOINTS.me)
    return unwrap(response)
  },
}
