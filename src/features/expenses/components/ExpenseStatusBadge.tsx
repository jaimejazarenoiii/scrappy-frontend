import { StatusBadge } from '@/components/common/StatusBadge'

import {
  expenseStatusLabel,
  expenseStatusTone,
  formatExpenseStatusLabel,
} from '../lib/expense-status'
import type { ExpenseStatus } from '../types/expense.types'

interface ExpenseStatusBadgeProps {
  status: string
}

const KNOWN_STATUSES = new Set<ExpenseStatus>(['DRAFT', 'RECORDED', 'CANCELLED'])

export function ExpenseStatusBadge({ status }: ExpenseStatusBadgeProps) {
  if (KNOWN_STATUSES.has(status as ExpenseStatus)) {
    const knownStatus = status as ExpenseStatus
    return (
      <StatusBadge label={expenseStatusLabel(knownStatus)} tone={expenseStatusTone(knownStatus)} />
    )
  }

  return <StatusBadge label={formatExpenseStatusLabel(status)} tone="neutral" />
}
