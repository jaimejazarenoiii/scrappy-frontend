import { BarChart3 } from 'lucide-react'

import { EmptyState } from '@/components/feedback/EmptyState'

interface AnalyticsEmptyStateProps {
  title?: string
  description?: string
}

export function AnalyticsEmptyState({
  title = 'No analytics data for this period',
  description = 'Adjust the reporting period or clear entity filters to see results.',
}: AnalyticsEmptyStateProps) {
  return <EmptyState icon={BarChart3} title={title} description={description} />
}
