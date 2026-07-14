import type { ItemUnit } from '@/features/transactions/types/transaction.types'

export type TripLoadIndicatorStatus = 'NORMAL' | 'WARNING' | 'EXCEEDED'

export interface TripLoadSummary {
  totalItems: number
  totalLoadedWeight: number | null
  remainingWeight: number | null
  weightUnit: string | null
  lastUpdatedAt: string
}

export interface TripLoadItem {
  id: string
  tripId: string
  materialName: string
  quantity: number
  unit: ItemUnit
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface TripLoadDetail {
  summary: TripLoadSummary
  items: TripLoadItem[]
}

export interface TripLoadProgressRow {
  materialName: string
  unit: ItemUnit
  loadedQuantity: number
  soldQuantity: number
  remainingQuantity: number
  indicatorStatus: TripLoadIndicatorStatus
}

export interface TripLoadProgress {
  rows: TripLoadProgressRow[]
}

export interface TripLoadValidationWarning {
  code: string
  message: string
  materialName?: string
  requestedQty?: number
  remainingQty?: number
  unit?: string
}

export interface CreateTripLoadItemInput {
  materialName: string
  quantity: number
  unit: ItemUnit
  notes?: string | null
}

export type UpdateTripLoadItemInput = Partial<CreateTripLoadItemInput>

export interface TripLoadValidationRequestItem {
  materialName: string
  weight: number
  unit: ItemUnit
}

export interface TripLoadValidationResult {
  warnings: TripLoadValidationWarning[]
}
