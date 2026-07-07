import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  breadcrumbs?: ReactNode
  actions?: ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn('flex flex-col gap-4 border-b pb-6', className)}>
      {breadcrumbs ? <div className="text-muted-foreground text-sm">{breadcrumbs}</div> : null}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
          {description ? (
            <p className="text-muted-foreground text-sm md:text-base">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  )
}
