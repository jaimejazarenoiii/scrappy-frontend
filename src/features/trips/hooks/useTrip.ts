import { useQuery } from '@tanstack/react-query'

import { TripService } from '../services/trip.service'
import { tripKeys } from './trip-keys'

export function useTrip(id: string | undefined) {
  return useQuery({
    queryKey: tripKeys.detail(id ?? ''),
    queryFn: () => TripService.get(id ?? ''),
    enabled: Boolean(id),
  })
}
