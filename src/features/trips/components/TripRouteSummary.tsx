import { formatDate } from '@/utils/format-date'

import type { TripDetail } from '../types/trip.types'

interface TripRouteSummaryProps {
  trip: TripDetail
}

export function TripRouteSummary({ trip }: TripRouteSummaryProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <p className="text-muted-foreground text-sm">Origin</p>
        <p className="font-medium">{trip.origin}</p>
      </div>
      <div>
        <p className="text-muted-foreground text-sm">Destination</p>
        <p className="font-medium">{trip.destination}</p>
      </div>
      <div>
        <p className="text-muted-foreground text-sm">Scheduled start</p>
        <p className="font-medium">
          {trip.scheduledStart ? (
            <time dateTime={trip.scheduledStart}>{formatDate(trip.scheduledStart)}</time>
          ) : (
            '—'
          )}
        </p>
      </div>
      <div>
        <p className="text-muted-foreground text-sm">Actual start</p>
        <p className="font-medium">
          {trip.actualStart ? (
            <time dateTime={trip.actualStart}>{formatDate(trip.actualStart)}</time>
          ) : (
            '—'
          )}
        </p>
      </div>
      <div>
        <p className="text-muted-foreground text-sm">Actual completion</p>
        <p className="font-medium">
          {trip.actualEnd ? (
            <time dateTime={trip.actualEnd}>{formatDate(trip.actualEnd)}</time>
          ) : (
            '—'
          )}
        </p>
      </div>
    </div>
  )
}
