import { apiClient } from '@/lib/axios'
import { unwrap, unwrapList } from '@/lib/api-envelope'
import { toQueryParams } from '@/lib/list-params'
import type { ApiEnvelope } from '@/types/api.types'
import type { ListQueryParams, PaginatedResponse } from '@/types/pagination.types'

import type { CashAdvance, CreateCashAdvanceInput } from '../types/cash-advance.types'

export const CASH_ADVANCE_ENDPOINTS = {
  mine: '/workforce/cash-advances',
  company: '/workforce/cash-advances/company',
  detail: (cashAdvanceId: string) => `/workforce/cash-advances/${cashAdvanceId}`,
} as const

export const CashAdvanceService = {
  async listMine(params: ListQueryParams): Promise<PaginatedResponse<CashAdvance>> {
    const response = await apiClient.get<ApiEnvelope<CashAdvance[]>>(CASH_ADVANCE_ENDPOINTS.mine, {
      params: toQueryParams(params),
    })
    return unwrapList(response)
  },

  async listCompany(params: ListQueryParams): Promise<PaginatedResponse<CashAdvance>> {
    const response = await apiClient.get<ApiEnvelope<CashAdvance[]>>(
      CASH_ADVANCE_ENDPOINTS.company,
      { params: toQueryParams(params) },
    )
    return unwrapList(response)
  },

  async get(cashAdvanceId: string): Promise<CashAdvance> {
    // GET-by-id is not documented — resolve from list endpoints.
    try {
      const company = await CashAdvanceService.listCompany({ page: 1, pageSize: 100 })
      const fromCompany = company.data.find((item) => item.id === cashAdvanceId)
      if (fromCompany) return fromCompany
    } catch {
      // Company list is OWNER/MANAGER only.
    }

    try {
      const mine = await CashAdvanceService.listMine({ page: 1, pageSize: 100 })
      const fromMine = mine.data.find((item) => item.id === cashAdvanceId)
      if (fromMine) return fromMine
    } catch {
      // Mine list is EMPLOYEE only.
    }

    throw Object.assign(new Error('Resource not found'), {
      code: 'RESOURCE_NOT_FOUND',
      message: 'Resource not found',
      status: 404,
    })
  },

  async create(input: CreateCashAdvanceInput): Promise<CashAdvance> {
    const response = await apiClient.post<ApiEnvelope<CashAdvance>>(
      CASH_ADVANCE_ENDPOINTS.mine,
      input,
    )
    return unwrap(response)
  },
}
