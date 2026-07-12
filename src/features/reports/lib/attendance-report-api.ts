import { asDateString, asIsoString, asNullableString, asRecord, asString } from './report-api'
import type { AttendanceReportRow } from '../types/reports.types'

export function normalizeAttendanceReportRow(raw: unknown): AttendanceReportRow {
  const row = asRecord(raw)
  const employee = asRecord(row.employee)

  return {
    id: asString(row.attendanceId ?? row.id),
    date: asDateString(row.date ?? row.attendanceDate ?? row.timeIn),
    employeeId: asNullableString(employee.id ?? row.employeeId),
    employeeName: asNullableString(employee.displayName ?? row.employeeName ?? row.employee),
    timeIn: asIsoString(row.timeIn ?? row.clockIn),
    timeOut: asIsoString(row.timeOut ?? row.clockOut),
    status: asNullableString(row.status),
  }
}
