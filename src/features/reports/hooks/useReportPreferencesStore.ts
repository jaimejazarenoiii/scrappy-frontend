import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { DEFAULT_PAGE_SIZE, type ReportDomain } from '../types/reports.types'

interface ReportPreferencesStore {
  pageSize: number
  lastDomain: ReportDomain | null
  setPageSize: (pageSize: number) => void
  setLastDomain: (domain: ReportDomain) => void
}

export const useReportPreferencesStore = create<ReportPreferencesStore>()(
  persist(
    (set) => ({
      pageSize: DEFAULT_PAGE_SIZE,
      lastDomain: null,
      setPageSize: (pageSize) => {
        set({ pageSize })
      },
      setLastDomain: (lastDomain) => {
        set({ lastDomain })
      },
    }),
    { name: 'scrappy-report-preferences' },
  ),
)
