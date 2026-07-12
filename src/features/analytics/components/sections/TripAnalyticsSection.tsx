import { AnalyticsChart } from '@/features/analytics/components/AnalyticsChart'
import { AnalyticsKpiCard } from '@/features/analytics/components/AnalyticsKpiCard'
import { AnalyticsKpiGrid } from '@/features/analytics/components/AnalyticsKpiGrid'
import { EntityLink } from '@/features/analytics/components/AnalyticsEntityLink'
import { AnalyticsRankingTable } from '@/features/analytics/components/AnalyticsRankingTable'
import { rankingPermissions, rankingRoutes } from '@/features/analytics/lib/analytics-ranking-links'
import { AnalyticsSection } from '@/features/analytics/components/AnalyticsSection'
import { tripChartConfig } from '@/features/analytics/lib/analytics-chart-config'
import { useTripAnalytics } from '@/features/analytics/hooks/useAnalyticsQueries'
import type { VehicleUtilizationRow } from '@/features/analytics/types/analytics.types'

interface TripAnalyticsSectionProps {
  enabled?: boolean
}

function formatDuration(minutes: number | null): string {
  if (minutes == null) return '—'
  if (minutes < 60) return `${String(Math.round(minutes))} min`
  const hours = Math.floor(minutes / 60)
  const remainder = Math.round(minutes % 60)
  return `${String(hours)}h ${String(remainder)}m`
}

export function TripAnalyticsSection({ enabled = true }: TripAnalyticsSectionProps) {
  const query = useTripAnalytics(enabled)
  const data = query.data

  const statusChartData =
    data?.statusDistribution.map((row) => ({
      name: row.status,
      value: row.count,
    })) ?? []

  const isEmpty = data?.tripCount === 0

  return (
    <AnalyticsSection
      title="Trip analytics"
      description="Trip counts, duration, status distribution, and vehicle utilization."
      isLoading={query.isLoading}
      isError={query.isError}
      errorMessage={query.error instanceof Error ? query.error.message : undefined}
      onRetry={() => {
        void query.refetch()
      }}
      isEmpty={Boolean(data) && isEmpty}
      emptyTitle="No trips in this period"
    >
      {data ? (
        <div className="space-y-6">
          <AnalyticsKpiGrid>
            <AnalyticsKpiCard label="Trips" value={data.tripCount.toLocaleString()} />
            <AnalyticsKpiCard label="Completed" value={data.completedCount.toLocaleString()} />
            <AnalyticsKpiCard label="Cancelled" value={data.cancelledCount.toLocaleString()} />
            {data.startedCount != null ? (
              <AnalyticsKpiCard label="Started" value={data.startedCount.toLocaleString()} />
            ) : null}
            <AnalyticsKpiCard
              label="Average duration"
              value={formatDuration(data.averageDurationMinutes)}
            />
          </AnalyticsKpiGrid>

          {statusChartData.length > 0 ? (
            <AnalyticsChart
              title="Trip status distribution"
              kind={tripChartConfig.statusDistribution.kind}
              data={statusChartData}
            />
          ) : null}

          <AnalyticsRankingTable<VehicleUtilizationRow>
            title="Vehicle utilization"
            rows={data.vehicleUtilization}
            getRowKey={(row) => row.vehicleId}
            columns={[
              {
                key: 'plateNumber',
                header: 'Vehicle',
                cell: (row) => (
                  <EntityLink
                    href={rankingRoutes.vehicle(row.vehicleId)}
                    label={row.plateNumber}
                    permission={rankingPermissions.vehicle}
                  />
                ),
              },
              { key: 'tripCount', header: 'Trips', cell: (row) => row.tripCount.toLocaleString() },
              {
                key: 'utilizationRate',
                header: 'Utilization',
                cell: (row) =>
                  row.utilizationRate == null ? '—' : `${row.utilizationRate.toFixed(1)}%`,
              },
            ]}
          />
        </div>
      ) : null}
    </AnalyticsSection>
  )
}
