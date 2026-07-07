import { LayoutDashboard } from 'lucide-react'
import { useEffect } from 'react'

import { PageContainer } from '@/components/common/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/feedback/EmptyState'

export default function DashboardPage() {
  useEffect(() => {
    document.title = 'Dashboard | Scrappy Web'
  }, [])

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader
          title="Dashboard"
          description="Overview of your junkshop management system."
          breadcrumbs={<span>Home / Dashboard</span>}
        />
        <EmptyState
          icon={LayoutDashboard}
          title="Welcome to Scrappy Web"
          description="Business modules will appear here as features are implemented."
        />
      </div>
    </PageContainer>
  )
}
