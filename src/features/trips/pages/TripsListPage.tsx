import type { ColumnDef } from '@tanstack/react-table'
import { MapPin, Pencil, Plus } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router'

import { DataTable } from '@/components/common/DataTable'
import { FilterBar } from '@/components/common/FilterBar'
import { PageContainer } from '@/components/common/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { Pagination } from '@/components/common/Pagination'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { PERMISSIONS } from '@/constants/permissions'
import { buildRoute, ROUTES } from '@/constants/routes'
import { PermissionGate } from '@/features/authorization/components/PermissionGate'
import { useListQuery } from '@/hooks/useListQuery'
import { formatDate } from '@/utils/format-date'

import { TripStatusBadge } from '../components/TripStatusBadge'
import { tripStatusLabel, TRIP_STATUS_OPTIONS } from '../lib/trip-status'
import { useTripDashboard, useTrips } from '../hooks/useTrips'
import type { TripSummary } from '../types/trip.types'

function tripRouteLabel(trip: TripSummary): string {
  return `${trip.origin} → ${trip.destination}`
}

export default function TripsListPage() {
  const navigate = useNavigate()
  const { params, setSearch, setPage, setSort, setFilter } = useListQuery({
    defaultSort: { field: 'scheduledStart', direction: 'desc' },
  })
  const tripsQuery = useTrips(params)
  const dashboardQuery = useTripDashboard()

  useEffect(() => {
    document.title = 'Trips | Scrappy'
  }, [])

  const columns = useMemo<ColumnDef<TripSummary>[]>(
    () => [
      {
        id: 'tripNumber',
        header: 'Trip',
        enableSorting: false,
        cell: ({ row }) => (
          <div>
            <p className="font-medium">{row.original.tripNumber ?? '—'}</p>
            <p className="text-muted-foreground text-sm">{tripRouteLabel(row.original)}</p>
          </div>
        ),
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <TripStatusBadge status={row.original.status} />,
      },
      {
        id: 'scheduledStart',
        accessorKey: 'scheduledStart',
        header: 'Scheduled start',
        cell: ({ row }) =>
          row.original.scheduledStart ? formatDate(row.original.scheduledStart) : '—',
      },
      {
        id: 'vehicle',
        header: 'Vehicle',
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.vehicle?.plateNumber ?? '—'}</span>
        ),
      },
      {
        id: 'members',
        header: 'Members',
        enableSorting: false,
        cell: ({ row }) => <span className="tabular-nums">{row.original.memberCount ?? 0}</span>,
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-end gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                void navigate(buildRoute.tripDetail(row.original.id))
              }}
            >
              View
            </Button>
            <PermissionGate permission={PERMISSIONS.trips.update}>
              {row.original.status === 'DRAFT' ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Edit ${tripRouteLabel(row.original)}`}
                  onClick={() => {
                    void navigate(buildRoute.tripEdit(row.original.id))
                  }}
                >
                  <Pencil className="size-4" />
                </Button>
              ) : null}
            </PermissionGate>
          </div>
        ),
      },
    ],
    [navigate],
  )

  const data = tripsQuery.data
  const hasFilters = Boolean(params.search ?? params.filters?.status)
  const hasNoResults = data && data.total === 0 && !hasFilters
  const dashboard = dashboardQuery.data

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Trips"
          description="Plan, schedule, and track business trips."
          actions={
            <PermissionGate permission={PERMISSIONS.trips.create}>
              <Button
                type="button"
                onClick={() => {
                  void navigate(ROUTES.tripsNew)
                }}
              >
                <Plus className="size-4" />
                New trip
              </Button>
            </PermissionGate>
          }
        />

        {dashboardQuery.isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-20 rounded-lg" />
            ))}
          </div>
        ) : dashboard ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {(
              [
                ['Ready', dashboard.draftCount, 'Draft trips due today or overdue'],
                ['Upcoming', dashboard.scheduledCount, 'Draft trips scheduled in the future'],
                ['Started', dashboard.startedCount, 'Trips in progress'],
                ['Completed', dashboard.completedCount, 'Finished trips'],
                ['Cancelled', dashboard.cancelledCount, 'Cancelled trips'],
              ] as const
            ).map(([label, count, hint]) => (
              <Card key={label} className="p-4">
                <p className="text-muted-foreground text-sm">{label}</p>
                <p className="text-2xl font-semibold tabular-nums">{count ?? 0}</p>
                <p className="text-muted-foreground mt-1 text-xs">{hint}</p>
              </Card>
            ))}
          </div>
        ) : null}

        {tripsQuery.isError ? (
          <div className="space-y-4">
            <ErrorState description="We couldn't load trips. Please try again." />
            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  void tripsQuery.refetch()
                }}
              >
                Retry
              </Button>
            </div>
          </div>
        ) : hasNoResults ? (
          <EmptyState
            icon={MapPin}
            title="No trips yet"
            description="Create a trip to plan routes, assign members, and link transactions."
            action={
              <PermissionGate permission={PERMISSIONS.trips.create}>
                <Button
                  type="button"
                  onClick={() => {
                    void navigate(ROUTES.tripsNew)
                  }}
                >
                  <Plus className="size-4" />
                  New trip
                </Button>
              </PermissionGate>
            }
          />
        ) : (
          <div className="space-y-4">
            <FilterBar
              search={params.search ?? ''}
              onSearchChange={setSearch}
              searchPlaceholder="Search by trip number…"
            >
              <Select
                aria-label="Filter by status"
                value={params.filters?.status ?? ''}
                onChange={(event) => {
                  const value = event.target.value
                  setFilter('status', value ? value : undefined)
                }}
                className="w-44"
              >
                <option value="">All statuses</option>
                {TRIP_STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {tripStatusLabel(status)}
                  </option>
                ))}
              </Select>
            </FilterBar>

            <Card>
              <DataTable
                columns={columns}
                data={data?.data ?? []}
                isLoading={tripsQuery.isLoading}
                sort={params.sort}
                onSortChange={setSort}
              />
            </Card>

            {data ? (
              <Pagination
                page={params.page}
                pageSize={params.pageSize}
                total={data.total}
                onPageChange={setPage}
              />
            ) : null}
          </div>
        )}
      </div>
    </PageContainer>
  )
}
