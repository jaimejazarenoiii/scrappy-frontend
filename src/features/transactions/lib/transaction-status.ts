import type { StatusTone } from '@/components/common/StatusBadge'

import type { TransactionStatus } from '../types/transaction.types'

export function transactionStatusLabel(status: TransactionStatus): string {
  switch (status) {
    case 'DRAFT':
      return 'Draft'
    case 'CANCELLED':
      return 'Cancelled'
    default:
      return String(status)
  }
}

export function transactionStatusTone(status: TransactionStatus): StatusTone {
  switch (status) {
    case 'DRAFT':
      return 'neutral'
    case 'CANCELLED':
      return 'inactive'
    default:
      return 'neutral'
  }
}
