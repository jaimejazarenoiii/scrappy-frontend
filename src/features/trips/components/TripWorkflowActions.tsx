import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { PERMISSIONS } from '@/constants/permissions'
import { PermissionGate } from '@/features/authorization/components/PermissionGate'

import { CancelTripDialog } from './CancelTripDialog'
import { CompleteTripDialog } from './CompleteTripDialog'
import { StartTripDialog } from './StartTripDialog'
import { useCancelTrip, useCompleteTrip, useStartTrip } from '../hooks/useTripWorkflowMutations'
import { useTripDialogStore } from '../hooks/useTripDialogStore'
import {
  isCancelledStatus,
  isCompletedStatus,
  isDraftStatus,
  isStartedStatus,
} from '../lib/trip-workflow'
import type { TripDetail } from '../types/trip.types'

interface TripWorkflowActionsProps {
  trip: TripDetail
}

export function TripWorkflowActions({ trip }: TripWorkflowActionsProps) {
  const { activeDialog, openDialog, closeDialog } = useTripDialogStore()

  const startMutation = useStartTrip(trip.id)
  const completeMutation = useCompleteTrip(trip.id)
  const cancelMutation = useCancelTrip(trip.id)

  const isPending =
    startMutation.isPending || completeMutation.isPending || cancelMutation.isPending

  if (isCompletedStatus(trip.status) || isCancelledStatus(trip.status)) {
    return null
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <PermissionGate permission={PERMISSIONS.trips.start}>
          {isDraftStatus(trip.status) ? (
            <Button
              type="button"
              size="sm"
              disabled={isPending}
              onClick={() => {
                openDialog('start')
              }}
            >
              {startMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
              Start trip
            </Button>
          ) : null}
        </PermissionGate>

        <PermissionGate permission={PERMISSIONS.trips.complete}>
          {isStartedStatus(trip.status) ? (
            <Button
              type="button"
              size="sm"
              disabled={isPending}
              onClick={() => {
                openDialog('complete')
              }}
            >
              {completeMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
              Complete trip
            </Button>
          ) : null}
        </PermissionGate>

        <PermissionGate permission={PERMISSIONS.trips.cancel}>
          {isDraftStatus(trip.status) ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isPending}
              onClick={() => {
                openDialog('cancel')
              }}
            >
              Cancel trip
            </Button>
          ) : null}
        </PermissionGate>
      </div>

      <StartTripDialog
        open={activeDialog === 'start'}
        onOpenChange={(open) => {
          if (!open) closeDialog()
        }}
        isLoading={startMutation.isPending}
        onSubmit={(values) => {
          void startMutation.mutateAsync({ startingOdometer: values.startingOdometer })
        }}
      />

      <CompleteTripDialog
        open={activeDialog === 'complete'}
        onOpenChange={(open) => {
          if (!open) closeDialog()
        }}
        isLoading={completeMutation.isPending}
        startingOdometer={trip.startingOdometer}
        onSubmit={(values) => {
          void completeMutation.mutateAsync({ endingOdometer: values.endingOdometer })
        }}
      />

      <CancelTripDialog
        open={activeDialog === 'cancel'}
        onOpenChange={(open) => {
          if (!open) closeDialog()
        }}
        isLoading={cancelMutation.isPending}
        onSubmit={(values) => {
          void cancelMutation.mutateAsync({
            cancellationReason: values.cancellationReason?.trim()
              ? values.cancellationReason.trim()
              : undefined,
          })
        }}
      />
    </>
  )
}
