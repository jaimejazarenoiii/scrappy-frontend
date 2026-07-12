import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { NormalizedApiError } from '@/lib/axios'

import { TripService } from '../services/trip.service'
import type {
  AssignVehicleInput,
  CreateTripInput,
  TripDetail,
  UpdateTripInput,
} from '../types/trip.types'
import { tripKeys } from './trip-keys'

function invalidateTripQueries(queryClient: ReturnType<typeof useQueryClient>, id?: string) {
  void queryClient.invalidateQueries({ queryKey: tripKeys.all })
  if (id) {
    void queryClient.invalidateQueries({ queryKey: tripKeys.detail(id) })
    void queryClient.invalidateQueries({ queryKey: tripKeys.members(id) })
    void queryClient.invalidateQueries({ queryKey: tripKeys.transactions(id) })
    void queryClient.invalidateQueries({ queryKey: tripKeys.timeline(id) })
  }
}

export function useCreateTrip() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateTripInput) => TripService.create(input),
    onSuccess: (trip: TripDetail) => {
      queryClient.setQueryData(tripKeys.detail(trip.id), trip)
      invalidateTripQueries(queryClient, trip.id)
      toast.success('Trip created')
    },
    onError: (error: NormalizedApiError) => {
      toast.error(error.message || 'Could not create trip')
    },
  })
}

export function useUpdateTrip(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateTripInput) => TripService.update(id, input),
    onSuccess: (trip: TripDetail) => {
      queryClient.setQueryData(tripKeys.detail(id), trip)
      invalidateTripQueries(queryClient, id)
      toast.success('Trip updated')
    },
    onError: (error: NormalizedApiError) => {
      toast.error(error.message || 'Could not update trip')
    },
  })
}

export function useAssignTripVehicle(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: AssignVehicleInput) => TripService.assignVehicle(id, input),
    onSuccess: (trip: TripDetail) => {
      queryClient.setQueryData(tripKeys.detail(id), trip)
      invalidateTripQueries(queryClient, id)
      toast.success('Vehicle assigned')
    },
    onError: (error: NormalizedApiError) => {
      toast.error(error.message || 'Could not assign vehicle')
    },
  })
}
