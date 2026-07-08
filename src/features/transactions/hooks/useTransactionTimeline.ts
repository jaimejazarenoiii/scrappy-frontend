import { useMemo } from 'react'

import { buildSettlementTimeline } from '../lib/transaction-timeline'
import { useTransaction } from './useTransaction'

export function useTransactionTimeline(transactionId: string | undefined) {
  const transactionQuery = useTransaction(transactionId)

  const events = useMemo(() => {
    if (!transactionQuery.data) return []
    return buildSettlementTimeline(transactionQuery.data)
  }, [transactionQuery.data])

  return {
    events,
    isLoading: transactionQuery.isLoading,
    isError: transactionQuery.isError,
    refetch: transactionQuery.refetch,
  }
}
