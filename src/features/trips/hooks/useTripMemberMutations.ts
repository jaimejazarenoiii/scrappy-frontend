import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { NormalizedApiError } from '@/lib/axios'

import { TripService } from '../services/trip.service'
import type { AssignMembersInput } from '../types/trip.types'
import { tripKeys } from './trip-keys'
import { useTripDialogStore } from './useTripDialogStore'

export function useAddTripMembers(tripId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: AssignMembersInput) => TripService.addMembers(tripId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tripKeys.detail(tripId) })
      void queryClient.invalidateQueries({ queryKey: tripKeys.members(tripId) })
      useTripDialogStore.getState().closeDialog()
      toast.success('Members assigned')
    },
    onError: (error: NormalizedApiError) => {
      toast.error(error.message || 'Could not assign members')
    },
  })
}

export function useRemoveTripMember(tripId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (memberId: string) => TripService.removeMember(tripId, memberId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tripKeys.detail(tripId) })
      void queryClient.invalidateQueries({ queryKey: tripKeys.members(tripId) })
      toast.success('Member removed')
    },
    onError: (error: NormalizedApiError) => {
      toast.error(error.message || 'Could not remove member')
    },
  })
}
