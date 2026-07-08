import { useQuery } from '@tanstack/react-query'

import { WarehouseService } from '../services/warehouse.service'
import { warehouseKeys } from './useWarehouses'

/** Active warehouses for select pickers in vehicle forms. */
export function useWarehouseOptions() {
  return useQuery({
    queryKey: warehouseKeys.picker,
    queryFn: async () => {
      const result = await WarehouseService.list({
        page: 1,
        pageSize: 100,
        filters: { status: 'ACTIVE' },
      })
      return result.data
    },
    staleTime: 60_000,
  })
}
