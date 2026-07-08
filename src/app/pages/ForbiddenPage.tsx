import { ShieldAlert } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'

import { PageContainer } from '@/components/common/PageContainer'
import { EmptyState } from '@/components/feedback/EmptyState'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'

export default function ForbiddenPage() {
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Access Denied | Scrappy'
  }, [])

  return (
    <PageContainer maxWidth="md">
      <EmptyState
        icon={ShieldAlert}
        title="Access denied"
        description="You don't have permission to view this page. Contact your administrator if you believe this is a mistake."
        action={
          <Button
            type="button"
            onClick={() => {
              void navigate(ROUTES.dashboard, { replace: true })
            }}
          >
            Back to dashboard
          </Button>
        }
      />
    </PageContainer>
  )
}
