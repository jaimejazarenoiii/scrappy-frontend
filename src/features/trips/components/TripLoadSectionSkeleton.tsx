import { Skeleton } from '@/components/ui/skeleton'

export function TripLoadSectionSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading trip load">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-16 w-full rounded-md" />
        ))}
      </div>
      <Skeleton className="h-48 w-full rounded-md" />
    </div>
  )
}
