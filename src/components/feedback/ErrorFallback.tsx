import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { ErrorState } from '@/components/feedback/ErrorState'
import { ROUTES } from '@/constants/routes'

interface ErrorFallbackProps {
  error?: Error
  resetError?: () => void
}

export function ErrorFallback({ resetError }: ErrorFallbackProps) {
  if (import.meta.env.DEV) {
    console.error('[ErrorBoundary]', 'An unexpected error occurred')
  }

  return (
    <div className="flex min-h-[50vh] items-center justify-center p-6">
      <div className="w-full max-w-lg space-y-4">
        <ErrorState
          title="Unexpected error"
          description="We encountered a problem loading this page. Please try again."
        />
        <div className="flex justify-center gap-3">
          {resetError ? (
            <Button type="button" onClick={resetError}>
              Try again
            </Button>
          ) : null}
          <Button variant="outline" asChild>
            <Link to={ROUTES.dashboard}>Go to dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
