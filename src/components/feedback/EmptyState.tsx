import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'bg-card flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-16 text-center shadow-sm',
        className,
      )}
    >
      {Icon ? (
        <div className="bg-muted mb-4 flex size-12 items-center justify-center rounded-full">
          <Icon className="text-muted-foreground size-6" />
        </div>
      ) : null}
      <h2 className="text-lg font-semibold">{title}</h2>
      {description ? (
        <p className="text-muted-foreground mt-2 max-w-md text-sm">{description}</p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}
