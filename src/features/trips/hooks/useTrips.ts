import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { useAuthStore } from '@/store/auth.store'
import type { ListQueryParams } from '@/types/pagination.types'
import { isCompanyViewer } from '@/features/workforce/lib/workforce-roles'

import { TripService } from '../services/trip.service'
import { tripKeys } from './trip-keys'

/**
 * Company trip list for Owner/Manager (`GET /trips`).
 * Assigned trips for Employee (`GET /trips/mine`).
 */
export function useTrips(params: ListQueryParams) {
  const role = useAuthStore((state) => state.currentUser?.role)
  const scope = role === 'EMPLOYEE' ? 'mine' : 'company'

  return useQuery({
    queryKey: tripKeys.list(params, scope),
    queryFn: () => (scope === 'mine' ? TripService.listMine(params) : TripService.list(params)),
    placeholderData: keepPreviousData,
    enabled: Boolean(role),
  })
}

/** Company status counts — Owner/Manager only (`GET /trips/dashboard`). */
export function useTripDashboard() {
  const role = useAuthStore((state) => state.currentUser?.role)
  const enabled = isCompanyViewer(role)

  return useQuery({
    queryKey: tripKeys.dashboard(),
    queryFn: () => TripService.getDashboard(),
    enabled,
    retry: false,
  })
}
