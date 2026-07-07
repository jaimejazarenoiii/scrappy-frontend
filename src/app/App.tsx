import { Suspense } from 'react'
import { RouterProvider } from 'react-router'

import { AppProviders } from '@/app/providers/AppProviders'
import { router } from '@/app/router'
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary'
import { PageSkeleton } from '@/components/feedback/PageSkeleton'

export function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <Suspense fallback={<PageSkeleton />}>
          <RouterProvider router={router} />
        </Suspense>
      </AppProviders>
    </ErrorBoundary>
  )
}
