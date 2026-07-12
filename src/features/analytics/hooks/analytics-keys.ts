import type { AnalyticsFilterSet } from '../types/analytics.types'

export const analyticsKeys = {
  all: ['analytics'] as const,
  company: (filters: AnalyticsFilterSet) => [...analyticsKeys.all, 'company', filters] as const,
  transactions: (filters: AnalyticsFilterSet) =>
    [...analyticsKeys.all, 'transactions', filters] as const,
  expenses: (filters: AnalyticsFilterSet) => [...analyticsKeys.all, 'expenses', filters] as const,
  workforce: (filters: AnalyticsFilterSet) => [...analyticsKeys.all, 'workforce', filters] as const,
  trips: (filters: AnalyticsFilterSet) => [...analyticsKeys.all, 'trips', filters] as const,
  organization: (filters: AnalyticsFilterSet) =>
    [...analyticsKeys.all, 'organization', filters] as const,
}
