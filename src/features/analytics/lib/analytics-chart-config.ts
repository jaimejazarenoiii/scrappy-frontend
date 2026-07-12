import type { AnalyticsChartKind } from '../types/analytics.types'

export interface AnalyticsChartConfig {
  kind: AnalyticsChartKind
  nameKey: string
  valueKey: string
}

export const transactionChartConfig = {
  topMaterials: { kind: 'bar', nameKey: 'name', valueKey: 'value' } satisfies AnalyticsChartConfig,
  timeSeries: { kind: 'area', nameKey: 'date', valueKey: 'value' } satisfies AnalyticsChartConfig,
} as const

export const expenseChartConfig = {
  byCategory: { kind: 'donut', nameKey: 'name', valueKey: 'value' } satisfies AnalyticsChartConfig,
  byContextType: { kind: 'bar', nameKey: 'name', valueKey: 'value' } satisfies AnalyticsChartConfig,
  byStatus: { kind: 'bar', nameKey: 'name', valueKey: 'value' } satisfies AnalyticsChartConfig,
  timeSeries: { kind: 'line', nameKey: 'date', valueKey: 'value' } satisfies AnalyticsChartConfig,
} as const

export const tripChartConfig = {
  statusDistribution: {
    kind: 'donut',
    nameKey: 'name',
    valueKey: 'value',
  } satisfies AnalyticsChartConfig,
} as const

export const CHART_COLORS = [
  'var(--primary)',
  'var(--muted-foreground)',
  'var(--ring)',
  'var(--destructive)',
  'var(--secondary-foreground)',
] as const
