import type { StatusTone } from '@/components/common/StatusBadge'

import type { TripStatus } from '../types/trip.types'

const TRIP_STATUS_LABELS: Record<TripStatus, string> = {
  DRAFT: 'Draft',
  STARTED: 'Started',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
}

const TRIP_STATUS_TONES: Record<TripStatus, StatusTone> = {
  DRAFT: 'neutral',
  STARTED: 'active',
  COMPLETED: 'active',
  CANCELLED: 'inactive',
}

export function tripStatusLabel(status: TripStatus): string {
  return TRIP_STATUS_LABELS[status]
}

/** Safe label for unknown status strings from API or filters. */
export function formatTripStatusLabel(status: string): string {
  if (status in TRIP_STATUS_LABELS) {
    return TRIP_STATUS_LABELS[status as TripStatus]
  }
  if (status === 'SCHEDULED') {
    return 'Upcoming draft'
  }
  return status.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

export function tripStatusTone(status: TripStatus): StatusTone {
  return TRIP_STATUS_TONES[status]
}

export const TRIP_STATUS_OPTIONS: TripStatus[] = ['DRAFT', 'STARTED', 'COMPLETED', 'CANCELLED']
