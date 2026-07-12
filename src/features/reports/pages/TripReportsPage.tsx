import type { ColumnDef } from '@tanstack/react-table'
import { Link } from 'react-router'

import { PermissionGate } from '@/features/authorization/components/PermissionGate'
import { ReportDomainPage } from '@/features/reports/components/ReportDomainPage'
import { useTripReport } from '@/features/reports/hooks/useReportQueries'
import type { TripReportRow } from '@/features/reports/types/reports.types'
import { PERMISSIONS } from '@/constants/permissions'
import { buildRoute } from '@/constants/routes'

const columns: ColumnDef<TripReportRow>[] = [
  {
    id: 'scheduledStart',
    accessorKey: 'date',
    header: 'Date',
    enableSorting: true,
  },
  {
    accessorKey: 'tripNumber',
    header: 'Trip',
    cell: ({ row }) => (
      <PermissionGate permission={PERMISSIONS.trips.view}>
        <Link
          to={buildRoute.tripDetail(row.original.id)}
          className="text-primary font-medium hover:underline"
        >
          {row.original.tripNumber ?? row.original.id.slice(0, 8)}
        </Link>
      </PermissionGate>
    ),
  },
  { accessorKey: 'status', header: 'Status' },
  {
    accessorKey: 'vehiclePlate',
    header: 'Vehicle',
    cell: ({ row }) =>
      row.original.vehicleId ? (
        <PermissionGate permission={PERMISSIONS.vehicle.view}>
          <Link
            to={buildRoute.vehicleDetail(row.original.vehicleId)}
            className="text-primary hover:underline"
          >
            {row.original.vehiclePlate ?? row.original.vehicleId.slice(0, 8)}
          </Link>
        </PermissionGate>
      ) : (
        (row.original.vehiclePlate ?? '—')
      ),
  },
  { accessorKey: 'employeeName', header: 'Members' },
  { accessorKey: 'origin', header: 'Origin' },
  { accessorKey: 'destination', header: 'Destination' },
]

export default function TripReportsPage() {
  const query = useTripReport()

  return (
    <ReportDomainPage
      domain="trips"
      title="Trip reports"
      description="Trip status, vehicle utilization, and employee trip history."
      query={query}
      columns={columns}
      renderMobileCard={(row) => (
        <div className="bg-card space-y-1 rounded-xl border p-4 text-sm">
          <p className="font-medium">{row.tripNumber ?? row.status ?? 'Trip'}</p>
          <p className="text-muted-foreground">
            {row.date} · {row.vehiclePlate ?? '—'} · {row.employeeName ?? '—'}
          </p>
        </div>
      )}
    />
  )
}
