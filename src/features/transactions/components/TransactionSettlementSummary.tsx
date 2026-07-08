import { DescriptionItem, DescriptionList } from '@/components/common/DescriptionList'
import { formatDate } from '@/utils/format-date'

import { TransactionDirectionBadge } from './TransactionDirectionBadge'
import { formatTransactionParty } from '../lib/transaction-format'
import { isPaidStatus } from '../lib/transaction-settlement'
import type { TransactionDetail } from '../types/transaction.types'

function formatActorLabel(userId: string | null): string {
  if (!userId) return '—'
  return `User ${userId.slice(0, 8)}…`
}

interface TransactionSettlementSummaryProps {
  transaction: TransactionDetail
}

export function TransactionSettlementSummary({ transaction }: TransactionSettlementSummaryProps) {
  return (
    <DescriptionList>
      <DescriptionItem label="Transaction number">
        {transaction.transactionNumber ?? '—'}
      </DescriptionItem>
      <DescriptionItem label="Type">
        <TransactionDirectionBadge direction={transaction.direction} />
      </DescriptionItem>
      <DescriptionItem label="Party">{formatTransactionParty(transaction)}</DescriptionItem>
      <DescriptionItem label="Transaction date">
        {formatDate(transaction.transactionDate)}
      </DescriptionItem>
      <DescriptionItem label="Total amount">
        <span className="font-medium tabular-nums">{transaction.totalAmount.toFixed(2)}</span>
      </DescriptionItem>
      {transaction.submittedAt ? (
        <DescriptionItem label="Submitted">
          {formatDate(transaction.submittedAt)}
          {transaction.submittedByUserId
            ? ` · ${formatActorLabel(transaction.submittedByUserId)}`
            : null}
        </DescriptionItem>
      ) : null}
      {isPaidStatus(transaction.status) ? (
        <>
          <DescriptionItem label="Paid at">
            {transaction.paidAt ? formatDate(transaction.paidAt) : '—'}
          </DescriptionItem>
          <DescriptionItem label="Paid by">
            {formatActorLabel(transaction.paidByUserId)}
          </DescriptionItem>
        </>
      ) : null}
      {transaction.cancellationReason ? (
        <DescriptionItem label="Cancellation reason">
          {transaction.cancellationReason}
        </DescriptionItem>
      ) : null}
      {transaction.reopenReason ? (
        <DescriptionItem label="Reopen reason">{transaction.reopenReason}</DescriptionItem>
      ) : null}
    </DescriptionList>
  )
}
