export type AnalyticsPeriodPreset =
  'TODAY' | 'YESTERDAY' | 'THIS_WEEK' | 'THIS_MONTH' | 'THIS_YEAR' | 'CUSTOM'

export interface AnalyticsFilterSet {
  period: AnalyticsPeriodPreset
  from: string | null
  to: string | null
  branchId: string | null
  warehouseId: string | null
  vehicleId: string | null
  employeeId: string | null
  includeArchived: boolean
  limit: number
}

export interface AnalyticsMetadata {
  appliedFilters: Record<string, unknown>
  generatedAt: string
}

export interface RankingRow {
  materialName: string
  totalAmount: number
  count: number
}

export interface EntityRankingRow {
  id: string
  displayName: string
  count: number
  totalAmount: number
}

export interface CategoryBreakdown {
  category: string
  amount: number
  count: number
  percentage: number | null
}

export interface ContextBreakdown {
  contextType: string
  amount: number
  count: number
}

export interface StatusBreakdown {
  status: string
  count: number
  amount?: number | null
}

export interface TimeSeriesPoint {
  date: string
  value: number
  label: string | null
}

export interface VehicleUtilizationRow {
  vehicleId: string
  plateNumber: string
  tripCount: number
  utilizationRate: number | null
}

export interface LocationPerformanceRow {
  id: string
  name: string
  transactionAmount: number
  expenseAmount: number
  tripCount: number | null
}

export interface AttendanceSummary {
  present: number
  late: number
  absent: number
  onLeave: number
}

export interface PayrollSummary {
  totalGross: number
  totalNet: number
  paidCount: number
  payableCount: number
}

export interface LeaveSummary {
  pending: number
  approved: number
  rejected: number
}

export interface CashAdvanceSummary {
  outstandingAmount: number
  outstandingCount: number
}

export interface EmployeeActivityRow {
  employeeId: string
  displayName: string
  attendanceRate: number | null
  transactionsProcessed: number
  tripsCompleted: number
}

export interface CompanyAnalytics extends AnalyticsMetadata {
  inboundTransactionCount: number
  outboundTransactionCount: number
  totalTransactionAmount: number
  /** Money paid out buying scrap (inbound transactions). */
  inboundAmount: number
  /** Money received selling scrap (outbound transactions). */
  outboundAmount: number
  totalExpenses: number
  totalPayroll: number
  netOperationalAmount: number
  activeEmployeeCount: number
  activeTripCount: number
  activeVehicleCount: number
}

export interface TransactionAnalytics extends AnalyticsMetadata {
  /** Backend `totalInbound` — transaction count, not amount. */
  inboundCount: number
  /** Backend `totalOutbound` — transaction count, not amount. */
  outboundCount: number
  transactionCount: number
  totalAmount: number
  /** Money paid out buying scrap (inbound transactions). */
  inboundAmount: number
  /** Money received selling scrap (outbound transactions). */
  outboundAmount: number
  averageValue: number
  topMaterials: RankingRow[]
  mostActiveEmployees: EntityRankingRow[]
  mostActiveBranches: EntityRankingRow[]
  mostActiveWarehouses: EntityRankingRow[]
  timeSeries: TimeSeriesPoint[]
}

export interface ExpenseAnalytics extends AnalyticsMetadata {
  expenseCount: number
  totalAmount: number
  byCategory: CategoryBreakdown[]
  byContextType: ContextBreakdown[]
  byStatus: StatusBreakdown[]
  timeSeries: TimeSeriesPoint[]
}

export interface WorkforceAnalytics extends AnalyticsMetadata {
  attendanceSummary: AttendanceSummary
  payrollSummary: PayrollSummary
  leaveSummary: LeaveSummary
  cashAdvanceSummary: CashAdvanceSummary
  employeeActivity: EmployeeActivityRow[]
}

export interface TripAnalytics extends AnalyticsMetadata {
  tripCount: number
  completedCount: number
  cancelledCount: number
  startedCount: number | null
  averageDurationMinutes: number | null
  statusDistribution: StatusBreakdown[]
  vehicleUtilization: VehicleUtilizationRow[]
}

export interface OrganizationAnalytics extends AnalyticsMetadata {
  branchPerformance: LocationPerformanceRow[]
  warehousePerformance: LocationPerformanceRow[]
  vehicleUtilization: VehicleUtilizationRow[]
}

export type AnalyticsChartKind = 'line' | 'bar' | 'area' | 'pie' | 'donut'

export type AnalyticsTabId =
  'overview' | 'transactions' | 'expenses' | 'workforce' | 'trips' | 'organization'

export const ANALYTICS_TABS: { id: AnalyticsTabId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'expenses', label: 'Expenses' },
  { id: 'workforce', label: 'Workforce' },
  { id: 'trips', label: 'Trips' },
  { id: 'organization', label: 'Organization' },
]

export const DEFAULT_ANALYTICS_FILTERS: AnalyticsFilterSet = {
  period: 'THIS_MONTH',
  from: null,
  to: null,
  branchId: null,
  warehouseId: null,
  vehicleId: null,
  employeeId: null,
  includeArchived: false,
  limit: 10,
}
