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

import { isOrgEntityArchived, orgEntityStatusLabel, orgEntityStatusTone } from '../lib/org-status'
import { useBranch } from '../hooks/useBranch'
import { useArchiveBranch } from '../hooks/useBranchMutations'

export default function BranchDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const branchQuery = useBranch(id)
  const archiveBranch = useArchiveBranch(id ?? '')
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    document.title = 'Branch details | Scrappy Web'
  }, [])

  if (branchQuery.isLoading) {
    return <PageSkeleton />
  }

  if (branchQuery.isError || !branchQuery.data) {
    return (
      <PageContainer maxWidth="lg">
        <ErrorState
          title="Branch not found"
          description="This branch may have been removed or you may not have access."
        />
      </PageContainer>
    )
  }

  const branch = branchQuery.data
  const archived = isOrgEntityArchived(branch.deletedAt)

  return (
    <PageContainer maxWidth="lg">
      <div className="space-y-6">
        <PageHeader
          title={branch.name}
          description={branch.address ?? 'Branch location'}
          actions={
            <div className="flex items-center gap-2">
              <PermissionGate permission={PERMISSIONS.branch.update}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    void navigate(buildRoute.branchEdit(branch.id))
                  }}
                >
                  <Pencil className="size-4" />
                  Edit
                </Button>
              </PermissionGate>
              {!archived ? (
                <PermissionGate permission={PERMISSIONS.branch.archive}>
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={archiveBranch.isPending}
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
              <DescriptionItem label="Name">{branch.name}</DescriptionItem>
              <DescriptionItem label="Address">{branch.address ?? '—'}</DescriptionItem>
              <DescriptionItem label="Contact number">
                {branch.contactNumber ?? '—'}
              </DescriptionItem>
              <DescriptionItem label="Status">
                <StatusBadge
                  label={orgEntityStatusLabel(branch.status, branch.deletedAt)}
                  tone={orgEntityStatusTone(branch.status, branch.deletedAt)}
                />
              </DescriptionItem>
              <DescriptionItem label="Company ID">{branch.companyId}</DescriptionItem>
              <DescriptionItem label="Created">{formatDate(branch.createdAt)}</DescriptionItem>
              <DescriptionItem label="Last updated">{formatDate(branch.updatedAt)}</DescriptionItem>
            </DescriptionList>
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`Archive ${branch.name}?`}
        description="Archived branches are hidden from the default list."
        confirmLabel="Archive"
        variant="destructive"
        isLoading={archiveBranch.isPending}
        onConfirm={() => {
          archiveBranch.mutate(undefined, {
            onSuccess: () => {
              setConfirmOpen(false)
            },
          })
        }}
      />
    </PageContainer>
  )
}
