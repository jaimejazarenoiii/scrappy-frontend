import type { ColumnDef } from '@tanstack/react-table'
import { useMemo, useState } from 'react'

import { DataTable } from '@/components/common/DataTable'
import { FilterBar } from '@/components/common/FilterBar'
import { Pagination } from '@/components/common/Pagination'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { TripStatusBadge } from '@/features/trips/components/TripStatusBadge'
import { useTrips } from '@/features/trips/hooks/useTrips'
import { TRIP_STATUS_OPTIONS, tripStatusLabel } from '@/features/trips/lib/trip-status'
import type { TripSummary } from '@/features/trips/types/trip.types'
import type { ListQueryParams } from '@/types/pagination.types'
import { formatDate } from '@/utils/format-date'

interface TransactionTripPickerProps {
  value: string
  onChange: (tripId: string) => void
  disabled?: boolean
  error?: string
}

function tripRouteLabel(trip: TripSummary): string {
  return `${trip.origin} → ${trip.destination}`
}

export function TransactionTripPicker({
  value,
  onChange,
  disabled = false,
  error,
}: TransactionTripPickerProps) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)

  const params = useMemo<ListQueryParams>(
    () => ({
      page,
      pageSize: 10,
      search: search || undefined,
      sort: { field: 'scheduledStart', direction: 'desc' },
      filters: {
        ...(status ? { status } : {}),
      },
    }),
    [page, search, status],
  )

  const tripsQuery = useTrips(params)

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
        id: 'scheduledStart',
        header: 'Scheduled',
        enableSorting: false,
        cell: ({ row }) =>
          row.original.scheduledStart ? formatDate(row.original.scheduledStart) : '—',
      },
      {
        id: 'status',
        header: 'Status',
        enableSorting: false,
        cell: ({ row }) => <TripStatusBadge status={row.original.status} />,
      },
      {
        id: 'vehicle',
        header: 'Vehicle',
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm">
            {row.original.vehicle?.plateNumber ?? '—'}
          </span>
        ),
      },
      {
        id: 'select',
        header: '',
        enableSorting: false,
        cell: ({ row }) => {
          const selected = row.original.id === value
          return (
            <div className="flex justify-end">
              <Button
                type="button"
                size="sm"
                variant={selected ? 'default' : 'outline'}
                disabled={disabled}
                onClick={() => {
                  onChange(selected ? '' : row.original.id)
                }}
              >
                {selected ? 'Selected' : 'Select'}
              </Button>
            </div>
          )
        },
      },
    ],
    [value, onChange, disabled],
  )

  const data = tripsQuery.data
  const selectedTrip = data?.data.find((trip) => trip.id === value)

  return (
    <div className="space-y-4">
      <FilterBar
        search={search}
        onSearchChange={(next) => {
          setSearch(next)
          setPage(1)
        }}
        searchPlaceholder="Search by trip number…"
      >
        <Select
          aria-label="Filter by status"
          value={status}
          disabled={disabled}
          className="w-40"
          onChange={(event) => {
            setStatus(event.target.value)
            setPage(1)
          }}
        >
          <option value="">All statuses</option>
          {TRIP_STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {tripStatusLabel(option)}
            </option>
          ))}
        </Select>
      </FilterBar>

      {selectedTrip ? (
        <p className="text-sm">
          Selected:{' '}
          <span className="font-medium">
            {selectedTrip.tripNumber ?? tripRouteLabel(selectedTrip)}
          </span>
        </p>
      ) : value ? (
        <p className="text-muted-foreground text-sm">Selected trip is outside the current page.</p>
      ) : null}

      {tripsQuery.isLoading ? (
        <Skeleton className="h-48 w-full rounded-md" />
      ) : tripsQuery.isError ? (
        <ErrorState description="Could not load trips. Check that you have access to the trips list." />
      ) : (
        <>
          <DataTable columns={columns} data={data?.data ?? []} />
          {data ? (
            <Pagination page={page} pageSize={10} total={data.total} onPageChange={setPage} />
          ) : null}
        </>
      )}

      {error ? <p className="text-destructive text-sm">{error}</p> : null}
    </div>
  )
}
