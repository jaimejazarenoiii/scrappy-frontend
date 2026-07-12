import { apiClient } from '@/lib/axios'
import { unwrap } from '@/lib/api-envelope'
import type { ApiEnvelope } from '@/types/api.types'

import {
  buildAnalyticsQueryParams,
  normalizeCompanyAnalytics,
  normalizeExpenseAnalytics,
  normalizeOrganizationAnalytics,
  normalizeTransactionAnalytics,
  normalizeTripAnalytics,
  normalizeWorkforceAnalytics,
} from '../lib/analytics-api'
import type {
  AnalyticsFilterSet,
  CompanyAnalytics,
  ExpenseAnalytics,
  OrganizationAnalytics,
  TransactionAnalytics,
  TripAnalytics,
  WorkforceAnalytics,
} from '../types/analytics.types'

export const ANALYTICS_ENDPOINTS = {
  company: '/analytics/company',
  transactions: '/analytics/transactions',
  expenses: '/analytics/expenses',
  workforce: '/analytics/workforce',
  trips: '/analytics/trips',
  organization: '/analytics/organization',
} as const

export const AnalyticsService = {
  async getCompany(filters: AnalyticsFilterSet): Promise<CompanyAnalytics> {
    const response = await apiClient.get<ApiEnvelope<Record<string, unknown>>>(
      ANALYTICS_ENDPOINTS.company,
      { params: buildAnalyticsQueryParams(filters) },
    )
    return normalizeCompanyAnalytics(unwrap(response))
  },

  async getTransactions(filters: AnalyticsFilterSet): Promise<TransactionAnalytics> {
    const response = await apiClient.get<ApiEnvelope<Record<string, unknown>>>(
      ANALYTICS_ENDPOINTS.transactions,
      { params: buildAnalyticsQueryParams(filters) },
    )
    return normalizeTransactionAnalytics(unwrap(response))
  },

  async getExpenses(filters: AnalyticsFilterSet): Promise<ExpenseAnalytics> {
    const response = await apiClient.get<ApiEnvelope<Record<string, unknown>>>(
      ANALYTICS_ENDPOINTS.expenses,
      { params: buildAnalyticsQueryParams(filters) },
    )
    return normalizeExpenseAnalytics(unwrap(response))
  },

  async getWorkforce(filters: AnalyticsFilterSet): Promise<WorkforceAnalytics> {
    const response = await apiClient.get<ApiEnvelope<Record<string, unknown>>>(
      ANALYTICS_ENDPOINTS.workforce,
      { params: buildAnalyticsQueryParams(filters) },
    )
    return normalizeWorkforceAnalytics(unwrap(response))
  },

  async getTrips(filters: AnalyticsFilterSet): Promise<TripAnalytics> {
    const response = await apiClient.get<ApiEnvelope<Record<string, unknown>>>(
      ANALYTICS_ENDPOINTS.trips,
      { params: buildAnalyticsQueryParams(filters) },
    )
    return normalizeTripAnalytics(unwrap(response))
  },

  async getOrganization(filters: AnalyticsFilterSet): Promise<OrganizationAnalytics> {
    const response = await apiClient.get<ApiEnvelope<Record<string, unknown>>>(
      ANALYTICS_ENDPOINTS.organization,
      { params: buildAnalyticsQueryParams(filters) },
    )
    return normalizeOrganizationAnalytics(unwrap(response))
  },
}
