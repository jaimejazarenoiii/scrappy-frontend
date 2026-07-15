import { create } from 'zustand'

type ExpenseDialogType = 'archive' | null

interface ExpenseDialogStore {
  activeDialog: ExpenseDialogType
  openArchive: () => void
  closeDialog: () => void
}

export const useExpenseDialogStore = create<ExpenseDialogStore>((set) => ({
  activeDialog: null,
  openArchive: () => {
    set({ activeDialog: 'archive' })
  },
  closeDialog: () => {
    set({ activeDialog: null })
  },
}))
