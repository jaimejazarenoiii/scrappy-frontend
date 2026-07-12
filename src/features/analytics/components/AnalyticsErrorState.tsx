import { ErrorState } from '@/components/feedback/ErrorState'

interface AnalyticsErrorStateProps {
  title?: string
  description?: string
}

export function AnalyticsErrorState({
  title = 'Unable to load analytics',
  description = 'Please try again or contact support if the problem persists.',
}: AnalyticsErrorStateProps) {
  return <ErrorState title={title} description={description} />
}
