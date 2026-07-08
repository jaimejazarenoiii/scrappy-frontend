import { Check, Pencil, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'

import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { PERMISSIONS } from '@/constants/permissions'
import { buildRoute } from '@/constants/routes'
import { PermissionGate } from '@/features/authorization/components/PermissionGate'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { canManageLeaveRecords } from '@/features/workforce/lib/workforce-roles'

import { canManageLeave } from '../lib/leave-status'
import type { Leave, ManageLeaveInput } from '../types/leave.types'

interface ApprovalActionsProps {
  leave: Leave
  onManage: (input: ManageLeaveInput) => void
  isManaging: boolean
}

export function ApprovalActions({ leave, onManage, isManaging }: ApprovalActionsProps) {
  const navigate = useNavigate()
  const { currentUser } = useCurrentUser()
  const [approveOpen, setApproveOpen] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [managerNote, setManagerNote] = useState('')

  const canManage = canManageLeaveRecords(currentUser?.role)

  if (!canManage) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2">
      <PermissionGate permission={PERMISSIONS.leave.update}>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            void navigate(buildRoute.leaveEdit(leave.id))
          }}
        >
          <Pencil className="size-4" />
          Edit details
        </Button>
      </PermissionGate>

      {canManageLeave(leave) ? (
        <>
          <PermissionGate permission={PERMISSIONS.leave.approve}>
            <Button
              type="button"
              onClick={() => {
                setApproveOpen(true)
              }}
            >
              <Check className="size-4" />
              Approve
            </Button>
          </PermissionGate>
          <PermissionGate permission={PERMISSIONS.leave.reject}>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setRejectOpen(true)
              }}
            >
              <X className="size-4" />
              Reject
            </Button>
          </PermissionGate>
          <PermissionGate permission={PERMISSIONS.leave.cancel}>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                setCancelOpen(true)
              }}
            >
              Cancel request
            </Button>
          </PermissionGate>
        </>
      ) : null}

      <ConfirmDialog
        open={approveOpen}
        onOpenChange={setApproveOpen}
        title="Approve leave request?"
        description="Confirm approval for this leave request."
        confirmLabel="Approve"
        isLoading={isManaging}
        onConfirm={() => {
          onManage({ status: 'APPROVED' })
          setApproveOpen(false)
        }}
      />
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject leave request?</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Manager note (optional)"
            value={managerNote}
            onChange={(event) => {
              setManagerNote(event.target.value)
            }}
          />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setRejectOpen(false)
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isManaging}
              onClick={() => {
                onManage({
                  status: 'REJECTED',
                  managerNote: managerNote.length > 0 ? managerNote : undefined,
                })
                setRejectOpen(false)
                setManagerNote('')
              }}
            >
              {isManaging ? 'Working…' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title="Cancel leave request?"
        description="This will cancel the pending leave request."
        confirmLabel="Cancel request"
        variant="destructive"
        isLoading={isManaging}
        onConfirm={() => {
          onManage({ status: 'CANCELLED' })
          setCancelOpen(false)
        }}
      />
    </div>
  )
}
