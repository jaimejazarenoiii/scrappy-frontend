import { DescriptionItem, DescriptionList } from '@/components/common/DescriptionList'
import { formatDateTime } from '@/utils/format-date'

import type { TripLoad } from '../types/trip-load.types'

interface TripLoadSummaryCardProps {
  load: TripLoad
}

export function TripLoadSummaryCard({ load }: TripLoadSummaryCardProps) {
  const totalQty = load.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <DescriptionList className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <DescriptionItem label="Total items">{load.items.length}</DescriptionItem>
      <DescriptionItem label="Total quantity">
        {new Intl.NumberFormat('en-PH', { maximumFractionDigits: 2 }).format(totalQty)}
      </DescriptionItem>
      <DescriptionItem label="Last updated">{formatDateTime(load.updatedAt)}</DescriptionItem>
    </DescriptionList>
  )
}
