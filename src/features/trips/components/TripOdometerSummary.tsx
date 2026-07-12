import type { TripDetail } from '../types/trip.types'

interface TripOdometerSummaryProps {
  trip: TripDetail
}

export function TripOdometerSummary({ trip }: TripOdometerSummaryProps) {
  const hasData =
    trip.startingOdometer != null || trip.endingOdometer != null || trip.distance != null

  if (!hasData) {
    return <p className="text-muted-foreground text-sm">No odometer readings recorded yet.</p>
  }

  return (
    <dl className="grid gap-4 sm:grid-cols-3">
      <div>
        <dt className="text-muted-foreground text-sm">Starting odometer</dt>
        <dd className="font-medium tabular-nums">
          {trip.startingOdometer != null ? trip.startingOdometer.toLocaleString() : '—'}
        </dd>
      </div>
      <div>
        <dt className="text-muted-foreground text-sm">Ending odometer</dt>
        <dd className="font-medium tabular-nums">
          {trip.endingOdometer != null ? trip.endingOdometer.toLocaleString() : '—'}
        </dd>
      </div>
      <div>
        <dt className="text-muted-foreground text-sm">Distance</dt>
        <dd className="font-medium tabular-nums">
          {trip.distance != null ? `${trip.distance.toLocaleString()} km` : '—'}
        </dd>
      </div>
    </dl>
  )
}
