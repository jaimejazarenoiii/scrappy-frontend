import { useState } from 'react'
import { Users } from 'lucide-react'

import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { StatusBadge } from '@/components/common/StatusBadge'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PERMISSIONS } from '@/constants/permissions'
import { PermissionGate } from '@/features/authorization/components/PermissionGate'
import { useFormatRecordEmployee } from '@/features/employees/hooks/useFormatRecordEmployee'

import { TripMemberAssignDialog } from './TripMemberAssignDialog'
import { tripMemberRoleLabel } from '../lib/trip-member'
import { useRemoveTripMember } from '../hooks/useTripMemberMutations'
import { useTripDialogStore } from '../hooks/useTripDialogStore'
import { isTerminalTripStatus } from '../lib/trip-workflow'
import type { TripDetail, TripMember } from '../types/trip.types'

interface TripMembersPanelProps {
  trip: TripDetail
}

function memberStatusLabel(status: string | null | undefined): string {
  if (!status) return 'Assigned'
  return status.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

export function TripMembersPanel({ trip }: TripMembersPanelProps) {
  const formatEmployee = useFormatRecordEmployee()
  const removeMember = useRemoveTripMember(trip.id)
  const { activeDialog, openDialog, closeDialog } = useTripDialogStore()
  const [memberToRemove, setMemberToRemove] = useState<TripMember | null>(null)

  const members = trip.members
  const canManage = !isTerminalTripStatus(trip.status)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle>Trip members</CardTitle>
        <PermissionGate permission={PERMISSIONS.trips.update}>
          {canManage ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                openDialog('assignMembers')
              }}
            >
              Assign employees
            </Button>
          ) : null}
        </PermissionGate>
      </CardHeader>
      <CardContent>
        {members.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No members assigned"
            description="Assign employees to coordinate this trip."
          />
        ) : (
          <ul className="divide-y rounded-md border">
            {members.map((member) => (
              <li
                key={member.id}
                className="flex flex-wrap items-center justify-between gap-2 px-4 py-3"
              >
                <div>
                  <p className="font-medium">{formatEmployee({ employeeId: member.employeeId })}</p>
                  <p className="text-muted-foreground text-sm">
                    {tripMemberRoleLabel(member.role)}
                  </p>
                  {member.status ? (
                    <StatusBadge label={memberStatusLabel(member.status)} tone="neutral" />
                  ) : null}
                </div>
                <PermissionGate permission={PERMISSIONS.trips.update}>
                  {canManage ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      disabled={removeMember.isPending}
                      onClick={() => {
                        setMemberToRemove(member)
                      }}
                    >
                      Remove
                    </Button>
                  ) : null}
                </PermissionGate>
              </li>
            ))}
          </ul>
        )}
      </CardContent>

      <TripMemberAssignDialog
        tripId={trip.id}
        open={activeDialog === 'assignMembers'}
        onOpenChange={(open) => {
          if (!open) closeDialog()
        }}
        existingMemberIds={members.map((member) => member.employeeId)}
      />

      <ConfirmDialog
        open={Boolean(memberToRemove)}
        onOpenChange={(open) => {
          if (!open) setMemberToRemove(null)
        }}
        title="Remove member?"
        description="This employee will be removed from the trip."
        confirmLabel="Remove"
        variant="destructive"
        isLoading={removeMember.isPending}
        onConfirm={() => {
          if (!memberToRemove) return
          void removeMember.mutateAsync(memberToRemove.id, {
            onSuccess: () => {
              setMemberToRemove(null)
            },
          })
        }}
      />
    </Card>
  )
}
