import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { toast } from 'sonner'

import { AUTH_ENDPOINTS } from '@/features/auth/services/auth.service'
import type { LoginResponse } from '@/features/auth/types/auth.types'
import { getStoredRefreshToken } from '@/lib/token-storage'
import { useAuthStore } from '@/store/auth.store'
import type { ApiEnvelope, ApiError, NormalizedApiError } from '@/types/api.types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

export type { NormalizedApiError }

function normalizeError(error: AxiosError<ApiEnvelope<unknown>>): NormalizedApiError {
  const envelopeError: ApiError | null | undefined = error.response?.data.error
  const normalized = new Error(envelopeError?.message ?? error.message) as NormalizedApiError
  normalized.status = error.response?.status ?? 500
  normalized.code = envelopeError?.code
  normalized.details = envelopeError?.details
  return normalized
}

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const { accessToken, tenant } = useAuthStore.getState()
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  // Tenant scoping: harmless if the backend derives tenant from the JWT instead.
  if (tenant?.companyId) {
    config.headers['X-Company-Id'] = tenant.companyId
  }
  return config
})

// Single-flight refresh: concurrent 401s await one refresh call.
let refreshPromise: Promise<string | null> | null = null

async function runRefresh(): Promise<string | null> {
  const { refreshToken, setTokens } = useAuthStore.getState()
  const token = refreshToken ?? getStoredRefreshToken()
  try {
    const { data } = await axios.post<ApiEnvelope<LoginResponse>>(
      `${BASE_URL}${AUTH_ENDPOINTS.refresh}`,
      token ? { refreshToken: token } : {},
      { headers: { 'Content-Type': 'application/json' } },
    )
    const tokens = data.data
    setTokens(tokens.accessToken, tokens.refreshToken ?? undefined)
    return tokens.accessToken
  } catch {
    return null
  }
}

function isAuthRoute(url: string | undefined): boolean {
  if (!url) return false
  return url.includes(AUTH_ENDPOINTS.login) || url.includes(AUTH_ENDPOINTS.refresh)
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiEnvelope<unknown>>) => {
    const normalized = normalizeError(error)

    if (import.meta.env.DEV) {
      console.error('[API Error]', normalized)
    }

    const original = error.config as RetryableRequestConfig | undefined
    const status = error.response?.status

    if (status === 401 && original && !original._retry && !isAuthRoute(original.url)) {
      original._retry = true

      refreshPromise = refreshPromise ?? runRefresh()
      const newAccessToken = await refreshPromise
      refreshPromise = null

      if (newAccessToken) {
        original.headers.Authorization = `Bearer ${newAccessToken}`
        return apiClient(original)
      }

      // Refresh failed → end the session and notify the user.
      useAuthStore.getState().clearSession()
      toast.error('Your session has expired. Please sign in again.')
    }

    return Promise.reject(normalized)
  },
)
