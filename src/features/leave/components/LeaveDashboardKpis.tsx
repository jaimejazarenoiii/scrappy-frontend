import { CalendarDays } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

import type { LeaveDashboard } from '../types/leave.types'

interface LeaveDashboardKpisProps {
  dashboard?: LeaveDashboard
  isLoading: boolean
}

export function LeaveDashboardKpis({ dashboard, isLoading }: LeaveDashboardKpisProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!dashboard) {
    return null
  }

  const items = [
    { label: 'Pending requests', value: dashboard.summary.pendingRequests },
    { label: 'On leave today', value: dashboard.summary.onLeaveToday },
    { label: 'Approved this week', value: dashboard.summary.approvedThisWeek },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <CalendarDays className="text-muted-foreground size-4" />
        <p className="text-muted-foreground text-sm">Business leave overview</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {items.map((item) => (
          <Card key={item.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                {item.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold tabular-nums">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
