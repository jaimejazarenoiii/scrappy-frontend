import { apiClient } from '@/lib/axios'
import { unwrap, unwrapList } from '@/lib/api-envelope'
import { toQueryParams } from '@/lib/list-params'
import type { ApiEnvelope } from '@/types/api.types'
import type { ListQueryParams, PaginatedResponse } from '@/types/pagination.types'

import type {
  CreateLeaveInput,
  Leave,
  LeaveDashboard,
  ManageLeaveInput,
} from '../types/leave.types'

export const LEAVE_ENDPOINTS = {
  mine: '/workforce/leave',
  company: '/workforce/leave/company',
  dashboard: '/workforce/leave/dashboard',
  detail: (leaveId: string) => `/workforce/leave/${leaveId}`,
} as const

export const LeaveService = {
  async listMine(params: ListQueryParams): Promise<PaginatedResponse<Leave>> {
    const response = await apiClient.get<ApiEnvelope<Leave[]>>(LEAVE_ENDPOINTS.mine, {
      params: toQueryParams(params),
    })
    return unwrapList(response)
  },

  async listCompany(params: ListQueryParams): Promise<PaginatedResponse<Leave>> {
    const response = await apiClient.get<ApiEnvelope<Leave[]>>(LEAVE_ENDPOINTS.company, {
      params: toQueryParams(params),
    })
    return unwrapList(response)
  },

  async dashboard(): Promise<LeaveDashboard> {
    const response = await apiClient.get<ApiEnvelope<LeaveDashboard>>(LEAVE_ENDPOINTS.dashboard)
    return unwrap(response)
  },

  async get(leaveId: string): Promise<Leave> {
    // GET-by-id is not documented — resolve from list endpoints.
    const mine = await LeaveService.listMine({ page: 1, pageSize: 100 })
    const fromMine = mine.data.find((item) => item.id === leaveId)
    if (fromMine) return fromMine

    try {
      const company = await LeaveService.listCompany({ page: 1, pageSize: 100 })
      const fromCompany = company.data.find((item) => item.id === leaveId)
      if (fromCompany) return fromCompany
    } catch {
      // Company list is OWNER/MANAGER only; ignore for employees.
    }

    throw Object.assign(new Error('Resource not found'), {
      code: 'RESOURCE_NOT_FOUND',
      message: 'Resource not found',
      status: 404,
    })
  },

  async create(input: CreateLeaveInput): Promise<Leave> {
    const response = await apiClient.post<ApiEnvelope<Leave>>(LEAVE_ENDPOINTS.mine, input)
    return unwrap(response)
  },

  async manage(leaveId: string, input: ManageLeaveInput): Promise<Leave> {
    const response = await apiClient.patch<ApiEnvelope<Leave>>(
      LEAVE_ENDPOINTS.detail(leaveId),
      input,
    )
    return unwrap(response)
  },
}
