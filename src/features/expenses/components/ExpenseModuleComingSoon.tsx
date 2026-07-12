import { Construction } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'

import { PageContainer } from '@/components/common/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'

interface ExpenseModuleComingSoonProps {
  title?: string
}

export function ExpenseModuleComingSoon({
  title = 'Expense management',
}: ExpenseModuleComingSoonProps) {
  const navigate = useNavigate()

  useEffect(() => {
    document.title = `${title} | Scrappy`
  }, [title])

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title={title}
          description="Full expense management is not available yet on this environment."
        />
        <EmptyState
          icon={Construction}
          title="Coming soon"
          description="Create, edit, detail views, and receipt uploads will be enabled when Backend P007 expense CRUD ships. Use the Expenses list to view the read-only expense report."
          action={
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                void navigate(ROUTES.expenses)
              }}
            >
              Back to expense report
            </Button>
          }
        />
      </div>
    </PageContainer>
  )
}
