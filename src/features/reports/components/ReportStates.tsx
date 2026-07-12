import { FileText } from 'lucide-react'

import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export function ReportEmptyState({
  title = 'No results for these filters',
  description = 'Widen the date range or clear entity filters to see report rows.',
}: {
  title?: string
  description?: string
}) {
  return <EmptyState icon={FileText} title={title} description={description} />
}

export function ReportErrorState({
  title = 'Unable to load report',
  description = 'Please try again or contact support if the problem persists.',
}: {
  title?: string
  description?: string
}) {
  return <ErrorState title={title} description={description} />
}

export function ReportSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-20 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  )
}
