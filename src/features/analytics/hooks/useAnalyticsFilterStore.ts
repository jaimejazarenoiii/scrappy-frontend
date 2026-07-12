import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import {
  DEFAULT_ANALYTICS_FILTERS,
  type AnalyticsFilterSet,
  type AnalyticsPeriodPreset,
} from '../types/analytics.types'

interface AnalyticsFilterStore {
  filters: AnalyticsFilterSet
  setPeriod: (period: AnalyticsPeriodPreset) => void
  setCustomRange: (from: string | null, to: string | null) => void
  setBranchId: (branchId: string | null) => void
  setWarehouseId: (warehouseId: string | null) => void
  setVehicleId: (vehicleId: string | null) => void
  setEmployeeId: (employeeId: string | null) => void
  setIncludeArchived: (includeArchived: boolean) => void
  setLimit: (limit: number) => void
  resetFilters: () => void
}

export const useAnalyticsFilterStore = create<AnalyticsFilterStore>()(
  persist(
    (set) => ({
      filters: DEFAULT_ANALYTICS_FILTERS,
      setPeriod: (period) => {
        set((state) => ({
          filters: {
            ...state.filters,
            period,
            from: period === 'CUSTOM' ? state.filters.from : null,
            to: period === 'CUSTOM' ? state.filters.to : null,
          },
        }))
      },
      setCustomRange: (from, to) => {
        set((state) => ({
          filters: {
            ...state.filters,
            period: 'CUSTOM',
            from,
            to,
          },
        }))
      },
      setBranchId: (branchId) => {
        set((state) => ({ filters: { ...state.filters, branchId } }))
      },
      setWarehouseId: (warehouseId) => {
        set((state) => ({ filters: { ...state.filters, warehouseId } }))
      },
      setVehicleId: (vehicleId) => {
        set((state) => ({ filters: { ...state.filters, vehicleId } }))
      },
      setEmployeeId: (employeeId) => {
        set((state) => ({ filters: { ...state.filters, employeeId } }))
      },
      setIncludeArchived: (includeArchived) => {
        set((state) => ({ filters: { ...state.filters, includeArchived } }))
      },
      setLimit: (limit) => {
        set((state) => ({ filters: { ...state.filters, limit } }))
      },
      resetFilters: () => {
        set({ filters: DEFAULT_ANALYTICS_FILTERS })
      },
    }),
    { name: 'scrappy-analytics-filters' },
  ),
)
