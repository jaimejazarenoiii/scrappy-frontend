import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import type { ListQueryParams } from '@/types/pagination.types'

import { CashAdvanceService } from '../services/cash-advance.service'

export const cashAdvanceKeys = {
  all: ['cash-advances'] as const,
  list: (scope: 'mine' | 'company', params: ListQueryParams) =>
    ['cash-advances', 'list', scope, params] as const,
  detail: (id: string) => ['cash-advances', 'detail', id] as const,
}

function isCompanyViewer(role: string | undefined): boolean {
  return role === 'OWNER' || role === 'MANAGER'
}

export function useCashAdvances(params: ListQueryParams) {
  const { currentUser } = useCurrentUser()
  const scope = isCompanyViewer(currentUser?.role) ? 'company' : 'mine'

  return useQuery({
    queryKey: cashAdvanceKeys.list(scope, params),
    queryFn: () =>
      scope === 'company'
        ? CashAdvanceService.listCompany(params)
        : CashAdvanceService.listMine(params),
    placeholderData: keepPreviousData,
  })
}
