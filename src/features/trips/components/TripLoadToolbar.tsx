import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

interface TripLoadToolbarProps {
  onAddItem: () => void
  disabled?: boolean
  strictLoadValidation: boolean
  onStrictChange?: (strict: boolean) => void
  canManageSettings?: boolean
  onClearLoad?: () => void
  isClearing?: boolean
  hasLoad: boolean
}

export function TripLoadToolbar({
  onAddItem,
  disabled = false,
  strictLoadValidation,
  onStrictChange,
  canManageSettings = false,
  onClearLoad,
  isClearing = false,
  hasLoad,
}: TripLoadToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3" data-slot="trip-load-tools">
      {canManageSettings ? (
        <label className="text-muted-foreground flex items-center gap-2 text-sm">
          <Checkbox
            checked={strictLoadValidation}
            disabled={disabled || !onStrictChange}
            onChange={(event) => {
              onStrictChange?.(event.target.checked)
            }}
          />
          Block overselling
        </label>
      ) : null}
      {canManageSettings && hasLoad && onClearLoad ? (
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
