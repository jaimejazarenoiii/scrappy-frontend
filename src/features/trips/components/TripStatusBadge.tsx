import { StatusBadge } from '@/components/common/StatusBadge'

import { tripStatusLabel, tripStatusTone } from '../lib/trip-status'
import type { TripStatus } from '../types/trip.types'

interface TripStatusBadgeProps {
  status: TripStatus
}

export function TripStatusBadge({ status }: TripStatusBadgeProps) {
  return <StatusBadge label={tripStatusLabel(status)} tone={tripStatusTone(status)} />
}
