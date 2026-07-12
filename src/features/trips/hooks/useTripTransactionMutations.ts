import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { NormalizedApiError } from '@/lib/axios'

import { TripService } from '../services/trip.service'
import type { LinkTransactionInput } from '../types/trip.types'
import { tripKeys } from './trip-keys'
import { useTripDialogStore } from './useTripDialogStore'

export function useLinkTripTransaction(tripId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: LinkTransactionInput) => TripService.linkTransaction(tripId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tripKeys.detail(tripId) })
      void queryClient.invalidateQueries({ queryKey: tripKeys.transactions(tripId) })
      useTripDialogStore.getState().closeDialog()
      toast.success('Transaction linked')
    },
    onError: (error: NormalizedApiError) => {
      toast.error(error.message || 'Could not link transaction')
    },
  })
}

export function useUnlinkTripTransaction(tripId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (transactionId: string) => TripService.unlinkTransaction(tripId, transactionId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tripKeys.detail(tripId) })
      void queryClient.invalidateQueries({ queryKey: tripKeys.transactions(tripId) })
      toast.success('Transaction unlinked')
    },
    onError: (error: NormalizedApiError) => {
      toast.error(error.message || 'Could not unlink transaction')
    },
  })
}
