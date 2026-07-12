import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'

import { DescriptionItem, DescriptionList } from '@/components/common/DescriptionList'
import { PageContainer } from '@/components/common/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { ErrorState } from '@/components/feedback/ErrorState'
import { PageSkeleton } from '@/components/feedback/PageSkeleton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ROUTES } from '@/constants/routes'
import { formatCurrency } from '@/utils/format-currency'
import { formatDate } from '@/utils/format-date'

import { ExpenseDetailActions } from '../components/ExpenseDetailActions'
import { ExpenseReceiptManager } from '../components/ExpenseReceiptManager'
import { ExpenseReferenceSummary } from '../components/ExpenseReferenceSummary'
import { ExpenseStatusBadge } from '../components/ExpenseStatusBadge'
import { useExpense } from '../hooks/useExpense'
import { isEditableExpenseStatus } from '../lib/expense-status'

function expenseTitle(expense: { expenseNumber: string | null; description: string }): string {
  return expense.expenseNumber ?? expense.description
}

export default function ExpenseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const expenseQuery = useExpense(id)

  useEffect(() => {
    document.title = 'Expense details | Scrappy'
  }, [])

  if (expenseQuery.isLoading) {
    return <PageSkeleton />
  }

  if (expenseQuery.isError || !expenseQuery.data) {
    return (
      <PageContainer maxWidth="lg">
        <div className="space-y-4">
          <ErrorState
            title="Expense not found"
            description="This expense may have been removed or you may not have access."
          />
          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                void navigate(ROUTES.expenses)
              }}
            >
              Back to expenses
            </Button>
          </div>
        </div>
      </PageContainer>
    )
  }

  const expense = expenseQuery.data
  const editable = isEditableExpenseStatus(expense.status)

  return (
    <PageContainer maxWidth="lg">
      <div className="space-y-6">
        <PageHeader
          title={expenseTitle(expense)}
          description={expense.description}
          actions={<ExpenseDetailActions expense={expense} />}
        />

        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <DescriptionList>
              <DescriptionItem label="Status">
                <ExpenseStatusBadge status={expense.status} />
              </DescriptionItem>
              <DescriptionItem label="Amount">
                <span className="text-lg font-semibold tabular-nums">
                  {formatCurrency(expense.amount)}
                </span>
              </DescriptionItem>
              <DescriptionItem label="Expense date">
                {formatDate(expense.expenseDate)}
              </DescriptionItem>
              <DescriptionItem label="Category">{expense.category ?? '—'}</DescriptionItem>
              <ExpenseReferenceSummary expense={expense} />
              {expense.notes ? (
                <DescriptionItem label="Notes">{expense.notes}</DescriptionItem>
              ) : null}
              <DescriptionItem label="Created">{formatDate(expense.createdAt)}</DescriptionItem>
              <DescriptionItem label="Last updated">
                {formatDate(expense.updatedAt)}
              </DescriptionItem>
            </DescriptionList>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <ExpenseReceiptManager expenseId={expense.id} disabled={!editable} />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
