import { cn } from '@/lib/utils'

interface FullPageLoaderProps {
  label?: string
  className?: string
}

export function FullPageLoader({ label = 'Loading…', className }: FullPageLoaderProps) {
  return (
    <div
      className={cn(
        'flex min-h-screen w-full flex-col items-center justify-center gap-4',
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <div className="border-primary size-8 animate-spin rounded-full border-2 border-t-transparent" />
      <span className="text-muted-foreground text-sm">{label}</span>
    </div>
  )
}
