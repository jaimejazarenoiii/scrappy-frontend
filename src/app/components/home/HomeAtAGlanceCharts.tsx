import { useQuery } from '@tanstack/react-query'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { AnalyticsChart } from '@/features/analytics/components/AnalyticsChart'
import { AnalyticsKpiCard } from '@/features/analytics/components/AnalyticsKpiCard'
import { analyticsKeys } from '@/features/analytics/hooks/analytics-keys'
import { AnalyticsService } from '@/features/analytics/services/analytics.service'
import type { AnalyticsFilterSet } from '@/features/analytics/types/analytics.types'
import { PERMISSIONS } from '@/constants/permissions'
import { ROUTES } from '@/constants/routes'
import { formatCurrency } from '@/utils/format-currency'

const TODAY_FILTERS: AnalyticsFilterSet = {
  period: 'TODAY',
  from: null,
  to: null,
  branchId: null,
  warehouseId: null,
  vehicleId: null,
  employeeId: null,
  includeArchived: false,
  limit: 5,
}

const MONTH_FILTERS: AnalyticsFilterSet = {
  ...TODAY_FILTERS,
  period: 'THIS_MONTH',
  limit: 8,
}

function useHomeTodayAnalytics(enabled: boolean) {
  const company = useQuery({
    queryKey: analyticsKeys.company(TODAY_FILTERS),
    queryFn: () => AnalyticsService.getCompany(TODAY_FILTERS),
    enabled,
    staleTime: 60_000,
    retry: false,
  })

  const transactions = useQuery({
    queryKey: analyticsKeys.transactions(TODAY_FILTERS),
    queryFn: () => AnalyticsService.getTransactions(TODAY_FILTERS),
    enabled,
    staleTime: 60_000,
    retry: false,
  })

  return { company, transactions }
}

function useHomeMonthAnalytics(enabled: boolean) {
  const expenses = useQuery({
    queryKey: analyticsKeys.expenses(MONTH_FILTERS),
    queryFn: () => AnalyticsService.getExpenses(MONTH_FILTERS),
    enabled,
    staleTime: 60_000,
    retry: false,
  })

  const trips = useQuery({
    queryKey: analyticsKeys.trips(MONTH_FILTERS),
    queryFn: () => AnalyticsService.getTrips(MONTH_FILTERS),
    enabled,
    staleTime: 60_000,
    retry: false,
  })

  const transactions = useQuery({
    queryKey: analyticsKeys.transactions(MONTH_FILTERS),
    queryFn: () => AnalyticsService.getTransactions(MONTH_FILTERS),
    enabled,
    staleTime: 60_000,
    retry: false,
  })

  return { expenses, trips, transactions }
}

interface HomeAtAGlanceChartsProps {
  enabled: boolean
}

