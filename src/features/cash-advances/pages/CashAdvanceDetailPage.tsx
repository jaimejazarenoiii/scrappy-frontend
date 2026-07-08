import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'

import { DescriptionItem, DescriptionList } from '@/components/common/DescriptionList'
import { PageContainer } from '@/components/common/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { ErrorState } from '@/components/feedback/ErrorState'
import { PageSkeleton } from '@/components/feedback/PageSkeleton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ROUTES } from '@/constants/routes'
import { useFormatRecordEmployee } from '@/features/employees/hooks/useFormatRecordEmployee'
import { formatDate } from '@/utils/format-date'

import { WorkflowHistory } from '../components/WorkflowHistory'
import { cashAdvanceStatusLabel, cashAdvanceStatusTone } from '../lib/cash-advance-status'
import { useCashAdvance } from '../hooks/useCashAdvance'

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount)
}

export default function CashAdvanceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const cashAdvanceQuery = useCashAdvance(id)
  const formatEmployee = useFormatRecordEmployee()

  useEffect(() => {
    document.title = 'Cash advance details | Scrappy'
  }, [])

  if (cashAdvanceQuery.isLoading) {
    return <PageSkeleton />
  }

  if (cashAdvanceQuery.isError || !cashAdvanceQuery.data) {
    return (
      <PageContainer maxWidth="lg">
        <ErrorState
          title="Cash advance not found"
          description="This record may have been removed or you may not have access."
        />
        <div className="mt-4 flex justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              void navigate(ROUTES.cashAdvances)
            }}
          >
            Back to cash advances
          </Button>
        </div>
      </PageContainer>
    )
  }

  const cashAdvance = cashAdvanceQuery.data

  return (
    <PageContainer maxWidth="lg">
      <div className="space-y-6">
        <PageHeader
          title={formatCurrency(cashAdvance.amount)}
          description={cashAdvance.reason ?? 'Cash advance'}
        />

        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent>
            <DescriptionList>
              <DescriptionItem label="Employee">{formatEmployee(cashAdvance)}</DescriptionItem>
              <DescriptionItem label="Amount">{formatCurrency(cashAdvance.amount)}</DescriptionItem>
              <DescriptionItem label="Reason">{cashAdvance.reason ?? '—'}</DescriptionItem>
              <DescriptionItem label="Status">
                <StatusBadge
                  label={cashAdvanceStatusLabel(cashAdvance.status)}
                  tone={cashAdvanceStatusTone(cashAdvance.status)}
                />
              </DescriptionItem>
              <DescriptionItem label="Created">{formatDate(cashAdvance.createdAt)}</DescriptionItem>
              <DescriptionItem label="Last updated">
                {formatDate(cashAdvance.updatedAt)}
              </DescriptionItem>
            </DescriptionList>
          </CardContent>
        </Card>

        <WorkflowHistory
          deductedAmount={cashAdvance.deductedAmount}
          remainingAmount={cashAdvance.remainingAmount}
        />
      </div>
    </PageContainer>
  )
}
