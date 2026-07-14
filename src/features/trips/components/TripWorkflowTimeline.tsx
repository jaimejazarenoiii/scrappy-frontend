import { History } from 'lucide-react'

import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDateTime } from '@/utils/format-date'

import type { TripTimelineEvent } from '../types/trip.types'

interface TripWorkflowTimelineProps {
  events: TripTimelineEvent[]
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
}

export function TripWorkflowTimeline({
  events,
  isLoading = false,
  isError = false,
  onRetry,
}: TripWorkflowTimelineProps) {
  if (isLoading) {
    return (
      <div className="space-y-3" aria-busy="true">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-3">
        <ErrorState title="Could not load trip history" description="Please try again." />
        {onRetry ? (
          <Button type="button" variant="outline" size="sm" onClick={onRetry}>
            Retry
          </Button>
        ) : null}
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <EmptyState
        icon={History}
        title="No trip events yet"
        description="Trip events appear after you schedule, start, complete, or cancel the trip."
      />
    )
  }

  return (
    <ol className="relative space-y-4 border-s ps-6" aria-label="Trip timeline">
      {events.map((event) => (
        <li key={event.id} className="relative">
          <span
            className="bg-primary absolute -start-[calc(0.5rem+1px)] top-2 size-2.5 rounded-full"
            aria-hidden
          />
          <div className="rounded-lg border p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="font-medium">{event.actionLabel}</p>
              <time className="text-muted-foreground text-sm" dateTime={event.occurredAt}>
                {formatDateTime(event.occurredAt)}
              </time>
            </div>
            {event.actorDisplayName ? (
              <p className="text-muted-foreground mt-1 text-sm">By {event.actorDisplayName}</p>
            ) : null}
            {event.notes ? (
              <p className="text-muted-foreground mt-2 text-sm">{event.notes}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  )
}
