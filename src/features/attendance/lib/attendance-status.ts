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

/** Elapsed working time from a start ISO timestamp to `nowMs` (defaults to now). */
export function formatElapsedWorkingTime(startedAt: string, nowMs = Date.now()): string {
  const startMs = Date.parse(startedAt)
  if (Number.isNaN(startMs) || startMs > nowMs) return '0h 00m 00s'

  const totalSeconds = Math.floor((nowMs - startMs) / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return `${String(hours)}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`
}

export function formatAttendanceDateTime(value: string | null | undefined): string {
  if (!value) return '—'
  return new Intl.DateTimeFormat('en-PH', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(value))
}

export function formatAttendanceDate(value: string | null | undefined): string {
  if (!value) return '—'
  return new Intl.DateTimeFormat('en-PH', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value))
}

export function formatAttendanceTime(value: string | null | undefined): string {
  if (!value) return '—'
  return new Intl.DateTimeFormat('en-PH', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(value))
}

export function formatEmployeeDisplayName(
  employee: WorkforceEmployeeRecord,
  labelById?: ReadonlyMap<string, string>,
): string {
  return formatRecordEmployeeLabel(employee, labelById)
}
