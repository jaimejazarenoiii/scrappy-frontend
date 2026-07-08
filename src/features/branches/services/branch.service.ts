import { apiClient } from '@/lib/axios'
import { unwrap, unwrapList } from '@/lib/api-envelope'
import { toQueryParams } from '@/lib/list-params'
import type { ApiEnvelope } from '@/types/api.types'
import type { ListQueryParams, PaginatedResponse } from '@/types/pagination.types'

import type { Branch, CreateBranchInput, UpdateBranchInput } from '../types/branch.types'

export const BRANCH_ENDPOINTS = {
  base: '/branches',
  detail: (branchId: string) => `/branches/${branchId}`,
  archive: (branchId: string) => `/branches/${branchId}/archive`,
} as const

export const BranchService = {
  async list(params: ListQueryParams): Promise<PaginatedResponse<Branch>> {
    const response = await apiClient.get<ApiEnvelope<Branch[]>>(BRANCH_ENDPOINTS.base, {
      params: toQueryParams(params),
    })
    return unwrapList(response)
  },

  async get(branchId: string): Promise<Branch> {
    const response = await apiClient.get<ApiEnvelope<Branch>>(BRANCH_ENDPOINTS.detail(branchId))
    return unwrap(response)
  },

  async create(input: CreateBranchInput): Promise<Branch> {
    const response = await apiClient.post<ApiEnvelope<Branch>>(BRANCH_ENDPOINTS.base, input)
    return unwrap(response)
  },

  async update(branchId: string, input: UpdateBranchInput): Promise<Branch> {
    const response = await apiClient.patch<ApiEnvelope<Branch>>(
      BRANCH_ENDPOINTS.detail(branchId),
      input,
    )
    return unwrap(response)
  },

  async archive(branchId: string): Promise<Branch> {
    const response = await apiClient.post<ApiEnvelope<Branch>>(BRANCH_ENDPOINTS.archive(branchId))
    return unwrap(response)
  },
}
