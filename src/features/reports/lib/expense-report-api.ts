import { asDateString, asNullableString, asNumber, asRecord, asString } from './report-api'
import type { ExpenseReportRow } from '../types/reports.types'

/** Ported from Spec 008 expense-report-api — Reports module owns this surface. */
export function normalizeExpenseReportRow(raw: unknown): ExpenseReportRow {
  const row = asRecord(raw)
  const category = asNullableString(row.category ?? row.categoryName)
  const reference = asNullableString(row.reference ?? row.referenceLabel)

  return {
    id: asString(row.expenseId ?? row.id),
    date: asDateString(row.date ?? row.expenseDate),
    description: asString(row.description ?? category ?? reference ?? 'Expense'),
    amount: asNumber(row.amount),
    category,
    expenseNumber: asNullableString(row.expenseNumber),
    referenceType: asNullableString(row.referenceType),
    referenceId: asNullableString(row.referenceId),
    referenceLabel: reference,
    status: asNullableString(row.status),
    notes: asNullableString(row.notes ?? row.addedBy),
    branchId: asNullableString(row.branchId),
    warehouseId: asNullableString(row.warehouseId),
    vehicleId: asNullableString(row.vehicleId),
    employeeId: asNullableString(row.employeeId),
    tripId: asNullableString(row.tripId),
  }
}
