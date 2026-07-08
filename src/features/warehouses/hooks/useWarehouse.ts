import { useQuery } from '@tanstack/react-query'

import { WarehouseService } from '../services/warehouse.service'
import { warehouseKeys } from './useWarehouses'

export function useWarehouse(id: string | undefined) {
  return useQuery({
    queryKey: warehouseKeys.detail(id ?? ''),
    queryFn: () => WarehouseService.get(id ?? ''),
    enabled: Boolean(id),
  })
}
