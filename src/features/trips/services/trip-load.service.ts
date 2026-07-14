import { apiClient } from '@/lib/axios'
import { unwrap } from '@/lib/api-envelope'
import type { ApiEnvelope } from '@/types/api.types'

import type {
  CreateTripLoadItemInput,
  TripLoadDetail,
  TripLoadItem,
  TripLoadProgress,
  TripLoadValidationRequestItem,
  TripLoadValidationResult,
  UpdateTripLoadItemInput,
} from '../types/trip-load.types'

export const TRIP_LOAD_ENDPOINTS = {
  load: (tripId: string) => `/trips/${tripId}/load`,
  progress: (tripId: string) => `/trips/${tripId}/load/progress`,
  items: (tripId: string) => `/trips/${tripId}/load/items`,
  item: (tripId: string, itemId: string) => `/trips/${tripId}/load/items/${itemId}`,
  validateTransaction: (tripId: string) => `/trips/${tripId}/load/validate-transaction`,
} as const

export const TripLoadService = {
  async getLoad(tripId: string): Promise<TripLoadDetail> {
    const response = await apiClient.get<ApiEnvelope<TripLoadDetail>>(
      TRIP_LOAD_ENDPOINTS.load(tripId),
    )
    return unwrap(response)
  },

  async getProgress(tripId: string): Promise<TripLoadProgress> {
    const response = await apiClient.get<ApiEnvelope<TripLoadProgress>>(
      TRIP_LOAD_ENDPOINTS.progress(tripId),
    )
    return unwrap(response)
  },

  async addItem(tripId: string, input: CreateTripLoadItemInput): Promise<TripLoadItem> {
    const response = await apiClient.post<ApiEnvelope<TripLoadItem>>(
      TRIP_LOAD_ENDPOINTS.items(tripId),
      input,
    )
    return unwrap(response)
  },

  async updateItem(
    tripId: string,
    itemId: string,
    input: UpdateTripLoadItemInput,
  ): Promise<TripLoadItem> {
    const response = await apiClient.patch<ApiEnvelope<TripLoadItem>>(
      TRIP_LOAD_ENDPOINTS.item(tripId, itemId),
      input,
    )
    return unwrap(response)
  },

  async deleteItem(tripId: string, itemId: string): Promise<void> {
    await apiClient.delete(TRIP_LOAD_ENDPOINTS.item(tripId, itemId))
  },

  async validateTransaction(
    tripId: string,
    items: TripLoadValidationRequestItem[],
  ): Promise<TripLoadValidationResult> {
    const response = await apiClient.post<ApiEnvelope<TripLoadValidationResult>>(
      TRIP_LOAD_ENDPOINTS.validateTransaction(tripId),
      { items },
    )
    return unwrap(response)
  },
}
