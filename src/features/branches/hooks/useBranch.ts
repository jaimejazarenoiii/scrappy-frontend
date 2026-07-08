import { useQuery } from '@tanstack/react-query'

import { BranchService } from '../services/branch.service'
import { branchKeys } from './useBranches'

export function useBranch(id: string | undefined) {
  return useQuery({
    queryKey: branchKeys.detail(id ?? ''),
    queryFn: () => BranchService.get(id ?? ''),
    enabled: Boolean(id),
  })
}
