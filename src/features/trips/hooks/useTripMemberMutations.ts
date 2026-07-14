import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { NormalizedApiError } from '@/lib/axios'

import { TripService } from '../services/trip.service'
import type { AssignMembersInput, TripDetail, TripMember } from '../types/trip.types'
import { tripKeys } from './trip-keys'
import { useTripDialogStore } from './useTripDialogStore'

function mergeMembers(existing: TripMember[], incoming: TripMember[]): TripMember[] {
  const byEmployeeId = new Map(existing.map((member) => [member.employeeId, member]))
  for (const member of incoming) {
    byEmployeeId.set(member.employeeId, member)
  }
  return [...byEmployeeId.values()]
}

function syncMembersCache(
  queryClient: ReturnType<typeof useQueryClient>,
  tripId: string,
  members: TripMember[],
) {
  queryClient.setQueryData(tripKeys.members(tripId), members)
  queryClient.setQueryData(tripKeys.detail(tripId), (prev: TripDetail | undefined) => {
    if (!prev) return prev
    return { ...prev, members }
  })
}

export function useAddTripMembers(tripId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: AssignMembersInput) => TripService.addMembers(tripId, input),
    onSuccess: (addedMembers) => {
      const previous = queryClient.getQueryData<TripDetail>(tripKeys.detail(tripId))
      const nextMembers = mergeMembers(previous?.members ?? [], addedMembers)
      syncMembersCache(queryClient, tripId, nextMembers)
      void queryClient.invalidateQueries({ queryKey: tripKeys.detail(tripId) })
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
    onSuccess: (_result, memberId) => {
      const previous = queryClient.getQueryData<TripDetail>(tripKeys.detail(tripId))
      const nextMembers = (previous?.members ?? []).filter((member) => member.id !== memberId)
      syncMembersCache(queryClient, tripId, nextMembers)
      void queryClient.invalidateQueries({ queryKey: tripKeys.detail(tripId) })
      toast.success('Member removed')
    },
    onError: (error: NormalizedApiError) => {
      toast.error(error.message || 'Could not remove member')
    },
  })
}
