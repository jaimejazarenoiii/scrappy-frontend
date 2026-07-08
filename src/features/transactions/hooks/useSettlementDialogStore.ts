import { create } from 'zustand'

export type SettlementDialogType =
  'finish' | 'settle' | 'cancel' | 'returnToDraft' | 'reopen' | null

interface SettlementDialogState {
  activeDialog: SettlementDialogType
  openDialog: (dialog: Exclude<SettlementDialogType, null>) => void
  closeDialog: () => void
}

export const useSettlementDialogStore = create<SettlementDialogState>((set) => ({
  activeDialog: null,
  openDialog: (dialog) => {
    set({ activeDialog: dialog })
  },
  closeDialog: () => {
    set({ activeDialog: null })
  },
}))
