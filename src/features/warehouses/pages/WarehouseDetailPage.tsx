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
import {
  isOrgEntityArchived,
  orgEntityStatusLabel,
  orgEntityStatusTone,
} from '@/features/branches/lib/org-status'
import { PermissionGate } from '@/features/authorization/components/PermissionGate'
import { formatDate } from '@/utils/format-date'

import { useWarehouse } from '../hooks/useWarehouse'
import { useArchiveWarehouse } from '../hooks/useWarehouseMutations'

export default function WarehouseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const warehouseQuery = useWarehouse(id)
  const archiveWarehouse = useArchiveWarehouse(id ?? '')
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    document.title = 'Warehouse details | Scrappy'
  }, [])

  if (warehouseQuery.isLoading) {
    return <PageSkeleton />
  }

  if (warehouseQuery.isError || !warehouseQuery.data) {
    return (
      <PageContainer maxWidth="lg">
        <ErrorState
          title="Warehouse not found"
          description="This warehouse may have been removed or you may not have access."
        />
      </PageContainer>
    )
  }

  const warehouse = warehouseQuery.data
  const archived = isOrgEntityArchived(warehouse.deletedAt)

  return (
    <PageContainer maxWidth="lg">
      <div className="space-y-6">
        <PageHeader
          title={warehouse.name}
          description={warehouse.address ?? 'Warehouse location'}
          actions={
            <div className="flex items-center gap-2">
              <PermissionGate permission={PERMISSIONS.warehouse.update}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    void navigate(buildRoute.warehouseEdit(warehouse.id))
                  }}
                >
                  <Pencil className="size-4" />
                  Edit
                </Button>
              </PermissionGate>
              {!archived ? (
                <PermissionGate permission={PERMISSIONS.warehouse.archive}>
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={archiveWarehouse.isPending}
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
              <DescriptionItem label="Name">{warehouse.name}</DescriptionItem>
              <DescriptionItem label="Address">{warehouse.address ?? '—'}</DescriptionItem>
              <DescriptionItem label="Contact number">
                {warehouse.contactNumber ?? '—'}
              </DescriptionItem>
              <DescriptionItem label="Branch">
                {warehouse.branch?.name ?? warehouse.branchId ?? '—'}
              </DescriptionItem>
              <DescriptionItem label="Status">
                <StatusBadge
                  label={orgEntityStatusLabel(warehouse.status, warehouse.deletedAt)}
                  tone={orgEntityStatusTone(warehouse.status, warehouse.deletedAt)}
                />
              </DescriptionItem>
              <DescriptionItem label="Created">{formatDate(warehouse.createdAt)}</DescriptionItem>
              <DescriptionItem label="Last updated">
                {formatDate(warehouse.updatedAt)}
              </DescriptionItem>
            </DescriptionList>
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`Archive ${warehouse.name}?`}
        description="Archived warehouses are hidden from the default list."
        confirmLabel="Archive"
        variant="destructive"
        isLoading={archiveWarehouse.isPending}
        onConfirm={() => {
          archiveWarehouse.mutate(undefined, {
            onSuccess: () => {
              setConfirmOpen(false)
            },
          })
        }}
      />
    </PageContainer>
  )
}
