import { apiClient } from '@/lib/axios'
import { unwrap, unwrapList } from '@/lib/api-envelope'
import { toQueryParams } from '@/lib/list-params'
import type { ApiEnvelope } from '@/types/api.types'
import type { ListQueryParams, PaginatedResponse } from '@/types/pagination.types'

import type {
  CreateWarehouseInput,
  UpdateWarehouseInput,
  Warehouse,
} from '../types/warehouse.types'

export const WAREHOUSE_ENDPOINTS = {
  base: '/warehouses',
  detail: (warehouseId: string) => `/warehouses/${warehouseId}`,
  archive: (warehouseId: string) => `/warehouses/${warehouseId}/archive`,
} as const

export const WarehouseService = {
  async list(params: ListQueryParams): Promise<PaginatedResponse<Warehouse>> {
    const response = await apiClient.get<ApiEnvelope<Warehouse[]>>(WAREHOUSE_ENDPOINTS.base, {
      params: toQueryParams(params),
    })
    return unwrapList(response)
  },

  async get(warehouseId: string): Promise<Warehouse> {
    const response = await apiClient.get<ApiEnvelope<Warehouse>>(
      WAREHOUSE_ENDPOINTS.detail(warehouseId),
    )
    return unwrap(response)
  },

  async create(input: CreateWarehouseInput): Promise<Warehouse> {
    const response = await apiClient.post<ApiEnvelope<Warehouse>>(WAREHOUSE_ENDPOINTS.base, input)
    return unwrap(response)
  },

  async update(warehouseId: string, input: UpdateWarehouseInput): Promise<Warehouse> {
    const response = await apiClient.patch<ApiEnvelope<Warehouse>>(
      WAREHOUSE_ENDPOINTS.detail(warehouseId),
      input,
    )
    return unwrap(response)
  },

  async archive(warehouseId: string): Promise<Warehouse> {
    const response = await apiClient.post<ApiEnvelope<Warehouse>>(
      WAREHOUSE_ENDPOINTS.archive(warehouseId),
    )
    return unwrap(response)
  },
}
