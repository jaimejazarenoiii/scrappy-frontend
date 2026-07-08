export type AttendanceSessionStatus = 'OPEN' | 'CLOSED'

export type AttendanceDayStatus = 'ABSENT' | 'ON_TIME' | 'LATE' | 'TIMED_OUT' | 'ON_LEAVE'

export interface Attendance {
  id: string
  companyId: string
  employeeId: string
  firstName?: string | null
  lastName?: string | null
  employeeNumber?: string | null
  status: AttendanceSessionStatus
  timeInAt: string
  timeOutAt: string | null
  note: string | null
  correctionNote: string | null
  adjustedTimeInAt: string | null
  adjustedTimeOutAt: string | null
  createdAt: string
  updatedAt: string
}

export interface AttendanceStatusResponse {
  isTimedIn: boolean
  openSession: Attendance | null
}

export interface WorkforceDashboard {
  attendanceStatus?: AttendanceStatusResponse
  recentAttendance?: Attendance[]
  canTimeIn?: boolean
  canTimeOut?: boolean
  canCreateTransaction?: boolean
  [key: string]: unknown
}

export interface AttendanceEmployeeDaySummary {
  employeeId: string
  employeeNumber?: string | null
  firstName?: string | null
  lastName?: string | null
  status: AttendanceDayStatus
  isTimedIn: boolean
  isLate: boolean
  isAbsent: boolean
  onLeave: boolean
  timeInToday: string | null
  timeOutToday: string | null
}

export interface AttendanceCompanySummary {
  present: number
  late: number
  absent: number
  onLeave: number
  timedIn: number
}

export interface AttendanceDashboard {
  date: string
  employees: AttendanceEmployeeDaySummary[]
  summary: AttendanceCompanySummary
}

export interface AttendanceNoteInput {
  note?: string
}

export interface AttendanceCorrectionInput {
  timeInAt?: string
  timeOutAt?: string
  note?: string
  correctionNote?: string
}
