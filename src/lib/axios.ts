import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

import { useAuthStore } from '@/store/auth.store'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const { accessToken } = useAuthStore.getState()
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; code?: string }>) => {
    interface NormalizedApiError extends Error {
      status: number
      code?: string
    }

    const responseData = error.response?.data
    const normalized = new Error(
      responseData?.message ?? 'An unexpected error occurred.',
    ) as NormalizedApiError

    normalized.status = error.response?.status ?? 500
    normalized.code = responseData?.code

    if (import.meta.env.DEV) {
      console.error('[API Error]', normalized)
    }

    // TODO(Spec 002): Handle 401 refresh token flow
    if (error.response?.status === 401) {
      // Placeholder for authentication refresh logic
    }

    return Promise.reject(normalized)
  },
)
