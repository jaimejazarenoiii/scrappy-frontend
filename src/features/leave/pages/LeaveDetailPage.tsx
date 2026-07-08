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

import { ApprovalActions } from '../components/ApprovalActions'
import { WorkflowHistory } from '../components/WorkflowHistory'
import { leaveStatusLabel, leaveStatusTone, leaveTypeLabel } from '../lib/leave-status'
import { useLeave } from '../hooks/useLeave'
import { useManageLeave } from '../hooks/useLeaveMutations'

export default function LeaveDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const leaveQuery = useLeave(id)
  const formatEmployee = useFormatRecordEmployee()
  const manageLeave = useManageLeave(id ?? '')

  useEffect(() => {
    document.title = 'Leave details | Scrappy'
  }, [])

  if (leaveQuery.isLoading) {
    return <PageSkeleton />
  }

  if (leaveQuery.isError || !leaveQuery.data) {
    return (
      <PageContainer maxWidth="lg">
        <ErrorState
          title="Leave request not found"
          description="This request may have been removed or you may not have access."
        />
        <div className="mt-4 flex justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              void navigate(ROUTES.leave)
            }}
          >
            Back to leave
          </Button>
        </div>
      </PageContainer>
    )
  }

  const leave = leaveQuery.data

  return (
    <PageContainer maxWidth="lg">
      <div className="space-y-6">
        <PageHeader
          title={leaveTypeLabel(leave.leaveType)}
          description={formatDate(leave.leaveDate)}
          actions={
            <ApprovalActions
              leave={leave}
              isManaging={manageLeave.isPending}
              onManage={(input) => {
                manageLeave.mutate(input)
              }}
            />
          }
        />

        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent>
            <DescriptionList>
              <DescriptionItem label="Employee">{formatEmployee(leave)}</DescriptionItem>
              <DescriptionItem label="Leave type">
                {leaveTypeLabel(leave.leaveType)}
              </DescriptionItem>
              <DescriptionItem label="Leave date">{formatDate(leave.leaveDate)}</DescriptionItem>
              <DescriptionItem label="Reason">{leave.reason ?? '—'}</DescriptionItem>
              <DescriptionItem label="Status">
                <StatusBadge
                  label={leaveStatusLabel(leave.status)}
                  tone={leaveStatusTone(leave.status)}
                />
              </DescriptionItem>
              <DescriptionItem label="Created">{formatDate(leave.createdAt)}</DescriptionItem>
              <DescriptionItem label="Last updated">{formatDate(leave.updatedAt)}</DescriptionItem>
            </DescriptionList>
          </CardContent>
        </Card>

        <WorkflowHistory managerNote={leave.managerNote} />
      </div>
    </PageContainer>
  )
}
