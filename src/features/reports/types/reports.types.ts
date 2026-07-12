export type ReportDomain = 'transactions' | 'trips' | 'expenses' | 'payroll' | 'attendance'

export type ReportExportFormat = 'csv' | 'xlsx' | 'pdf'

export type ReportSortDirection = 'asc' | 'desc'

export interface ReportFilterSet {
  from: string
  to: string
  branchId: string | null
  warehouseId: string | null
  vehicleId: string | null
  employeeId: string | null
  tripId: string | null
  includeArchived: boolean
  search: string | null
  transactionType: string | null
  expenseCategory: string | null
  payrollPeriod: string | null
  tripStatus: string | null
  page: number
  pageSize: number
  sortField: string | null
  sortDirection: ReportSortDirection
}

export type ReportSummary = Record<string, string | number | boolean | null>

export interface ReportListResponse<TRow> {
  data: TRow[]
  total: number
  page: number
  pageSize: number
  generatedAt: string | null
  appliedCriteria: Record<string, unknown> | null
  summary: ReportSummary | null
}

export interface TransactionReportRow {
  id: string
  date: string
  transactionNumber: string | null
  type: string | null
  status: string | null
  partyName: string | null
  totalAmount: number | null
  employeeName: string | null
  branchName: string | null
  warehouseName: string | null
}

export interface TripReportRow {
  id: string
  tripNumber: string | null
  date: string
  status: string | null
  vehicleId: string | null
  vehiclePlate: string | null
  employeeId: string | null
  employeeName: string | null
  origin: string | null
  destination: string | null
  durationMinutes: number | null
}

export interface ExpenseReportRow {
  id: string
  date: string
  description: string
  amount: number
  category: string | null
  expenseNumber: string | null
  referenceType: string | null
  referenceId: string | null
  referenceLabel: string | null
  status: string | null
  notes: string | null
  branchId: string | null
  warehouseId: string | null
  vehicleId: string | null
  employeeId: string | null
  tripId: string | null
}

export interface PayrollReportRow {
  id: string
  period: string | null
  employeeId: string | null
  employeeName: string | null
  gross: number | null
  net: number | null
  status: string | null
}

export interface AttendanceReportRow {
  id: string
  date: string
  employeeId: string | null
  employeeName: string | null
  timeIn: string | null
  timeOut: string | null
  status: string | null
}

export interface ReportExportResult {
  blob: Blob
  filename: string
  jobId: string | null
}

export type ReportFilterExtraKey =
  'transactionType' | 'expenseCategory' | 'payrollPeriod' | 'tripStatus'

export const DEFAULT_PAGE_SIZE = 20

export function defaultReportDateRange(): { from: string; to: string } {
  const now = new Date()
  const from = new Date(now.getFullYear(), now.getMonth(), 1)
  return {
    from: from.toISOString().slice(0, 10),
    to: now.toISOString().slice(0, 10),
  }
}

export function createDefaultReportFilters(): ReportFilterSet {
  const range = defaultReportDateRange()
  return {
    from: range.from,
    to: range.to,
    branchId: null,
    warehouseId: null,
    vehicleId: null,
    employeeId: null,
    tripId: null,
    includeArchived: false,
    search: null,
    transactionType: null,
    expenseCategory: null,
    payrollPeriod: null,
    tripStatus: null,
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    sortField: 'transactionDate',
    sortDirection: 'desc',
  }
}

export const REPORT_EXPORT_FORMATS: {
  format: ReportExportFormat
  label: string
  enabled: boolean
}[] = [
  { format: 'csv', label: 'Export CSV', enabled: true },
  { format: 'xlsx', label: 'Export Excel', enabled: true },
  { format: 'pdf', label: 'Export PDF', enabled: false },
]
