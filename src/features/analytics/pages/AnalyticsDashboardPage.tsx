import { useEffect } from 'react'
import { useSearchParams } from 'react-router'

import { PageContainer } from '@/components/common/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { AnalyticsFilterBar } from '@/features/analytics/components/AnalyticsFilterBar'
import { AnalyticsRefreshBar } from '@/features/analytics/components/AnalyticsRefreshBar'
import { CompanyOverviewSection } from '@/features/analytics/components/sections/CompanyOverviewSection'
import { ExpenseAnalyticsSection } from '@/features/analytics/components/sections/ExpenseAnalyticsSection'
import { OrganizationAnalyticsSection } from '@/features/analytics/components/sections/OrganizationAnalyticsSection'
import { TransactionAnalyticsSection } from '@/features/analytics/components/sections/TransactionAnalyticsSection'
import { TripAnalyticsSection } from '@/features/analytics/components/sections/TripAnalyticsSection'
import { WorkforceAnalyticsSection } from '@/features/analytics/components/sections/WorkforceAnalyticsSection'
import { useCompanyAnalytics } from '@/features/analytics/hooks/useAnalyticsQueries'
import { useAnalyticsPreferencesStore } from '@/features/analytics/hooks/useAnalyticsPreferencesStore'
import { ANALYTICS_TABS, type AnalyticsTabId } from '@/features/analytics/types/analytics.types'
import { cn } from '@/lib/utils'

function isAnalyticsTabId(value: string | null): value is AnalyticsTabId {
  return ANALYTICS_TABS.some((tab) => tab.id === value)
}

export default function AnalyticsDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = useAnalyticsPreferencesStore((state) => state.activeTab)
  const setActiveTab = useAnalyticsPreferencesStore((state) => state.setActiveTab)
  const companyQuery = useCompanyAnalytics(true)

  useEffect(() => {
    document.title = 'Analytics'
  }, [])

  useEffect(() => {
    const tabParam = searchParams.get('tab')
    if (isAnalyticsTabId(tabParam) && tabParam !== activeTab) {
      setActiveTab(tabParam)
    }
  }, [activeTab, searchParams, setActiveTab])

  const handleTabChange = (tab: AnalyticsTabId) => {
    setActiveTab(tab)
    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('tab', tab)
    setSearchParams(nextParams, { replace: true })
  }

  return (
    <PageContainer className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Read-only operational and executive insights for the selected reporting period."
      />

      <AnalyticsFilterBar />
      <AnalyticsRefreshBar generatedAt={companyQuery.data?.generatedAt} />

      <div className="space-y-4">
        <div
          className="flex gap-2 overflow-x-auto pb-1"
          role="tablist"
          aria-label="Analytics domains"
        >
          {ANALYTICS_TABS.map((tab) => {
            const selected = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selected}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors',
                  selected
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-muted-foreground hover:text-foreground',
                )}
                onClick={() => {
                  handleTabChange(tab.id)
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        <div role="tabpanel" aria-label={`${activeTab} analytics`}>
          {activeTab === 'overview' ? <CompanyOverviewSection /> : null}
          {activeTab === 'transactions' ? <TransactionAnalyticsSection enabled /> : null}
          {activeTab === 'expenses' ? <ExpenseAnalyticsSection enabled /> : null}
          {activeTab === 'workforce' ? <WorkforceAnalyticsSection enabled /> : null}
          {activeTab === 'trips' ? <TripAnalyticsSection enabled /> : null}
          {activeTab === 'organization' ? <OrganizationAnalyticsSection enabled /> : null}
        </div>
      </div>
    </PageContainer>
  )
}
