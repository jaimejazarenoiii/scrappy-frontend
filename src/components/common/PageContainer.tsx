import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface PageContainerProps {
  children: ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const maxWidthClasses = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  full: 'max-w-full',
}

export function PageContainer({ children, className, maxWidth = 'full' }: PageContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full min-w-0 p-4 md:p-6 lg:p-8',
        maxWidthClasses[maxWidth],
        className,
      )}
    >
      {children}
    </div>
  )
}
