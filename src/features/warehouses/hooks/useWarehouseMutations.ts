import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { NormalizedApiError } from '@/lib/axios'

import { WarehouseService } from '../services/warehouse.service'
import type {
  CreateWarehouseInput,
  UpdateWarehouseInput,
  Warehouse,
} from '../types/warehouse.types'
import { warehouseKeys } from './useWarehouses'

export function useCreateWarehouse() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateWarehouseInput) => WarehouseService.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: warehouseKeys.all })
      toast.success('Warehouse created')
    },
    onError: (error: NormalizedApiError) => {
      toast.error(error.message || 'Could not create warehouse')
    },
  })
}

export function useUpdateWarehouse(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateWarehouseInput) => WarehouseService.update(id, input),
    onSuccess: (warehouse) => {
      queryClient.setQueryData(warehouseKeys.detail(id), warehouse)
      void queryClient.invalidateQueries({ queryKey: warehouseKeys.all })
      toast.success('Warehouse updated')
    },
    onError: (error: NormalizedApiError) => {
      toast.error(error.message || 'Could not update warehouse')
    },
  })
}

export function useArchiveWarehouse(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => WarehouseService.archive(id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: warehouseKeys.detail(id) })
      const previous = queryClient.getQueryData<Warehouse>(warehouseKeys.detail(id))
      if (previous) {
        queryClient.setQueryData<Warehouse>(warehouseKeys.detail(id), {
          ...previous,
          deletedAt: new Date().toISOString(),
        })
      }
      return { previous }
    },
    onError: (error: NormalizedApiError, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(warehouseKeys.detail(id), context.previous)
      }
      toast.error(error.message || 'Could not archive warehouse')
    },
    onSuccess: (warehouse) => {
      queryClient.setQueryData(warehouseKeys.detail(id), warehouse)
      toast.success('Warehouse archived')
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: warehouseKeys.all })
    },
  })
}
