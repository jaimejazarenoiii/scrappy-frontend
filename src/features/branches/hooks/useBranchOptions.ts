import { useQuery } from '@tanstack/react-query'

import { BranchService } from '../services/branch.service'
import { branchKeys } from './useBranches'

/** Active branches for select pickers in warehouse/vehicle forms. */
export function useBranchOptions() {
  return useQuery({
    queryKey: branchKeys.picker,
    queryFn: async () => {
      const result = await BranchService.list({
        page: 1,
        pageSize: 100,
        filters: { status: 'ACTIVE' },
      })
      return result.data
    },
    staleTime: 60_000,
  })
}
