import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { toast } from 'sonner'

import { isAnalyticsFilterValid } from '../validation/analytics-filter.schema'
import { AnalyticsService } from '../services/analytics.service'
import { analyticsKeys } from './analytics-keys'
import { useAnalyticsFilterStore } from './useAnalyticsFilterStore'
import { useAnalyticsPreferencesStore } from './useAnalyticsPreferencesStore'

const STALE_TIME_MS = 60_000
const AUTO_REFRESH_INTERVAL_MS = 60_000

function useAnalyticsQueryOptions(enabled: boolean) {
  const filters = useAnalyticsFilterStore((state) => state.filters)
  const autoRefreshEnabled = useAnalyticsPreferencesStore((state) => state.autoRefreshEnabled)
  const isValid = isAnalyticsFilterValid(filters)

  return {
    filters,
    enabled: enabled && isValid,
    staleTime: STALE_TIME_MS,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: true as const,
    refetchInterval:
      autoRefreshEnabled && enabled && isValid ? AUTO_REFRESH_INTERVAL_MS : (false as const),
  }
}

export function useCompanyAnalytics(enabled = true) {
  const options = useAnalyticsQueryOptions(enabled)
  const { filters, ...queryOptions } = options

  return useQuery({
    queryKey: analyticsKeys.company(filters),
    queryFn: () => AnalyticsService.getCompany(filters),
    ...queryOptions,
  })
}

export function useTransactionAnalytics(enabled = true) {
  const options = useAnalyticsQueryOptions(enabled)
  const { filters, ...queryOptions } = options

  return useQuery({
    queryKey: analyticsKeys.transactions(filters),
    queryFn: () => AnalyticsService.getTransactions(filters),
    ...queryOptions,
  })
}

export function useExpenseAnalytics(enabled = true) {
  const options = useAnalyticsQueryOptions(enabled)
  const { filters, ...queryOptions } = options

  return useQuery({
    queryKey: analyticsKeys.expenses(filters),
    queryFn: () => AnalyticsService.getExpenses(filters),
    ...queryOptions,
  })
}

export function useWorkforceAnalytics(enabled = true) {
  const options = useAnalyticsQueryOptions(enabled)
  const { filters, ...queryOptions } = options

  return useQuery({
    queryKey: analyticsKeys.workforce(filters),
    queryFn: () => AnalyticsService.getWorkforce(filters),
    ...queryOptions,
  })
}

export function useTripAnalytics(enabled = true) {
  const options = useAnalyticsQueryOptions(enabled)
  const { filters, ...queryOptions } = options

  return useQuery({
    queryKey: analyticsKeys.trips(filters),
    queryFn: () => AnalyticsService.getTrips(filters),
    ...queryOptions,
  })
}

export function useOrganizationAnalytics(enabled = true) {
  const options = useAnalyticsQueryOptions(enabled)
  const { filters, ...queryOptions } = options

  return useQuery({
    queryKey: analyticsKeys.organization(filters),
    queryFn: () => AnalyticsService.getOrganization(filters),
    ...queryOptions,
  })
}

export function useAnalyticsRefresh() {
  const queryClient = useQueryClient()
  const activeTab = useAnalyticsPreferencesStore((state) => state.activeTab)

  const isRefreshing = queryClient.isFetching({ queryKey: analyticsKeys.all }) > 0

  const refresh = useCallback(async () => {
    try {
      await queryClient.invalidateQueries({ queryKey: analyticsKeys.all })
      toast.success('Analytics refreshed')
    } catch {
      toast.error('Failed to refresh analytics')
    }
  }, [queryClient])

  return { refresh, isRefreshing, activeTab }
}
