import { AlertCircle } from 'lucide-react'

import { cn } from '@/lib/utils'

interface ErrorStateProps {
  title?: string
  description?: string
  className?: string
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'Please try again or contact support if the problem persists.',
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'border-destructive/20 bg-destructive/5 flex flex-col items-center justify-center rounded-xl border px-6 py-12 text-center',
        className,
      )}
      role="alert"
    >
      <AlertCircle className="text-destructive mb-4 size-10" />
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-muted-foreground mt-2 max-w-md text-sm">{description}</p>
    </div>
  )
}
