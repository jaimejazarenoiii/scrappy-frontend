import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { PageContainer } from '@/components/common/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { buildRoute, ROUTES } from '@/constants/routes'
import type { NormalizedApiError } from '@/lib/axios'
import { useAuthStore } from '@/store/auth.store'
import { blankToUndefined } from '@/utils/form-values'

import { ExpenseForm } from '../components/ExpenseForm'
import { useCreateExpense } from '../hooks/useExpenseMutations'
import type { ExpenseFormValues } from '../validation/expense.schema'

export default function ExpenseCreatePage() {
  const navigate = useNavigate()
  const createExpense = useCreateExpense()
  const tenant = useAuthStore((state) => state.tenant)
  const [apiError, setApiError] = useState<NormalizedApiError | null>(null)

  useEffect(() => {
    document.title = 'New expense | Scrappy'
  }, [])

  function handleSubmit(values: ExpenseFormValues) {
    setApiError(null)

    createExpense.mutate(
      {
        category: values.category,
        referenceType: values.referenceType,
        referenceId:
          values.referenceType === 'COMPANY'
            ? (tenant?.companyId ?? values.referenceId)
            : blankToUndefined(values.referenceId),
        description: values.description.trim(),
        amount: values.amount,
        expenseDate: values.expenseDate,
        notes: blankToUndefined(values.notes),
      },
      {
        onSuccess: (expense) => {
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
          title="New expense"
          description="Record operational spend with category and reference context."
        />
        <Card>
          <CardContent className="pt-6">
            <ExpenseForm
              mode="create"
              isSubmitting={createExpense.isPending}
              apiError={apiError}
              onCancel={() => {
                void navigate(ROUTES.expenses)
              }}
              onSubmit={handleSubmit}
            />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
