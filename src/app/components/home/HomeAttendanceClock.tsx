import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { AttendanceActionDialog } from '@/features/attendance/components/AttendanceActionDialog'
import { AttendanceDashboardKpis } from '@/features/attendance/components/AttendanceDashboardKpis'
import { attendanceKeys } from '@/features/attendance/hooks/useAttendances'
import {
  useTimeInAttendance,
  useTimeOutAttendance,
} from '@/features/attendance/hooks/useAttendanceMutations'
import { AttendanceService } from '@/features/attendance/services/attendance.service'
import { canClockAttendance } from '@/features/workforce/lib/workforce-roles'
import { ROUTES } from '@/constants/routes'

/**
 * Home clock-in/out for Manager and Employee. Owners are exempt (no widget).
 */
export function HomeAttendanceClock() {
  const { currentUser } = useCurrentUser()
  const canClock = canClockAttendance(currentUser?.role)

  const operationalDashboardQuery = useQuery({
    queryKey: attendanceKeys.operationalDashboard,
    queryFn: () => AttendanceService.operationalDashboard(),
    enabled: canClock,
  })
  const statusQuery = useQuery({
    queryKey: attendanceKeys.status,
    queryFn: () => AttendanceService.status(),
    enabled: canClock,
  })
  const timeIn = useTimeInAttendance()
  const timeOut = useTimeOutAttendance()
  const [actionDialog, setActionDialog] = useState<'time-in' | 'time-out' | null>(null)

  if (!canClock) return null

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-sm font-semibold">Attendance</h2>
          <p className="text-muted-foreground text-xs">Time in before creating transactions.</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to={ROUTES.attendance}>View attendance</Link>
        </Button>
      </div>

      <AttendanceDashboardKpis
        role={currentUser?.role}
        dashboard={operationalDashboardQuery.data}
        status={statusQuery.data}
        isLoading={operationalDashboardQuery.isLoading || statusQuery.isLoading}
        isTimingIn={timeIn.isPending}
        isTimingOut={timeOut.isPending}
        onTimeIn={() => {
          setActionDialog('time-in')
        }}
        onTimeOut={() => {
          setActionDialog('time-out')
        }}
      />

      <AttendanceActionDialog
        open={actionDialog != null}
        onOpenChange={(open) => {
          if (!open) setActionDialog(null)
        }}
        action={actionDialog ?? 'time-in'}
        isLoading={timeIn.isPending || timeOut.isPending}
        onConfirm={() => {
          const mutation = actionDialog === 'time-in' ? timeIn : timeOut
          void mutation.mutateAsync(undefined).then(() => {
            setActionDialog(null)
          })
        }}
      />
    </section>
  )
}
