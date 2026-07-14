import { AlertTriangle, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import type { TripLoadValidationWarning } from '@/features/trips/types/trip-load.types'

interface TripLoadValidationBannerProps {
  warnings: TripLoadValidationWarning[]
  className?: string
}

export function TripLoadValidationBanner({ warnings, className }: TripLoadValidationBannerProps) {
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    setDismissed(false)
  }, [warnings])

  if (warnings.length === 0 || dismissed) {
    return null
  }

  const primary = warnings[0]
  const additional = warnings.slice(1)

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm dark:border-amber-500/30 dark:bg-amber-500/10',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-700 dark:text-amber-400" />
        <div className="min-w-0 flex-1 space-y-2">
          <p className="font-medium text-amber-900 dark:text-amber-100">Trip load validation</p>
          <p className="text-amber-800 dark:text-amber-200/90">{primary.message}</p>
          {additional.length > 0 ? (
            <ul className="list-disc space-y-1 pl-5 text-amber-800 dark:text-amber-200/90">
              {additional.map((warning) => (
                <li key={`${warning.code}-${warning.materialName ?? warning.message}`}>
                  {warning.message}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 shrink-0 text-amber-800 hover:bg-amber-100 dark:text-amber-200 dark:hover:bg-amber-500/20"
          aria-label="Dismiss trip load warnings"
          onClick={() => {
            setDismissed(true)
          }}
        >
          <X className="size-4" />
        </Button>
      </div>
    </div>
  )
}
