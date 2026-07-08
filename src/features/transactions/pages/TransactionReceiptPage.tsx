import { ArrowLeft, Printer } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router'

import { PageContainer } from '@/components/common/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { PageSkeleton } from '@/components/feedback/PageSkeleton'
import { ErrorState } from '@/components/feedback/ErrorState'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Button } from '@/components/ui/button'
import { buildRoute } from '@/constants/routes'

import { TransactionReceiptDocument } from '../components/TransactionReceiptDocument'
import { useTransaction } from '../hooks/useTransaction'
import { useTransactionReceipt } from '../hooks/useTransactionReceipt'
import { canShowReceiptHint } from '../lib/transaction-settlement'

export default function TransactionReceiptPage() {
  const { id } = useParams<{ id: string }>()
  const transactionQuery = useTransaction(id)
  const tx = transactionQuery.data
  const receiptQuery = useTransactionReceipt(id, tx?.status)

  useEffect(() => {
    document.title = 'Transaction Receipt | Scrappy'
  }, [])

  const receiptEligible = tx ? canShowReceiptHint(tx.status) : false

  return (
    <PageContainer maxWidth="lg">
      <div className="space-y-6 print:space-y-0">
        <div className="print:hidden">
          {transactionQuery.isLoading ? (
            <PageSkeleton />
          ) : transactionQuery.isError ? (
            <ErrorState description="We couldn't load this transaction. Please try again." />
          ) : !tx ? (
            <EmptyState
              title="Transaction not found"
              description="The requested transaction does not exist."
            />
          ) : !receiptEligible ? (
            <EmptyState
              title="Receipt not available"
              description="Receipts are available after a transaction has been paid."
              action={
                <Button type="button" variant="outline" asChild>
                  <Link to={buildRoute.transactionDetail(tx.id)}>Back to transaction</Link>
                </Button>
              }
            />
          ) : receiptQuery.isLoading ? (
            <PageSkeleton />
          ) : receiptQuery.isError ? (
            <div className="space-y-4">
              <ErrorState description="We couldn't load the receipt. Please try again." />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  void receiptQuery.refetch()
                }}
              >
                Retry
              </Button>
            </div>
          ) : receiptQuery.data ? (
            <>
              <PageHeader
                title="Receipt"
                description={tx.transactionNumber ?? tx.partyName}
                actions={
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline" size="sm" asChild>
                      <Link to={buildRoute.transactionDetail(tx.id)}>
                        <ArrowLeft className="size-4" />
                        Back
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        window.print()
                      }}
                    >
                      <Printer className="size-4" />
                      Print
                    </Button>
                  </div>
                }
              />
              <TransactionReceiptDocument receipt={receiptQuery.data} />
            </>
          ) : null}
        </div>

        {receiptQuery.data ? (
          <div className="hidden print:block">
            <TransactionReceiptDocument receipt={receiptQuery.data} />
          </div>
        ) : null}
      </div>
    </PageContainer>
  )
}
