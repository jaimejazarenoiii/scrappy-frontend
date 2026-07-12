import type { TripStatus } from '../types/trip.types'

/** Display hints only — authorization is enforced by the backend and PermissionGate. */

export function isDraftStatus(status: TripStatus): boolean {
  return status === 'DRAFT'
}

export function isStartedStatus(status: TripStatus): boolean {
  return status === 'STARTED'
}

export function isCompletedStatus(status: TripStatus): boolean {
  return status === 'COMPLETED'
}

export function isCancelledStatus(status: TripStatus): boolean {
  return status === 'CANCELLED'
}

export function isTerminalTripStatus(status: TripStatus): boolean {
  return isCompletedStatus(status) || isCancelledStatus(status)
}

/** True when a draft trip's scheduled start is in the future (dashboard "upcoming" bucket). */
export function isUpcomingDraft(trip: {
  status: TripStatus
  scheduledStart: string | null
}): boolean {
  if (!isDraftStatus(trip.status) || !trip.scheduledStart) return false
  return new Date(trip.scheduledStart).getTime() > Date.now()
}
