import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import { PageContainer } from '@/components/common/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { ErrorState } from '@/components/feedback/ErrorState'
import { PageSkeleton } from '@/components/feedback/PageSkeleton'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { NormalizedApiError } from '@/lib/axios'
import { ROUTES } from '@/constants/routes'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { canManageLeaveRecords } from '@/features/workforce/lib/workforce-roles'
import { blankToUndefined } from '@/utils/form-values'

import { LeaveForm } from '../components/LeaveForm'
import { useLeave } from '../hooks/useLeave'
import { useManageLeave } from '../hooks/useLeaveMutations'
import type { ManageLeaveInput } from '../types/leave.types'
import type { AnyLeaveFormValues } from '../validation/leave.schema'

export default function LeaveEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { currentUser } = useCurrentUser()
  const leaveQuery = useLeave(id)
  const manageLeave = useManageLeave(id ?? '')
  const [apiError, setApiError] = useState<NormalizedApiError | null>(null)

  const canEdit = canManageLeaveRecords(currentUser?.role)

  useEffect(() => {
    document.title = 'Edit leave request | Scrappy'
  }, [])

  if (leaveQuery.isLoading) {
    return <PageSkeleton />
  }

  if (!canEdit) {
    return (
      <PageContainer maxWidth="lg">
        <div className="space-y-6">
          <PageHeader title="Edit leave request" />
          <ErrorState
            title="Editing is not allowed"
            description="Only owners and managers can edit leave records."
          />
          <div className="flex justify-center">
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
        </div>
      </PageContainer>
    )
  }

  if (leaveQuery.isError || !leaveQuery.data) {
    return (
      <PageContainer maxWidth="lg">
        <ErrorState title="Leave request not found" />
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

  function handleSubmit(values: AnyLeaveFormValues) {
    setApiError(null)
    const input: ManageLeaveInput = {
      leaveType: values.leaveType,
      leaveDate: values.leaveDate,
      reason: blankToUndefined(values.reason),
    }
    manageLeave.mutate(input, {
      onSuccess: () => {
        void navigate(ROUTES.leave)
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
          title="Edit leave request"
          description="Update leave details. Status changes use approve/reject actions on the detail page."
        />
        <Card>
          <CardContent className="pt-6">
            <LeaveForm
              mode="edit"
              employeeMode="self"
              defaultValues={{
                leaveType: leave.leaveType,
                leaveDate: leave.leaveDate,
                reason: leave.reason ?? '',
              }}
              isSubmitting={manageLeave.isPending}
              apiError={apiError}
              onCancel={() => {
                void navigate(ROUTES.leave)
              }}
              onSubmit={handleSubmit}
            />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
