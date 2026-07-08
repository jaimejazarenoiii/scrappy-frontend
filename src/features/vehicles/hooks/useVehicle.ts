import { useQuery } from '@tanstack/react-query'

import { VehicleService } from '../services/vehicle.service'
import { vehicleKeys } from './useVehicles'

export function useVehicle(id: string | undefined) {
  return useQuery({
    queryKey: vehicleKeys.detail(id ?? ''),
    queryFn: () => VehicleService.get(id ?? ''),
    enabled: Boolean(id),
  })
}
