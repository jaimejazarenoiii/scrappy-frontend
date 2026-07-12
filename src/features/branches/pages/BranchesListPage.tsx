import type { ColumnDef } from '@tanstack/react-table'
import { MapPin, Pencil, Plus } from 'lucide-react'
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
import { PermissionGate } from '@/features/authorization/components/PermissionGate'
import { useListQuery } from '@/hooks/useListQuery'

import { orgEntityStatusLabel, orgEntityStatusTone } from '../lib/org-status'
import { useBranches } from '../hooks/useBranches'
import type { Branch } from '../types/branch.types'

export default function BranchesListPage() {
  const navigate = useNavigate()
  const { params, setSearch, setPage, setSort, setFilter } = useListQuery({
    defaultSort: { field: 'name', direction: 'asc' },
  })
  const branchesQuery = useBranches(params)

  useEffect(() => {
    document.title = 'Branches | Scrappy'
  }, [])

  const columns = useMemo<ColumnDef<Branch>[]>(
    () => [
      {
        id: 'name',
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
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
        id: 'address',
        header: 'Address',
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.address ?? '—'}</span>
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
                  void navigate(buildRoute.branchDetail(row.original.id))
                }}
              >
                View
              </Button>
              <PermissionGate permission={PERMISSIONS.branch.update}>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Edit ${name}`}
                  onClick={() => {
                    void navigate(buildRoute.branchEdit(row.original.id))
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

  const data = branchesQuery.data
  const hasNoResults = data && data.total === 0 && !params.search && !params.filters?.status

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Branches"
          description="Manage your business branch locations."
          actions={
            <PermissionGate permission={PERMISSIONS.branch.create}>
              <Button
                type="button"
                onClick={() => {
                  void navigate(ROUTES.branchNew)
                }}
              >
                <Plus className="size-4" />
                New branch
              </Button>
            </PermissionGate>
          }
        />

        {branchesQuery.isError ? (
          <ErrorState description="We couldn't load branches. Please try again." />
        ) : hasNoResults ? (
          <EmptyState
            icon={MapPin}
            title="No branches yet"
            description="Add your first branch to start organizing your locations."
            action={
              <PermissionGate permission={PERMISSIONS.branch.create}>
                <Button
                  type="button"
                  onClick={() => {
                    void navigate(ROUTES.branchNew)
                  }}
                >
                  <Plus className="size-4" />
                  New branch
                </Button>
              </PermissionGate>
            }
          />
        ) : (
          <div className="space-y-4">
            <FilterBar
              search={params.search ?? ''}
              onSearchChange={setSearch}
              searchPlaceholder="Search branches…"
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
              isLoading={branchesQuery.isLoading}
              emptyMessage="No branches match your filters."
              sort={params.sort}
              onSortChange={setSort}
              getRowId={(row) => row.id}
              renderMobileCard={(branch) => (
                <Card className="gap-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{branch.name}</p>
                      <p className="text-muted-foreground truncate text-sm">
                        {branch.contactNumber ?? branch.address ?? '—'}
                      </p>
                    </div>
                    <StatusBadge
                      label={orgEntityStatusLabel(branch.status, branch.deletedAt)}
                      tone={orgEntityStatusTone(branch.status, branch.deletedAt)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        void navigate(buildRoute.branchDetail(branch.id))
                      }}
                    >
                      View
                    </Button>
                    <PermissionGate permission={PERMISSIONS.branch.update}>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          void navigate(buildRoute.branchEdit(branch.id))
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
