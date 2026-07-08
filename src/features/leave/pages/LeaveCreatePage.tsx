import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'

import { PageContainer } from '@/components/common/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import type { NormalizedApiError } from '@/lib/axios'
import { buildRoute, ROUTES } from '@/constants/routes'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import type { UserRole } from '@/features/auth/types/auth.types'
import {
  requiresLeaveEmployeePicker,
  showsOptionalLeaveEmployeePicker,
} from '@/features/workforce/lib/workforce-roles'
import { blankToUndefined } from '@/utils/form-values'

import { LeaveForm } from '../components/LeaveForm'
import { useCreateLeave } from '../hooks/useLeaveMutations'
import type { CreateLeaveInput } from '../types/leave.types'
import type { AnyLeaveFormValues, LeaveFormMode } from '../validation/leave.schema'

function leaveFormModeForRole(role: UserRole | undefined): LeaveFormMode {
  if (requiresLeaveEmployeePicker(role)) return 'required-employee'
  if (showsOptionalLeaveEmployeePicker(role)) return 'optional-employee'
  return 'self'
}

function toCreateInput(values: AnyLeaveFormValues, mode: LeaveFormMode): CreateLeaveInput {
  const input: CreateLeaveInput = {
    leaveType: values.leaveType,
    leaveDate: values.leaveDate,
    reason: blankToUndefined(values.reason),
  }

  if (mode === 'required-employee' && values.employeeId) {
    input.employeeId = values.employeeId
  }

  if (mode === 'optional-employee' && values.employeeId) {
    input.employeeId = values.employeeId
  }

  return input
}

export default function LeaveCreatePage() {
  const navigate = useNavigate()
  const { currentUser } = useCurrentUser()
  const createLeave = useCreateLeave()
  const [apiError, setApiError] = useState<NormalizedApiError | null>(null)

  const employeeMode = useMemo(() => leaveFormModeForRole(currentUser?.role), [currentUser?.role])

  const isOnBehalf = employeeMode === 'required-employee'

  useEffect(() => {
    document.title = isOnBehalf
      ? 'Create leave for employee | Scrappy'
      : 'New leave request | Scrappy'
  }, [isOnBehalf])

  function handleSubmit(values: AnyLeaveFormValues) {
    setApiError(null)
    createLeave.mutate(toCreateInput(values, employeeMode), {
      onSuccess: (leave) => {
        void navigate(buildRoute.leaveDetail(leave.id))
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
          title={isOnBehalf ? 'Create leave for employee' : 'New leave request'}
          description={
            isOnBehalf
              ? 'Owners cannot request leave for themselves. Select an employee to create leave on their behalf.'
              : 'Submit a leave request for approval.'
          }
        />
        <Card>
          <CardContent className="pt-6">
            <LeaveForm
              mode="create"
              employeeMode={employeeMode}
              isSubmitting={createLeave.isPending}
              apiError={apiError}
              submitLabel={isOnBehalf ? 'Create leave' : 'Create leave request'}
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
