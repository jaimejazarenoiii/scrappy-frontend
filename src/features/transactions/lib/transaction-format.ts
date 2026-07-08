import { formatDate } from '@/utils/format-date'

import type { Direction, DirectionLabel } from '../types/transaction.types'
import { transactionDirectionLabel } from './transaction-direction'

interface TransactionLike {
  direction?: Direction | null
  directionLabel?: DirectionLabel | null
  partyName?: string | null
  transactionDate?: string | null
}

export function formatTransactionParty(tx?: TransactionLike | null): string {
  return tx?.partyName?.trim() ? tx.partyName : 'Details'
}

export function formatTransactionDate(tx?: TransactionLike | null): string | undefined {
  const date = tx?.transactionDate
  if (!date) return undefined
  return formatDate(date)
}

export function formatTransactionDirection(tx?: TransactionLike | null): string | undefined {
  if (!tx) return undefined

  if (tx.direction) return transactionDirectionLabel(tx.direction)

  if (tx.directionLabel) {
    const inferredDirection: Direction = tx.directionLabel === 'BUY' ? 'INBOUND' : 'OUTBOUND'
    return transactionDirectionLabel(inferredDirection)
  }

  return undefined
}

export function formatTransactionDirectionAndParty(tx?: TransactionLike | null): string {
  const direction = formatTransactionDirection(tx)
  const party = formatTransactionParty(tx)
  return direction ? `${direction} · ${party}` : party
}
