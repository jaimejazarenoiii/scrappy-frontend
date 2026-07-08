import { apiClient } from '@/lib/axios'
import { unwrap, unwrapList } from '@/lib/api-envelope'
import { toQueryParams } from '@/lib/list-params'
import type { ApiEnvelope } from '@/types/api.types'
import type { ListQueryParams, PaginatedResponse } from '@/types/pagination.types'

import type { GeneratePayrollInput, MarkPayrollPaidInput, Payroll } from '../types/payroll.types'

export const PAYROLL_ENDPOINTS = {
  base: '/workforce/payroll',
  detail: (payrollId: string) => `/workforce/payroll/${payrollId}`,
  markPaid: (payrollId: string) => `/workforce/payroll/${payrollId}/mark-paid`,
} as const

export const PayrollService = {
  async list(params: ListQueryParams): Promise<PaginatedResponse<Payroll>> {
    const response = await apiClient.get<ApiEnvelope<Payroll[]>>(PAYROLL_ENDPOINTS.base, {
      params: toQueryParams(params),
    })
    return unwrapList(response)
  },

  async get(payrollId: string): Promise<Payroll> {
    const response = await apiClient.get<ApiEnvelope<Payroll>>(PAYROLL_ENDPOINTS.detail(payrollId))
    return unwrap(response)
  },

  async generate(input: GeneratePayrollInput): Promise<Payroll | Payroll[]> {
    const response = await apiClient.post<ApiEnvelope<Payroll | Payroll[]>>(
      PAYROLL_ENDPOINTS.base,
      input,
    )
    return unwrap(response)
  },

  async markPaid(payrollId: string, input?: MarkPayrollPaidInput): Promise<Payroll> {
    const response = await apiClient.post<ApiEnvelope<Payroll>>(
      PAYROLL_ENDPOINTS.markPaid(payrollId),
      input ?? {},
    )
    return unwrap(response)
  },
}
