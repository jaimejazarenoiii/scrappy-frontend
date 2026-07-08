import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { NormalizedApiError } from '@/lib/axios'

import { BranchService } from '../services/branch.service'
import type { Branch, CreateBranchInput, UpdateBranchInput } from '../types/branch.types'
import { branchKeys } from './useBranches'

export function useCreateBranch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateBranchInput) => BranchService.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: branchKeys.all })
      toast.success('Branch created')
    },
    onError: (error: NormalizedApiError) => {
      toast.error(error.message || 'Could not create branch')
    },
  })
}

export function useUpdateBranch(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateBranchInput) => BranchService.update(id, input),
    onSuccess: (branch) => {
      queryClient.setQueryData(branchKeys.detail(id), branch)
      void queryClient.invalidateQueries({ queryKey: branchKeys.all })
      toast.success('Branch updated')
    },
    onError: (error: NormalizedApiError) => {
      toast.error(error.message || 'Could not update branch')
    },
  })
}

export function useArchiveBranch(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => BranchService.archive(id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: branchKeys.detail(id) })
      const previous = queryClient.getQueryData<Branch>(branchKeys.detail(id))
      if (previous) {
        queryClient.setQueryData<Branch>(branchKeys.detail(id), {
          ...previous,
          deletedAt: new Date().toISOString(),
        })
      }
      return { previous }
    },
    onError: (error: NormalizedApiError, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(branchKeys.detail(id), context.previous)
      }
      toast.error(error.message || 'Could not archive branch')
    },
    onSuccess: (branch) => {
      queryClient.setQueryData(branchKeys.detail(id), branch)
      toast.success('Branch archived')
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: branchKeys.all })
    },
  })
}
