import { create } from 'zustand'

interface ExpenseListStore {
  includeArchived: boolean
  setIncludeArchived: (value: boolean) => void
}

export const useExpenseListStore = create<ExpenseListStore>((set) => ({
  includeArchived: false,
  setIncludeArchived: (value) => {
    set({ includeArchived: value })
  },
}))
