import type { Direction } from '../types/transaction.types'

import { StatusBadge } from '@/components/common/StatusBadge'
import { transactionDirectionLabel } from '../lib/transaction-direction'

export function TransactionDirectionBadge({ direction }: { direction: Direction }) {
  return (
    <StatusBadge
      label={transactionDirectionLabel(direction)}
      tone="neutral"
      className="capitalize"
    />
  )
}
