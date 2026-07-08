import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import { DescriptionItem, DescriptionList } from '@/components/common/DescriptionList'
import { PageContainer } from '@/components/common/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { ErrorState } from '@/components/feedback/ErrorState'
import { PageSkeleton } from '@/components/feedback/PageSkeleton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { PERMISSIONS } from '@/constants/permissions'
import { ROUTES } from '@/constants/routes'
import { PermissionGate } from '@/features/authorization/components/PermissionGate'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { useFormatRecordEmployee } from '@/features/employees/hooks/useFormatRecordEmployee'
import { formatDate } from '@/utils/format-date'

import { PayrollLineItemsTable } from '../components/PayrollLineItemsTable'
import { PayrollSummaryCards } from '../components/PayrollSummaryCards'
import { payrollStatusLabel, payrollStatusTone } from '../lib/payroll-status'
import { usePayroll } from '../hooks/usePayroll'
import { useMarkPayrollPaid } from '../hooks/usePayrollMutations'

export default function PayrollDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { currentUser } = useCurrentUser()
  const payrollQuery = usePayroll(id)
  const formatEmployee = useFormatRecordEmployee()
  const markPaid = useMarkPayrollPaid(id ?? '')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [paymentReference, setPaymentReference] = useState('')

  const canMarkPaid = currentUser?.role === 'OWNER' || currentUser?.role === 'MANAGER'

  useEffect(() => {
    document.title = 'Payroll details | Scrappy'
  }, [])

  if (payrollQuery.isLoading) {
    return <PageSkeleton />
  }

  if (payrollQuery.isError || !payrollQuery.data) {
    return (
      <PageContainer maxWidth="lg">
        <ErrorState
          title="Payroll not found"
          description="This payroll record may have been removed or you may not have access."
        />
        <div className="mt-4 flex justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              void navigate(ROUTES.payroll)
            }}
          >
            Back to payroll
          </Button>
        </div>
      </PageContainer>
    )
  }

  const payroll = payrollQuery.data

  return (
    <PageContainer maxWidth="lg">
      <div className="space-y-6">
        <PageHeader
          title={`${formatDate(payroll.payPeriodStart)} – ${formatDate(payroll.payPeriodEnd)}`}
          description="Payroll record as returned by the backend."
          actions={
            payroll.status === 'PAYABLE' && canMarkPaid ? (
              <PermissionGate permission={PERMISSIONS.payroll.view}>
                <Button
                  type="button"
                  onClick={() => {
                    setConfirmOpen(true)
                  }}
                >
                  Mark as paid
                </Button>
              </PermissionGate>
            ) : null
          }
        />

        <PayrollSummaryCards payroll={payroll} />

        <Card>
          <CardHeader>
            <CardTitle>Record details</CardTitle>
          </CardHeader>
          <CardContent>
            <DescriptionList>
              <DescriptionItem label="Employee">{formatEmployee(payroll)}</DescriptionItem>
              <DescriptionItem label="Status">
                <StatusBadge
                  label={payrollStatusLabel(payroll.status)}
                  tone={payrollStatusTone(payroll.status)}
                />
              </DescriptionItem>
              <DescriptionItem label="Period start">
                {formatDate(payroll.payPeriodStart)}
              </DescriptionItem>
              <DescriptionItem label="Period end">
                {formatDate(payroll.payPeriodEnd)}
              </DescriptionItem>
              <DescriptionItem label="Paid at">
                {payroll.paidAt ? formatDate(payroll.paidAt) : '—'}
              </DescriptionItem>
              <DescriptionItem label="Payment reference">
                {payroll.paymentReference ?? '—'}
              </DescriptionItem>
              <DescriptionItem label="Created">{formatDate(payroll.createdAt)}</DescriptionItem>
              <DescriptionItem label="Last updated">
                {formatDate(payroll.updatedAt)}
              </DescriptionItem>
            </DescriptionList>
          </CardContent>
        </Card>

        <PayrollLineItemsTable />
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark payroll as paid?</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Payment reference (optional)"
            value={paymentReference}
            onChange={(event) => {
              setPaymentReference(event.target.value)
            }}
          />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setConfirmOpen(false)
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={markPaid.isPending}
              onClick={() => {
                markPaid.mutate(paymentReference.length > 0 ? { paymentReference } : undefined, {
                  onSuccess: () => {
                    setConfirmOpen(false)
                    setPaymentReference('')
                  },
                })
              }}
            >
              {markPaid.isPending ? 'Working…' : 'Mark paid'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}
