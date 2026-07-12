import { TransactionService } from '@/features/transactions/services/transaction.service'
import type { TransactionSummary } from '@/features/transactions/types/transaction.types'

import { TripService } from '../services/trip.service'
import type { LinkedTransactionSummary } from '../types/trip.types'

function toLinkedTransactionSummary(transaction: TransactionSummary): LinkedTransactionSummary {
  return {
    id: transaction.id,
    transactionNumber: transaction.transactionNumber,
    direction: transaction.direction,
    directionLabel: transaction.directionLabel,
    status: transaction.status,
    partyName: transaction.partyName,
    transactionDate: transaction.transactionDate,
    totalAmount: transaction.totalAmount,
    locationType: transaction.locationType,
  }
}

function isNotFoundError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    (error as { status: number }).status === 404
  )
}

/** Loads transactions linked via `transaction.tripId` (location type TRIP). */
export async function fetchTripLinkedTransactions(
  tripId: string,
): Promise<LinkedTransactionSummary[]> {
  try {
    return await TripService.listLinkedTransactions(tripId)
  } catch (error) {
    if (!isNotFoundError(error)) {
      throw error
    }
  }

  const page = await TransactionService.list({
    tripId,
    locationType: 'TRIP',
    limit: 100,
  })

  return page.data.map(toLinkedTransactionSummary)
}
