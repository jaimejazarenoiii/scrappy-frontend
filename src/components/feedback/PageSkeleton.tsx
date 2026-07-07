import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface PageSkeletonProps {
  className?: string
}

export function PageSkeleton({ className }: PageSkeletonProps) {
  return (
    <div className={cn('space-y-6 p-4 md:p-6 lg:p-8', className)}>
      <div className="space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
      <Skeleton className="h-48 w-full rounded-xl" />
    </div>
  )
}
