import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface AnalyticsSkeletonProps {
  variant?: 'kpi' | 'chart' | 'section'
  className?: string
}

export function AnalyticsSkeleton({ variant = 'kpi', className }: AnalyticsSkeletonProps) {
  if (variant === 'chart') {
    return <Skeleton className={cn('h-64 w-full rounded-xl', className)} />
  }

  if (variant === 'section') {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4',
        className,
      )}
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-28 rounded-xl" />
      ))}
    </div>
  )
}
