import { ArrowLeft } from 'lucide-react'
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
import { formatDateTime } from '@/utils/format-date'

import { useActivityLog } from '../hooks/useActivityLogs'
import {
  activityEventTypeLabel,
  activityEventTypeTone,
  activityRoleLabel,
  formatActivityAction,
  formatPerformedBy,
} from '../lib/activity-log-display'

export default function ActivityLogDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const formatEmployee = useFormatRecordEmployee()
  const logQuery = useActivityLog(id)

  useEffect(() => {
    document.title = 'Activity log | Scrappy'
  }, [])

  if (logQuery.isLoading) {
    return <PageSkeleton />
  }

  if (logQuery.isError || !logQuery.data) {
    return (
      <PageContainer maxWidth="lg">
        <ErrorState
          title="Activity log not found"
          description="This log entry may have been removed or you may not have access."
        />
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={() => {
            void navigate(ROUTES.activityLogs)
          }}
        >
          <ArrowLeft className="size-4" />
          Back to activity logs
        </Button>
      </PageContainer>
    )
  }

  const log = logQuery.data
  const performedBy = log.performedBy
  const linkedEmployeeId = performedBy?.employeeId ?? log.employeeId
  const employeeLabel = linkedEmployeeId ? formatEmployee({ employeeId: linkedEmployeeId }) : null
  const metadataJson =
    log.metadata && Object.keys(log.metadata).length > 0
      ? JSON.stringify(log.metadata, null, 2)
      : null

  return (
    <PageContainer maxWidth="lg">
      <div className="space-y-6">
        <PageHeader
          title={log.description}
          description={formatActivityAction(log.action)}
          actions={
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                void navigate(ROUTES.activityLogs)
              }}
            >
              <ArrowLeft className="size-4" />
              Back
            </Button>
          }
        />

        <Card>
          <CardHeader>
            <CardTitle>Event</CardTitle>
          </CardHeader>
          <CardContent>
            <DescriptionList>
              <DescriptionItem label="When">{formatDateTime(log.createdAt)}</DescriptionItem>
              <DescriptionItem label="Type">
                <StatusBadge
                  label={activityEventTypeLabel(log.eventType)}
                  tone={activityEventTypeTone(log.eventType)}
                />
              </DescriptionItem>
              <DescriptionItem label="Module">
                <span className="capitalize">{log.module}</span>
              </DescriptionItem>
              <DescriptionItem label="Action">
                <span className="font-mono text-sm">{log.action}</span>
              </DescriptionItem>
              <DescriptionItem label="Description">{log.description}</DescriptionItem>
            </DescriptionList>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performed by</CardTitle>
          </CardHeader>
          <CardContent>
            <DescriptionList>
              <DescriptionItem label="Email">
                {performedBy ? formatPerformedBy(performedBy) : (log.userId ?? '—')}
              </DescriptionItem>
              <DescriptionItem label="Role">
                {performedBy ? activityRoleLabel(performedBy.role) : '—'}
              </DescriptionItem>
              <DescriptionItem label="Employee">{employeeLabel ?? '—'}</DescriptionItem>
              <DescriptionItem label="User ID">
                {performedBy?.id ?? log.userId ?? '—'}
              </DescriptionItem>
              <DescriptionItem label="Employee ID">{linkedEmployeeId ?? '—'}</DescriptionItem>
            </DescriptionList>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resource</CardTitle>
          </CardHeader>
          <CardContent>
            <DescriptionList>
              <DescriptionItem label="Resource type">{log.resourceType ?? '—'}</DescriptionItem>
              <DescriptionItem label="Resource ID">{log.resourceId ?? '—'}</DescriptionItem>
              <DescriptionItem label="Resource number">{log.resourceNumber ?? '—'}</DescriptionItem>
            </DescriptionList>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Request context</CardTitle>
          </CardHeader>
          <CardContent>
            <DescriptionList>
              <DescriptionItem label="IP address">{log.ipAddress ?? '—'}</DescriptionItem>
              <DescriptionItem label="User agent">
                <span className="text-sm break-all">{log.userAgent ?? '—'}</span>
              </DescriptionItem>
            </DescriptionList>
          </CardContent>
        </Card>

        {metadataJson ? (
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted/40 overflow-x-auto rounded-md border p-3 font-mono text-xs whitespace-pre-wrap">
                {metadataJson}
              </pre>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </PageContainer>
  )
}
