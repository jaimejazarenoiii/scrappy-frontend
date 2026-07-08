import { Edit3 } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router'

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
import { TransactionStatusBadge } from '../components/TransactionStatusBadge'
import { useTransaction } from '../hooks/useTransaction'
import { transactionAttachmentImageUrl } from '../lib/transaction-attachment-url'
import { formatDate } from '@/utils/format-date'
import {
  formatTransactionDirectionAndParty,
  formatTransactionParty,
} from '../lib/transaction-format'

export default function TransactionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const formatEmployee = useFormatRecordEmployee()
  const transactionQuery = useTransaction(id)
  const accessToken = useAuthStore((state) => state.accessToken)

  useEffect(() => {
    document.title = 'Transaction Details | Scrappy'
  }, [])

  const assignedEmployeeLabels = useMemo(() => {
    const tx = transactionQuery.data
    if (!tx) return []
    return tx.assignments.map((a) => formatEmployee({ employeeId: a.employeeId }))
  }, [transactionQuery.data, formatEmployee])

  const locationLabel = useMemo(() => {
    const tx = transactionQuery.data
    if (!tx) return undefined

    if (tx.locationType === 'BRANCH') return tx.branchId ?? '—'
    if (tx.locationType === 'WAREHOUSE') return tx.warehouseId ?? '—'

    // Remaining case: OUTSIDE (type narrowed by the checks above).
    if (tx.outsideLocationName && tx.outsideAddress) {
      return `${tx.outsideLocationName} · ${tx.outsideAddress}`
    }
    return tx.outsideLocationName ?? tx.outsideAddress ?? '—'
  }, [transactionQuery.data])

  const tx = transactionQuery.data

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
                <PermissionGate permission={PERMISSIONS.transactions.update}>
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
                </PermissionGate>
              }
            />

            <DescriptionList>
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
              <DescriptionItem label="Notes">{tx.notes?.trim() ? tx.notes : '—'}</DescriptionItem>
            </DescriptionList>

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
