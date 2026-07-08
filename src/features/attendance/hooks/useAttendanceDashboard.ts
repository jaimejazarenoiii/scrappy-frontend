import { useQuery } from '@tanstack/react-query'

import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { isCompanyViewer } from '@/features/workforce/lib/workforce-roles'

import { AttendanceService } from '../services/attendance.service'
import { attendanceKeys } from './useAttendances'

export function useAttendanceOperationalDashboard() {
  return useQuery({
    queryKey: attendanceKeys.operationalDashboard,
    queryFn: () => AttendanceService.operationalDashboard(),
  })
}

export function useAttendanceCompanyDashboard(date?: string) {
  const { currentUser } = useCurrentUser()

  return useQuery({
    queryKey: attendanceKeys.companyDashboard(date),
    queryFn: () => AttendanceService.companyDashboard(date),
    enabled: isCompanyViewer(currentUser?.role),
  })
}

export function useAttendanceStatus() {
  return useQuery({
    queryKey: attendanceKeys.status,
    queryFn: () => AttendanceService.status(),
  })
}
