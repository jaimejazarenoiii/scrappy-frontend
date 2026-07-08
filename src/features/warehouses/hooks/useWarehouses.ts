import { keepPreviousData, useQuery } from '@tanstack/react-query'

import type { ListQueryParams } from '@/types/pagination.types'

import { WarehouseService } from '../services/warehouse.service'

export const warehouseKeys = {
  all: ['warehouses'] as const,
  list: (params: ListQueryParams) => ['warehouses', 'list', params] as const,
  detail: (id: string) => ['warehouses', 'detail', id] as const,
  picker: ['warehouses', 'picker'] as const,
}

export function useWarehouses(params: ListQueryParams) {
  return useQuery({
    queryKey: warehouseKeys.list(params),
    queryFn: () => WarehouseService.list(params),
    placeholderData: keepPreviousData,
  })
}
