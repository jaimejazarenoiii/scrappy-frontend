import { DescriptionItem, DescriptionList } from '@/components/common/DescriptionList'
import { StatusBadge } from '@/components/common/StatusBadge'
import { formatDateTime } from '@/utils/format-date'

import type { TripLoad } from '../types/trip-load.types'

interface TripLoadSummaryCardProps {
  load: TripLoad
  strictLoadValidation: boolean
}

export function TripLoadSummaryCard({ load, strictLoadValidation }: TripLoadSummaryCardProps) {
  const totalQty = load.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <DescriptionList className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <DescriptionItem label="Total items">{load.items.length}</DescriptionItem>
      <DescriptionItem label="Total quantity">
        {new Intl.NumberFormat('en-PH', { maximumFractionDigits: 2 }).format(totalQty)}
      </DescriptionItem>
      <DescriptionItem label="Validation">
        <StatusBadge
          label={strictLoadValidation ? 'Strict (block)' : 'Warn only'}
          tone={strictLoadValidation ? 'archived' : 'neutral'}
        />
      </DescriptionItem>
      <DescriptionItem label="Last updated">{formatDateTime(load.updatedAt)}</DescriptionItem>
    </DescriptionList>
  )
}
