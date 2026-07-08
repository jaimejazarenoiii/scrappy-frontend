import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { isCompanyViewer } from '@/features/workforce/lib/workforce-roles'
import type { ListQueryParams } from '@/types/pagination.types'

import { LeaveService } from '../services/leave.service'

export const leaveKeys = {
  all: ['leave'] as const,
  dashboard: ['leave', 'dashboard'] as const,
  list: (scope: 'mine' | 'company', params: ListQueryParams) =>
    ['leave', 'list', scope, params] as const,
  detail: (id: string) => ['leave', 'detail', id] as const,
}

export function useLeaves(params: ListQueryParams) {
  const { currentUser } = useCurrentUser()
  const scope = isCompanyViewer(currentUser?.role) ? 'company' : 'mine'

  return useQuery({
    queryKey: leaveKeys.list(scope, params),
    queryFn: () =>
      scope === 'company' ? LeaveService.listCompany(params) : LeaveService.listMine(params),
    placeholderData: keepPreviousData,
  })
}
