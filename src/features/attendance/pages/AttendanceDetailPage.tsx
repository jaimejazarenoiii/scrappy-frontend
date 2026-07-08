import { Clock, Pencil } from 'lucide-react'
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { PERMISSIONS } from '@/constants/permissions'
import { ROUTES } from '@/constants/routes'
import { PermissionGate } from '@/features/authorization/components/PermissionGate'
import { useFormatRecordEmployee } from '@/features/employees/hooks/useFormatRecordEmployee'
import type { NormalizedApiError } from '@/lib/axios'
import { formatDate } from '@/utils/format-date'

import { AttendanceCorrectionForm } from '../components/AttendanceCorrectionForm'
import {
  attendanceStatusLabel,
  attendanceStatusTone,
  canCorrectAttendance,
  displayTimeIn,
  displayTimeOut,
} from '../lib/attendance-status'
import { useAttendance } from '../hooks/useAttendance'
import { useCorrectAttendance } from '../hooks/useAttendanceMutations'
import type { AttendanceCorrectionInput } from '../types/attendance.types'

function formatDateTime(value: string | null): string {
  if (!value) return '—'
  return new Intl.DateTimeFormat('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export default function AttendanceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const attendanceQuery = useAttendance(id)
  const correctAttendance = useCorrectAttendance(id ?? '')
  const formatEmployee = useFormatRecordEmployee()
  const [correctionOpen, setCorrectionOpen] = useState(false)
  const [apiError, setApiError] = useState<NormalizedApiError | null>(null)

  useEffect(() => {
    document.title = 'Attendance details | Scrappy'
  }, [])

  if (attendanceQuery.isLoading) {
    return <PageSkeleton />
  }

  if (attendanceQuery.isError || !attendanceQuery.data) {
    return (
      <PageContainer maxWidth="lg">
        <ErrorState
          title="Attendance not found"
          description="This record may have been removed or you may not have access."
        />
        <div className="mt-4 flex justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              void navigate(ROUTES.attendance)
            }}
          >
            Back to attendance
          </Button>
        </div>
      </PageContainer>
    )
  }

  const attendance = attendanceQuery.data

  function handleCorrection(values: AttendanceCorrectionInput) {
    setApiError(null)
    correctAttendance.mutate(values, {
      onSuccess: () => {
        setCorrectionOpen(false)
      },
      onError: (error) => {
        setApiError(error)
      },
    })
  }

  return (
    <PageContainer maxWidth="lg">
      <div className="space-y-6">
        <PageHeader
          title="Attendance session"
          description={formatDate(attendance.timeInAt)}
          actions={
            canCorrectAttendance() ? (
              <PermissionGate permission={PERMISSIONS.attendance.correct}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setCorrectionOpen(true)
                  }}
                >
                  <Pencil className="size-4" />
                  Correct
                </Button>
              </PermissionGate>
            ) : null
          }
        />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="size-5" />
              Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DescriptionList>
              <DescriptionItem label="Employee">{formatEmployee(attendance)}</DescriptionItem>
              <DescriptionItem label="Status">
                <StatusBadge
                  label={attendanceStatusLabel(attendance.status)}
                  tone={attendanceStatusTone(attendance.status)}
                />
              </DescriptionItem>
              <DescriptionItem label="Time in">
                {formatDateTime(displayTimeIn(attendance))}
              </DescriptionItem>
              <DescriptionItem label="Time out">
                {formatDateTime(displayTimeOut(attendance))}
              </DescriptionItem>
              <DescriptionItem label="Note">{attendance.note ?? '—'}</DescriptionItem>
              <DescriptionItem label="Correction note">
                {attendance.correctionNote ?? '—'}
              </DescriptionItem>
              <DescriptionItem label="Created">{formatDate(attendance.createdAt)}</DescriptionItem>
              <DescriptionItem label="Last updated">
                {formatDate(attendance.updatedAt)}
              </DescriptionItem>
            </DescriptionList>
          </CardContent>
        </Card>
      </div>

      <Dialog open={correctionOpen} onOpenChange={setCorrectionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Attendance correction</DialogTitle>
          </DialogHeader>
          <AttendanceCorrectionForm
            defaultValues={{
              timeInAt: attendance.timeInAt,
              timeOutAt: attendance.timeOutAt ?? '',
              note: attendance.note ?? '',
              correctionNote: attendance.correctionNote ?? '',
            }}
            isSubmitting={correctAttendance.isPending}
            apiError={apiError}
            onCancel={() => {
              setCorrectionOpen(false)
            }}
            onSubmit={handleCorrection}
          />
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}
