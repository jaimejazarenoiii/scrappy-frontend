import { useQuery } from '@tanstack/react-query'

import { TripService } from '../services/trip.service'
import type { TripMember } from '../types/trip.types'
import { tripKeys } from './trip-keys'

/**
 * Members are nested on trip detail (`GET /trips/{id}`). There is no live
 * `GET /trips/{id}/members` endpoint — load via detail and keep a members key
 * for mutation cache updates.
 */
export function useTripMembers(tripId: string | undefined) {
  return useQuery({
    queryKey: tripKeys.members(tripId ?? ''),
    queryFn: async (): Promise<TripMember[]> => {
      const detail = await TripService.get(tripId ?? '')
      return detail.members
    },
    enabled: Boolean(tripId),
  })
}
