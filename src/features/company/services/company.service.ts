import { apiClient } from '@/lib/axios'
import { unwrap } from '@/lib/api-envelope'
import type { ApiEnvelope } from '@/types/api.types'

import type { Company, UpdateCompanyInput } from '../types/company.types'

export const COMPANY_ENDPOINTS = {
  me: '/companies/me',
  detail: (companyId: string) => `/companies/${companyId}`,
} as const

export const CompanyService = {
  async getMe(): Promise<Company> {
    const response = await apiClient.get<ApiEnvelope<Company>>(COMPANY_ENDPOINTS.me)
    return unwrap(response)
  },

  async update(companyId: string, input: UpdateCompanyInput): Promise<Company> {
    const response = await apiClient.patch<ApiEnvelope<Company>>(
      COMPANY_ENDPOINTS.detail(companyId),
      input,
    )
    return unwrap(response)
  },
}
