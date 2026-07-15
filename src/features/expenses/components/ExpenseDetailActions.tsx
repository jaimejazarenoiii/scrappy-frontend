import { CheckCircle2, Archive, Pencil, XCircle } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'

import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { PERMISSIONS } from '@/constants/permissions'
import { buildRoute } from '@/constants/routes'
import { PermissionGate } from '@/features/authorization/components/PermissionGate'
import { useAuthStore } from '@/store/auth.store'

import { useExpenseDialogStore } from '../hooks/useExpenseDialogStore'
import { useCancelExpense, useRecordExpense } from '../hooks/useExpenseMutations'
import {
  canArchiveExpense,
  canCancelExpense,
  canRecordExpense,
  isEditableExpenseStatus,
} from '../lib/expense-status'
import type { ExpenseDetail } from '../types/expense.types'
import { ExpenseArchiveDialog } from './ExpenseArchiveDialog'

interface ExpenseDetailActionsProps {
  expense: ExpenseDetail
}

export function ExpenseDetailActions({ expense }: ExpenseDetailActionsProps) {
  const navigate = useNavigate()
  const role = useAuthStore((state) => state.currentUser?.role)
  const { activeDialog, openArchive, closeDialog } = useExpenseDialogStore()
  const recordExpense = useRecordExpense()
  const cancelExpense = useCancelExpense()
  const [cancelOpen, setCancelOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState('')

  const editable = isEditableExpenseStatus(expense.status, role)
  const canRecord = canRecordExpense(expense.status)
  const canCancel = canCancelExpense(expense.status, role)
  const canArchive = canArchiveExpense(expense.status)

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <PermissionGate permission={PERMISSIONS.expenses.update}>
          {canRecord ? (
            <Button
              type="button"
              disabled={recordExpense.isPending}
              onClick={() => {
                void recordExpense.mutateAsync(expense.id)
              }}
            >
              <CheckCircle2 className="size-4" />
              Record expense
            </Button>
          ) : null}
        </PermissionGate>

        <PermissionGate permission={PERMISSIONS.expenses.update}>
          {editable ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                void navigate(buildRoute.expenseEdit(expense.id))
              }}
            >
              <Pencil className="size-4" />
              Edit
            </Button>
          ) : null}
        </PermissionGate>

        <PermissionGate permission={PERMISSIONS.expenses.update}>
          {canCancel ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setCancelReason('')
                setCancelOpen(true)
              }}
            >
              <XCircle className="size-4" />
              Cancel
            </Button>
          ) : null}
        </PermissionGate>

        <PermissionGate permission={PERMISSIONS.expenses.archive}>
          {canArchive ? (
            <Button type="button" variant="outline" onClick={openArchive}>
              <Archive className="size-4" />
              Archive
            </Button>
          ) : null}
        </PermissionGate>
      </div>

      <ConfirmDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title="Cancel expense?"
        description="Cancelled expenses are immutable and will not appear in analytics totals."
        confirmLabel="Cancel expense"
        variant="destructive"
        isLoading={cancelExpense.isPending}
        confirmDisabled={!cancelReason.trim()}
        onConfirm={() => {
          void cancelExpense
            .mutateAsync({ id: expense.id, reason: cancelReason.trim() })
            .then(() => {
              setCancelOpen(false)
            })
        }}
      >
        <Textarea
          value={cancelReason}
          onChange={(event) => {
            setCancelReason(event.target.value)
          }}
          placeholder="Reason for cancelling…"
          rows={3}
          aria-label="Cancellation reason"
        />
      </ConfirmDialog>

      <ExpenseArchiveDialog
        expense={expense}
        open={activeDialog === 'archive'}
        onOpenChange={(open) => {
          if (!open) closeDialog()
        }}
        onArchived={closeDialog}
      />
    </>
  )
}
