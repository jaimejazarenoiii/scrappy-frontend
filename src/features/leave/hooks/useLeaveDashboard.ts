import { useQuery } from '@tanstack/react-query'

import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { isCompanyViewer } from '@/features/workforce/lib/workforce-roles'

import { LeaveService } from '../services/leave.service'
import { leaveKeys } from './useLeaves'

export function useLeaveDashboard() {
  const { currentUser } = useCurrentUser()

  return useQuery({
    queryKey: leaveKeys.dashboard,
    queryFn: () => LeaveService.dashboard(),
    enabled: isCompanyViewer(currentUser?.role),
  })
}
