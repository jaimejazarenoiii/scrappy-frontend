import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface TripLoadToolbarProps {
  onAddItem: () => void
  disabled?: boolean
}

export function TripLoadToolbar({ onAddItem, disabled = false }: TripLoadToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2" data-slot="trip-load-tools">
      <Button type="button" size="sm" className="min-h-11" disabled={disabled} onClick={onAddItem}>
        <Plus className="size-4" />
        Add item
      </Button>
    </div>
  )
}
