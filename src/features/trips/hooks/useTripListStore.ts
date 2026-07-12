import { create } from 'zustand'

interface TripListState {
  viewMode: 'table' | 'cards'
  setViewMode: (mode: 'table' | 'cards') => void
}

export const useTripListStore = create<TripListState>((set) => ({
  viewMode: 'table',
  setViewMode: (mode) => {
    set({ viewMode: mode })
  },
}))
