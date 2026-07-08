import type { StatusTone } from '@/components/common/StatusBadge'

import type { CashAdvanceStatus } from '../types/cash-advance.types'

export function cashAdvanceStatusLabel(status: CashAdvanceStatus): string {
  const labels: Record<CashAdvanceStatus, string> = {
    OUTSTANDING: 'Outstanding',
    SETTLED: 'Settled',
  }
  return labels[status]
}

export function cashAdvanceStatusTone(status: CashAdvanceStatus): StatusTone {
  switch (status) {
    case 'OUTSTANDING':
      return 'neutral'
    case 'SETTLED':
      return 'active'
    default:
      return 'neutral'
  }
}
