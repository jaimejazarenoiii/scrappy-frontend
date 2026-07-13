import { Outlet } from 'react-router'

import { VercelObservability } from '@/app/providers/VercelObservability'

/** Root shell so analytics/insights can read the active React Router location. */
export function AppShell() {
  return (
    <>
      <Outlet />
      <VercelObservability />
    </>
  )
}
