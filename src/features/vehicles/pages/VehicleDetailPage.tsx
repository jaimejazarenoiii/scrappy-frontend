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
  vehicleStatusLabel,
  vehicleStatusTone,
} from '@/features/branches/lib/org-status'
import { PermissionGate } from '@/features/authorization/components/PermissionGate'
import { formatDate } from '@/utils/format-date'

import { useVehicle } from '../hooks/useVehicle'
import { useArchiveVehicle } from '../hooks/useVehicleMutations'

export default function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const vehicleQuery = useVehicle(id)
  const archiveVehicle = useArchiveVehicle(id ?? '')
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    document.title = 'Vehicle details | Scrappy'
  }, [])

  if (vehicleQuery.isLoading) {
    return <PageSkeleton />
  }

  if (vehicleQuery.isError || !vehicleQuery.data) {
    return (
      <PageContainer maxWidth="lg">
        <ErrorState
          title="Vehicle not found"
          description="This vehicle may have been removed or you may not have access."
        />
      </PageContainer>
    )
  }

  const vehicle = vehicleQuery.data
  const archived = isOrgEntityArchived(vehicle.deletedAt)

  return (
    <PageContainer maxWidth="lg">
      <div className="space-y-6">
        <PageHeader
          title={vehicle.plateNumber}
          description={vehicle.description ?? 'Fleet vehicle'}
          actions={
            <div className="flex items-center gap-2">
              <PermissionGate permission={PERMISSIONS.vehicle.update}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    void navigate(buildRoute.vehicleEdit(vehicle.id))
                  }}
                >
                  <Pencil className="size-4" />
                  Edit
                </Button>
              </PermissionGate>
              {!archived ? (
                <PermissionGate permission={PERMISSIONS.vehicle.archive}>
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={archiveVehicle.isPending}
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
              <DescriptionItem label="Plate number">{vehicle.plateNumber}</DescriptionItem>
              <DescriptionItem label="Description">{vehicle.description ?? '—'}</DescriptionItem>
              <DescriptionItem label="Vehicle type">{vehicle.vehicleType ?? '—'}</DescriptionItem>
              <DescriptionItem label="Branch">
                {vehicle.branch?.name ?? vehicle.branchId ?? '—'}
              </DescriptionItem>
              <DescriptionItem label="Warehouse">
                {vehicle.warehouse?.name ?? vehicle.warehouseId ?? '—'}
              </DescriptionItem>
              <DescriptionItem label="Status">
                <StatusBadge
                  label={vehicleStatusLabel(vehicle.status, vehicle.deletedAt)}
                  tone={vehicleStatusTone(vehicle.status, vehicle.deletedAt)}
                />
              </DescriptionItem>
              <DescriptionItem label="Created">{formatDate(vehicle.createdAt)}</DescriptionItem>
              <DescriptionItem label="Last updated">
                {formatDate(vehicle.updatedAt)}
              </DescriptionItem>
            </DescriptionList>
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`Archive ${vehicle.plateNumber}?`}
        description="Archived vehicles are hidden from the default list."
        confirmLabel="Archive"
        variant="destructive"
        isLoading={archiveVehicle.isPending}
        onConfirm={() => {
          archiveVehicle.mutate(undefined, {
            onSuccess: () => {
              setConfirmOpen(false)
            },
          })
        }}
      />
    </PageContainer>
  )
}
