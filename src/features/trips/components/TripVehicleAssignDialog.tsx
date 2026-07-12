import { useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useVehicles } from '@/features/vehicles/hooks/useVehicles'

import { useAssignTripVehicle } from '../hooks/useTripMutations'

interface TripVehicleAssignDialogProps {
  tripId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  currentVehicleId: string | null
}

export function TripVehicleAssignDialog({
  tripId,
  open,
  onOpenChange,
  currentVehicleId,
}: TripVehicleAssignDialogProps) {
  const vehiclesQuery = useVehicles({
    page: 1,
    pageSize: 100,
    filters: { status: 'AVAILABLE' },
  })
  const assignVehicle = useAssignTripVehicle(tripId)
  const [vehicleId, setVehicleId] = useState(currentVehicleId ?? '')

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setVehicleId(currentVehicleId ?? '')
        onOpenChange(next)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign vehicle</DialogTitle>
          <DialogDescription>
            Select a vehicle for this trip. Availability and conflicts are validated by the backend.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {vehiclesQuery.isLoading ? (
            <Skeleton className="h-10 w-full rounded-md" />
          ) : (
            <Select
              value={vehicleId}
              onChange={(event) => {
                setVehicleId(event.target.value)
              }}
              disabled={assignVehicle.isPending}
            >
              <option value="">Select vehicle</option>
              {(vehiclesQuery.data?.data ?? []).map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.plateNumber}
                  {vehicle.description ? ` — ${vehicle.description}` : ''}
                </option>
              ))}
            </Select>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={assignVehicle.isPending}
            onClick={() => {
              onOpenChange(false)
            }}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={assignVehicle.isPending || !vehicleId}
            onClick={() => {
              void assignVehicle.mutateAsync(
                { vehicleId },
                {
                  onSuccess: () => {
                    onOpenChange(false)
                  },
                },
              )
            }}
          >
            {assignVehicle.isPending ? 'Saving…' : 'Save vehicle'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
