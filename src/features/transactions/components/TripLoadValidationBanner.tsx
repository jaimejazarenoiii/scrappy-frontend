import { AlertTriangle, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { TripLoadOutboundWarning } from '@/features/trips/types/trip-load.types'

interface TripLoadValidationBannerProps {
  warnings: TripLoadOutboundWarning[]
  strict?: boolean
  className?: string
}

export function TripLoadValidationBanner({
  warnings,
  strict = false,
  className,
}: TripLoadValidationBannerProps) {
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
        'rounded-lg border px-4 py-3 text-sm',
        strict
          ? 'border-destructive/40 bg-destructive/5 dark:border-destructive/40'
          : 'border-amber-200 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/10',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle
          className={cn(
            'mt-0.5 size-4 shrink-0',
            strict ? 'text-destructive' : 'text-amber-700 dark:text-amber-400',
          )}
        />
        <div className="min-w-0 flex-1 space-y-2">
          <p
            className={cn(
              'font-medium',
              strict ? 'text-destructive' : 'text-amber-900 dark:text-amber-100',
            )}
          >
            {strict ? 'Trip load validation (strict)' : 'Trip load warning'}
          </p>
          <p className={strict ? 'text-destructive/90' : 'text-amber-800 dark:text-amber-200/90'}>
            {primary.message}
          </p>
          {additional.length > 0 ? (
            <ul
              className={cn(
                'list-disc space-y-1 pl-5',
                strict ? 'text-destructive/90' : 'text-amber-800 dark:text-amber-200/90',
              )}
            >
              {additional.map((warning) => (
                <li key={`${warning.materialName}-${warning.unit}-${warning.message}`}>
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
          className="size-8 shrink-0"
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
