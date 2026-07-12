import { AnalyticsKpiCard } from '@/features/analytics/components/AnalyticsKpiCard'
import { AnalyticsKpiGrid } from '@/features/analytics/components/AnalyticsKpiGrid'
import { AnalyticsSection } from '@/features/analytics/components/AnalyticsSection'
import { useCompanyAnalytics } from '@/features/analytics/hooks/useAnalyticsQueries'
import { formatCurrency } from '@/utils/format-currency'

function formatCount(value: number): string {
  return new Intl.NumberFormat('en-PH').format(value)
}

export function CompanyOverviewSection() {
  const query = useCompanyAnalytics(true)

  const data = query.data
  const isEmpty = data
    ? data.inboundTransactionCount === 0 &&
      data.outboundTransactionCount === 0 &&
      data.totalTransactionAmount === 0 &&
      data.totalExpenses === 0 &&
      data.totalPayroll === 0 &&
      data.activeEmployeeCount === 0 &&
      data.activeTripCount === 0 &&
      data.activeVehicleCount === 0
    : false

  return (
    <AnalyticsSection
      title="Business overview"
      description="Executive KPIs for the selected reporting period."
      isLoading={query.isLoading}
      isError={query.isError}
      errorMessage={query.error instanceof Error ? query.error.message : undefined}
      onRetry={() => {
        void query.refetch()
      }}
      isEmpty={Boolean(data) && isEmpty}
    >
      {data ? (
        <div className="space-y-4">
          <AnalyticsKpiGrid>
            <AnalyticsKpiCard
              label="Inbound transactions"
              value={formatCount(data.inboundTransactionCount)}
            />
            <AnalyticsKpiCard
              label="Outbound transactions"
              value={formatCount(data.outboundTransactionCount)}
            />
            <AnalyticsKpiCard
              label="Total transaction amount"
              value={formatCurrency(data.totalTransactionAmount)}
            />
            <AnalyticsKpiCard label="Total expenses" value={formatCurrency(data.totalExpenses)} />
            <AnalyticsKpiCard label="Total payroll" value={formatCurrency(data.totalPayroll)} />
            <AnalyticsKpiCard
              label="Net operational amount"
              value={formatCurrency(data.netOperationalAmount)}
              highlight
            />
            <AnalyticsKpiCard
              label="Active employees"
              value={formatCount(data.activeEmployeeCount)}
            />
            <AnalyticsKpiCard label="Active trips" value={formatCount(data.activeTripCount)} />
            <AnalyticsKpiCard
              label="Active vehicles"
              value={formatCount(data.activeVehicleCount)}
            />
          </AnalyticsKpiGrid>

          {Object.keys(data.appliedFilters).length > 0 ? (
            <p className="text-muted-foreground text-xs">
              Applied filters echoed by backend: {JSON.stringify(data.appliedFilters)}
            </p>
          ) : null}
        </div>
      ) : null}
    </AnalyticsSection>
  )
}
