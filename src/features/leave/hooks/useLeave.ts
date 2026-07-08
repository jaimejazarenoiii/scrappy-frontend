import { useQuery } from '@tanstack/react-query'

import { LeaveService } from '../services/leave.service'
import { leaveKeys } from './useLeaves'

export function useLeave(id: string | undefined) {
  return useQuery({
    queryKey: leaveKeys.detail(id ?? ''),
    queryFn: () => LeaveService.get(id ?? ''),
    enabled: Boolean(id),
  })
}
