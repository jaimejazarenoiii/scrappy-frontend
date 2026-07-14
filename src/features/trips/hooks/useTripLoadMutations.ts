import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { NormalizedApiError } from '@/lib/axios'

import { TripLoadService } from '../services/trip-load.service'
import type { CreateTripLoadItemInput, UpdateTripLoadItemInput } from '../types/trip-load.types'
import { tripKeys, tripLoadKeys } from './trip-keys'

function invalidateTripLoad(queryClient: ReturnType<typeof useQueryClient>, tripId: string) {
  void queryClient.invalidateQueries({ queryKey: tripLoadKeys.detail(tripId) })
  void queryClient.invalidateQueries({ queryKey: tripLoadKeys.progress(tripId) })
  void queryClient.invalidateQueries({ queryKey: tripKeys.detail(tripId) })
}

function handleMutationError(error: NormalizedApiError, fallback: string) {
  if (error.status === 409) {
    toast.error(error.message || 'Trip load is no longer editable.')
    return
  }
  toast.error(error.message || fallback)
}

export function useAddTripLoadItem(tripId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateTripLoadItemInput) => TripLoadService.addItem(tripId, input),
    onSuccess: () => {
      invalidateTripLoad(queryClient, tripId)
      toast.success('Load item added')
    },
    onError: (error: NormalizedApiError) => {
      handleMutationError(error, 'Could not add load item')
    },
  })
}

export function useUpdateTripLoadItem(tripId: string, itemId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateTripLoadItemInput) =>
      TripLoadService.updateItem(tripId, itemId, input),
    onSuccess: () => {
      invalidateTripLoad(queryClient, tripId)
      toast.success('Load item updated')
    },
    onError: (error: NormalizedApiError) => {
      handleMutationError(error, 'Could not update load item')
    },
  })
}

export function useDeleteTripLoadItem(tripId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (itemId: string) => TripLoadService.deleteItem(tripId, itemId),
    onSuccess: () => {
      invalidateTripLoad(queryClient, tripId)
      toast.success('Load item removed')
    },
    onError: (error: NormalizedApiError) => {
      handleMutationError(error, 'Could not remove load item')
    },
  })
}
