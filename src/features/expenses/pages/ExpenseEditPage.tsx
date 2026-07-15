import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import { PageContainer } from '@/components/common/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { ErrorState } from '@/components/feedback/ErrorState'
import { PageSkeleton } from '@/components/feedback/PageSkeleton'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { buildRoute } from '@/constants/routes'
import type { NormalizedApiError } from '@/lib/axios'
import { useAuthStore } from '@/store/auth.store'
import { blankToUndefined } from '@/utils/form-values'

import { ExpenseForm } from '../components/ExpenseForm'
import { ExpenseReceiptManager } from '../components/ExpenseReceiptManager'
import { useExpense } from '../hooks/useExpense'
import { useUpdateExpense } from '../hooks/useExpenseMutations'
import { isEditableExpenseStatus } from '../lib/expense-status'
import type { ExpenseFormValues } from '../validation/expense.schema'

function toDateInputValue(value: string): string {
  return value.length >= 10 ? value.slice(0, 10) : value
}

export default function ExpenseEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const expenseQuery = useExpense(id)
  const updateExpense = useUpdateExpense(id ?? '')
  const role = useAuthStore((state) => state.currentUser?.role)
  const [apiError, setApiError] = useState<NormalizedApiError | null>(null)

  useEffect(() => {
    document.title = 'Edit expense | Scrappy'
  }, [])

  if (expenseQuery.isLoading) {
    return <PageSkeleton />
  }

  if (expenseQuery.isError || !expenseQuery.data) {
    return (
      <PageContainer maxWidth="lg">
        <ErrorState
          title="Expense not found"
          description="This expense may have been removed or you may not have access."
        />
      </PageContainer>
    )
  }

  const expense = expenseQuery.data

  if (!isEditableExpenseStatus(expense.status, role)) {
    return (
      <PageContainer maxWidth="lg">
        <div className="space-y-4">
          <ErrorState
            title="Expense cannot be edited"
            description="This expense is no longer editable per backend rules."
          />
          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                void navigate(buildRoute.expenseDetail(expense.id))
              }}
            >
              Back to expense
            </Button>
          </div>
        </div>
      </PageContainer>
    )
  }

  function handleSubmit(values: ExpenseFormValues) {
    setApiError(null)

    updateExpense.mutate(
      {
        category: values.category,
        referenceType: values.referenceType,
        referenceId: blankToUndefined(values.referenceId),
        description: values.description.trim(),
        amount: values.amount,
        expenseDate: values.expenseDate,
        notes: blankToUndefined(values.notes),
      },
      {
        onSuccess: () => {
          void navigate(buildRoute.expenseDetail(expense.id))
        },
        onError: (error) => {
          setApiError(error)
        },
      },
    )
  }

  return (
    <PageContainer maxWidth="lg">
      <div className="space-y-6">
        <PageHeader
          title="Edit expense"
          description={expense.expenseNumber ?? expense.description}
        />
        <Card>
          <CardContent className="pt-6">
            <ExpenseForm
              mode="edit"
              defaultValues={{
                category: expense.category ?? '',
                referenceType: expense.referenceType,
                referenceId: expense.referenceId ?? undefined,
                description: expense.description,
                amount: expense.amount,
                expenseDate: toDateInputValue(expense.expenseDate),
                notes: expense.notes ?? undefined,
              }}
              isSubmitting={updateExpense.isPending}
              apiError={apiError}
              onCancel={() => {
                void navigate(buildRoute.expenseDetail(expense.id))
              }}
              onSubmit={handleSubmit}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <ExpenseReceiptManager expenseId={expense.id} />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
