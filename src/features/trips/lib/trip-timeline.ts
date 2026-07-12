import type { TripDetail, TripTimelineEvent } from '../types/trip.types'

function event(
  id: string,
  action: string,
  actionLabel: string,
  occurredAt: string | null | undefined,
  actorUserId: string | null | undefined,
  notes: string | null | undefined,
): TripTimelineEvent | null {
  if (!occurredAt) return null
  return {
    id,
    action,
    actionLabel,
    actorUserId: actorUserId ?? null,
    actorDisplayName: null,
    occurredAt,
    notes: notes ?? null,
  }
}

/** Builds timeline from authoritative trip lifecycle fields when history API is unavailable. */
export function buildTripTimelineFromDetail(trip: TripDetail): TripTimelineEvent[] {
  const events = [
    event('created', 'CREATED', 'Trip created', trip.createdAt, null, null),
    event(
      'scheduled',
      'SCHEDULED',
      'Scheduled start',
      trip.scheduledStart,
      trip.scheduledByUserId,
      null,
    ),
    event('started', 'STARTED', 'Trip started', trip.actualStart, trip.startedByUserId, null),
    event('completed', 'COMPLETED', 'Trip completed', trip.actualEnd, trip.completedByUserId, null),
    event(
      'cancelled',
      'CANCELLED',
      'Trip cancelled',
      trip.cancelledAt,
      trip.cancelledByUserId,
      trip.cancellationReason,
    ),
  ].filter((entry): entry is TripTimelineEvent => entry !== null)

  return events.sort(
    (left, right) => new Date(left.occurredAt).getTime() - new Date(right.occurredAt).getTime(),
  )
}

export function mergeTripTimeline(
  history: TripTimelineEvent[] | undefined,
  trip: TripDetail,
): TripTimelineEvent[] {
  if (history && history.length > 0) {
    return [...history].sort(
      (left, right) => new Date(left.occurredAt).getTime() - new Date(right.occurredAt).getTime(),
    )
  }
  return buildTripTimelineFromDetail(trip)
}
