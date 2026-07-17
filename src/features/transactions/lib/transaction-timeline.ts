import type { SettlementTimelineEvent, TransactionDetail } from '../types/transaction.types'

/** Builds a chronological settlement timeline from authoritative transaction lifecycle fields. */
export function buildSettlementTimeline(
  transaction: TransactionDetail,
  history?: SettlementTimelineEvent[],
): SettlementTimelineEvent[] {
  if (history?.length) {
    return [...history].sort(
      (a, b) => new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime(),
    )
  }

  const events: SettlementTimelineEvent[] = []

  if (transaction.submittedAt) {
    events.push({
      id: 'submitted',
      action: 'READY_FOR_PAYMENT',
      actionLabel: 'Ready for payment',
      actorUserId: transaction.submittedByUserId,
      actorDisplayName: null,
      occurredAt: transaction.submittedAt,
      notes: null,
    })
  }

  if (transaction.paidAt) {
    events.push({
      id: 'paid',
      action: 'PAID',
      actionLabel: 'Paid',
      actorUserId: transaction.paidByUserId,
      actorDisplayName: null,
      occurredAt: transaction.paidAt,
      notes: null,
    })
  }

  if (transaction.cancelledAt) {
    events.push({
      id: 'cancelled',
      action: 'CANCELLED',
      actionLabel: 'Cancelled',
      actorUserId: transaction.cancelledByUserId,
      actorDisplayName: null,
      occurredAt: transaction.cancelledAt,
      notes: transaction.cancellationReason,
    })
  }

  if (transaction.reopenedAt) {
    events.push({
      id: 'reopened',
      action: 'REOPENED',
      actionLabel: 'Reopened',
      actorUserId: transaction.reopenedByUserId,
      actorDisplayName: null,
      occurredAt: transaction.reopenedAt,
      notes: transaction.reopenReason,
    })
  }

  return events.sort((a, b) => new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime())
}
