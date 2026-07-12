import { EntityLink } from '@/features/analytics/components/AnalyticsEntityLink'
import { formatRankingCurrency } from '@/features/analytics/lib/analytics-ranking-links'
import { AnalyticsRankingTable } from '@/features/analytics/components/AnalyticsRankingTable'
import { rankingPermissions, rankingRoutes } from '@/features/analytics/lib/analytics-ranking-links'
import { AnalyticsSection } from '@/features/analytics/components/AnalyticsSection'
import { useOrganizationAnalytics } from '@/features/analytics/hooks/useAnalyticsQueries'
import type {
  LocationPerformanceRow,
  VehicleUtilizationRow,
} from '@/features/analytics/types/analytics.types'

interface OrganizationAnalyticsSectionProps {
  enabled?: boolean
}

export function OrganizationAnalyticsSection({
  enabled = true,
}: OrganizationAnalyticsSectionProps) {
  const query = useOrganizationAnalytics(enabled)
  const data = query.data

  const isEmpty = data
    ? data.branchPerformance.length === 0 &&
      data.warehousePerformance.length === 0 &&
      data.vehicleUtilization.length === 0
    : false

  return (
    <AnalyticsSection
      title="Organization analytics"
      description="Branch, warehouse, and fleet performance from backend aggregates."
      isLoading={query.isLoading}
      isError={query.isError}
      errorMessage={query.error instanceof Error ? query.error.message : undefined}
      onRetry={() => {
        void query.refetch()
      }}
      isEmpty={Boolean(data) && isEmpty}
    >
      {data ? (
        <div className="space-y-6">
          <AnalyticsRankingTable<LocationPerformanceRow>
            title="Branch performance"
            rows={data.branchPerformance}
            columns={[
              {
                key: 'name',
                header: 'Branch',
                cell: (row) => (
                  <EntityLink
                    href={rankingRoutes.branch(row.id)}
                    label={row.name}
                    permission={rankingPermissions.branch}
                  />
                ),
              },
              {
                key: 'transactionAmount',
                header: 'Transactions',
                cell: (row) => formatRankingCurrency(row.transactionAmount),
              },
              {
                key: 'expenseAmount',
                header: 'Expenses',
                cell: (row) => formatRankingCurrency(row.expenseAmount),
              },
              {
                key: 'tripCount',
                header: 'Trips',
                cell: (row) => (row.tripCount == null ? '—' : row.tripCount.toLocaleString()),
              },
            ]}
          />

          <AnalyticsRankingTable<LocationPerformanceRow>
            title="Warehouse performance"
            rows={data.warehousePerformance}
            columns={[
              {
                key: 'name',
                header: 'Warehouse',
                cell: (row) => (
                  <EntityLink
                    href={rankingRoutes.warehouse(row.id)}
                    label={row.name}
                    permission={rankingPermissions.warehouse}
                  />
                ),
              },
              {
                key: 'transactionAmount',
                header: 'Transactions',
                cell: (row) => formatRankingCurrency(row.transactionAmount),
              },
              {
                key: 'expenseAmount',
                header: 'Expenses',
                cell: (row) => formatRankingCurrency(row.expenseAmount),
              },
              {
                key: 'tripCount',
                header: 'Trips',
                cell: (row) => (row.tripCount == null ? '—' : row.tripCount.toLocaleString()),
              },
            ]}
          />

          <AnalyticsRankingTable<VehicleUtilizationRow>
            title="Fleet utilization"
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
