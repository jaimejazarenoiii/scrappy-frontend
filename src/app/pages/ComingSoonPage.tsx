import { Construction } from 'lucide-react'
import { useEffect } from 'react'

import { PageContainer } from '@/components/common/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/feedback/EmptyState'

export default function ComingSoonPage() {
  useEffect(() => {
    document.title = 'Coming Soon | Scrappy'
  }, [])

  return (
    <PageContainer>
      <div className="space-y-8">
        <PageHeader title="Coming Soon" description="This module is under development." />
        <EmptyState
          icon={Construction}
          title="Module not available yet"
          description="This section will be implemented in a future specification."
        />
      </div>
    </PageContainer>
  )
}
