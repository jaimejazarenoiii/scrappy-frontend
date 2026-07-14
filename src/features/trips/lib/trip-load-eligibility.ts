import {
  isCancelledStatus,
  isCompletedStatus,
  isDraftStatus,
  isStartedStatus,
} from './trip-workflow'
import type { TripDetail } from '../types/trip.types'
import type { TripLoadProgressRow } from '../types/trip-load.types'

/** Display hints only — authorization is enforced by the backend and PermissionGate. */

export function shouldShowTripLoadSection(trip: Pick<TripDetail, 'tripLoadEnabled'>): boolean {
  return trip.tripLoadEnabled
}

export function isTripLoadEditable(trip: Pick<TripDetail, 'status' | 'tripLoadEnabled'>): boolean {
  return trip.tripLoadEnabled && isDraftStatus(trip.status)
}

export function shouldShowProgressView(
  trip: Pick<TripDetail, 'status' | 'tripLoadEnabled'>,
): boolean {
  if (!trip.tripLoadEnabled) return false
  return (
    isStartedStatus(trip.status) || isCompletedStatus(trip.status) || isCancelledStatus(trip.status)
  )
}

export function hasTripLoadAlertRows(rows: TripLoadProgressRow[]): boolean {
  return rows.some((row) => row.indicatorStatus === 'WARNING' || row.indicatorStatus === 'EXCEEDED')
}
