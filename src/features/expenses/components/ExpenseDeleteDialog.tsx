import { ConfirmDialog } from '@/components/common/ConfirmDialog'

import { useDeleteExpense } from '../hooks/useExpenseMutations'
import type { ExpenseDetail } from '../types/expense.types'

interface ExpenseDeleteDialogProps {
  expense: ExpenseDetail
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeleted: () => void
}

export function ExpenseDeleteDialog({
  expense,
  open,
  onOpenChange,
  onDeleted,
}: ExpenseDeleteDialogProps) {
  const deleteExpense = useDeleteExpense()
  const label = expense.expenseNumber ?? expense.description

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete expense?"
      description={`This will permanently delete "${label}". This action cannot be undone.`}
      confirmLabel="Delete"
      variant="destructive"
      isLoading={deleteExpense.isPending}
      onConfirm={() => {
        void deleteExpense.mutateAsync(expense.id).then(() => {
          onDeleted()
        })
      }}
    />
  )
}
