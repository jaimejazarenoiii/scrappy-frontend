import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface TripLoadToolbarProps {
  onAddItem: () => void
  disabled?: boolean
  onClearLoad?: () => void
  isClearing?: boolean
  hasLoad: boolean
}

export function TripLoadToolbar({
  onAddItem,
  disabled = false,
  onClearLoad,
  isClearing = false,
  hasLoad,
}: TripLoadToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3" data-slot="trip-load-tools">
      {hasLoad && onClearLoad ? (
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="min-h-11"
          disabled={disabled || isClearing}
          onClick={onClearLoad}
        >
          Clear load
        </Button>
      ) : null}
      <Button type="button" size="sm" className="min-h-11" disabled={disabled} onClick={onAddItem}>
        <Plus className="size-4" />
        Add item
      </Button>
    </div>
  )
}
