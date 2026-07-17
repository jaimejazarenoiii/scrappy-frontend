import { AnalyticsChart } from '@/features/analytics/components/AnalyticsChart'
import { AnalyticsKpiCard } from '@/features/analytics/components/AnalyticsKpiCard'
import { AnalyticsKpiGrid } from '@/features/analytics/components/AnalyticsKpiGrid'
import { EntityLink } from '@/features/analytics/components/AnalyticsEntityLink'
import { formatRankingCurrency } from '@/features/analytics/lib/analytics-ranking-links'
import { AnalyticsRankingTable } from '@/features/analytics/components/AnalyticsRankingTable'
import { rankingPermissions, rankingRoutes } from '@/features/analytics/lib/analytics-ranking-links'
import { AnalyticsSection } from '@/features/analytics/components/AnalyticsSection'
import { transactionChartConfig } from '@/features/analytics/lib/analytics-chart-config'
import { useTransactionAnalytics } from '@/features/analytics/hooks/useAnalyticsQueries'
import { formatCurrency } from '@/utils/format-currency'

interface TransactionAnalyticsSectionProps {
  enabled?: boolean
}

export function TransactionAnalyticsSection({ enabled = true }: TransactionAnalyticsSectionProps) {
  const query = useTransactionAnalytics(enabled)
  const data = query.data

  const topMaterialsChartData =
    data?.topMaterials.map((row) => ({
      name: row.materialName,
      value: row.totalAmount,
    })) ?? []

  const timeSeriesChartData =
    data?.timeSeries.map((point) => ({
      name: point.label ?? point.date,
      value: point.value,
    })) ?? []

  const isEmpty = data?.transactionCount === 0

  return (
    <AnalyticsSection
      title="Transaction analytics"
      description="Transaction volume, rankings, and trends from backend aggregates."
      isLoading={query.isLoading}
      isError={query.isError}
      errorMessage={query.error instanceof Error ? query.error.message : undefined}
      onRetry={() => {
        void query.refetch()
      }}
      isEmpty={Boolean(data) && isEmpty}
      emptyTitle="No transactions in this period"
      emptyDescription="Widen the date range or clear entity filters to see transaction analytics."
    >
      {data ? (
        <div className="space-y-6">
          <AnalyticsKpiGrid>
            <AnalyticsKpiCard label="Transactions" value={data.transactionCount.toLocaleString()} />
            <AnalyticsKpiCard
              label="Sales"
              value={formatCurrency(data.outboundAmount)}
              trend={{
                label: `Money in · ${data.outboundCount.toLocaleString()} outbound`,
                direction: 'neutral',
              }}
            />
            <AnalyticsKpiCard
              label="Purchases"
              value={formatCurrency(data.inboundAmount)}
              trend={{
                label: `Money out · ${data.inboundCount.toLocaleString()} inbound`,
                direction: 'neutral',
              }}
            />
            <AnalyticsKpiCard label="Total amount" value={formatCurrency(data.totalAmount)} />
            <AnalyticsKpiCard label="Average value" value={formatCurrency(data.averageValue)} />
          </AnalyticsKpiGrid>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {data.inboundCount > 0 || data.outboundCount > 0 ? (
              <AnalyticsChart
                title="Inbound vs outbound"
                kind="donut"
                data={[
                  { name: 'Inbound', value: data.inboundCount },
                  { name: 'Outbound', value: data.outboundCount },
                ].filter((row) => row.value > 0)}
              />
            ) : null}

            {topMaterialsChartData.length > 0 ? (
              <AnalyticsChart
                title="Top materials"
                kind={transactionChartConfig.topMaterials.kind}
                data={topMaterialsChartData}
              />
            ) : null}

            {timeSeriesChartData.length > 0 ? (
              <AnalyticsChart
                title="Transaction trend"
                kind={transactionChartConfig.timeSeries.kind}
                data={timeSeriesChartData}
              />
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <AnalyticsRankingTable
              title="Most active employees"
              rows={data.mostActiveEmployees}
              columns={[
                {
                  key: 'displayName',
                  header: 'Employee',
                  cell: (row) => (
                    <EntityLink
                      href={rankingRoutes.employee(row.id)}
                      label={row.displayName}
                      permission={rankingPermissions.employee}
                    />
                  ),
                },
                { key: 'count', header: 'Count', cell: (row) => row.count.toLocaleString() },
                {
                  key: 'totalAmount',
                  header: 'Amount',
                  cell: (row) => formatRankingCurrency(row.totalAmount),
                },
              ]}
            />
            <AnalyticsRankingTable
              title="Most active branches"
              rows={data.mostActiveBranches}
              columns={[
                {
                  key: 'displayName',
                  header: 'Branch',
                  cell: (row) => (
                    <EntityLink
                      href={rankingRoutes.branch(row.id)}
                      label={row.displayName}
                      permission={rankingPermissions.branch}
                    />
                  ),
                },
                { key: 'count', header: 'Count', cell: (row) => row.count.toLocaleString() },
                {
                  key: 'totalAmount',
                  header: 'Amount',
                  cell: (row) => formatRankingCurrency(row.totalAmount),
                },
              ]}
            />
            <AnalyticsRankingTable
              title="Most active warehouses"
              rows={data.mostActiveWarehouses}
              columns={[
                {
                  key: 'displayName',
                  header: 'Warehouse',
                  cell: (row) => (
                    <EntityLink
                      href={rankingRoutes.warehouse(row.id)}
                      label={row.displayName}
                      permission={rankingPermissions.warehouse}
                    />
                  ),
                },
                { key: 'count', header: 'Count', cell: (row) => row.count.toLocaleString() },
                {
                  key: 'totalAmount',
                  header: 'Amount',
                  cell: (row) => formatRankingCurrency(row.totalAmount),
                },
              ]}
            />
          </div>
        </div>
      ) : null}
    </AnalyticsSection>
  )
}
