import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

import type { TripLoadIndicatorStatus } from '../types/trip-load.types'

interface RemainingQuantityBadgeProps {
  status: TripLoadIndicatorStatus
  className?: string
}

const statusConfig: Record<TripLoadIndicatorStatus, { label: string; className: string }> = {
  NORMAL: {
    label: 'Normal',
    className: 'border-transparent bg-muted text-muted-foreground',
  },
  WARNING: {
    label: 'Warning',
    className:
      'border-transparent bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400',
  },
  EXCEEDED: {
    label: 'Exceeded',
    className:
      'border-transparent bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-red-400',
  },
}

export function RemainingQuantityBadge({ status, className }: RemainingQuantityBadgeProps) {
  const config = statusConfig[status]

  return (
    <Badge variant="outline" className={cn('capitalize', config.className, className)}>
      {config.label}
    </Badge>
  )
}
