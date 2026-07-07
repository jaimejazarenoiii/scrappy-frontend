import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface LoadingOverlayProps {
  isLoading: boolean
  children: ReactNode
  className?: string
}

export function LoadingOverlay({ isLoading, children, className }: LoadingOverlayProps) {
  return (
    <div className={cn('relative', className)}>
      {children}
      {isLoading ? (
        <div className="bg-background/60 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-[1px]">
          <div className="border-primary size-8 animate-spin rounded-full border-2 border-t-transparent" />
        </div>
      ) : null}
    </div>
  )
}
