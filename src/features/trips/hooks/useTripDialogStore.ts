import { create } from 'zustand'

type TripDialogType =
  'schedule' | 'start' | 'complete' | 'cancel' | 'assignMembers' | 'assignVehicle' | null

interface TripDialogState {
  activeDialog: TripDialogType
  openDialog: (dialog: TripDialogType) => void
  closeDialog: () => void
}

export const useTripDialogStore = create<TripDialogState>((set) => ({
  activeDialog: null,
  openDialog: (dialog) => {
    set({ activeDialog: dialog })
  },
  closeDialog: () => {
    set({ activeDialog: null })
  },
}))
