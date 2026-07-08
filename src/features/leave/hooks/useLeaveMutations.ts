import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { NormalizedApiError } from '@/lib/axios'

import { LeaveService } from '../services/leave.service'
import type { CreateLeaveInput, Leave, ManageLeaveInput } from '../types/leave.types'
import { leaveKeys } from './useLeaves'

function handleWorkflowError(
  error: NormalizedApiError,
  queryClient: ReturnType<typeof useQueryClient>,
  id: string,
  fallback: string,
) {
  if (error.code === 'LIFECYCLE_CONFLICT' || error.code === 'BUSINESS_RULE_VIOLATION') {
    toast.error(error.message || fallback)
    void queryClient.invalidateQueries({ queryKey: leaveKeys.detail(id) })
    void queryClient.invalidateQueries({ queryKey: leaveKeys.all })
    return
  }
  toast.error(error.message || fallback)
}

export function useCreateLeave() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateLeaveInput) => LeaveService.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: leaveKeys.all })
      toast.success('Leave request created')
    },
    onError: (error: NormalizedApiError) => {
      toast.error(error.message || 'Could not create leave request')
    },
  })
}

export function useManageLeave(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ManageLeaveInput) => LeaveService.manage(id, input),
    onSuccess: (leave: Leave) => {
      queryClient.setQueryData(leaveKeys.detail(id), leave)
      void queryClient.invalidateQueries({ queryKey: leaveKeys.all })
      toast.success('Leave request updated')
    },
    onError: (error: NormalizedApiError) => {
      handleWorkflowError(error, queryClient, id, 'Could not update leave request')
    },
  })
}
