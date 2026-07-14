import { DescriptionItem, DescriptionList } from '@/components/common/DescriptionList'
import { formatDateTime } from '@/utils/format-date'

import type { TripLoadSummary } from '../types/trip-load.types'

interface TripLoadSummaryCardProps {
  summary: TripLoadSummary
}

function formatWeight(value: number | null, unit: string | null): string {
  if (value == null) return '—'
  const formatted = new Intl.NumberFormat('en-PH', { maximumFractionDigits: 2 }).format(value)
  return unit ? `${formatted} ${unit}` : formatted
}

export function TripLoadSummaryCard({ summary }: TripLoadSummaryCardProps) {
  return (
    <DescriptionList className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <DescriptionItem label="Total items">{summary.totalItems}</DescriptionItem>
      <DescriptionItem label="Loaded weight">
        {formatWeight(summary.totalLoadedWeight, summary.weightUnit)}
      </DescriptionItem>
      <DescriptionItem label="Remaining weight">
        {formatWeight(summary.remainingWeight, summary.weightUnit)}
      </DescriptionItem>
      <DescriptionItem label="Last updated">
        {formatDateTime(summary.lastUpdatedAt)}
      </DescriptionItem>
    </DescriptionList>
  )
}
