import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import {
  createDefaultReportFilters,
  type ReportDomain,
  type ReportFilterSet,
  type ReportSortDirection,
} from '../types/reports.types'

type FiltersByDomain = Record<ReportDomain, ReportFilterSet>

function createAllDefaults(): FiltersByDomain {
  return {
    transactions: { ...createDefaultReportFilters(), sortField: 'transactionDate' },
    trips: { ...createDefaultReportFilters(), sortField: 'scheduledStart' },
    expenses: { ...createDefaultReportFilters(), sortField: 'date' },
    payroll: { ...createDefaultReportFilters(), sortField: 'payPeriodStart' },
    attendance: { ...createDefaultReportFilters(), sortField: 'timeInAt' },
  }
}

interface ReportFilterStore {
  filtersByDomain: FiltersByDomain
  getFilters: (domain: ReportDomain) => ReportFilterSet
  setFilters: (domain: ReportDomain, patch: Partial<ReportFilterSet>) => void
  setDateRange: (domain: ReportDomain, from: string, to: string) => void
  setPage: (domain: ReportDomain, page: number) => void
  setSort: (
    domain: ReportDomain,
    sortField: string | null,
    sortDirection: ReportSortDirection,
  ) => void
  resetDomain: (domain: ReportDomain) => void
}

export const useReportFilterStore = create<ReportFilterStore>()(
  persist(
    (set, get) => ({
      filtersByDomain: createAllDefaults(),
      getFilters: (domain) => get().filtersByDomain[domain],
      setFilters: (domain, patch) => {
        set((state) => {
          const current = state.filtersByDomain[domain]
          return {
            filtersByDomain: {
              ...state.filtersByDomain,
              [domain]: {
                ...current,
                ...patch,
                // Filter changes reset to page 1 unless page is explicitly provided.
                page: patch.page ?? 1,
              },
            },
          }
        })
      },
      setDateRange: (domain, from, to) => {
        get().setFilters(domain, { from, to, page: 1 })
      },
      setPage: (domain, page) => {
        set((state) => ({
          filtersByDomain: {
            ...state.filtersByDomain,
            [domain]: { ...state.filtersByDomain[domain], page },
          },
        }))
      },
      setSort: (domain, sortField, sortDirection) => {
        get().setFilters(domain, { sortField, sortDirection, page: 1 })
      },
      resetDomain: (domain) => {
        set((state) => ({
          filtersByDomain: {
            ...state.filtersByDomain,
            [domain]: createAllDefaults()[domain],
          },
        }))
      },
    }),
    {
      name: 'scrappy-report-filters',
      // v4: reset persisted filters so entity pickers default to "All …" (clear stale employeeId).
      version: 4,
      migrate: () => ({ filtersByDomain: createAllDefaults() }),
    },
  ),
)
