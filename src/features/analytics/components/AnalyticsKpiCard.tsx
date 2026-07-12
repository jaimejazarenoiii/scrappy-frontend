import type { ReactNode } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface AnalyticsKpiTrend {
  label: string
  direction?: 'up' | 'down' | 'neutral'
}

interface AnalyticsKpiCardProps {
  label: string
  value: ReactNode
  trend?: AnalyticsKpiTrend | null
  highlight?: boolean
  className?: string
}

export function AnalyticsKpiCard({
  label,
  value,
  trend,
  highlight = false,
  className,
}: AnalyticsKpiCardProps) {
  return (
    <Card
      className={cn(
        'h-full',
        highlight && 'border-primary/40 bg-primary/5 ring-primary/20 ring-1',
        className,
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">{label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <p className="text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
        {trend ? (
          <p
            className={cn(
              'text-xs font-medium',
              trend.direction === 'up' && 'text-primary',
              trend.direction === 'down' && 'text-destructive',
              trend.direction === 'neutral' && 'text-muted-foreground',
            )}
          >
            {trend.label}
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}
