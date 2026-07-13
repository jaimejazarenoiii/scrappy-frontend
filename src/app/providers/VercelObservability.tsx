import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights, computeRoute } from '@vercel/speed-insights/react'
import { useLocation, useParams } from 'react-router'

/**
 * Vercel Web Analytics + Speed Insights with React Router path tracking.
 * Mount inside the router tree so route changes report correctly.
 */
export function VercelObservability() {
  const { pathname } = useLocation()
  const params = useParams()
  const route = computeRoute(pathname, params as Record<string, string>)

  return (
    <>
      <Analytics framework="react-router" path={pathname} route={route} />
      <SpeedInsights framework="react-router" route={route} />
    </>
  )
}
