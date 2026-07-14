import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'

import { TripLoadService } from '@/features/trips/services/trip-load.service'
import { useTrip } from '@/features/trips/hooks/useTrip'
import { tripLoadKeys } from '@/features/trips/hooks/trip-keys'
import { debounce } from '@/utils/debounce'

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
}

function hasValidatableItems(items: TripLoadValidationLineItem[]): boolean {
  return items.some(
    (item) => item.materialName.trim().length > 0 && item.weight > 0 && Boolean(item.unit),
  )
}

export function useTripLoadTransactionWarnings({
  tripId,
  locationType,
  items,
}: UseTripLoadTransactionWarningsOptions) {
  const tripQuery = useTrip(tripId ?? undefined)
  const [debouncedItems, setDebouncedItems] = useState(items)

  const debouncedSetItems = useMemo(
    () =>
      debounce((next: TripLoadValidationLineItem[]) => {
        setDebouncedItems(next)
      }, 400),
    [],
  )

  useEffect(() => {
    debouncedSetItems(items)
    return () => {
      debouncedSetItems.cancel()
    }
  }, [items, debouncedSetItems])

  const enabled =
    locationType === 'TRIP' &&
    Boolean(tripId) &&
    tripQuery.data?.tripLoadEnabled === true &&
    hasValidatableItems(debouncedItems)

  const itemsKey = debouncedItems
    .map((item) => `${item.materialName}:${String(item.weight)}:${item.unit}`)
    .join('|')

  return useQuery({
    queryKey: tripLoadKeys.validate(tripId ?? '', itemsKey),
    queryFn: () =>
      TripLoadService.validateTransaction(
        tripId ?? '',
        debouncedItems
          .filter(
            (item) => item.materialName.trim().length > 0 && item.weight > 0 && Boolean(item.unit),
          )
          .map((item) => ({
            materialName: item.materialName.trim(),
            weight: item.weight,
            unit: item.unit,
          })),
      ),
    enabled,
    staleTime: 30_000,
    retry: false,
  })
}
