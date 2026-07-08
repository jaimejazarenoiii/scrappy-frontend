import { keepPreviousData, useQuery } from '@tanstack/react-query'

import type { ListQueryParams } from '@/types/pagination.types'

import { VehicleService } from '../services/vehicle.service'

export const vehicleKeys = {
  all: ['vehicles'] as const,
  list: (params: ListQueryParams) => ['vehicles', 'list', params] as const,
  detail: (id: string) => ['vehicles', 'detail', id] as const,
}

export function useVehicles(params: ListQueryParams) {
  return useQuery({
    queryKey: vehicleKeys.list(params),
    queryFn: () => VehicleService.list(params),
    placeholderData: keepPreviousData,
  })
}
