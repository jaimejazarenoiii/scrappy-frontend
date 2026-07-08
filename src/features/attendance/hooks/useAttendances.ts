import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { isCompanyViewer } from '@/features/workforce/lib/workforce-roles'
import type { ListQueryParams } from '@/types/pagination.types'

import { AttendanceService } from '../services/attendance.service'

export const attendanceKeys = {
  all: ['attendance'] as const,
  operationalDashboard: ['attendance', 'operational-dashboard'] as const,
  companyDashboard: (date?: string) => ['attendance', 'company-dashboard', date] as const,
  status: ['attendance', 'status'] as const,
  list: (scope: 'mine' | 'company', params: ListQueryParams) =>
    ['attendance', 'list', scope, params] as const,
  detail: (id: string) => ['attendance', 'detail', id] as const,
}

export function useAttendances(params: ListQueryParams) {
  const { currentUser } = useCurrentUser()
  const scope = isCompanyViewer(currentUser?.role) ? 'company' : 'mine'

  return useQuery({
    queryKey: attendanceKeys.list(scope, params),
    queryFn: () =>
      scope === 'company'
        ? AttendanceService.listCompany(params)
        : AttendanceService.listMine(params),
    placeholderData: keepPreviousData,
  })
}
