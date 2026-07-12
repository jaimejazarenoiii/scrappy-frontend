import { useState } from 'react'

import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useEmployeeOptions } from '@/features/employees/hooks/useEmployeeOptions'

import { useAddTripMembers } from '../hooks/useTripMemberMutations'

interface TripMemberAssignDialogProps {
  tripId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  existingMemberIds: string[]
}

export function TripMemberAssignDialog({
  tripId,
  open,
  onOpenChange,
  existingMemberIds,
}: TripMemberAssignDialogProps) {
  const employeeOptions = useEmployeeOptions()
  const addMembers = useAddTripMembers(tripId)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const availableOptions = (employeeOptions.data ?? []).filter(
    (option) => !existingMemberIds.includes(option.value),
  )

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setSelectedIds([])
        onOpenChange(next)
      }}
    >
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Assign employees</DialogTitle>
          <DialogDescription>Select employees to add to this trip.</DialogDescription>
        </DialogHeader>

        <div className="py-2">
          {employeeOptions.isLoading ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-full rounded-md" />
              ))}
            </div>
          ) : availableOptions.length === 0 ? (
            <p className="text-muted-foreground text-sm">No additional employees available.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {availableOptions.map((option) => {
                const checked = selectedIds.includes(option.value)
                return (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-center gap-2 rounded-md border p-2"
                  >
                    <Checkbox
                      checked={checked}
                      disabled={addMembers.isPending}
                      onChange={(event) => {
                        const next = event.target.checked
                          ? [...selectedIds, option.value]
                          : selectedIds.filter((id) => id !== option.value)
                        setSelectedIds(next)
                      }}
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                )
              })}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={addMembers.isPending}
            onClick={() => {
              onOpenChange(false)
            }}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={addMembers.isPending || selectedIds.length === 0}
            onClick={() => {
              void addMembers.mutateAsync({ employeeIds: selectedIds })
            }}
          >
            {addMembers.isPending ? 'Assigning…' : 'Assign selected'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
