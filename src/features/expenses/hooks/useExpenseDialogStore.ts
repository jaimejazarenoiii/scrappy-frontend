import { create } from 'zustand'

type ExpenseDialogType = 'delete' | 'archive' | null

interface ExpenseDialogStore {
  activeDialog: ExpenseDialogType
  openDelete: () => void
  openArchive: () => void
  closeDialog: () => void
}

export const useExpenseDialogStore = create<ExpenseDialogStore>((set) => ({
  activeDialog: null,
  openDelete: () => {
    set({ activeDialog: 'delete' })
  },
  openArchive: () => {
    set({ activeDialog: 'archive' })
  },
  closeDialog: () => {
    set({ activeDialog: null })
  },
}))
