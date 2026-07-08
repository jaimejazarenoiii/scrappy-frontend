import { Edit3, FileText, Receipt } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router'

import { DescriptionItem, DescriptionList } from '@/components/common/DescriptionList'
import { PageContainer } from '@/components/common/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { PageSkeleton } from '@/components/feedback/PageSkeleton'
import { ErrorState } from '@/components/feedback/ErrorState'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Button } from '@/components/ui/button'
import { PERMISSIONS } from '@/constants/permissions'
import { buildRoute } from '@/constants/routes'
import { PermissionGate } from '@/features/authorization/components/PermissionGate'
import { useFormatRecordEmployee } from '@/features/employees/hooks/useFormatRecordEmployee'
import { useAuthStore } from '@/store/auth.store'
import { TransactionDirectionBadge } from '../components/TransactionDirectionBadge'
import { TransactionSettlementActions } from '../components/TransactionSettlementActions'
import { TransactionSettlementSummary } from '../components/TransactionSettlementSummary'
import { TransactionStatusBadge } from '../components/TransactionStatusBadge'
import { useTransaction } from '../hooks/useTransaction'
import { transactionAttachmentImageUrl } from '../lib/transaction-attachment-url'
import { formatDate } from '@/utils/format-date'
import {
  formatTransactionDirectionAndParty,
  formatTransactionParty,
} from '../lib/transaction-format'
import { isDraftStatus, isPaidStatus } from '../lib/transaction-settlement'

function formatActorLabel(userId: string | null | undefined): string {
  if (!userId) return '—'
  return `User ${userId.slice(0, 8)}…`
}

export default function TransactionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const formatEmployee = useFormatRecordEmployee()
  const transactionQuery = useTransaction(id)
  const accessToken = useAuthStore((state) => state.accessToken)

  const tx = transactionQuery.data

  useEffect(() => {
    if (!tx) {
      document.title = 'Transaction Details | Scrappy'
      return
    }
    document.title = `${tx.status === 'READY_FOR_PAYMENT' ? 'Ready for Payment' : 'Transaction Details'} · ${formatTransactionDirectionAndParty(tx)} | Scrappy`
  }, [tx])

  const assignedEmployeeLabels = useMemo(() => {
    if (!tx) return []
    return tx.assignments.map((a) => formatEmployee({ employeeId: a.employeeId }))
  }, [tx, formatEmployee])

  const locationLabel = useMemo(() => {
    if (!tx) return undefined

    if (tx.locationType === 'BRANCH') return tx.branchId ?? '—'
    if (tx.locationType === 'WAREHOUSE') return tx.warehouseId ?? '—'

    if (tx.outsideLocationName && tx.outsideAddress) {
      return `${tx.outsideLocationName} · ${tx.outsideAddress}`
    }
    return tx.outsideLocationName ?? tx.outsideAddress ?? '—'
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
              title="Transaction details"
              description={formatTransactionDirectionAndParty(tx)}
              actions={
                <div className="flex flex-wrap items-center gap-2">
                  <TransactionStatusBadge status={tx.status} />
                  <Button type="button" variant="outline" size="sm" asChild>
                    <Link to={buildRoute.transactionSettlement(tx.id)}>
                      <FileText className="size-4" />
                      Settlement
                    </Link>
                  </Button>
                  {isPaidStatus(tx.status) ? (
                    <Button type="button" variant="outline" size="sm" asChild>
                      <Link to={buildRoute.transactionReceipt(tx.id)}>
                        <Receipt className="size-4" />
                        Receipt
                      </Link>
                    </Button>
                  ) : null}
                  <PermissionGate permission={PERMISSIONS.transactions.update}>
                    {isDraftStatus(tx.status) ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          void navigate(buildRoute.transactionEdit(tx.id))
                        }}
                      >
                        <Edit3 className="size-4" />
                        Edit draft
                      </Button>
                    ) : null}
                  </PermissionGate>
                </div>
              }
            />

            <TransactionSettlementActions transaction={tx} />

            <DescriptionList>
              <DescriptionItem label="Transaction number">
                {tx.transactionNumber ?? '—'}
              </DescriptionItem>
              <DescriptionItem label="Status">
                <TransactionStatusBadge status={tx.status} />
              </DescriptionItem>
              <DescriptionItem label="Type">
                <TransactionDirectionBadge direction={tx.direction} />
              </DescriptionItem>
              <DescriptionItem label="Party">{formatTransactionParty(tx)}</DescriptionItem>
              <DescriptionItem label="Party contact">
                {tx.partyContactNumber ?? '—'}
              </DescriptionItem>
              <DescriptionItem label="Transaction date">
                {formatDate(tx.transactionDate)}
              </DescriptionItem>
              <DescriptionItem label="Location">{locationLabel}</DescriptionItem>
              <DescriptionItem label="Assigned employees">
                {assignedEmployeeLabels.length ? assignedEmployeeLabels.join(', ') : '—'}
              </DescriptionItem>
              <DescriptionItem label="Items">{tx.items.length}</DescriptionItem>
              <DescriptionItem label="Photos">{tx.attachments.length}</DescriptionItem>
              <DescriptionItem label="Total amount">
                <span className="font-medium tabular-nums">{tx.totalAmount.toFixed(2)}</span>
              </DescriptionItem>
              {tx.submittedAt ? (
                <DescriptionItem label="Submitted">
                  {formatDate(tx.submittedAt)}
                  {tx.submittedByUserId ? ` · ${formatActorLabel(tx.submittedByUserId)}` : null}
                </DescriptionItem>
              ) : null}
              {isPaidStatus(tx.status) ? (
                <>
                  <DescriptionItem label="Paid at">
                    {tx.paidAt ? formatDate(tx.paidAt) : '—'}
                  </DescriptionItem>
                  <DescriptionItem label="Paid by">
                    {formatActorLabel(tx.paidByUserId)}
                  </DescriptionItem>
                </>
              ) : null}
              {tx.cancellationReason ? (
                <DescriptionItem label="Cancellation reason">
                  {tx.cancellationReason}
                </DescriptionItem>
              ) : null}
              {tx.reopenReason ? (
                <DescriptionItem label="Reopen reason">{tx.reopenReason}</DescriptionItem>
              ) : null}
              <DescriptionItem label="Notes">{tx.notes?.trim() ? tx.notes : '—'}</DescriptionItem>
            </DescriptionList>

            {isPaidStatus(tx.status) ? (
              <section className="space-y-3">
                <h2 className="text-lg font-semibold">Payment summary</h2>
                <TransactionSettlementSummary transaction={tx} />
              </section>
            ) : null}

            {tx.attachments.length > 0 ? (
              <section className="space-y-3" aria-labelledby="transaction-detail-photos-heading">
                <h2 id="transaction-detail-photos-heading" className="text-lg font-semibold">
                  Photos
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {tx.attachments.map((attachment) => (
                    <figure key={attachment.id} className="overflow-hidden rounded-lg border">
                      <img
                        src={transactionAttachmentImageUrl(tx.id, attachment, accessToken)}
                        alt={attachment.fileName}
                        className="aspect-video w-full object-cover"
                        loading="lazy"
                      />
                      <figcaption className="truncate px-3 py-2 text-sm">
                        {attachment.fileName}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </section>
            ) : null}
          </>
        )}
      </div>
    </PageContainer>
  )
}
