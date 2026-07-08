import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type StatusTone = 'active' | 'inactive' | 'archived' | 'neutral'

interface StatusBadgeProps {
  label: string
  tone: StatusTone
  className?: string
}

const toneClasses: Record<StatusTone, string> = {
  active:
    'border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  inactive: 'border-transparent bg-muted text-muted-foreground',
  archived:
    'border-transparent bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  neutral: 'border-transparent bg-muted text-muted-foreground',
}

export function StatusBadge({ label, tone, className }: StatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn('capitalize', toneClasses[tone], className)}>
      {label}
    </Badge>
  )
}
