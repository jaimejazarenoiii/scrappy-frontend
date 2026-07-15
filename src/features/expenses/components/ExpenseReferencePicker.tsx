import type { ColumnDef } from '@tanstack/react-table'
import { useMemo, useState } from 'react'

import { DataTable } from '@/components/common/DataTable'
import { FilterBar } from '@/components/common/FilterBar'
import { FormField } from '@/components/common/FormField'
import { Pagination } from '@/components/common/Pagination'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useBranchOptions } from '@/features/branches/hooks/useBranchOptions'
import { TripStatusBadge } from '@/features/trips/components/TripStatusBadge'
import { useTrips } from '@/features/trips/hooks/useTrips'
import { TRIP_STATUS_OPTIONS, tripStatusLabel } from '@/features/trips/lib/trip-status'
import type { TripSummary } from '@/features/trips/types/trip.types'
import { useVehicles } from '@/features/vehicles/hooks/useVehicles'
import { useWarehouseOptions } from '@/features/warehouses/hooks/useWarehouseOptions'
import { useAuthStore } from '@/store/auth.store'
import type { ListQueryParams } from '@/types/pagination.types'
import { formatDate } from '@/utils/format-date'

import type { ExpenseReferenceType } from '../types/expense.types'

interface ExpenseReferencePickerProps {
  referenceType: ExpenseReferenceType
  referenceId: string
  onReferenceIdChange: (value: string) => void
  disabled?: boolean
  error?: string
}

function tripRouteLabel(trip: TripSummary): string {
  return `${trip.origin} → ${trip.destination}`
}

function TripReferencePicker({
  value,
  onChange,
  disabled,
  error,
}: {
  value: string
  onChange: (tripId: string) => void
  disabled?: boolean
  error?: string
}) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)

  const params = useMemo<ListQueryParams>(
    () => ({
      page,
      pageSize: 10,
      search: search || undefined,
      sort: { field: 'scheduledStart', direction: 'desc' },
      filters: status ? { status } : undefined,
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
        id: 'select',
        header: '',
        enableSorting: false,
        cell: ({ row }) => (
          <Button
            type="button"
            size="sm"
            variant={value === row.original.id ? 'default' : 'outline'}
            disabled={disabled}
            onClick={() => {
              onChange(row.original.id)
            }}
          >
            {value === row.original.id ? 'Selected' : 'Select'}
          </Button>
        ),
      },
    ],
    [disabled, onChange, value],
  )

  return (
    <div className="min-w-0 space-y-4 rounded-lg border p-3 sm:p-4">
      <FilterBar search={search} onSearchChange={setSearch} searchPlaceholder="Search trips…">
        <Select
          aria-label="Filter trips by status"
          value={status}
          onChange={(event) => {
            setStatus(event.target.value)
            setPage(1)
          }}
          className="w-full sm:w-44"
        >
          <option value="">All statuses</option>
          {TRIP_STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {tripStatusLabel(option)}
            </option>
          ))}
        </Select>
      </FilterBar>

      {tripsQuery.isError ? (
        <ErrorState description="Could not load trips." />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={tripsQuery.data?.data ?? []}
            isLoading={tripsQuery.isLoading}
            getRowId={(row) => row.id}
            renderMobileCard={(trip) => {
              const selected = value === trip.id
              return (
                <Card className="gap-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{trip.tripNumber ?? '—'}</p>
                      <p className="text-muted-foreground text-sm break-words">
                        {tripRouteLabel(trip)}
                      </p>
                      <p className="text-muted-foreground mt-1 text-sm">
                        {trip.scheduledStart ? formatDate(trip.scheduledStart) : '—'}
                      </p>
                    </div>
                    <TripStatusBadge status={trip.status} />
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    className="w-full"
                    variant={selected ? 'default' : 'outline'}
                    disabled={disabled}
                    onClick={() => {
                      onChange(trip.id)
                    }}
                  >
                    {selected ? 'Selected' : 'Select'}
                  </Button>
                </Card>
              )
            }}
            footer={
              tripsQuery.data ? (
                <Pagination
                  page={page}
                  pageSize={10}
                  total={tripsQuery.data.total}
                  onPageChange={setPage}
                />
              ) : null
            }
          />
        </>
      )}

      {error ? <p className="text-destructive text-sm">{error}</p> : null}
    </div>
  )
}

export function ExpenseReferencePicker({
  referenceType,
  referenceId,
  onReferenceIdChange,
  disabled = false,
  error,
}: ExpenseReferencePickerProps) {
  const tenant = useAuthStore((state) => state.tenant)
  const branchesQuery = useBranchOptions()
  const warehousesQuery = useWarehouseOptions()
  const vehiclesQuery = useVehicles({ page: 1, pageSize: 100 })

  if (referenceType === 'COMPANY') {
    return (
      <FormField label="Business" htmlFor="referenceCompany">
        <p className="text-muted-foreground rounded-md border px-3 py-2 text-sm">
          {tenant?.companyName ?? 'Current business'}
        </p>
      </FormField>
    )
  }

  if (referenceType === 'BRANCH') {
    if (branchesQuery.isLoading) return <Skeleton className="h-10 w-full" />
    return (
      <FormField label="Branch" htmlFor="referenceId" error={error} required>
        <Select
          id="referenceId"
          value={referenceId}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          onChange={(event) => {
            onReferenceIdChange(event.target.value)
          }}
        >
          <option value="">Select branch</option>
          {(branchesQuery.data ?? []).map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </Select>
      </FormField>
    )
  }

  if (referenceType === 'WAREHOUSE') {
    if (warehousesQuery.isLoading) return <Skeleton className="h-10 w-full" />
    return (
      <FormField label="Warehouse" htmlFor="referenceId" error={error} required>
        <Select
          id="referenceId"
          value={referenceId}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          onChange={(event) => {
            onReferenceIdChange(event.target.value)
          }}
        >
          <option value="">Select warehouse</option>
          {(warehousesQuery.data ?? []).map((warehouse) => (
            <option key={warehouse.id} value={warehouse.id}>
              {warehouse.name}
            </option>
          ))}
        </Select>
      </FormField>
    )
  }

  if (referenceType === 'VEHICLE') {
    if (vehiclesQuery.isLoading) return <Skeleton className="h-10 w-full" />
    return (
      <FormField label="Vehicle" htmlFor="referenceId" error={error} required>
        <Select
          id="referenceId"
          value={referenceId}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          onChange={(event) => {
            onReferenceIdChange(event.target.value)
          }}
        >
          <option value="">Select vehicle</option>
          {(vehiclesQuery.data?.data ?? []).map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.plateNumber}
            </option>
          ))}
        </Select>
      </FormField>
    )
  }

  return (
    <FormField label="Trip" error={error} required>
      <TripReferencePicker
        value={referenceId}
        onChange={onReferenceIdChange}
        disabled={disabled}
        error={error}
      />
    </FormField>
  )
}
