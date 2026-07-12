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

export function ExpenseStatusBadge({ status }: ExpenseStatusBadgeProps) {
  const knownStatus = status as ExpenseStatus
  const label =
    status === 'ACTIVE' || status === 'ARCHIVED'
      ? expenseStatusLabel(knownStatus)
      : formatExpenseStatusLabel(status)
  const tone =
    status === 'ACTIVE' || status === 'ARCHIVED' ? expenseStatusTone(knownStatus) : 'neutral'

  return <StatusBadge label={label} tone={tone} />
}
