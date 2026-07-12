import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { AnalyticsEmptyState } from '@/features/analytics/components/AnalyticsEmptyState'
import { AnalyticsErrorState } from '@/features/analytics/components/AnalyticsErrorState'
import { AnalyticsSkeleton } from '@/features/analytics/components/AnalyticsSkeleton'
import { cn } from '@/lib/utils'

interface AnalyticsSectionProps {
  title: string
  description?: string
  isLoading?: boolean
  isError?: boolean
  errorMessage?: string
  onRetry?: () => void
  isEmpty?: boolean
  emptyTitle?: string
  emptyDescription?: string
  children: ReactNode
  className?: string
}

export function AnalyticsSection({
  title,
  description,
  isLoading = false,
  isError = false,
  errorMessage,
  onRetry,
  isEmpty = false,
  emptyTitle = 'No data for this period',
  emptyDescription = 'Try adjusting the date range or clearing entity filters.',
  children,
  className,
}: AnalyticsSectionProps) {
  return (
    <section className={cn('space-y-4', className)} aria-labelledby={`${title}-heading`}>
      <div className="space-y-1">
        <h2 id={`${title}-heading`} className="text-lg font-semibold tracking-tight">
          {title}
        </h2>
        {description ? <p className="text-muted-foreground text-sm">{description}</p> : null}
      </div>

      {isLoading ? <AnalyticsSkeleton variant="section" /> : null}

      {!isLoading && isError ? (
        <div className="space-y-3">
          <AnalyticsErrorState
            title="Unable to load analytics"
            description={errorMessage ?? 'Please try again.'}
          />
          {onRetry ? (
            <Button type="button" variant="outline" onClick={onRetry}>
              Retry
            </Button>
          ) : null}
        </div>
      ) : null}

      {!isLoading && !isError && isEmpty ? (
        <AnalyticsEmptyState title={emptyTitle} description={emptyDescription} />
      ) : null}

      {!isLoading && !isError && !isEmpty ? children : null}
    </section>
  )
}
