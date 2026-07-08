import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface DescriptionListProps {
  children: ReactNode
  className?: string
}

export function DescriptionList({ children, className }: DescriptionListProps) {
  return <dl className={cn('grid gap-x-6 gap-y-4 sm:grid-cols-2', className)}>{children}</dl>
}

interface DescriptionItemProps {
  label: string
  children: ReactNode
  className?: string
}

export function DescriptionItem({ label, children, className }: DescriptionItemProps) {
  return (
    <div className={cn('space-y-1', className)}>
      <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">{label}</dt>
      <dd className="text-sm">{children}</dd>
    </div>
  )
}
