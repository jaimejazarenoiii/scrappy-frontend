import { ConfirmDialog } from '@/components/common/ConfirmDialog'

import { useArchiveExpense } from '../hooks/useExpenseMutations'
import type { ExpenseDetail } from '../types/expense.types'

interface ExpenseArchiveDialogProps {
  expense: ExpenseDetail
  open: boolean
  onOpenChange: (open: boolean) => void
  onArchived: () => void
}

export function ExpenseArchiveDialog({
  expense,
  open,
  onOpenChange,
  onArchived,
}: ExpenseArchiveDialogProps) {
  const archiveExpense = useArchiveExpense()
  const label = expense.expenseNumber ?? expense.description

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Archive expense?"
      description={`"${label}" will be archived and hidden from active lists unless you include archived expenses.`}
      confirmLabel="Archive"
      isLoading={archiveExpense.isPending}
      onConfirm={() => {
        void archiveExpense.mutateAsync(expense.id).then(() => {
          onArchived()
        })
      }}
    />
  )
}
