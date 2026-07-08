import { useEffect } from 'react'
import { useNavigate } from 'react-router'

import { PageContainer } from '@/components/common/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'

/** Cash advance API has create + list/detail only; no edit endpoint. */
export default function CashAdvanceEditPage() {
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Edit cash advance | Scrappy'
  }, [])

  return (
    <PageContainer maxWidth="lg">
      <div className="space-y-6">
        <PageHeader title="Edit cash advance" />
        <ErrorState
          title="Editing is not supported"
          description="Cash advances are issued once and tracked until settled through payroll deductions."
        />
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              void navigate(ROUTES.cashAdvances)
            }}
          >
            Back to cash advances
          </Button>
        </div>
      </div>
    </PageContainer>
  )
}