export function HomeAtAGlanceCharts({ enabled }: HomeAtAGlanceChartsProps) {
  const today = useHomeTodayAnalytics(enabled)
  const month = useHomeMonthAnalytics(enabled)

  if (!enabled) return null

  const isLoading =
    today.company.isLoading ||
    today.transactions.isLoading ||
    month.expenses.isLoading ||
    month.trips.isLoading ||
    month.transactions.isLoading

  const isError =
    today.company.isError ||
    today.transactions.isError ||
    month.expenses.isError ||
    month.trips.isError ||
    month.transactions.isError

  const companyToday = today.company.data
  const txToday = today.transactions.data
  const expensesMonth = month.expenses.data
  const tripsMonth = month.trips.data
  const txMonth = month.transactions.data

  const inboundToday = txToday?.inboundCount ?? companyToday?.inboundTransactionCount ?? 0
  const outboundToday = txToday?.outboundCount ?? companyToday?.outboundTransactionCount ?? 0
  const salesToday = txToday?.totalAmount ?? companyToday?.totalTransactionAmount ?? 0

  const inboundOutboundChart = [
    { name: 'Inbound', value: inboundToday },
    { name: 'Outbound', value: outboundToday },
  ].filter((row) => row.value > 0)

  const monthDirectionChart = inboundOutboundMonthChart(txMonth)

  const topMaterialsChart =
    txMonth?.topMaterials.slice(0, 5).map((row) => ({
      name: row.materialName,
      value: row.totalAmount,
    })) ?? []

  const expenseCategoryChart =
    expensesMonth?.byCategory.slice(0, 6).map((row) => ({
      name: row.category,
      value: row.amount,
    })) ?? []

  const tripStatusChart =
    tripsMonth?.statusDistribution.map((row) => ({
      name: row.status,
      value: row.count,
    })) ?? []

  const expenseTrendChart =
    expensesMonth?.timeSeries.map((point) => ({
      name: point.label ?? point.date,
      value: point.value,
    })) ?? []

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-sm font-semibold">At a glance</h2>
          <p className="text-muted-foreground text-xs">
            Today&apos;s sales plus this month&apos;s trends from Analytics
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to={ROUTES.analyticsDashboard}>
            Open analytics
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-2">
          <Skeleton className="col-span-2 h-28 rounded-xl md:row-span-2 md:h-auto" />
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
        </div>
      ) : isError ? (
        <p className="text-muted-foreground text-sm">
          Could not load analytics preview. Open Analytics to retry with full filters.
        </p>
      ) : (
        <div className="space-y-8">
          <div className="space-y-3">
            <h3 className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
              Today
            </h3>

            {/* Top bento: hero sales + equal KPI tiles */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
              <AnalyticsKpiCard
                className="justify-center sm:col-span-2 lg:col-span-2 lg:row-span-2"
                label="Total sales today"
                value={<span className="text-3xl md:text-4xl">{formatCurrency(salesToday)}</span>}
                highlight
              />
              <AnalyticsKpiCard label="Inbound" value={inboundToday.toLocaleString()} />
              <AnalyticsKpiCard label="Outbound" value={outboundToday.toLocaleString()} />
              <AnalyticsKpiCard
                label="Expenses"
                value={formatCurrency(companyToday?.totalExpenses ?? 0)}
              />
              <AnalyticsKpiCard
                label="Net operational"
                value={formatCurrency(companyToday?.netOperationalAmount ?? 0)}
              />
            </div>

            {/* Second row: equal-height chart + side metrics */}
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:items-stretch">
              {inboundOutboundChart.length > 0 ? (
                <AnalyticsChart
                  title="Inbound vs outbound"
                  kind="donut"
                  data={inboundOutboundChart}
                  chartClassName="h-52"
                />
              ) : (
                <AnalyticsKpiCard label="Inbound vs outbound" value="No transactions today" />
              )}
              <div className="grid grid-cols-2 gap-3">
                <AnalyticsKpiCard
                  label="Active trips"
                  value={(companyToday?.activeTripCount ?? 0).toLocaleString()}
                />
                <AnalyticsKpiCard
                  label="Active vehicles"
                  value={(companyToday?.activeVehicleCount ?? 0).toLocaleString()}
                />
                <AnalyticsKpiCard
                  className="col-span-2"
                  label="Transactions today"
                  value={(
                    txToday?.transactionCount ?? inboundToday + outboundToday
                  ).toLocaleString()}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
              This month
            </h3>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <AnalyticsKpiCard label="Sales" value={formatCurrency(txMonth?.totalAmount ?? 0)} />
              <AnalyticsKpiCard
                label="Expenses"
                value={formatCurrency(expensesMonth?.totalAmount ?? 0)}
              />
              <AnalyticsKpiCard
                label="Trips"
                value={(tripsMonth?.tripCount ?? 0).toLocaleString()}
              />
              <AnalyticsKpiCard
                label="Avg transaction"
                value={formatCurrency(txMonth?.averageValue ?? 0)}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {monthDirectionChart ? (
                <AnalyticsChart
                  title="Inbound vs outbound"
                  kind="bar"
                  data={monthDirectionChart}
                  chartClassName="h-52"
                />
              ) : null}
              {topMaterialsChart.length > 0 ? (
                <AnalyticsChart
                  title="Top materials"
                  kind="bar"
                  data={topMaterialsChart}
                  chartClassName="h-52"
                />
              ) : null}
              {expenseCategoryChart.length > 0 ? (
                <AnalyticsChart
                  title="Expenses by category"
                  kind="donut"
                  data={expenseCategoryChart}
                  chartClassName="h-52"
                />
              ) : null}
              {tripStatusChart.length > 0 ? (
                <AnalyticsChart
                  title="Trip status"
                  kind="donut"
                  data={tripStatusChart}
                  chartClassName="h-52"
                />
              ) : null}
              {expenseTrendChart.length > 0 ? (
                <AnalyticsChart
                  title="Expense trend"
                  kind="area"
                  data={expenseTrendChart}
                  className="md:col-span-2"
                  chartClassName="h-52"
                />
              ) : null}
            </div>
          </div>

          <p className="text-muted-foreground text-xs">
            Direction charts use backend transaction counts; sales use Analytics totals. Full
            filters live under{' '}
            <Link
              to={ROUTES.analyticsDashboard}
              className="text-primary font-medium hover:underline"
            >
              Analytics
            </Link>
            .
          </p>
        </div>
      )}
    </section>
  )
}

function inboundOutboundMonthChart(
  txMonth:
    | {
        inboundCount: number
        outboundCount: number
      }
    | undefined,
) {
  if (!txMonth) return null
  const data = [
    { name: 'Inbound', value: txMonth.inboundCount },
    { name: 'Outbound', value: txMonth.outboundCount },
  ].filter((row) => row.value > 0)
  return data.length > 0 ? data : null
}

/** Permission used by the dashboard to decide whether to show this section. */
export const HOME_ANALYTICS_PERMISSION = PERMISSIONS.analytics.view
