import { ArrowLeft } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router'

import { PageContainer } from '@/components/common/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { PageSkeleton } from '@/components/feedback/PageSkeleton'
import { ErrorState } from '@/components/feedback/ErrorState'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Button } from '@/components/ui/button'
import { buildRoute } from '@/constants/routes'

import { TransactionSettlementActions } from '../components/TransactionSettlementActions'
import { TransactionSettlementSummary } from '../components/TransactionSettlementSummary'
import { TransactionSettlementTimeline } from '../components/TransactionSettlementTimeline'
import { TransactionStatusBadge } from '../components/TransactionStatusBadge'
import { useTransaction } from '../hooks/useTransaction'
import { useTransactionTimeline } from '../hooks/useTransactionTimeline'
import { formatTransactionDirectionAndParty } from '../lib/transaction-format'

export default function TransactionSettlementPage() {
  const { id } = useParams<{ id: string }>()
  const transactionQuery = useTransaction(id)
  const timeline = useTransactionTimeline(id)

  const tx = transactionQuery.data

  useEffect(() => {
    if (tx) {
      document.title = `Settlement · ${formatTransactionDirectionAndParty(tx)} | Scrappy`
      return
    }
    document.title = 'Transaction Settlement | Scrappy'
  }, [tx])

  return (
    <PageContainer maxWidth="lg">
      <div className="space-y-6">
        {transactionQuery.isLoading ? (
          <PageSkeleton />
        ) : transactionQuery.isError ? (
          <ErrorState description="We couldn't load this transaction. Please try again." />
        ) : !tx ? (
          <EmptyState
            title="Transaction not found"
            description="The requested transaction does not exist."
          />
        ) : (
          <>
            <PageHeader
              title="Settlement"
              description={formatTransactionDirectionAndParty(tx)}
              actions={
                <div className="flex flex-wrap items-center gap-2">
                  <TransactionStatusBadge status={tx.status} />
                  <Button type="button" variant="outline" size="sm" asChild>
                    <Link to={buildRoute.transactionDetail(tx.id)}>
                      <ArrowLeft className="size-4" />
                      Back to details
                    </Link>
                  </Button>
                </div>
              }
            />

            <section className="space-y-4 rounded-lg border p-4">
              <h2 className="text-lg font-semibold">Summary</h2>
              <TransactionSettlementSummary transaction={tx} />
            </section>

            <section className="space-y-4 rounded-lg border p-4">
              <h2 className="text-lg font-semibold">Actions</h2>
              <TransactionSettlementActions transaction={tx} />
            </section>

            <section className="space-y-4" aria-labelledby="settlement-timeline-heading">
              <h2 id="settlement-timeline-heading" className="text-lg font-semibold">
                Settlement history
              </h2>
              <TransactionSettlementTimeline
                events={timeline.events}
                isLoading={timeline.isLoading}
                isError={timeline.isError}
                onRetry={() => {
                  void timeline.refetch()
                }}
              />
            </section>
          </>
        )}
      </div>
    </PageContainer>
  )
}
