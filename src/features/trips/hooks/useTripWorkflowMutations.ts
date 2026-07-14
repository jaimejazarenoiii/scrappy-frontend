import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { NormalizedApiError } from '@/lib/axios'

import { TripService } from '../services/trip.service'
import type {
  CancelTripInput,
  CompleteTripInput,
  StartTripInput,
  TripDetail,
} from '../types/trip.types'
import { tripKeys, tripLoadKeys } from './trip-keys'
import { useTripDialogStore } from './useTripDialogStore'

function invalidateTripDetail(queryClient: ReturnType<typeof useQueryClient>, id: string) {
  void queryClient.invalidateQueries({ queryKey: tripKeys.all })
  void queryClient.invalidateQueries({ queryKey: tripKeys.detail(id) })
  void queryClient.invalidateQueries({ queryKey: tripKeys.timeline(id) })
  void queryClient.invalidateQueries({ queryKey: tripLoadKeys.detail(id) })
  void queryClient.invalidateQueries({ queryKey: tripLoadKeys.progress(id) })
}

function handleWorkflowError(
  error: NormalizedApiError,
  queryClient: ReturnType<typeof useQueryClient>,
  id: string,
  fallback: string,
) {
  if (error.code === 'LIFECYCLE_CONFLICT' || error.code === 'BUSINESS_RULE_VIOLATION') {
    toast.error(error.message || fallback)
    invalidateTripDetail(queryClient, id)
    useTripDialogStore.getState().closeDialog()
    return
  }

  if (error.status === 403) {
    toast.error(error.message || 'You are not allowed to perform this action.')
    return
  }

  toast.error(error.message || fallback)
}

function useTripWorkflowMutation<TInput>(
  id: string,
  mutationFn: (input: TInput) => Promise<TripDetail>,
  successMessage: string,
  errorFallback: string,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: (trip: TripDetail) => {
      queryClient.setQueryData(tripKeys.detail(id), trip)
      invalidateTripDetail(queryClient, id)
      useTripDialogStore.getState().closeDialog()
      toast.success(successMessage)
    },
    onError: (error: NormalizedApiError) => {
      handleWorkflowError(error, queryClient, id, errorFallback)
    },
  })
}

export function useStartTrip(id: string) {
  return useTripWorkflowMutation(
    id,
    (input: StartTripInput) => TripService.start(id, input),
    'Trip started',
    'Could not start trip',
  )
}

export function useCompleteTrip(id: string) {
  return useTripWorkflowMutation(
    id,
    (input: CompleteTripInput) => TripService.complete(id, input),
    'Trip completed',
    'Could not complete trip',
  )
}

export function useCancelTrip(id: string) {
  return useTripWorkflowMutation(
    id,
    (input: CancelTripInput) => TripService.cancel(id, input),
    'Trip cancelled',
    'Could not cancel trip',
  )
}
