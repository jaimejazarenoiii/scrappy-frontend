import { Archive, KeyRound, Pencil, RotateCcw, ShieldOff, ShieldCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { DescriptionItem, DescriptionList } from '@/components/common/DescriptionList'
import { PageContainer } from '@/components/common/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { ErrorState } from '@/components/feedback/ErrorState'
import { PageSkeleton } from '@/components/feedback/PageSkeleton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PERMISSIONS } from '@/constants/permissions'
import { buildRoute } from '@/constants/routes'
import { PermissionGate } from '@/features/authorization/components/PermissionGate'
import { formatDate } from '@/utils/format-date'
import { GrantSystemAccessDialog } from '../components/GrantSystemAccessDialog'
import { ResetEmployeePasswordDialog } from '../components/ResetEmployeePasswordDialog'
import { formatEmployeeName, isEmployeeArchived } from '../lib/employee-display'
import { useEmployee } from '../hooks/useEmployee'
import {
  useArchiveEmployee,
  useDisableSystemAccess,
  useEnableSystemAccess,
} from '../hooks/useEmployeeMutations'

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const employeeQuery = useEmployee(id)
  const archiveEmployee = useArchiveEmployee(id ?? '')
  const disableAccess = useDisableSystemAccess(id ?? '')
  const enableAccess = useEnableSystemAccess(id ?? '')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [grantOpen, setGrantOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)

  useEffect(() => {
    document.title = 'Employee details | Scrappy'
  }, [])

  if (employeeQuery.isLoading) {
    return <PageSkeleton />
  }

  if (employeeQuery.isError || !employeeQuery.data) {
    return (
      <PageContainer maxWidth="lg">
        <ErrorState
          title="Employee not found"
          description="This employee may have been removed or you may not have access."
        />
      </PageContainer>
    )
  }

  const employee = employeeQuery.data
  const displayName = formatEmployeeName(employee)
  const archived = isEmployeeArchived(employee)
  const statusTone = archived ? 'archived' : employee.status === 'ACTIVE' ? 'active' : 'inactive'
  const statusLabel = archived ? 'archived' : employee.status.toLowerCase()
  const linkedUser = employee.linkedUser
  const hasLogin = Boolean(employee.userId ?? linkedUser?.id)
  const loginActive = linkedUser?.status === 'ACTIVE'

  return (
    <PageContainer maxWidth="lg">
      <div className="space-y-6">
        <PageHeader
          title={displayName}
          description={employee.employeeNumber ?? 'Employee record'}
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <PermissionGate permission={PERMISSIONS.employee.update}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    void navigate(buildRoute.employeeEdit(employee.id))
                  }}
                >
                  <Pencil className="size-4" />
                  Edit
                </Button>
              </PermissionGate>
              {!archived && !hasLogin ? (
                <PermissionGate permission={PERMISSIONS.employee.update}>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setGrantOpen(true)
                    }}
                  >
                    <KeyRound className="size-4" />
                    Create login
                  </Button>
                </PermissionGate>
              ) : null}
              {!archived && hasLogin && linkedUser ? (
                <PermissionGate permission={PERMISSIONS.employee.update}>
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setResetOpen(true)
                      }}
                    >
                      <RotateCcw className="size-4" />
                      Reset password
                    </Button>
                    {loginActive ? (
                      <Button
                        type="button"
                        variant="outline"
                        disabled={disableAccess.isPending}
                        onClick={() => {
                          disableAccess.mutate()
                        }}
                      >
                        <ShieldOff className="size-4" />
                        Disable login
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        disabled={enableAccess.isPending}
                        onClick={() => {
                          enableAccess.mutate()
                        }}
                      >
                        <ShieldCheck className="size-4" />
                        Enable login
                      </Button>
                    )}
                  </>
                </PermissionGate>
              ) : null}
              {!archived ? (
                <PermissionGate permission={PERMISSIONS.employee.archive}>
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={archiveEmployee.isPending}
                    onClick={() => {
                      setConfirmOpen(true)
                    }}
                  >
                    <Archive className="size-4" />
                    Archive
                  </Button>
                </PermissionGate>
              ) : null}
            </div>
          }
        />

        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent>
            <DescriptionList>
              <DescriptionItem label="Full name">{displayName}</DescriptionItem>
              <DescriptionItem label="Employee number">
                {employee.employeeNumber ?? '—'}
              </DescriptionItem>
              <DescriptionItem label="Contact number">
                {employee.contactNumber ?? '—'}
              </DescriptionItem>
              <DescriptionItem label="Weekly salary">
                {employee.weeklySalary.toLocaleString()}
              </DescriptionItem>
              <DescriptionItem label="Status">
                <StatusBadge label={statusLabel} tone={statusTone} />
              </DescriptionItem>
              <DescriptionItem label="Created">{formatDate(employee.createdAt)}</DescriptionItem>
              <DescriptionItem label="Last updated">
                {formatDate(employee.updatedAt)}
              </DescriptionItem>
            </DescriptionList>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System access</CardTitle>
          </CardHeader>
          <CardContent>
            {linkedUser ? (
              <DescriptionList>
                <DescriptionItem label="Email">{linkedUser.email}</DescriptionItem>
                <DescriptionItem label="Role">{linkedUser.role}</DescriptionItem>
                <DescriptionItem label="Login status">
                  <StatusBadge
                    label={linkedUser.status.toLowerCase()}
                    tone={linkedUser.status === 'ACTIVE' ? 'active' : 'inactive'}
                  />
                </DescriptionItem>
              </DescriptionList>
            ) : hasLogin ? (
              <p className="text-muted-foreground text-sm">
                Linked to user {employee.userId}. Account details are unavailable.
              </p>
            ) : (
              <p className="text-muted-foreground text-sm">
                No login account. Create one so this employee can sign in.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <GrantSystemAccessDialog
        employeeId={employee.id}
        employeeName={displayName}
        open={grantOpen}
        onOpenChange={setGrantOpen}
      />

      <ResetEmployeePasswordDialog
        employeeId={employee.id}
        employeeName={displayName}
        open={resetOpen}
        onOpenChange={setResetOpen}
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`Archive ${displayName}?`}
        description="Archived employees are hidden from the active list."
        confirmLabel="Archive"
        variant="destructive"
        isLoading={archiveEmployee.isPending}
        onConfirm={() => {
          archiveEmployee.mutate(undefined, {
            onSuccess: () => {
              setConfirmOpen(false)
            },
          })
        }}
      />
    </PageContainer>
  )
}
