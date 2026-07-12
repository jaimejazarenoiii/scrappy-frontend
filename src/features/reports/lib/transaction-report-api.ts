import { asDateString, asNullableNumber, asNullableString, asRecord, asString } from './report-api'
import type { TransactionReportRow } from '../types/reports.types'

export function normalizeTransactionReportRow(raw: unknown): TransactionReportRow {
  const row = asRecord(raw)
  const location = asRecord(row.location)
  const assigned = Array.isArray(row.assignedEmployees)
    ? row.assignedEmployees.filter((name): name is string => typeof name === 'string')
    : []

  return {
    id: asString(row.transactionId ?? row.id),
    date: asDateString(row.transactionDate ?? row.date),
    transactionNumber: asNullableString(row.transactionNumber ?? row.number),
    type: asNullableString(row.direction ?? row.type ?? row.transactionType),
    status: asNullableString(row.status),
    partyName: asNullableString(row.partyName),
    totalAmount: asNullableNumber(row.grandTotal ?? row.totalAmount ?? row.amount),
    employeeName:
      assigned.length > 0
        ? assigned.join(', ')
        : asNullableString(row.employeeName ?? row.employee),
    branchName: asNullableString(location.label ?? row.branchName ?? row.branch),
    warehouseName: asNullableString(row.warehouseName ?? row.warehouse),
  }
}
