import { useQuery } from '@tanstack/react-query'

import { CashAdvanceService } from '../services/cash-advance.service'
import { cashAdvanceKeys } from './useCashAdvances'

export function useCashAdvance(id: string | undefined) {
  return useQuery({
    queryKey: cashAdvanceKeys.detail(id ?? ''),
    queryFn: () => CashAdvanceService.get(id ?? ''),
    enabled: Boolean(id),
  })
}
