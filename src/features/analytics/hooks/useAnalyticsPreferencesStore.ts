import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { AnalyticsTabId } from '../types/analytics.types'

interface AnalyticsPreferencesStore {
  activeTab: AnalyticsTabId
  autoRefreshEnabled: boolean
  collapsedSections: Record<string, boolean>
  setActiveTab: (tab: AnalyticsTabId) => void
  setAutoRefreshEnabled: (enabled: boolean) => void
  toggleSectionCollapsed: (sectionId: string) => void
}

export const useAnalyticsPreferencesStore = create<AnalyticsPreferencesStore>()(
  persist(
    (set) => ({
      activeTab: 'overview',
      autoRefreshEnabled: false,
      collapsedSections: {},
      setActiveTab: (activeTab) => {
        set({ activeTab })
      },
      setAutoRefreshEnabled: (autoRefreshEnabled) => {
        set({ autoRefreshEnabled })
      },
      toggleSectionCollapsed: (sectionId) => {
        set((state) => ({
          collapsedSections: {
            ...state.collapsedSections,
            [sectionId]: !state.collapsedSections[sectionId],
          },
        }))
      },
    }),
    { name: 'scrappy-analytics-preferences' },
  ),
)
