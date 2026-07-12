import { Archive, Pencil, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router'

import { Button } from '@/components/ui/button'
import { PERMISSIONS } from '@/constants/permissions'
import { buildRoute } from '@/constants/routes'
import { PermissionGate } from '@/features/authorization/components/PermissionGate'

import { useExpenseDialogStore } from '../hooks/useExpenseDialogStore'
import { isEditableExpenseStatus } from '../lib/expense-status'
import type { ExpenseDetail } from '../types/expense.types'
import { ExpenseArchiveDialog } from './ExpenseArchiveDialog'
import { ExpenseDeleteDialog } from './ExpenseDeleteDialog'

interface ExpenseDetailActionsProps {
  expense: ExpenseDetail
}

export function ExpenseDetailActions({ expense }: ExpenseDetailActionsProps) {
  const navigate = useNavigate()
  const { activeDialog, openDelete, openArchive, closeDialog } = useExpenseDialogStore()
  const editable = isEditableExpenseStatus(expense.status)

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
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

        <PermissionGate permission={PERMISSIONS.expenses.archive}>
          {expense.status === 'ACTIVE' ? (
            <Button type="button" variant="outline" onClick={openArchive}>
              <Archive className="size-4" />
              Archive
            </Button>
          ) : null}
        </PermissionGate>

        <PermissionGate permission={PERMISSIONS.expenses.delete}>
          <Button type="button" variant="destructive" onClick={openDelete}>
            <Trash2 className="size-4" />
            Delete
          </Button>
        </PermissionGate>
      </div>

      <ExpenseDeleteDialog
        expense={expense}
        open={activeDialog === 'delete'}
        onOpenChange={(open) => {
          if (!open) closeDialog()
        }}
        onDeleted={() => {
          closeDialog()
          void navigate('/expenses')
        }}
      />

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
