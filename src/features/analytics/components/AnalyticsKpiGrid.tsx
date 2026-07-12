import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface AnalyticsKpiGridProps {
  children: ReactNode
  className?: string
}

export function AnalyticsKpiGrid({ children, className }: AnalyticsKpiGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4',
        className,
      )}
    >
      {children}
    </div>
  )
}
