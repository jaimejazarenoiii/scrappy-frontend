import { LogIn, LogOut } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { PERMISSIONS } from '@/constants/permissions'
import { PermissionGate } from '@/features/authorization/components/PermissionGate'
import { canClockAttendance } from '@/features/workforce/lib/workforce-roles'
import type { UserRole } from '@/features/auth/types/auth.types'

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
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
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

  const showClockActions = canClockAttendance(role)
  const isTimedIn = status?.isTimedIn ?? dashboard?.attendanceStatus?.isTimedIn ?? false
  const canTimeIn = showClockActions && (dashboard?.canTimeIn ?? !isTimedIn)
  const canTimeOut = showClockActions && (dashboard?.canTimeOut ?? isTimedIn)

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
    <div className="grid gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            Current status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{isTimedIn ? 'Timed in' : 'Timed out'}</p>
          {dashboard?.canCreateTransaction === false && !isTimedIn ? (
            <p className="text-muted-foreground mt-2 text-sm">
              Time in before creating transactions.
            </p>
          ) : null}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-muted-foreground text-sm font-medium">Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
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
        </CardContent>
      </Card>
    </div>
  )
}
