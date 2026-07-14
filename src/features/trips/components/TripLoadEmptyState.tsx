import { Package } from 'lucide-react'

import { EmptyState } from '@/components/feedback/EmptyState'
import { Button } from '@/components/ui/button'

interface TripLoadEmptyStateProps {
  editable: boolean
  readOnlyStarted?: boolean
  onAddItem?: () => void
}

export function TripLoadEmptyState({
  editable,
  readOnlyStarted = false,
  onAddItem,
}: TripLoadEmptyStateProps) {
  if (readOnlyStarted) {
    return (
      <p className="text-muted-foreground rounded-lg border border-dashed p-6 text-center text-sm">
        No trip load was defined for this trip.
      </p>
    )
  }

  if (editable) {
    return (
      <EmptyState
        icon={Package}
        title="No load items yet"
        description="Add materials and quantities you expect to carry on this trip."
        action={
          onAddItem ? (
            <Button type="button" size="sm" className="min-h-11" onClick={onAddItem}>
              Add item
            </Button>
          ) : undefined
        }
      />
    )
  }

  return (
    <p className="text-muted-foreground rounded-lg border border-dashed p-6 text-center text-sm">
      No load items defined.
    </p>
  )
}
