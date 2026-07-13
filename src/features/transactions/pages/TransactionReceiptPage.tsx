import { ArrowLeft, Printer, Download } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router'
import { toast } from 'sonner'

import { PageContainer } from '@/components/common/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { PageSkeleton } from '@/components/feedback/PageSkeleton'
import { ErrorState } from '@/components/feedback/ErrorState'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Button } from '@/components/ui/button'
import { buildRoute } from '@/constants/routes'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { useBranch } from '@/features/branches/hooks/useBranch'
import { useFormatRecordEmployee } from '@/features/employees/hooks/useFormatRecordEmployee'
import { useTrip } from '@/features/trips/hooks/useTrip'
import { useWarehouse } from '@/features/warehouses/hooks/useWarehouse'
import { isCompanyViewer } from '@/features/workforce/lib/workforce-roles'

import { TransactionReceiptDocument } from '../components/TransactionReceiptDocument'
import { useTransaction } from '../hooks/useTransaction'
import { useTransactionReceipt } from '../hooks/useTransactionReceipt'
import { canShowReceiptHint } from '../lib/transaction-settlement'
import { downloadTransactionReceiptBin } from '../lib/transaction-receipt-escpos'
import { buildReceiptLocationSummary } from '../lib/transaction-receipt-location'

export default function TransactionReceiptPage() {
  const { id } = useParams<{ id: string }>()
  const { currentUser } = useCurrentUser()
  const formatEmployee = useFormatRecordEmployee()
  const transactionQuery = useTransaction(id)
  const tx = transactionQuery.data
  const receiptQuery = useTransactionReceipt(id, tx?.status)
  const canDownloadThermal = isCompanyViewer(currentUser?.role)

  const branchQuery = useBranch(
    tx?.locationType === 'BRANCH' ? (tx.branchId ?? undefined) : undefined,
  )
  const warehouseQuery = useWarehouse(
    tx?.locationType === 'WAREHOUSE' ? (tx.warehouseId ?? undefined) : undefined,
  )
  const tripQuery = useTrip(tx?.locationType === 'TRIP' ? (tx.tripId ?? undefined) : undefined)

  const assignedEmployeeNames = useMemo(() => {
    if (!tx) return []
    if (tx.assignments.length > 0) {
      return tx.assignments.map((a) => formatEmployee({ employeeId: a.employeeId }))
    }
    return tx.assignedEmployeeIds.map((employeeId) => formatEmployee({ employeeId }))
  }, [tx, formatEmployee])

  const location = useMemo(() => {
    if (!tx) return null
    return buildReceiptLocationSummary({
      locationType: tx.locationType,
      branchId: tx.branchId,
      warehouseId: tx.warehouseId,
      tripId: tx.tripId,
      outsideLocationName: tx.outsideLocationName,
      outsideAddress: tx.outsideAddress,
      branch: branchQuery.data ?? null,
      warehouse: warehouseQuery.data ?? null,
      trip: tripQuery.data
        ? {
            tripNumber: tripQuery.data.tripNumber,
            origin: tripQuery.data.origin,
            destination: tripQuery.data.destination,
            vehicle: tripQuery.data.vehicle,
          }
        : null,
    })
  }, [tx, branchQuery.data, warehouseQuery.data, tripQuery.data])

  const printExtras = useMemo(
    () => ({
      assignedEmployeeNames,
      location,
      partyContactNumber: tx?.partyContactNumber ?? null,
      notes: tx?.notes ?? null,
    }),
    [assignedEmployeeNames, location, tx?.partyContactNumber, tx?.notes],
  )

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
                    {canDownloadThermal ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="cursor-pointer"
                        onClick={() => {
                          void (async () => {
                            try {
                              await downloadTransactionReceiptBin(receiptQuery.data, printExtras)
                              toast.success('Thermal receipt downloaded', {
                                description: 'Open the .bin file in your EOS Print app.',
                              })
                            } catch {
                              toast.error('Could not build thermal receipt file')
                            }
                          })()
                        }}
                      >
                        <Download className="size-4" />
                        Download .bin
                      </Button>
                    ) : null}
                    <Button
                      type="button"
                      size="sm"
                      className="cursor-pointer"
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
              {canDownloadThermal ? (
                <p className="text-muted-foreground text-sm">
                  Download .bin for your EOS thermal printer app — includes location, employees,
                  contact, notes, line items, totals, and a Scrappy footer.
                </p>
              ) : null}
              <TransactionReceiptDocument
                receipt={receiptQuery.data}
                assignedEmployeeNames={printExtras.assignedEmployeeNames}
                location={printExtras.location}
                partyContactNumber={printExtras.partyContactNumber}
                notes={printExtras.notes}
              />
            </>
          ) : null}
        </div>

        {receiptQuery.data ? (
          <div className="hidden print:block">
            <TransactionReceiptDocument
              receipt={receiptQuery.data}
              assignedEmployeeNames={printExtras.assignedEmployeeNames}
              location={printExtras.location}
              partyContactNumber={printExtras.partyContactNumber}
              notes={printExtras.notes}
            />
          </div>
        ) : null}
      </div>
    </PageContainer>
  )
}
