import { keepPreviousData, useQuery } from '@tanstack/react-query'

import type { ListQueryParams } from '@/types/pagination.types'

import { TripService } from '../services/trip.service'
import { tripKeys } from './trip-keys'

export function useTrips(params: ListQueryParams) {
  return useQuery({
    queryKey: tripKeys.list(params),
    queryFn: () => TripService.list(params),
    placeholderData: keepPreviousData,
  })
}

export function useTripDashboard() {
  return useQuery({
    queryKey: tripKeys.dashboard(),
    queryFn: () => TripService.getDashboard(),
    retry: false,
  })
}
