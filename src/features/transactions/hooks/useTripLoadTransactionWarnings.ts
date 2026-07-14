import { useMemo } from 'react'

import { useTrip } from '@/features/trips/hooks/useTrip'
import { useTripLoadSummary } from '@/features/trips/hooks/useTripLoad'
import {
  indicatorForSummaryItem,
  type TripLoadOutboundWarning,
} from '@/features/trips/types/trip-load.types'

import type { ItemUnit, LocationType } from '../types/transaction.types'

export interface TripLoadValidationLineItem {
  materialName: string
  weight: number
  unit: ItemUnit
}

interface UseTripLoadTransactionWarningsOptions {
  tripId: string | null | undefined
  locationType: LocationType
  items: TripLoadValidationLineItem[]
  /** Warnings returned from create transaction `meta.warnings`. */
  serverWarnings?: TripLoadOutboundWarning[]
}

function normalizeName(value: string): string {
  return value.trim().toLowerCase()
}

/**
 * Advisory remaining/exceeded warnings for TRIP transactions.
 * Uses load summary remaining quantities (API has no separate validate endpoint).
 */
export function useTripLoadTransactionWarnings({
  tripId,
  locationType,
  items,
  serverWarnings = [],
}: UseTripLoadTransactionWarningsOptions) {
  const tripQuery = useTrip(tripId ?? undefined)
  const summaryQuery = useTripLoadSummary(tripId ?? '', locationType === 'TRIP' && Boolean(tripId))

  const clientWarnings = useMemo((): TripLoadOutboundWarning[] => {
    if (locationType !== 'TRIP' || !tripId || !summaryQuery.data) return []

    const byKey = new Map(
      summaryQuery.data.items.map((item) => [
        `${normalizeName(item.materialName)}:${item.unit}`,
        item,
      ]),
    )

    const attempted = new Map<string, { weight: number; materialName: string; unit: ItemUnit }>()
    for (const item of items) {
      if (!item.materialName.trim() || item.weight <= 0) continue
      const key = `${normalizeName(item.materialName)}:${item.unit}`
      const prev = attempted.get(key)
      attempted.set(key, {
        materialName: item.materialName.trim(),
        unit: item.unit,
        weight: (prev?.weight ?? 0) + item.weight,
      })
    }

    const warnings: TripLoadOutboundWarning[] = []
    for (const [key, attemptedItem] of attempted) {
      const loadItem = byKey.get(key)
      if (!loadItem) continue
      if (attemptedItem.weight > loadItem.remainingQuantity) {
        const exceededBy = attemptedItem.weight - loadItem.remainingQuantity
        warnings.push({
          materialName: loadItem.materialName,
          unit: loadItem.unit,
          loadedQuantity: loadItem.loadedQuantity,
          outboundQuantity: loadItem.outboundQuantity,
          attemptedQuantity: attemptedItem.weight,
          remainingQuantity: loadItem.remainingQuantity - attemptedItem.weight,
          message: `Outbound quantity for ${loadItem.materialName} exceeds remaining load by ${String(exceededBy)} ${loadItem.unit}.`,
        })
      } else if (indicatorForSummaryItem(loadItem) === 'WARNING') {
        warnings.push({
          materialName: loadItem.materialName,
          unit: loadItem.unit,
          loadedQuantity: loadItem.loadedQuantity,
          outboundQuantity: loadItem.outboundQuantity,
          attemptedQuantity: attemptedItem.weight,
          remainingQuantity: loadItem.remainingQuantity - attemptedItem.weight,
          message: `Remaining quantity for ${loadItem.materialName} is low (${String(loadItem.remainingQuantity)} ${loadItem.unit} left).`,
        })
      }
    }
    return warnings
  }, [items, locationType, summaryQuery.data, tripId])

  const warnings = serverWarnings.length > 0 ? serverWarnings : clientWarnings

  return {
    warnings,
    isLoading: summaryQuery.isLoading || tripQuery.isLoading,
    strictLoadValidation: tripQuery.data?.strictLoadValidation === true,
  }
}
