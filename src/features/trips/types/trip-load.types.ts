import type { ItemUnit } from '@/features/transactions/types/transaction.types'

export interface TripLoadItem {
  id: string
  tripLoadId: string
  materialName: string
  quantity: number
  unit: ItemUnit
  notes: string | null
  /** Present on Started/Completed when remaining is computed. */
  remainingQuantity: number | null
  createdAt: string
  updatedAt: string
}

export interface TripLoad {
  id: string
  tripId: string
  notes: string | null
  items: TripLoadItem[]
  createdByUserId: string
  updatedByUserId: string | null
  createdAt: string
  updatedAt: string
}

export interface TripLoadFlags {
  tripId: string
  loadEnabled: boolean
  strictLoadValidation: boolean
}

export interface TripLoadSummaryItem {
  materialName: string
  unit: ItemUnit
  loadedQuantity: number
  outboundQuantity: number
  remainingQuantity: number
}

export interface TripLoadSummary {
  tripId: string
  tripStatus: string
  loadEnabled: boolean
  strictLoadValidation: boolean
  notes: string | null
  items: TripLoadSummaryItem[]
}

export interface TripLoadSettings {
  defaultStrictLoadValidation: boolean
}

export interface CreateTripLoadItemInput {
  materialName: string
  quantity: number
  unit: ItemUnit
  notes?: string | null
}

export type UpdateTripLoadItemInput = Partial<CreateTripLoadItemInput>

export interface CreateTripLoadInput {
  notes?: string | null
  items: CreateTripLoadItemInput[]
}

export interface EnableTripLoadInput {
  strictLoadValidation?: boolean
}

/** Warning returned in `meta.warnings` on outbound TRIP transaction create (non-strict). */
export interface TripLoadOutboundWarning {
  materialName: string
  unit: string
  loadedQuantity: number
  outboundQuantity: number
  /** Server field when present on create response. */
  exceededBy?: number
  /** Client advisory: quantity being entered on the form. */
  attemptedQuantity?: number
  remainingQuantity?: number
  message: string
}

export function normalizeTripLoadOutboundWarnings(raw: unknown): TripLoadOutboundWarning[] {
  if (!Array.isArray(raw)) return []
  return raw.map((entry) => {
    const row = (entry ?? {}) as Record<string, unknown>
    const materialName = typeof row.materialName === 'string' ? row.materialName : 'Unknown'
    const unit = typeof row.unit === 'string' ? row.unit : ''
    const loadedQuantity = typeof row.loadedQuantity === 'number' ? row.loadedQuantity : 0
    const outboundQuantity = typeof row.outboundQuantity === 'number' ? row.outboundQuantity : 0
    const exceededBy =
      typeof row.exceededBy === 'number'
        ? row.exceededBy
        : Math.max(0, outboundQuantity - loadedQuantity)
    const message =
      typeof row.message === 'string' && row.message.trim()
        ? row.message
        : `Outbound quantity for ${materialName} exceeds load by ${String(exceededBy)} ${unit}.`.trim()
    return {
      materialName,
      unit,
      loadedQuantity,
      outboundQuantity,
      exceededBy,
      message,
    }
  })
}

/** UI indicator derived from remaining vs loaded (client display only). */
export type TripLoadIndicatorStatus = 'NORMAL' | 'WARNING' | 'EXCEEDED'

export function indicatorForSummaryItem(item: TripLoadSummaryItem): TripLoadIndicatorStatus {
  if (item.remainingQuantity < 0) return 'EXCEEDED'
  if (item.loadedQuantity > 0 && item.remainingQuantity / item.loadedQuantity <= 0.15) {
    return 'WARNING'
  }
  return 'NORMAL'
}
