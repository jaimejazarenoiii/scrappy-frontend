import { Archive, Pencil } from 'lucide-react'
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
import { formatEmployeeName, isEmployeeArchived } from '../lib/employee-display'
import { useEmployee } from '../hooks/useEmployee'
import { useArchiveEmployee } from '../hooks/useEmployeeMutations'

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const employeeQuery = useEmployee(id)
  const archiveEmployee = useArchiveEmployee(id ?? '')
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    document.title = 'Employee details | Scrappy Web'
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

  return (
    <PageContainer maxWidth="lg">
      <div className="space-y-6">
        <PageHeader
          title={displayName}
          description={employee.employeeNumber ?? 'Employee record'}
          actions={
            <div className="flex items-center gap-2">
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
              <DescriptionItem label="Linked user">
                {employee.userId ?? 'Not linked'}
              </DescriptionItem>
              <DescriptionItem label="Created">{formatDate(employee.createdAt)}</DescriptionItem>
              <DescriptionItem label="Last updated">
                {formatDate(employee.updatedAt)}
              </DescriptionItem>
            </DescriptionList>
          </CardContent>
        </Card>
      </div>

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
