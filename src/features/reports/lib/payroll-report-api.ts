import { asNullableNumber, asNullableString, asRecord, asString } from './report-api'
import type { PayrollReportRow } from '../types/reports.types'

export function normalizePayrollReportRow(raw: unknown): PayrollReportRow {
  const row = asRecord(raw)
  const employee = asRecord(row.employee)
  const start = asNullableString(row.payPeriodStart)
  const end = asNullableString(row.payPeriodEnd)
  const period =
    start && end
      ? `${start} – ${end}`
      : asNullableString(row.period ?? row.payrollPeriod ?? start ?? end)

  return {
    id: asString(row.payrollId ?? row.id),
    period,
    employeeId: asNullableString(employee.id ?? row.employeeId),
    employeeName: asNullableString(employee.displayName ?? row.employeeName ?? row.employee),
    gross: asNullableNumber(row.salary ?? row.gross ?? row.totalGross),
    net: asNullableNumber(row.totalAmount ?? row.net ?? row.netPay ?? row.totalNet),
    status: asNullableString(row.status),
  }
}
