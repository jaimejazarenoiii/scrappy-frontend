import { keepPreviousData, useQuery } from '@tanstack/react-query'

import type { ListQueryParams } from '@/types/pagination.types'

import { fetchTripLinkedTransactions } from '../lib/trip-linked-transactions'
import { TripService } from '../services/trip.service'
import type { TripDetail } from '../types/trip.types'
import { tripKeys } from './trip-keys'

export function useTripTransactions(tripId: string | undefined, trip?: TripDetail) {
  const embeddedTransactions =
    trip?.linkedTransactions && trip.linkedTransactions.length > 0
      ? trip.linkedTransactions
      : undefined

  return useQuery({
    queryKey: tripKeys.transactions(tripId ?? ''),
    queryFn: () => fetchTripLinkedTransactions(tripId ?? ''),
    enabled: Boolean(tripId),
    initialData: embeddedTransactions,
    retry: false,
  })
}

export function useSearchLinkableTransactions(
  tripId: string,
  params: ListQueryParams,
  enabled: boolean,
) {
  return useQuery({
    queryKey: tripKeys.linkableTransactions(tripId, params),
    queryFn: () => TripService.searchLinkableTransactions(tripId, params),
    enabled: enabled && Boolean(tripId),
    placeholderData: keepPreviousData,
  })
}
