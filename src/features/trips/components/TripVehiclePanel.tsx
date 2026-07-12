import { Truck } from 'lucide-react'

import { EmptyState } from '@/components/feedback/EmptyState'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PERMISSIONS } from '@/constants/permissions'
import { PermissionGate } from '@/features/authorization/components/PermissionGate'

import { TripVehicleAssignDialog } from './TripVehicleAssignDialog'
import { useTripDialogStore } from '../hooks/useTripDialogStore'
import { isTerminalTripStatus } from '../lib/trip-workflow'
import type { TripDetail } from '../types/trip.types'

interface TripVehiclePanelProps {
  trip: TripDetail
}

export function TripVehiclePanel({ trip }: TripVehiclePanelProps) {
  const { activeDialog, openDialog, closeDialog } = useTripDialogStore()
  const vehicle = trip.vehicle
  const canManage = !isTerminalTripStatus(trip.status)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle>Assigned vehicle</CardTitle>
        <PermissionGate permission={PERMISSIONS.trips.update}>
          {canManage ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                openDialog('assignVehicle')
              }}
            >
              {vehicle ? 'Change vehicle' : 'Assign vehicle'}
            </Button>
          ) : null}
        </PermissionGate>
      </CardHeader>
      <CardContent>
        {vehicle ? (
          <dl className="space-y-2">
            <div>
              <dt className="text-muted-foreground text-sm">Plate number</dt>
              <dd className="font-medium">{vehicle.plateNumber}</dd>
            </div>
            {vehicle.description ? (
              <div>
                <dt className="text-muted-foreground text-sm">Description</dt>
                <dd>{vehicle.description}</dd>
              </div>
            ) : null}
            <div>
              <dt className="text-muted-foreground text-sm">Status</dt>
              <dd>{vehicle.status}</dd>
            </div>
          </dl>
        ) : (
          <EmptyState
            icon={Truck}
            title="No vehicle assigned"
            description="Assign a vehicle before scheduling or starting this trip."
          />
        )}
      </CardContent>

      <TripVehicleAssignDialog
        tripId={trip.id}
        open={activeDialog === 'assignVehicle'}
        onOpenChange={(open) => {
          if (!open) closeDialog()
        }}
        currentVehicleId={trip.vehicleId}
      />
    </Card>
  )
}
