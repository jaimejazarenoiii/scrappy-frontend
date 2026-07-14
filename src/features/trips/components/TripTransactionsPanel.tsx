import { Receipt } from 'lucide-react'
import { Link } from 'react-router'

import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { buildRoute } from '@/constants/routes'
import { TransactionDirectionBadge } from '@/features/transactions/components/TransactionDirectionBadge'
import { TransactionStatusBadge } from '@/features/transactions/components/TransactionStatusBadge'
import { formatDateTime } from '@/utils/format-date'

import { useTripTransactions } from '../hooks/useTripTransactions'
import type { TripDetail } from '../types/trip.types'

interface TripTransactionsPanelProps {
  trip: TripDetail
}

export function TripTransactionsPanel({ trip }: TripTransactionsPanelProps) {
  const transactionsQuery = useTripTransactions(trip.id, trip)

  const transactions = transactionsQuery.data ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Linked transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {transactionsQuery.isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full rounded-md" />
            ))}
          </div>
        ) : transactionsQuery.isError ? (
          <ErrorState title="Could not load transactions" description="Please try again." />
        ) : transactions.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="No transactions linked"
            description="Transactions are linked when created with location type Trip."
          />
        ) : (
          <ul className="divide-y rounded-md border">
            {transactions.map((transaction) => (
              <li
                key={transaction.id}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <TransactionDirectionBadge direction={transaction.direction} />
                    <TransactionStatusBadge status={transaction.status} />
                  </div>
                  <p className="font-medium">
                    {transaction.transactionNumber ?? transaction.partyName}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {formatDateTime(transaction.transactionDate)} ·{' '}
                    <span className="tabular-nums">{transaction.totalAmount.toFixed(2)}</span>
                  </p>
                </div>
                <Button type="button" size="sm" variant="ghost" asChild>
                  <Link to={buildRoute.transactionDetail(transaction.id)}>View</Link>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
