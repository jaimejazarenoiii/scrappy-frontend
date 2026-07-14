import { apiClient } from '@/lib/axios'
import { unwrap } from '@/lib/api-envelope'
import type { ApiEnvelope, NormalizedApiError } from '@/types/api.types'
import type { ItemUnit } from '@/features/transactions/types/transaction.types'

import type {
  CreateTripLoadInput,
  CreateTripLoadItemInput,
  EnableTripLoadInput,
  TripLoad,
  TripLoadFlags,
  TripLoadItem,
  TripLoadSettings,
  TripLoadSummary,
  TripLoadSummaryItem,
  UpdateTripLoadItemInput,
} from '../types/trip-load.types'

export const TRIP_LOAD_ENDPOINTS = {
  settings: '/companies/me/trip-load-settings',
  load: (tripId: string) => `/trips/${tripId}/load`,
  enable: (tripId: string) => `/trips/${tripId}/load/enable`,
  disable: (tripId: string) => `/trips/${tripId}/load/disable`,
  summary: (tripId: string) => `/trips/${tripId}/load/summary`,
  items: (tripId: string) => `/trips/${tripId}/load/items`,
  item: (tripId: string, itemId: string) => `/trips/${tripId}/load/items/${itemId}`,
} as const

function isNotFound(error: unknown): boolean {
  return (error as NormalizedApiError).status === 404
}

function asString(value: unknown, fallback = ''): string {
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value)
  }
  return fallback
}

function asUnit(value: unknown): ItemUnit {
  const allowed: ItemUnit[] = ['KG', 'G', 'TON', 'LB', 'PIECE', 'BUNDLE', 'SACK']
  if (typeof value === 'string' && (allowed as string[]).includes(value)) {
    return value as ItemUnit
  }
  return 'KG'
}

function toIso(value: unknown): string {
  if (typeof value === 'string') return value
  if (value instanceof Date) return value.toISOString()
  return new Date(0).toISOString()
}

function normalizeItem(raw: Record<string, unknown>): TripLoadItem {
  return {
    id: asString(raw.id),
    tripLoadId: asString(raw.tripLoadId),
    materialName: asString(raw.materialName, 'Unknown'),
    quantity: typeof raw.quantity === 'number' ? raw.quantity : 0,
    unit: asUnit(raw.unit),
    notes: typeof raw.notes === 'string' ? raw.notes : null,
    remainingQuantity: typeof raw.remainingQuantity === 'number' ? raw.remainingQuantity : null,
    createdAt: toIso(raw.createdAt),
    updatedAt: toIso(raw.updatedAt),
  }
}

function normalizeLoad(raw: Record<string, unknown>): TripLoad {
  const items = Array.isArray(raw.items)
    ? raw.items.map((item) => normalizeItem(item as Record<string, unknown>))
    : []
  return {
    id: asString(raw.id),
    tripId: asString(raw.tripId),
    notes: typeof raw.notes === 'string' ? raw.notes : null,
    items,
    createdByUserId: asString(raw.createdByUserId),
    updatedByUserId: typeof raw.updatedByUserId === 'string' ? raw.updatedByUserId : null,
    createdAt: toIso(raw.createdAt),
    updatedAt: toIso(raw.updatedAt),
  }
}

function normalizeSummaryItem(raw: Record<string, unknown>): TripLoadSummaryItem {
  return {
    materialName: asString(raw.materialName, 'Unknown'),
    unit: asUnit(raw.unit),
    loadedQuantity: typeof raw.loadedQuantity === 'number' ? raw.loadedQuantity : 0,
    outboundQuantity: typeof raw.outboundQuantity === 'number' ? raw.outboundQuantity : 0,
    remainingQuantity: typeof raw.remainingQuantity === 'number' ? raw.remainingQuantity : 0,
  }
}

function normalizeSummary(raw: Record<string, unknown>): TripLoadSummary {
  const items = Array.isArray(raw.items)
    ? raw.items.map((item) => normalizeSummaryItem(item as Record<string, unknown>))
    : []
  return {
    tripId: asString(raw.tripId),
    tripStatus: asString(raw.tripStatus),
    loadEnabled: raw.loadEnabled === true,
    strictLoadValidation: raw.strictLoadValidation === true,
    notes: typeof raw.notes === 'string' ? raw.notes : null,
    items,
  }
}

