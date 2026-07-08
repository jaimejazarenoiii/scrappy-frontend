import type { TransactionStatus } from '../types/transaction.types'

import { StatusBadge } from '@/components/common/StatusBadge'
import { transactionStatusLabel, transactionStatusTone } from '../lib/transaction-status'

export function TransactionStatusBadge({ status }: { status: TransactionStatus }) {
  return <StatusBadge label={transactionStatusLabel(status)} tone={transactionStatusTone(status)} />
}
