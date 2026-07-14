import type { TripDetail } from '../types/trip.types'
import { resolveTripDistance } from '../lib/trip-odometer'

interface TripOdometerSummaryProps {
  trip: TripDetail
}

function formatReading(value: number | null): string {
  if (value == null) return '—'
  return value.toLocaleString('en-PH', { maximumFractionDigits: 3 })
}

export function TripOdometerSummary({ trip }: TripOdometerSummaryProps) {
  const distance = resolveTripDistance(trip.startingOdometer, trip.endingOdometer, trip.distance)
  const hasData = trip.startingOdometer != null || trip.endingOdometer != null || distance != null

  if (!hasData) {
    return <p className="text-muted-foreground text-sm">No odometer readings recorded yet.</p>
  }

  return (
    <dl className="grid gap-4 sm:grid-cols-3">
      <div>
        <dt className="text-muted-foreground text-sm">Starting odometer</dt>
        <dd className="font-medium tabular-nums">{formatReading(trip.startingOdometer)}</dd>
      </div>
      <div>
        <dt className="text-muted-foreground text-sm">Ending odometer</dt>
        <dd className="font-medium tabular-nums">{formatReading(trip.endingOdometer)}</dd>
      </div>
      <div>
        <dt className="text-muted-foreground text-sm">Distance</dt>
        <dd className="font-medium tabular-nums">
          {distance != null ? `${formatReading(distance)} km` : '—'}
        </dd>
      </div>
    </dl>
  )
}
