import { useQuery } from '@tanstack/react-query'

import { TripService } from '../services/trip.service'
import type { TripDetail } from '../types/trip.types'
import { tripKeys } from './trip-keys'

export function useTripMembers(tripId: string | undefined, trip?: TripDetail) {
  return useQuery({
    queryKey: tripKeys.members(tripId ?? ''),
    queryFn: () => TripService.listMembers(tripId ?? ''),
    enabled: Boolean(tripId) && !trip?.members,
    initialData: trip?.members,
  })
}
