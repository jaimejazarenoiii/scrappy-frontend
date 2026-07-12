import { RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useAnalyticsRefresh } from '@/features/analytics/hooks/useAnalyticsQueries'
import { useAnalyticsPreferencesStore } from '@/features/analytics/hooks/useAnalyticsPreferencesStore'
import { cn } from '@/lib/utils'

interface AnalyticsRefreshBarProps {
  generatedAt?: string | null
  className?: string
}

function formatGeneratedAt(value?: string | null): string | null {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString()
}

export function AnalyticsRefreshBar({ generatedAt, className }: AnalyticsRefreshBarProps) {
  const { refresh, isRefreshing } = useAnalyticsRefresh()
  const autoRefreshEnabled = useAnalyticsPreferencesStore((state) => state.autoRefreshEnabled)
  const setAutoRefreshEnabled = useAnalyticsPreferencesStore((state) => state.setAutoRefreshEnabled)
  const formattedGeneratedAt = formatGeneratedAt(generatedAt)

  return (
    <div
      className={cn(
        'bg-card flex flex-col gap-3 rounded-xl border px-4 py-3 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <div className="space-y-1">
        <p className="text-sm font-medium">Dashboard refresh</p>
        <p className="text-muted-foreground text-xs" aria-live="polite">
          {formattedGeneratedAt
            ? `Last updated ${formattedGeneratedAt}`
            : 'Last updated time will appear after data loads'}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Checkbox
            id="analytics-auto-refresh"
            checked={autoRefreshEnabled}
            onChange={(event) => {
              setAutoRefreshEnabled(event.target.checked)
            }}
          />
          <Label htmlFor="analytics-auto-refresh" className="text-sm font-normal">
            Auto refresh (60s)
          </Label>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            void refresh()
          }}
          disabled={isRefreshing}
          aria-busy={isRefreshing}
        >
          <RefreshCw className={cn('mr-2 size-4', isRefreshing && 'animate-spin')} />
          {isRefreshing ? 'Refreshing…' : 'Refresh'}
        </Button>
      </div>
    </div>
  )
}
