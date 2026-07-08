import type { ColumnDef } from '@tanstack/react-table'
import { Pencil, Plus, Truck } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router'

import { DataTable } from '@/components/common/DataTable'
import { FilterBar } from '@/components/common/FilterBar'
import { PageContainer } from '@/components/common/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { Pagination } from '@/components/common/Pagination'
import { StatusBadge } from '@/components/common/StatusBadge'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { PERMISSIONS } from '@/constants/permissions'
import { buildRoute, ROUTES } from '@/constants/routes'
import { vehicleStatusLabel, vehicleStatusTone } from '@/features/branches/lib/org-status'
import { PermissionGate } from '@/features/authorization/components/PermissionGate'
import { useListQuery } from '@/hooks/useListQuery'

import { useVehicles } from '../hooks/useVehicles'
import type { Vehicle } from '../types/vehicle.types'

export default function VehiclesListPage() {
  const navigate = useNavigate()
  const { params, setSearch, setPage, setSort, setFilter } = useListQuery({
    defaultSort: { field: 'plateNumber', direction: 'asc' },
  })
  const vehiclesQuery = useVehicles(params)

  useEffect(() => {
    document.title = 'Vehicles | Scrappy Web'
  }, [])

  const columns = useMemo<ColumnDef<Vehicle>[]>(
    () => [
      {
        id: 'plateNumber',
        accessorKey: 'plateNumber',
        header: 'Plate number',
        cell: ({ row }) => <span className="font-medium">{row.original.plateNumber}</span>,
      },
      {
        id: 'description',
        header: 'Description',
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.description ?? '—'}</span>
        ),
      },
      {
        id: 'vehicleType',
        header: 'Type',
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.vehicleType ?? '—'}</span>
        ),
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <StatusBadge
            label={vehicleStatusLabel(row.original.status, row.original.deletedAt)}
            tone={vehicleStatusTone(row.original.status, row.original.deletedAt)}
          />
        ),
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        cell: ({ row }) => {
          const plate = row.original.plateNumber
          return (
            <div className="flex justify-end gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  void navigate(buildRoute.vehicleDetail(row.original.id))
                }}
              >
                View
              </Button>
              <PermissionGate permission={PERMISSIONS.vehicle.update}>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Edit ${plate}`}
                  onClick={() => {
                    void navigate(buildRoute.vehicleEdit(row.original.id))
                  }}
                >
                  <Pencil className="size-4" />
                </Button>
              </PermissionGate>
            </div>
          )
        },
      },
    ],
    [navigate],
  )

  const data = vehiclesQuery.data
  const hasNoResults = data && data.total === 0 && !params.search && !params.filters?.status

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Vehicles"
          description="Manage your fleet vehicles and operational status."
          actions={
            <PermissionGate permission={PERMISSIONS.vehicle.create}>
              <Button
                type="button"
                onClick={() => {
                  void navigate(ROUTES.vehicleNew)
                }}
              >
                <Plus className="size-4" />
                New vehicle
              </Button>
            </PermissionGate>
          }
        />

        {vehiclesQuery.isError ? (
          <ErrorState description="We couldn't load vehicles. Please try again." />
        ) : hasNoResults ? (
          <EmptyState
            icon={Truck}
            title="No vehicles yet"
            description="Add your first vehicle to start tracking your fleet."
            action={
              <PermissionGate permission={PERMISSIONS.vehicle.create}>
                <Button
                  type="button"
                  onClick={() => {
                    void navigate(ROUTES.vehicleNew)
                  }}
                >
                  <Plus className="size-4" />
                  New vehicle
                </Button>
              </PermissionGate>
            }
          />
        ) : (
          <div className="space-y-4">
            <FilterBar
              search={params.search ?? ''}
              onSearchChange={setSearch}
              searchPlaceholder="Search vehicles…"
            >
              <Select
                aria-label="Filter by status"
                value={params.filters?.status ?? ''}
                onChange={(event) => {
                  setFilter('status', event.target.value || undefined)
                }}
                className="w-44"
              >
                <option value="">All statuses</option>
                <option value="AVAILABLE">Available</option>
                <option value="IN_USE">In use</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="INACTIVE">Inactive</option>
              </Select>
            </FilterBar>

            <DataTable
              columns={columns}
              data={data?.data ?? []}
              isLoading={vehiclesQuery.isLoading}
              emptyMessage="No vehicles match your filters."
              sort={params.sort}
              onSortChange={setSort}
              getRowId={(row) => row.id}
              renderMobileCard={(vehicle) => (
                <Card className="gap-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{vehicle.plateNumber}</p>
                      <p className="text-muted-foreground truncate text-sm">
                        {vehicle.description ?? vehicle.vehicleType ?? '—'}
                      </p>
                    </div>
                    <StatusBadge
                      label={vehicleStatusLabel(vehicle.status, vehicle.deletedAt)}
                      tone={vehicleStatusTone(vehicle.status, vehicle.deletedAt)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        void navigate(buildRoute.vehicleDetail(vehicle.id))
                      }}
                    >
                      View
                    </Button>
                    <PermissionGate permission={PERMISSIONS.vehicle.update}>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          void navigate(buildRoute.vehicleEdit(vehicle.id))
                        }}
                      >
                        Edit
                      </Button>
                    </PermissionGate>
                  </div>
                </Card>
              )}
              footer={
                data ? (
                  <Pagination
                    page={data.page}
                    pageSize={data.pageSize}
                    total={data.total}
                    onPageChange={setPage}
                  />
                ) : null
              }
            />
          </div>
        )}
      </div>
    </PageContainer>
  )
}
