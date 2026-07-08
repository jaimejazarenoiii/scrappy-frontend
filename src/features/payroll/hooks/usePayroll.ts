import { useQuery } from '@tanstack/react-query'

import { PayrollService } from '../services/payroll.service'
import { payrollKeys } from './usePayrolls'

export function usePayroll(id: string | undefined) {
  return useQuery({
    queryKey: payrollKeys.detail(id ?? ''),
    queryFn: () => PayrollService.get(id ?? ''),
    enabled: Boolean(id),
  })
}
