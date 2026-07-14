import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { NormalizedApiError } from '@/lib/axios'

import { TripLoadService } from '../services/trip-load.service'
import type {
  CreateTripLoadInput,
  CreateTripLoadItemInput,
  UpdateTripLoadItemInput,
} from '../types/trip-load.types'
import type { TripDetail } from '../types/trip.types'
import { tripKeys, tripLoadKeys } from './trip-keys'

function invalidateTripLoad(queryClient: ReturnType<typeof useQueryClient>, tripId: string) {
  void queryClient.invalidateQueries({ queryKey: tripLoadKeys.detail(tripId) })
  void queryClient.invalidateQueries({ queryKey: tripLoadKeys.progress(tripId) })
  void queryClient.invalidateQueries({ queryKey: tripKeys.detail(tripId) })
  void queryClient.invalidateQueries({ queryKey: tripKeys.all })
}

function patchTripFlags(
  queryClient: ReturnType<typeof useQueryClient>,
  tripId: string,
  flags: { loadEnabled: boolean; strictLoadValidation: boolean },
) {
  queryClient.setQueryData(tripKeys.detail(tripId), (prev: TripDetail | undefined) => {
    if (!prev) return prev
    return {
      ...prev,
      loadEnabled: flags.loadEnabled,
      strictLoadValidation: flags.strictLoadValidation,
    }
  })
}

function handleMutationError(error: NormalizedApiError, fallback: string) {
  if (error.status === 409) {
    toast.error(error.message || 'Trip load is no longer editable.')
    return
  }
  toast.error(error.message || fallback)
}

export function useCreateTripLoad(tripId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateTripLoadInput) => TripLoadService.createLoad(tripId, input),
    onSuccess: () => {
      invalidateTripLoad(queryClient, tripId)
      toast.success('Trip load created')
    },
    onError: (error: NormalizedApiError) => {
      handleMutationError(error, 'Could not create trip load')
    },
  })
}

export function useAddTripLoadItem(tripId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateTripLoadItemInput) => {
      const existing = await TripLoadService.getLoad(tripId)
      if (!existing) {
        return TripLoadService.createLoad(tripId, { items: [input] })
      }
      return TripLoadService.addItem(tripId, input)
    },
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

export function useDeleteTripLoad(tripId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => TripLoadService.deleteLoad(tripId),
    onSuccess: (flags) => {
      patchTripFlags(queryClient, tripId, flags)
      invalidateTripLoad(queryClient, tripId)
      toast.success('Trip load cleared')
    },
    onError: (error: NormalizedApiError) => {
      handleMutationError(error, 'Could not delete trip load')
    },
  })
}
