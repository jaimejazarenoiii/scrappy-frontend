import type {
  AnalyticsFilterSet,
  AnalyticsMetadata,
  AttendanceSummary,
  CashAdvanceSummary,
  CategoryBreakdown,
  CompanyAnalytics,
  ContextBreakdown,
  EmployeeActivityRow,
  EntityRankingRow,
  ExpenseAnalytics,
  LeaveSummary,
  LocationPerformanceRow,
  OrganizationAnalytics,
  PayrollSummary,
  RankingRow,
  StatusBreakdown,
  TimeSeriesPoint,
  TransactionAnalytics,
  TripAnalytics,
  VehicleUtilizationRow,
  WorkforceAnalytics,
} from '../types/analytics.types'

function asNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return fallback
}

function asNullableNumber(value: unknown): number | null {
  if (value == null) return null
  const num = asNumber(value, Number.NaN)
  return Number.isFinite(num) ? num : null
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

function asNullableString(value: unknown): string | null {
  return typeof value === 'string' ? value : null
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : []
}

function normalizeMetadata(raw: Record<string, unknown>): AnalyticsMetadata {
  return {
    appliedFilters: asRecord(raw.appliedFilters),
    generatedAt: asString(raw.generatedAt),
  }
}

function normalizeRankingRow(raw: Record<string, unknown>): RankingRow {
  return {
    materialName: asString(raw.materialName ?? raw.label, 'Unknown'),
    totalAmount: asNumber(raw.totalAmount ?? raw.value),
    count: asNumber(raw.count),
  }
}

function normalizeEntityRankingRow(raw: Record<string, unknown>): EntityRankingRow {
  const unit = asNullableString(raw.unit)
  const value = asNumber(raw.value)
  return {
    id: asString(raw.id),
    displayName: asString(raw.displayName ?? raw.label, 'Unknown'),
    count: asNumber(raw.count ?? (unit === 'count' || unit == null ? value : 0)),
    totalAmount: asNumber(raw.totalAmount ?? (unit === 'PHP' ? value : 0)),
  }
}

function normalizeCategoryBreakdown(raw: Record<string, unknown>): CategoryBreakdown {
  return {
    category: asString(raw.category ?? raw.label, 'Uncategorized'),
    amount: asNumber(raw.amount ?? raw.value),
    count: asNumber(raw.count),
    percentage: asNullableNumber(raw.percentage),
  }
}

function normalizeContextBreakdown(raw: Record<string, unknown>): ContextBreakdown {
  return {
    contextType: asString(raw.contextType, 'UNKNOWN'),
    amount: asNumber(raw.amount),
    count: asNumber(raw.count),
  }
}

function normalizeStatusBreakdown(raw: Record<string, unknown>): StatusBreakdown {
  return {
    status: asString(raw.status, 'UNKNOWN'),
    count: asNumber(raw.count),
    amount: asNullableNumber(raw.amount),
  }
}

function normalizeTimeSeriesPoint(raw: Record<string, unknown>): TimeSeriesPoint {
  return {
    date: asString(raw.date),
    value: asNumber(raw.value),
    label: asNullableString(raw.label),
  }
}

function normalizeVehicleUtilizationRow(raw: Record<string, unknown>): VehicleUtilizationRow {
  return {
    vehicleId: asString(raw.vehicleId ?? raw.id),
    plateNumber: asString(raw.plateNumber ?? raw.label, 'Unknown'),
    tripCount: asNumber(raw.tripCount ?? raw.value),
    utilizationRate: asNullableNumber(raw.utilizationRate),
  }
}

function normalizeLocationPerformanceRow(raw: Record<string, unknown>): LocationPerformanceRow {
  return {
    id: asString(raw.id),
    name: asString(raw.name, 'Unknown'),
    transactionAmount: asNumber(raw.transactionAmount),
    expenseAmount: asNumber(raw.expenseAmount),
    tripCount: asNullableNumber(raw.tripCount),
  }
}

function normalizeAttendanceSummary(raw: Record<string, unknown>): AttendanceSummary {
  return {
    present: asNumber(raw.present ?? raw.sessionsCount),
    late: asNumber(raw.late),
    absent: asNumber(raw.absent),
    onLeave: asNumber(raw.onLeave),
  }
}

function normalizePayrollSummary(raw: Record<string, unknown>): PayrollSummary {
  return {
    totalGross: asNumber(raw.totalGross),
    totalNet: asNumber(raw.totalNet ?? raw.totalNetPay),
    paidCount: asNumber(raw.paidCount ?? raw.recordsCount),
    payableCount: asNumber(raw.payableCount),
  }
}

function normalizeLeaveSummary(raw: Record<string, unknown>): LeaveSummary {
  return {
    pending: asNumber(raw.pending ?? raw.pendingCount),
    approved: asNumber(raw.approved ?? raw.approvedDays),
    rejected: asNumber(raw.rejected ?? raw.rejectedCount),
  }
}

function normalizeCashAdvanceSummary(raw: Record<string, unknown>): CashAdvanceSummary {
  return {
    outstandingAmount: asNumber(raw.outstandingAmount ?? raw.outstandingTotal),
    outstandingCount: asNumber(raw.outstandingCount ?? raw.outstandingRecords),
  }
}

function normalizeEmployeeActivityRow(raw: Record<string, unknown>): EmployeeActivityRow {
  return {
    employeeId: asString(raw.employeeId),
    displayName: asString(raw.displayName, 'Unknown'),
    attendanceRate: asNullableNumber(raw.attendanceRate),
    transactionsProcessed: asNumber(raw.transactionsProcessed),
    tripsCompleted: asNumber(raw.tripsCompleted),
  }
}

export function buildAnalyticsQueryParams(
  filters: AnalyticsFilterSet,
): Record<string, string | number | boolean> {
  const params: Record<string, string | number | boolean> = {
    period: filters.period,
    includeArchived: filters.includeArchived,
    limit: filters.limit,
  }

  if (filters.period === 'CUSTOM') {
    if (filters.from) params.from = filters.from
    if (filters.to) params.to = filters.to
  }

  if (filters.branchId) params.branchId = filters.branchId
  if (filters.warehouseId) params.warehouseId = filters.warehouseId
  if (filters.vehicleId) params.vehicleId = filters.vehicleId
  if (filters.employeeId) params.employeeId = filters.employeeId

  return params
}

export function normalizeCompanyAnalytics(raw: Record<string, unknown>): CompanyAnalytics {
  return {
    ...normalizeMetadata(raw),
    inboundTransactionCount: asNumber(raw.inboundTransactionCount ?? raw.totalInboundTransactions),
    outboundTransactionCount: asNumber(
      raw.outboundTransactionCount ?? raw.totalOutboundTransactions,
    ),
    totalTransactionAmount: asNumber(raw.totalTransactionAmount),
    totalExpenses: asNumber(raw.totalExpenses),
    totalPayroll: asNumber(raw.totalPayroll),
    netOperationalAmount: asNumber(raw.netOperationalAmount),
    activeEmployeeCount: asNumber(raw.activeEmployeeCount ?? raw.activeEmployees),
    activeTripCount: asNumber(raw.activeTripCount ?? raw.activeTrips),
    activeVehicleCount: asNumber(raw.activeVehicleCount ?? raw.activeVehicles),
  }
}

export function normalizeTransactionAnalytics(raw: Record<string, unknown>): TransactionAnalytics {
  return {
    ...normalizeMetadata(raw),
    inboundCount: asNumber(raw.inboundCount ?? raw.totalInbound),
    outboundCount: asNumber(raw.outboundCount ?? raw.totalOutbound),
    transactionCount: asNumber(raw.transactionCount),
    totalAmount: asNumber(raw.totalAmount ?? raw.totalTransactionAmount),
    averageValue: asNumber(raw.averageValue ?? raw.averageTransactionValue),
    topMaterials: asArray<Record<string, unknown>>(raw.topMaterials).map(normalizeRankingRow),
    mostActiveEmployees: asArray<Record<string, unknown>>(raw.mostActiveEmployees).map(
      normalizeEntityRankingRow,
    ),
    mostActiveBranches: asArray<Record<string, unknown>>(raw.mostActiveBranches).map(
      normalizeEntityRankingRow,
    ),
    mostActiveWarehouses: asArray<Record<string, unknown>>(raw.mostActiveWarehouses).map(
      normalizeEntityRankingRow,
    ),
    timeSeries: asArray<Record<string, unknown>>(raw.timeSeries).map(normalizeTimeSeriesPoint),
  }
}

export function normalizeExpenseAnalytics(raw: Record<string, unknown>): ExpenseAnalytics {
  const byCategory = asArray<Record<string, unknown>>(raw.byCategory ?? raw.expensesByCategory).map(
    normalizeCategoryBreakdown,
  )

  const monthlyTrend = asArray<Record<string, unknown>>(
    raw.timeSeries ?? raw.monthlyExpenseTrend,
  ).map((point) =>
    normalizeTimeSeriesPoint({
      date: point.date ?? point.month,
      value: point.value ?? point.amount,
      label: point.label ?? point.month ?? point.date,
    }),
  )

  return {
    ...normalizeMetadata(raw),
    expenseCount: asNumber(raw.expenseCount ?? byCategory.reduce((sum, row) => sum + row.count, 0)),
    totalAmount: asNumber(raw.totalAmount ?? raw.totalExpenses),
    byCategory,
    byContextType: asArray<Record<string, unknown>>(raw.byContextType).map(
      normalizeContextBreakdown,
    ),
    byStatus: asArray<Record<string, unknown>>(raw.byStatus).map(normalizeStatusBreakdown),
    timeSeries: monthlyTrend,
  }
}

export function normalizeWorkforceAnalytics(raw: Record<string, unknown>): WorkforceAnalytics {
  return {
    ...normalizeMetadata(raw),
    attendanceSummary: normalizeAttendanceSummary(asRecord(raw.attendanceSummary)),
    payrollSummary: normalizePayrollSummary(asRecord(raw.payrollSummary)),
    leaveSummary: normalizeLeaveSummary(asRecord(raw.leaveSummary)),
    cashAdvanceSummary: normalizeCashAdvanceSummary(asRecord(raw.cashAdvanceSummary)),
    employeeActivity: asArray<Record<string, unknown>>(raw.employeeActivity).map(
      normalizeEmployeeActivityRow,
    ),
  }
}

export function normalizeTripAnalytics(raw: Record<string, unknown>): TripAnalytics {
  const tripCount = asNumber(raw.tripCount ?? raw.totalTrips)
  const completedCount = asNumber(raw.completedCount ?? raw.completedTrips)
  const cancelledCount = asNumber(raw.cancelledCount ?? raw.cancelledTrips)
  const startedCount = asNullableNumber(raw.startedCount ?? raw.activeTrips)

  const statusDistributionRaw = asArray<Record<string, unknown>>(raw.statusDistribution)
  const statusDistribution =
    statusDistributionRaw.length > 0
      ? statusDistributionRaw.map(normalizeStatusBreakdown)
      : [
          { status: 'Completed', count: completedCount },
          { status: 'Started', count: startedCount ?? 0 },
          { status: 'Cancelled', count: cancelledCount },
        ].filter((row) => row.count > 0)

  return {
    ...normalizeMetadata(raw),
    tripCount,
    completedCount,
    cancelledCount,
    startedCount,
    averageDurationMinutes: asNullableNumber(
      raw.averageDurationMinutes ?? raw.averageTripDurationMinutes,
    ),
    statusDistribution,
    vehicleUtilization: asArray<Record<string, unknown>>(
      raw.vehicleUtilization ?? raw.mostActiveVehicles,
    ).map(normalizeVehicleUtilizationRow),
  }
}

export function normalizeOrganizationAnalytics(
  raw: Record<string, unknown>,
): OrganizationAnalytics {
  return {
    ...normalizeMetadata(raw),
    branchPerformance: asArray<Record<string, unknown>>(raw.branchPerformance).map(
      normalizeLocationPerformanceRow,
    ),
    warehousePerformance: asArray<Record<string, unknown>>(raw.warehousePerformance).map(
      normalizeLocationPerformanceRow,
    ),
    vehicleUtilization: asArray<Record<string, unknown>>(raw.vehicleUtilization).map(
      normalizeVehicleUtilizationRow,
    ),
  }
}
