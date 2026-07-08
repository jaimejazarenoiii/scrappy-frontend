import { apiClient } from '@/lib/axios'
import { unwrap, unwrapList } from '@/lib/api-envelope'
import { toQueryParams } from '@/lib/list-params'
import type { ApiEnvelope } from '@/types/api.types'
import type { ListQueryParams, PaginatedResponse } from '@/types/pagination.types'

import type { CreateVehicleInput, UpdateVehicleInput, Vehicle } from '../types/vehicle.types'

export const VEHICLE_ENDPOINTS = {
  base: '/vehicles',
  detail: (vehicleId: string) => `/vehicles/${vehicleId}`,
  archive: (vehicleId: string) => `/vehicles/${vehicleId}/archive`,
} as const

export const VehicleService = {
  async list(params: ListQueryParams): Promise<PaginatedResponse<Vehicle>> {
    const response = await apiClient.get<ApiEnvelope<Vehicle[]>>(VEHICLE_ENDPOINTS.base, {
      params: toQueryParams(params),
    })
    return unwrapList(response)
  },

  async get(vehicleId: string): Promise<Vehicle> {
    const response = await apiClient.get<ApiEnvelope<Vehicle>>(VEHICLE_ENDPOINTS.detail(vehicleId))
    return unwrap(response)
  },

  async create(input: CreateVehicleInput): Promise<Vehicle> {
    const response = await apiClient.post<ApiEnvelope<Vehicle>>(VEHICLE_ENDPOINTS.base, input)
    return unwrap(response)
  },

  async update(vehicleId: string, input: UpdateVehicleInput): Promise<Vehicle> {
    const response = await apiClient.patch<ApiEnvelope<Vehicle>>(
      VEHICLE_ENDPOINTS.detail(vehicleId),
      input,
    )
    return unwrap(response)
  },

  async archive(vehicleId: string): Promise<Vehicle> {
    const response = await apiClient.post<ApiEnvelope<Vehicle>>(
      VEHICLE_ENDPOINTS.archive(vehicleId),
    )
    return unwrap(response)
  },
}
