import {
  isCancelledStatus,
  isCompletedStatus,
  isDraftStatus,
  isStartedStatus,
} from './trip-workflow'
import type { TripDetail } from '../types/trip.types'
import type { TripLoadSummaryItem } from '../types/trip-load.types'
import { indicatorForSummaryItem } from '../types/trip-load.types'

/** Feature is always on; section is always shown on trip detail. */
export function shouldShowTripLoadSection(): boolean {
  return true
}

export function isTripLoadEditable(trip: Pick<TripDetail, 'status'>): boolean {
  return isDraftStatus(trip.status)
}

export function shouldShowProgressView(trip: Pick<TripDetail, 'status'>): boolean {
  return (
    isStartedStatus(trip.status) || isCompletedStatus(trip.status) || isCancelledStatus(trip.status)
  )
}

export function hasTripLoadAlertRows(items: TripLoadSummaryItem[]): boolean {
  return items.some((item) => {
    const status = indicatorForSummaryItem(item)
    return status === 'WARNING' || status === 'EXCEEDED'
  })
}
