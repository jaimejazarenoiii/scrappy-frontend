import type { StatusTone } from '@/components/common/StatusBadge'
import type { UserRole } from '@/features/auth/types/auth.types'

import type { ExpenseStatus } from '../types/expense.types'

const EXPENSE_STATUS_LABELS: Record<ExpenseStatus, string> = {
  DRAFT: 'Draft',
  RECORDED: 'Recorded',
  CANCELLED: 'Cancelled',
}

const EXPENSE_STATUS_TONES: Record<ExpenseStatus, StatusTone> = {
  DRAFT: 'neutral',
  RECORDED: 'active',
  CANCELLED: 'inactive',
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

/** Draft always editable; managers/owners may also edit recorded. */
export function isEditableExpenseStatus(status: string, role?: UserRole | null): boolean {
  if (status === 'DRAFT') return true
  if (status === 'RECORDED') return role === 'OWNER' || role === 'MANAGER'
  return false
}

export function canRecordExpense(status: string): boolean {
  return status === 'DRAFT'
}

export function canCancelExpense(status: string, role?: UserRole | null): boolean {
  if (status === 'DRAFT') return true
  if (status === 'RECORDED') return role === 'OWNER' || role === 'MANAGER'
  return false
}

export function canArchiveExpense(status: string): boolean {
  return status === 'RECORDED' || status === 'CANCELLED'
}

export const EXPENSE_STATUS_OPTIONS: ExpenseStatus[] = ['DRAFT', 'RECORDED', 'CANCELLED']
