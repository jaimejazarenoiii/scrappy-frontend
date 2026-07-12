import { apiClient } from '@/lib/axios'
import type { ApiEnvelope } from '@/types/api.types'

import { normalizeAttendanceReportRow } from '../lib/attendance-report-api'
import { normalizeExpenseReportRow } from '../lib/expense-report-api'
import { normalizePayrollReportRow } from '../lib/payroll-report-api'
import {
  buildReportQueryParams,
  filenameFromContentDisposition,
  unwrapReportList,
} from '../lib/report-api'
import { normalizeTransactionReportRow } from '../lib/transaction-report-api'
import { normalizeTripReportRow } from '../lib/trip-report-api'
import type {
  AttendanceReportRow,
  ExpenseReportRow,
  PayrollReportRow,
  ReportDomain,
  ReportExportFormat,
  ReportExportResult,
  ReportFilterSet,
  ReportListResponse,
  TransactionReportRow,
  TripReportRow,
} from '../types/reports.types'

export const REPORT_ENDPOINTS = {
  transactions: '/reports/transactions',
  trips: '/reports/trips',
  expenses: '/reports/expenses',
  payroll: '/reports/payroll',
  attendance: '/reports/attendance',
  export: (domain: ReportDomain) => `/reports/${domain}/export`,
} as const

async function listReport<TRow>(
  path: string,
  domain: ReportDomain,
  filters: ReportFilterSet,
  normalizeRow: (raw: unknown) => TRow,
): Promise<ReportListResponse<TRow>> {
  const response = await apiClient.get<ApiEnvelope<unknown>>(path, {
    params: buildReportQueryParams(domain, filters),
  })
  const page = unwrapReportList(response)
  return {
    ...page,
    data: page.data.map(normalizeRow),
  }
}

export const ReportService = {
  listTransactions(filters: ReportFilterSet): Promise<ReportListResponse<TransactionReportRow>> {
    return listReport(
      REPORT_ENDPOINTS.transactions,
      'transactions',
      filters,
      normalizeTransactionReportRow,
    )
  },

  listTrips(filters: ReportFilterSet): Promise<ReportListResponse<TripReportRow>> {
    return listReport(REPORT_ENDPOINTS.trips, 'trips', filters, normalizeTripReportRow)
  },

  listExpenses(filters: ReportFilterSet): Promise<ReportListResponse<ExpenseReportRow>> {
    return listReport(REPORT_ENDPOINTS.expenses, 'expenses', filters, normalizeExpenseReportRow)
  },

  listPayroll(filters: ReportFilterSet): Promise<ReportListResponse<PayrollReportRow>> {
    return listReport(REPORT_ENDPOINTS.payroll, 'payroll', filters, normalizePayrollReportRow)
  },

  listAttendance(filters: ReportFilterSet): Promise<ReportListResponse<AttendanceReportRow>> {
    return listReport(
      REPORT_ENDPOINTS.attendance,
      'attendance',
      filters,
      normalizeAttendanceReportRow,
    )
  },

  async export(
    domain: ReportDomain,
    filters: ReportFilterSet,
    format: ReportExportFormat,
  ): Promise<ReportExportResult> {
    const response = await apiClient.get<Blob>(REPORT_ENDPOINTS.export(domain), {
      params: {
        ...buildReportQueryParams(domain, filters),
        format,
      },
      responseType: 'blob',
    })

    const contentDisposition = response.headers['content-disposition'] as string | undefined
    const filename = filenameFromContentDisposition(
      contentDisposition,
      `${domain}-report.${format === 'xlsx' ? 'xlsx' : format}`,
    )

    return {
      blob: response.data,
      filename,
      jobId: null,
    }
  },
}
