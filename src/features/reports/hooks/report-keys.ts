import type { ReportDomain, ReportFilterSet } from '../types/reports.types'

export const reportKeys = {
  all: ['reports'] as const,
  lists: () => [...reportKeys.all, 'list'] as const,
  list: (domain: ReportDomain, filters: ReportFilterSet) =>
    [...reportKeys.lists(), domain, filters] as const,
  exports: () => [...reportKeys.all, 'export'] as const,
}
