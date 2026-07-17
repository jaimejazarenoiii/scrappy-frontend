import { Download, Edit3, FileText, Receipt } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'

import { DescriptionItem, DescriptionList } from '@/components/common/DescriptionList'
import { ImagePreviewDialog } from '@/components/common/ImagePreviewDialog'
import { PageContainer } from '@/components/common/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { PageSkeleton } from '@/components/feedback/PageSkeleton'
import { ErrorState } from '@/components/feedback/ErrorState'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Button } from '@/components/ui/button'
import { PERMISSIONS } from '@/constants/permissions'
import { buildRoute } from '@/constants/routes'
import { PermissionGate } from '@/features/authorization/components/PermissionGate'
import { useBranch } from '@/features/branches/hooks/useBranch'
import { useFormatRecordEmployee } from '@/features/employees/hooks/useFormatRecordEmployee'
import { useFormatUserActor } from '@/features/employees/hooks/useFormatUserActor'
import { useTrip } from '@/features/trips/hooks/useTrip'
import { useWarehouse } from '@/features/warehouses/hooks/useWarehouse'
import { useAuthStore } from '@/store/auth.store'
import { downloadImageFile } from '@/utils/download-image'
import { formatDateTime } from '@/utils/format-date'
import { TransactionDirectionBadge } from '../components/TransactionDirectionBadge'
import { TransactionItemsList } from '../components/TransactionItemsList'
import { TransactionSettlementActions } from '../components/TransactionSettlementActions'
import { TransactionSettlementSummary } from '../components/TransactionSettlementSummary'
import { TransactionStatusBadge } from '../components/TransactionStatusBadge'
import { useTransaction } from '../hooks/useTransaction'
import { transactionAttachmentImageUrl } from '../lib/transaction-attachment-url'
import {
  formatTransactionDirectionAndParty,
  formatTransactionParty,
} from '../lib/transaction-format'
import { isDraftStatus, isPaidStatus } from '../lib/transaction-settlement'
import type { TransactionAttachment } from '../types/transaction.types'

export default function TransactionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const formatEmployee = useFormatRecordEmployee()
  const formatActorLabel = useFormatUserActor()
  const transactionQuery = useTransaction(id)
  const accessToken = useAuthStore((state) => state.accessToken)
  const [preview, setPreview] = useState<{ src: string; fileName: string } | null>(null)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  const tx = transactionQuery.data
  const linkedTripQuery = useTrip(
    tx?.locationType === 'TRIP' ? (tx.tripId ?? undefined) : undefined,
  )
  const linkedTrip = linkedTripQuery.data
  const linkedBranchQuery = useBranch(
    tx?.locationType === 'BRANCH' ? (tx.branchId ?? undefined) : undefined,
  )
  const linkedWarehouseQuery = useWarehouse(
    tx?.locationType === 'WAREHOUSE' ? (tx.warehouseId ?? undefined) : undefined,
  )

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

    if (tx.locationType === 'BRANCH') {
      if (!tx.branchId) return '—'
      return linkedBranchQuery.data?.name ?? 'Branch'
    }
    if (tx.locationType === 'WAREHOUSE') {
      if (!tx.warehouseId) return '—'
      return linkedWarehouseQuery.data?.name ?? 'Warehouse'
    }

    if (tx.locationType === 'TRIP') {
      if (linkedTrip) {
        const route = `${linkedTrip.origin} → ${linkedTrip.destination}`
        return linkedTrip.tripNumber ? `${linkedTrip.tripNumber} · ${route}` : route
      }
      return tx.tripId ? 'Linked trip' : '—'
    }

    if (tx.outsideLocationName && tx.outsideAddress) {
      return `${tx.outsideLocationName} · ${tx.outsideAddress}`
    }
    return tx.outsideLocationName ?? tx.outsideAddress ?? '—'
  }, [tx, linkedTrip, linkedBranchQuery.data, linkedWarehouseQuery.data])

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
                {formatDateTime(tx.transactionDate)}
              </DescriptionItem>
              <DescriptionItem label="Location">
                {tx.locationType === 'TRIP' && tx.tripId ? (
                  <PermissionGate permission={PERMISSIONS.trips.view}>
                    <Button type="button" variant="link" className="h-auto p-0" asChild>
                      <Link to={buildRoute.tripDetail(tx.tripId)}>{locationLabel}</Link>
                    </Button>
                  </PermissionGate>
                ) : (
                  locationLabel
                )}
              </DescriptionItem>
              <DescriptionItem label="Assigned employees">
                {assignedEmployeeLabels.length ? assignedEmployeeLabels.join(', ') : '—'}
              </DescriptionItem>
              <DescriptionItem label="Photos">{tx.attachments.length}</DescriptionItem>
              {tx.submittedAt ? (
                <DescriptionItem label="Submitted">
                  {formatDateTime(tx.submittedAt)}
                  {tx.submittedByUserId ? ` · ${formatActorLabel(tx.submittedByUserId)}` : null}
                </DescriptionItem>
              ) : null}
              {isPaidStatus(tx.status) ? (
                <>
                  <DescriptionItem label="Paid at">
                    {tx.paidAt ? formatDateTime(tx.paidAt) : '—'}
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

            <TransactionItemsList items={tx.items} totalAmount={tx.totalAmount} />

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
                  {tx.attachments.map((attachment: TransactionAttachment) => {
                    const imageUrl = transactionAttachmentImageUrl(tx.id, attachment, accessToken)
                    return (
                      <figure key={attachment.id} className="overflow-hidden rounded-lg border">
                        <button
                          type="button"
                          className="focus-visible:ring-ring block w-full focus-visible:ring-2 focus-visible:outline-none"
                          aria-label={`View ${attachment.fileName}`}
                          onClick={() => {
                            setPreview({ src: imageUrl, fileName: attachment.fileName })
                          }}
                        >
                          <img
                            src={imageUrl}
                            alt={attachment.fileName}
                            className="aspect-video w-full object-cover transition-opacity hover:opacity-90"
                            loading="lazy"
                          />
                        </button>
                        <figcaption className="flex items-center justify-between gap-2 px-3 py-2">
                          <span className="truncate text-sm">{attachment.fileName}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="shrink-0"
                            aria-label={`Download ${attachment.fileName}`}
                            disabled={downloadingId === attachment.id}
                            onClick={() => {
                              setDownloadingId(attachment.id)
                              void downloadImageFile(imageUrl, attachment.fileName)
                                .catch(() => {
                                  toast.error('Could not download photo. Please try again.')
                                })
                                .finally(() => {
                                  setDownloadingId(null)
                                })
                            }}
                          >
                            <Download className="size-4" />
                          </Button>
                        </figcaption>
                      </figure>
                    )
                  })}
                </div>
              </section>
            ) : null}

            <ImagePreviewDialog
              open={Boolean(preview)}
              onOpenChange={(open) => {
                if (!open) setPreview(null)
              }}
              src={preview?.src ?? null}
              fileName={preview?.fileName ?? ''}
            />
          </>
        )}
      </div>
    </PageContainer>
  )
}
