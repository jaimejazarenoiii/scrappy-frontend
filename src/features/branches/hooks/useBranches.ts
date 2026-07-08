import { keepPreviousData, useQuery } from '@tanstack/react-query'

import type { ListQueryParams } from '@/types/pagination.types'

import { BranchService } from '../services/branch.service'

export const branchKeys = {
  all: ['branches'] as const,
  list: (params: ListQueryParams) => ['branches', 'list', params] as const,
  detail: (id: string) => ['branches', 'detail', id] as const,
  picker: ['branches', 'picker'] as const,
}

export function useBranches(params: ListQueryParams) {
  return useQuery({
    queryKey: branchKeys.list(params),
    queryFn: () => BranchService.list(params),
    placeholderData: keepPreviousData,
  })
}
