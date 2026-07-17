import { History } from 'lucide-react'

import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useFormatUserActor } from '@/features/employees/hooks/useFormatUserActor'
import { formatDateTime } from '@/utils/format-date'

import type { SettlementTimelineEvent } from '../types/transaction.types'

interface TransactionSettlementTimelineProps {
  events: SettlementTimelineEvent[]
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
}

export function TransactionSettlementTimeline({
  events,
  isLoading = false,
  isError = false,
  onRetry,
}: TransactionSettlementTimelineProps) {
  const formatActorLabel = useFormatUserActor()

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
        <ErrorState title="Could not load settlement history" description="Please try again." />
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
        title="No settlement events yet"
        description="Settlement events appear after you mark ready for payment, settle, cancel, or reopen."
      />
    )
  }

  return (
    <ol className="relative space-y-4 border-s ps-6" aria-label="Settlement timeline">
      {events.map((event) => {
        const actorLabel =
          event.actorDisplayName ?? (event.actorUserId ? formatActorLabel(event.actorUserId) : null)
        return (
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
              {actorLabel ? (
                <p className="text-muted-foreground mt-1 text-sm">By {actorLabel}</p>
              ) : null}
              {event.notes ? (
                <p className="text-muted-foreground mt-2 text-sm">{event.notes}</p>
              ) : null}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
