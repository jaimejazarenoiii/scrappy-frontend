import * as React from 'react'

import { cn } from '@/lib/utils'

function Select({ className, children, ...props }: React.ComponentProps<'select'>) {
  return (
    <select
      data-slot="select"
      className={cn(
        'border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 flex h-11 w-full rounded-md border px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:h-9',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  )
}

export { Select }
