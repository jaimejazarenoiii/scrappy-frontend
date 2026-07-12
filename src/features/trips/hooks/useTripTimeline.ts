import { useQuery } from '@tanstack/react-query'

import { TripService } from '../services/trip.service'
import { mergeTripTimeline } from '../lib/trip-timeline'
import type { TripDetail } from '../types/trip.types'
import { tripKeys } from './trip-keys'

export function useTripTimeline(tripId: string | undefined, trip?: TripDetail) {
  const historyQuery = useQuery({
    queryKey: tripKeys.timeline(tripId ?? ''),
    queryFn: () => TripService.getHistory(tripId ?? ''),
    enabled: Boolean(tripId),
    retry: false,
  })

  const events = trip ? mergeTripTimeline(historyQuery.data, trip) : []

  return {
    ...historyQuery,
    events,
  }
}
