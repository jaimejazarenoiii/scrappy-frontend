import { useQuery } from '@tanstack/react-query'

import { TripLoadService } from '../services/trip-load.service'
import { tripLoadKeys } from './trip-keys'

export function useTripLoad(tripId: string, enabled = true) {
  return useQuery({
    queryKey: tripLoadKeys.detail(tripId),
    queryFn: () => TripLoadService.getLoad(tripId),
    enabled: Boolean(tripId) && enabled,
  })
}

export function useTripLoadSummary(tripId: string, enabled = true) {
  return useQuery({
    queryKey: tripLoadKeys.progress(tripId),
    queryFn: () => TripLoadService.getSummary(tripId),
    enabled: Boolean(tripId) && enabled,
  })
}

/** @deprecated Use `useTripLoadSummary`. */
export const useTripLoadProgress = useTripLoadSummary
