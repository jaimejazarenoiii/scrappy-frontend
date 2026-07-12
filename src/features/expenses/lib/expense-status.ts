import type { StatusTone } from '@/components/common/StatusBadge'

import type { ExpenseStatus } from '../types/expense.types'

const EXPENSE_STATUS_LABELS: Record<ExpenseStatus, string> = {
  ACTIVE: 'Active',
  ARCHIVED: 'Archived',
}

const EXPENSE_STATUS_TONES: Record<ExpenseStatus, StatusTone> = {
  ACTIVE: 'active',
  ARCHIVED: 'inactive',
}

export function expenseStatusLabel(status: ExpenseStatus): string {
  return EXPENSE_STATUS_LABELS[status]
}

export function formatExpenseStatusLabel(status: string): string {
  if (status in EXPENSE_STATUS_LABELS) {
    return EXPENSE_STATUS_LABELS[status as ExpenseStatus]
  }
  return status.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

export function expenseStatusTone(status: ExpenseStatus): StatusTone {
  return EXPENSE_STATUS_TONES[status]
}

export function isEditableExpenseStatus(status: string): boolean {
  return status === 'ACTIVE'
}

export const EXPENSE_STATUS_OPTIONS: ExpenseStatus[] = ['ACTIVE', 'ARCHIVED']
