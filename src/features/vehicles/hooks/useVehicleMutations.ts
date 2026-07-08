import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { NormalizedApiError } from '@/lib/axios'

import { VehicleService } from '../services/vehicle.service'
import type { CreateVehicleInput, UpdateVehicleInput, Vehicle } from '../types/vehicle.types'
import { vehicleKeys } from './useVehicles'

export function useCreateVehicle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateVehicleInput) => VehicleService.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: vehicleKeys.all })
      toast.success('Vehicle created')
    },
    onError: (error: NormalizedApiError) => {
      toast.error(error.message || 'Could not create vehicle')
    },
  })
}

export function useUpdateVehicle(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateVehicleInput) => VehicleService.update(id, input),
    onSuccess: (vehicle) => {
      queryClient.setQueryData(vehicleKeys.detail(id), vehicle)
      void queryClient.invalidateQueries({ queryKey: vehicleKeys.all })
      toast.success('Vehicle updated')
    },
    onError: (error: NormalizedApiError) => {
      toast.error(error.message || 'Could not update vehicle')
    },
  })
}

export function useArchiveVehicle(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => VehicleService.archive(id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: vehicleKeys.detail(id) })
      const previous = queryClient.getQueryData<Vehicle>(vehicleKeys.detail(id))
      if (previous) {
        queryClient.setQueryData<Vehicle>(vehicleKeys.detail(id), {
          ...previous,
          deletedAt: new Date().toISOString(),
        })
      }
      return { previous }
    },
    onError: (error: NormalizedApiError, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(vehicleKeys.detail(id), context.previous)
      }
      toast.error(error.message || 'Could not archive vehicle')
    },
    onSuccess: (vehicle) => {
      queryClient.setQueryData(vehicleKeys.detail(id), vehicle)
      toast.success('Vehicle archived')
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: vehicleKeys.all })
    },
  })
}
