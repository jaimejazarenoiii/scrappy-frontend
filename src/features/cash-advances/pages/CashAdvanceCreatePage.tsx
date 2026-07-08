import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { PageContainer } from '@/components/common/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import type { NormalizedApiError } from '@/lib/axios'
import { buildRoute, ROUTES } from '@/constants/routes'
import { blankToUndefined } from '@/utils/form-values'

import { CashAdvanceForm } from '../components/CashAdvanceForm'
import { useCreateCashAdvance } from '../hooks/useCashAdvanceMutations'
import type { CashAdvanceFormValues } from '../validation/cash-advance.schema'

export default function CashAdvanceCreatePage() {
  const navigate = useNavigate()
  const createCashAdvance = useCreateCashAdvance()
  const [apiError, setApiError] = useState<NormalizedApiError | null>(null)

  useEffect(() => {
    document.title = 'Issue cash advance | Scrappy'
  }, [])

  function handleSubmit(values: CashAdvanceFormValues) {
    setApiError(null)
    createCashAdvance.mutate(
      {
        employeeId: values.employeeId,
        amount: values.amount,
        reason: blankToUndefined(values.reason),
      },
      {
        onSuccess: (cashAdvance) => {
          void navigate(buildRoute.cashAdvanceDetail(cashAdvance.id))
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
          title="Issue cash advance"
          description="Create a cash advance for an employee."
        />
        <Card>
          <CardContent className="pt-6">
            <CashAdvanceForm
              mode="create"
              isSubmitting={createCashAdvance.isPending}
              apiError={apiError}
              onCancel={() => {
                void navigate(ROUTES.cashAdvances)
              }}
              onSubmit={handleSubmit}
            />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
