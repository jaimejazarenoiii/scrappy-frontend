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

export function useTripLoadProgress(tripId: string, enabled = true) {
  return useQuery({
    queryKey: tripLoadKeys.progress(tripId),
    queryFn: () => TripLoadService.getProgress(tripId),
    enabled: Boolean(tripId) && enabled,
  })
}
