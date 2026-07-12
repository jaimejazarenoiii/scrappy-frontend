import { LogIn, LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { PERMISSIONS } from '@/constants/permissions'
import { PermissionGate } from '@/features/authorization/components/PermissionGate'
import { canClockAttendance } from '@/features/workforce/lib/workforce-roles'
import type { UserRole } from '@/features/auth/types/auth.types'

import {
  attendanceStatusLabel,
  displayTimeIn,
  formatAttendanceDate,
  formatAttendanceDateTime,
  formatAttendanceTime,
  formatElapsedWorkingTime,
} from '../lib/attendance-status'
import type { AttendanceStatusResponse, WorkforceDashboard } from '../types/attendance.types'

interface AttendanceDashboardKpisProps {
  role?: UserRole
  dashboard?: WorkforceDashboard
  status?: AttendanceStatusResponse
  isLoading: boolean
  onTimeIn?: () => void
  onTimeOut?: () => void
  isTimingIn?: boolean
  isTimingOut?: boolean
}

function useNow(enabled: boolean): number {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!enabled) return
    setNow(Date.now())
    const id = window.setInterval(() => {
      setNow(Date.now())
    }, 1000)
    return () => {
      window.clearInterval(id)
    }
  }, [enabled])

  return now
}

export function AttendanceDashboardKpis({
  role,
  dashboard,
  status,
  isLoading,
  onTimeIn,
  onTimeOut,
  isTimingIn,
  isTimingOut,
}: AttendanceDashboardKpisProps) {
  const openSession = status?.openSession ?? dashboard?.attendanceStatus?.openSession ?? null
  const isTimedIn =
    status?.isTimedIn ?? dashboard?.attendanceStatus?.isTimedIn ?? Boolean(openSession)
  const timeInAt = openSession ? displayTimeIn(openSession) : null
  const now = useNow(Boolean(isTimedIn && timeInAt))

  if (isLoading) {
    return (
      <div className="grid gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const showClockActions = canClockAttendance(role)
  const canTimeIn = showClockActions && (dashboard?.canTimeIn ?? !isTimedIn)
  const canTimeOut = showClockActions && (dashboard?.canTimeOut ?? isTimedIn)
  const elapsed = timeInAt ? formatElapsedWorkingTime(timeInAt, now) : null

  if (!showClockActions) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            Your attendance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Owners are exempt from time-in/out and are always ready for transactions.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            Current status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-2xl font-semibold">{isTimedIn ? 'Timed in' : 'Timed out'}</p>
          {dashboard?.canCreateTransaction === false && !isTimedIn ? (
            <p className="text-muted-foreground text-sm">Time in before creating transactions.</p>
          ) : null}
        </CardContent>
      </Card>

      <Card className="lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            {isTimedIn ? 'Today’s time in' : 'Session details'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isTimedIn && openSession && timeInAt ? (
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Timed in at</dt>
                <dd className="text-right font-medium tabular-nums">
                  {formatAttendanceTime(timeInAt)}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Date</dt>
                <dd className="text-right font-medium">{formatAttendanceDate(timeInAt)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Session</dt>
                <dd className="text-right font-medium">
                  {attendanceStatusLabel(openSession.status)}
                </dd>
              </div>
              {openSession.note ? (
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Note</dt>
                  <dd className="text-right font-medium">{openSession.note}</dd>
                </div>
              ) : null}
            </dl>
          ) : (
            <p className="text-muted-foreground text-sm">
              No open session yet. Time in to start tracking today’s hours.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">Hours working</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isTimedIn && elapsed ? (
            <>
              <p className="text-3xl font-semibold tracking-tight tabular-nums">{elapsed}</p>
              <p className="text-muted-foreground text-xs">
                Running since {formatAttendanceDateTime(timeInAt)}
              </p>
            </>
          ) : (
            <p className="text-muted-foreground text-sm">Clock starts after you time in.</p>
          )}

          <div className="flex flex-wrap gap-2 pt-1">
            {canTimeIn ? (
              <PermissionGate permission={PERMISSIONS.attendance.timeIn}>
                <Button type="button" size="sm" disabled={isTimingIn} onClick={onTimeIn}>
                  <LogIn className="size-4" />
                  Time in
                </Button>
              </PermissionGate>
            ) : null}
            {canTimeOut ? (
              <PermissionGate permission={PERMISSIONS.attendance.timeOut}>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={isTimingOut}
                  onClick={onTimeOut}
                >
                  <LogOut className="size-4" />
                  Time out
                </Button>
              </PermissionGate>
            ) : null}
            {!canTimeIn && !canTimeOut ? (
              <p className="text-muted-foreground text-sm">No attendance actions available.</p>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
