import type { ColumnDef } from '@tanstack/react-table'
import { Pencil, Plus, Warehouse as WarehouseIcon } from 'lucide-react'
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
import { orgEntityStatusLabel, orgEntityStatusTone } from '@/features/branches/lib/org-status'
import { PermissionGate } from '@/features/authorization/components/PermissionGate'
import { useListQuery } from '@/hooks/useListQuery'

import { useWarehouses } from '../hooks/useWarehouses'
import type { Warehouse } from '../types/warehouse.types'

export default function WarehousesListPage() {
  const navigate = useNavigate()
  const { params, setSearch, setPage, setSort, setFilter } = useListQuery({
    defaultSort: { field: 'name', direction: 'asc' },
  })
  const warehousesQuery = useWarehouses(params)

  useEffect(() => {
    document.title = 'Warehouses | Scrappy'
  }, [])

  const columns = useMemo<ColumnDef<Warehouse>[]>(
    () => [
      {
        id: 'name',
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
      },
      {
        id: 'branch',
        header: 'Branch',
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.branch?.name ?? row.original.branchId ?? '—'}
          </span>
        ),
      },
      {
        id: 'contact',
        header: 'Contact',
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.contactNumber ?? '—'}</span>
        ),
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <StatusBadge
            label={orgEntityStatusLabel(row.original.status, row.original.deletedAt)}
            tone={orgEntityStatusTone(row.original.status, row.original.deletedAt)}
          />
        ),
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        cell: ({ row }) => {
          const name = row.original.name
          return (
            <div className="flex justify-end gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  void navigate(buildRoute.warehouseDetail(row.original.id))
                }}
              >
                View
              </Button>
              <PermissionGate permission={PERMISSIONS.warehouse.update}>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Edit ${name}`}
                  onClick={() => {
                    void navigate(buildRoute.warehouseEdit(row.original.id))
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

  const data = warehousesQuery.data
  const hasNoResults = data && data.total === 0 && !params.search && !params.filters?.status

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Warehouses"
          description="Manage warehouse locations and storage facilities."
          actions={
            <PermissionGate permission={PERMISSIONS.warehouse.create}>
              <Button
                type="button"
                onClick={() => {
                  void navigate(ROUTES.warehouseNew)
                }}
              >
                <Plus className="size-4" />
                New warehouse
              </Button>
            </PermissionGate>
          }
        />

        {warehousesQuery.isError ? (
          <ErrorState description="We couldn't load warehouses. Please try again." />
        ) : hasNoResults ? (
          <EmptyState
            icon={WarehouseIcon}
            title="No warehouses yet"
            description="Add your first warehouse to start tracking storage locations."
            action={
              <PermissionGate permission={PERMISSIONS.warehouse.create}>
                <Button
                  type="button"
                  onClick={() => {
                    void navigate(ROUTES.warehouseNew)
                  }}
                >
                  <Plus className="size-4" />
                  New warehouse
                </Button>
              </PermissionGate>
            }
          />
        ) : (
          <div className="space-y-4">
            <FilterBar
              search={params.search ?? ''}
              onSearchChange={setSearch}
              searchPlaceholder="Search warehouses…"
            >
              <Select
                aria-label="Filter by status"
                value={params.filters?.status ?? ''}
                onChange={(event) => {
                  setFilter('status', event.target.value || undefined)
                }}
                className="w-40"
              >
                <option value="">All statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </Select>
            </FilterBar>

            <DataTable
              columns={columns}
              data={data?.data ?? []}
              isLoading={warehousesQuery.isLoading}
              emptyMessage="No warehouses match your filters."
              sort={params.sort}
              onSortChange={setSort}
              getRowId={(row) => row.id}
              renderMobileCard={(warehouse) => (
                <Card className="gap-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{warehouse.name}</p>
                      <p className="text-muted-foreground truncate text-sm">
                        {warehouse.branch?.name ?? warehouse.contactNumber ?? '—'}
                      </p>
                    </div>
                    <StatusBadge
                      label={orgEntityStatusLabel(warehouse.status, warehouse.deletedAt)}
                      tone={orgEntityStatusTone(warehouse.status, warehouse.deletedAt)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        void navigate(buildRoute.warehouseDetail(warehouse.id))
                      }}
                    >
                      View
                    </Button>
                    <PermissionGate permission={PERMISSIONS.warehouse.update}>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          void navigate(buildRoute.warehouseEdit(warehouse.id))
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
