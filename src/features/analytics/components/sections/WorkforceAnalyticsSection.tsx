import { AnalyticsKpiCard } from '@/features/analytics/components/AnalyticsKpiCard'
import { AnalyticsKpiGrid } from '@/features/analytics/components/AnalyticsKpiGrid'
import { EntityLink } from '@/features/analytics/components/AnalyticsEntityLink'
import { AnalyticsRankingTable } from '@/features/analytics/components/AnalyticsRankingTable'
import { rankingPermissions, rankingRoutes } from '@/features/analytics/lib/analytics-ranking-links'
import { AnalyticsSection } from '@/features/analytics/components/AnalyticsSection'
import { useWorkforceAnalytics } from '@/features/analytics/hooks/useAnalyticsQueries'
import { formatCurrency } from '@/utils/format-currency'

interface WorkforceAnalyticsSectionProps {
  enabled?: boolean
}

function formatPercent(value: number | null): string {
  if (value == null) return '—'
  return `${value.toFixed(1)}%`
}

export function WorkforceAnalyticsSection({ enabled = true }: WorkforceAnalyticsSectionProps) {
  const query = useWorkforceAnalytics(enabled)
  const data = query.data

  const isEmpty = data
    ? data.employeeActivity.length === 0 &&
      data.payrollSummary.totalGross === 0 &&
      data.attendanceSummary.present === 0
    : false

  return (
    <AnalyticsSection
      title="Workforce analytics"
      description="Attendance, payroll, leave, and employee activity from backend aggregates."
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
          <AnalyticsKpiGrid>
            <AnalyticsKpiCard label="Present" value={data.attendanceSummary.present} />
            <AnalyticsKpiCard label="Late" value={data.attendanceSummary.late} />
            <AnalyticsKpiCard label="Absent" value={data.attendanceSummary.absent} />
            <AnalyticsKpiCard label="On leave" value={data.attendanceSummary.onLeave} />
          </AnalyticsKpiGrid>

          <AnalyticsKpiGrid>
            <AnalyticsKpiCard
              label="Payroll gross"
              value={formatCurrency(data.payrollSummary.totalGross)}
            />
            <AnalyticsKpiCard
              label="Payroll net"
              value={formatCurrency(data.payrollSummary.totalNet)}
            />
            <AnalyticsKpiCard label="Paid payroll runs" value={data.payrollSummary.paidCount} />
            <AnalyticsKpiCard
              label="Payable payroll runs"
              value={data.payrollSummary.payableCount}
            />
          </AnalyticsKpiGrid>

          <AnalyticsKpiGrid>
            <AnalyticsKpiCard label="Pending leave" value={data.leaveSummary.pending} />
            <AnalyticsKpiCard label="Approved leave" value={data.leaveSummary.approved} />
            <AnalyticsKpiCard label="Rejected leave" value={data.leaveSummary.rejected} />
            <AnalyticsKpiCard
              label="Outstanding cash advances"
              value={formatCurrency(data.cashAdvanceSummary.outstandingAmount)}
            />
          </AnalyticsKpiGrid>

          <AnalyticsRankingTable
            title="Employee activity"
            rows={data.employeeActivity}
            getRowKey={(row) => row.employeeId}
            columns={[
              {
                key: 'displayName',
                header: 'Employee',
                cell: (row) => (
                  <EntityLink
                    href={rankingRoutes.employee(row.employeeId)}
                    label={row.displayName}
                    permission={rankingPermissions.employee}
                  />
                ),
              },
              {
                key: 'attendanceRate',
                header: 'Attendance rate',
                cell: (row) => formatPercent(row.attendanceRate),
              },
              {
                key: 'transactionsProcessed',
                header: 'Transactions',
                cell: (row) => row.transactionsProcessed.toLocaleString(),
              },
              {
                key: 'tripsCompleted',
                header: 'Trips completed',
                cell: (row) => row.tripsCompleted.toLocaleString(),
              },
            ]}
          />
        </div>
      ) : null}
    </AnalyticsSection>
  )
}
