import { AnalyticsChart } from '@/features/analytics/components/AnalyticsChart'
import { AnalyticsKpiCard } from '@/features/analytics/components/AnalyticsKpiCard'
import { AnalyticsKpiGrid } from '@/features/analytics/components/AnalyticsKpiGrid'
import { AnalyticsSection } from '@/features/analytics/components/AnalyticsSection'
import { expenseChartConfig } from '@/features/analytics/lib/analytics-chart-config'
import { useExpenseAnalytics } from '@/features/analytics/hooks/useAnalyticsQueries'
import { formatCurrency } from '@/utils/format-currency'

interface ExpenseAnalyticsSectionProps {
  enabled?: boolean
}

export function ExpenseAnalyticsSection({ enabled = true }: ExpenseAnalyticsSectionProps) {
  const query = useExpenseAnalytics(enabled)
  const data = query.data

  const categoryChartData =
    data?.byCategory.map((row) => ({
      name: row.category,
      value: row.amount,
    })) ?? []

  const contextChartData =
    data?.byContextType.map((row) => ({
      name: row.contextType,
      value: row.amount,
    })) ?? []

  const statusChartData =
    data?.byStatus.map((row) => ({
      name: row.status,
      value: row.count,
    })) ?? []

  const timeSeriesChartData =
    data?.timeSeries.map((point) => ({
      name: point.label ?? point.date,
      value: point.value,
    })) ?? []

  const isEmpty = data?.expenseCount === 0

  return (
    <AnalyticsSection
      title="Expense analytics"
      description="Expense totals and breakdowns from backend aggregates."
      isLoading={query.isLoading}
      isError={query.isError}
      errorMessage={query.error instanceof Error ? query.error.message : undefined}
      onRetry={() => {
        void query.refetch()
      }}
      isEmpty={Boolean(data) && isEmpty}
      emptyTitle="No expenses in this period"
    >
      {data ? (
        <div className="space-y-6">
          <AnalyticsKpiGrid>
            <AnalyticsKpiCard label="Expenses" value={data.expenseCount.toLocaleString()} />
            <AnalyticsKpiCard label="Total amount" value={formatCurrency(data.totalAmount)} />
          </AnalyticsKpiGrid>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {categoryChartData.length > 0 ? (
              <AnalyticsChart
                title="Expenses by category"
                kind={expenseChartConfig.byCategory.kind}
                data={categoryChartData}
              />
            ) : null}
            {contextChartData.length > 0 ? (
              <AnalyticsChart
                title="Expenses by context"
                kind={expenseChartConfig.byContextType.kind}
                data={contextChartData}
              />
            ) : null}
            {statusChartData.length > 0 ? (
              <AnalyticsChart
                title="Expenses by status"
                kind={expenseChartConfig.byStatus.kind}
                data={statusChartData}
              />
            ) : null}
            {timeSeriesChartData.length > 0 ? (
              <AnalyticsChart
                title="Expense trend"
                kind={expenseChartConfig.timeSeries.kind}
                data={timeSeriesChartData}
              />
            ) : null}
          </div>
        </div>
      ) : null}
    </AnalyticsSection>
  )
}
