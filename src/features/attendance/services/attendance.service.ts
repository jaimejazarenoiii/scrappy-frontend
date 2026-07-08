import { apiClient } from '@/lib/axios'
import { unwrap, unwrapList } from '@/lib/api-envelope'
import { toQueryParams } from '@/lib/list-params'
import type { ApiEnvelope } from '@/types/api.types'
import type { ListQueryParams, PaginatedResponse } from '@/types/pagination.types'

import type {
  Attendance,
  AttendanceCorrectionInput,
  AttendanceDashboard,
  AttendanceNoteInput,
  AttendanceStatusResponse,
  WorkforceDashboard,
} from '../types/attendance.types'

export const ATTENDANCE_ENDPOINTS = {
  operationalDashboard: '/workforce/dashboard',
  companyDashboard: '/workforce/attendance/dashboard',
  status: '/workforce/attendance/status',
  mine: '/workforce/attendance',
  company: '/workforce/attendance/company',
  timeIn: '/workforce/attendance/time-in',
  timeOut: '/workforce/attendance/time-out',
  detail: (attendanceId: string) => `/workforce/attendance/${attendanceId}`,
} as const

function listParams(params: ListQueryParams): Record<string, string | number> {
  const query = toQueryParams(params)
  // API uses fromDate/toDate instead of dateFrom/dateTo.
  if (typeof query.dateFrom === 'string') {
    query.fromDate = query.dateFrom
    delete query.dateFrom
  }
  if (typeof query.dateTo === 'string') {
    query.toDate = query.dateTo
    delete query.dateTo
  }
  return query
}

export const AttendanceService = {
  async operationalDashboard(): Promise<WorkforceDashboard> {
    const response = await apiClient.get<ApiEnvelope<WorkforceDashboard>>(
      ATTENDANCE_ENDPOINTS.operationalDashboard,
    )
    return unwrap(response)
  },

  async companyDashboard(date?: string): Promise<AttendanceDashboard> {
    const response = await apiClient.get<ApiEnvelope<AttendanceDashboard>>(
      ATTENDANCE_ENDPOINTS.companyDashboard,
      { params: date ? { date } : undefined },
    )
    return unwrap(response)
  },

  async status(): Promise<AttendanceStatusResponse> {
    const response = await apiClient.get<ApiEnvelope<AttendanceStatusResponse>>(
      ATTENDANCE_ENDPOINTS.status,
    )
    return unwrap(response)
  },

  async listMine(params: ListQueryParams): Promise<PaginatedResponse<Attendance>> {
    const response = await apiClient.get<ApiEnvelope<Attendance[]>>(ATTENDANCE_ENDPOINTS.mine, {
      params: listParams(params),
    })
    return unwrapList(response)
  },

  async listCompany(params: ListQueryParams): Promise<PaginatedResponse<Attendance>> {
    const response = await apiClient.get<ApiEnvelope<Attendance[]>>(ATTENDANCE_ENDPOINTS.company, {
      params: listParams(params),
    })
    return unwrapList(response)
  },

  async get(attendanceId: string): Promise<Attendance> {
    // GET-by-id is not documented — resolve from list endpoints.
    const mine = await AttendanceService.listMine({ page: 1, pageSize: 100 })
    const fromMine = mine.data.find((item) => item.id === attendanceId)
    if (fromMine) return fromMine

    try {
      const company = await AttendanceService.listCompany({
        page: 1,
        pageSize: 100,
        filters: {},
      })
      const fromCompany = company.data.find((item) => item.id === attendanceId)
      if (fromCompany) return fromCompany
    } catch {
      // Company list is OWNER/MANAGER only; ignore for employees.
    }

    throw Object.assign(new Error('Resource not found'), {
      code: 'RESOURCE_NOT_FOUND',
      message: 'Resource not found',
      status: 404,
    })
  },

  async timeIn(input?: AttendanceNoteInput): Promise<Attendance> {
    const response = await apiClient.post<ApiEnvelope<Attendance>>(
      ATTENDANCE_ENDPOINTS.timeIn,
      input ?? {},
    )
    return unwrap(response)
  },

  async timeOut(input?: AttendanceNoteInput): Promise<Attendance> {
    const response = await apiClient.post<ApiEnvelope<Attendance>>(
      ATTENDANCE_ENDPOINTS.timeOut,
      input ?? {},
    )
    return unwrap(response)
  },

  async correct(attendanceId: string, input: AttendanceCorrectionInput): Promise<Attendance> {
    const response = await apiClient.patch<ApiEnvelope<Attendance>>(
      ATTENDANCE_ENDPOINTS.detail(attendanceId),
      input,
    )
    return unwrap(response)
  },
}
