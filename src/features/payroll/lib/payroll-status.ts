import type { StatusTone } from '@/components/common/StatusBadge'

import type { PayrollStatus } from '../types/payroll.types'

export function payrollStatusLabel(status: PayrollStatus): string {
  const labels: Record<PayrollStatus, string> = {
    PAYABLE: 'Payable',
    PAID: 'Paid',
  }
  return labels[status]
}

export function payrollStatusTone(status: PayrollStatus): StatusTone {
  switch (status) {
    case 'PAYABLE':
      return 'neutral'
    case 'PAID':
      return 'active'
    default:
      return 'neutral'
  }
}