function normalizeFlags(raw: Record<string, unknown>): TripLoadFlags {
  return {
    tripId: asString(raw.tripId),
    loadEnabled: raw.loadEnabled !== false,
    strictLoadValidation: raw.strictLoadValidation === true,
  }
}

export const TripLoadService = {
  async getSettings(): Promise<TripLoadSettings> {
    const response = await apiClient.get<ApiEnvelope<TripLoadSettings>>(
      TRIP_LOAD_ENDPOINTS.settings,
    )
    return unwrap(response)
  },

  async updateSettings(input: Partial<TripLoadSettings>): Promise<TripLoadSettings> {
    const response = await apiClient.patch<ApiEnvelope<TripLoadSettings>>(
      TRIP_LOAD_ENDPOINTS.settings,
      input,
    )
    return unwrap(response)
  },

  /** Returns `null` when no load row exists (404). */
  async getLoad(tripId: string): Promise<TripLoad | null> {
    try {
      const response = await apiClient.get<ApiEnvelope<Record<string, unknown>>>(
        TRIP_LOAD_ENDPOINTS.load(tripId),
      )
      return normalizeLoad(unwrap(response))
    } catch (error) {
      if (isNotFound(error)) return null
      throw error
    }
  },

  async createLoad(tripId: string, input: CreateTripLoadInput): Promise<TripLoad> {
    const response = await apiClient.post<ApiEnvelope<Record<string, unknown>>>(
      TRIP_LOAD_ENDPOINTS.load(tripId),
      input,
    )
    return normalizeLoad(unwrap(response))
  },

  async updateLoadNotes(tripId: string, notes: string | null): Promise<TripLoad> {
    const response = await apiClient.patch<ApiEnvelope<Record<string, unknown>>>(
      TRIP_LOAD_ENDPOINTS.load(tripId),
      { notes },
    )
    return normalizeLoad(unwrap(response))
  },

  async deleteLoad(tripId: string): Promise<TripLoadFlags> {
    const response = await apiClient.delete<ApiEnvelope<Record<string, unknown>>>(
      TRIP_LOAD_ENDPOINTS.load(tripId),
    )
    return normalizeFlags(unwrap(response))
  },

  async enable(tripId: string, input: EnableTripLoadInput = {}): Promise<TripLoadFlags> {
    const response = await apiClient.post<ApiEnvelope<Record<string, unknown>>>(
      TRIP_LOAD_ENDPOINTS.enable(tripId),
      input,
    )
    return normalizeFlags(unwrap(response))
  },

  async disable(tripId: string): Promise<TripLoadFlags> {
    const response = await apiClient.post<ApiEnvelope<Record<string, unknown>>>(
      TRIP_LOAD_ENDPOINTS.disable(tripId),
    )
    return normalizeFlags(unwrap(response))
  },

  /** Returns `null` when no load exists (404). */
  async getSummary(tripId: string): Promise<TripLoadSummary | null> {
    try {
      const response = await apiClient.get<ApiEnvelope<Record<string, unknown>>>(
        TRIP_LOAD_ENDPOINTS.summary(tripId),
      )
      return normalizeSummary(unwrap(response))
    } catch (error) {
      if (isNotFound(error)) return null
      throw error
    }
  },

  async addItem(tripId: string, input: CreateTripLoadItemInput): Promise<TripLoadItem> {
    const response = await apiClient.post<ApiEnvelope<Record<string, unknown>>>(
      TRIP_LOAD_ENDPOINTS.items(tripId),
      input,
    )
    return normalizeItem(unwrap(response))
  },

  async updateItem(
    tripId: string,
    itemId: string,
    input: UpdateTripLoadItemInput,
  ): Promise<TripLoadItem> {
    const response = await apiClient.patch<ApiEnvelope<Record<string, unknown>>>(
      TRIP_LOAD_ENDPOINTS.item(tripId, itemId),
      input,
    )
    return normalizeItem(unwrap(response))
  },

  async deleteItem(tripId: string, itemId: string): Promise<void> {
    await apiClient.delete(TRIP_LOAD_ENDPOINTS.item(tripId, itemId))
  },
}
