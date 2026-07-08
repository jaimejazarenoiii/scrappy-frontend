import { useQuery } from '@tanstack/react-query'

import { AttendanceService } from '../services/attendance.service'
import { attendanceKeys } from './useAttendances'

export function useAttendance(id: string | undefined) {
  return useQuery({
    queryKey: attendanceKeys.detail(id ?? ''),
    queryFn: () => AttendanceService.get(id ?? ''),
    enabled: Boolean(id),
  })
}
