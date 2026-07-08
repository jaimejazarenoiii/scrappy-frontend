import type { StatusTone } from '@/components/common/StatusBadge'
import {
  formatRecordEmployeeLabel,
  type WorkforceEmployeeRecord,
} from '@/features/employees/lib/employee-display'

import type {
  Attendance,
  AttendanceDayStatus,
  AttendanceSessionStatus,
} from '../types/attendance.types'

export function attendanceStatusLabel(status: AttendanceSessionStatus): string {
  const labels: Record<AttendanceSessionStatus, string> = {
    OPEN: 'Open',
    CLOSED: 'Closed',
  }
  return labels[status]
}

export function attendanceStatusTone(status: AttendanceSessionStatus): StatusTone {
  switch (status) {
    case 'OPEN':
      return 'active'
    case 'CLOSED':
      return 'inactive'
    default:
      return 'neutral'
  }
}

export function attendanceDayStatusLabel(status: AttendanceDayStatus): string {
  const labels: Record<AttendanceDayStatus, string> = {
    ABSENT: 'Absent',
    ON_TIME: 'On time',
    LATE: 'Late',
    TIMED_OUT: 'Timed out',
    ON_LEAVE: 'On leave',
  }
  return labels[status]
}

export function attendanceDayStatusTone(status: AttendanceDayStatus): StatusTone {
  switch (status) {
    case 'ON_TIME':
      return 'active'
    case 'LATE':
      return 'neutral'
    case 'TIMED_OUT':
      return 'inactive'
    case 'ON_LEAVE':
      return 'archived'
    case 'ABSENT':
      return 'archived'
    default:
      return 'neutral'
  }
}

export function canCorrectAttendance(): boolean {
  return true
}

export function displayTimeIn(attendance: Attendance): string | null {
  return attendance.adjustedTimeInAt ?? attendance.timeInAt
}

export function displayTimeOut(attendance: Attendance): string | null {
  return attendance.adjustedTimeOutAt ?? attendance.timeOutAt
}

export function formatEmployeeDisplayName(
  employee: WorkforceEmployeeRecord,
  labelById?: ReadonlyMap<string, string>,
): string {
  return formatRecordEmployeeLabel(employee, labelById)
}
