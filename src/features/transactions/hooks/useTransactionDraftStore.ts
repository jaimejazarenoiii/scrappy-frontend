import { create } from 'zustand'

interface TransactionDraftStoreState {
  isDirty: boolean
  isSaving: boolean
  lastSavedAt: string | null
  setDirty: (dirty: boolean) => void
  setSaving: (saving: boolean) => void
  setLastSavedAt: (timestamp: string | null) => void
  reset: () => void
  markSaved: (timestamp: string) => void
}

export const useTransactionDraftStore = create<TransactionDraftStoreState>((set) => ({
  isDirty: false,
  isSaving: false,
  lastSavedAt: null,
  setDirty: (isDirty) => {
    set({ isDirty })
  },
  setSaving: (isSaving) => {
    set({ isSaving })
  },
  setLastSavedAt: (lastSavedAt) => {
    set({ lastSavedAt })
  },
  reset: () => {
    set({
      isDirty: false,
      isSaving: false,
      lastSavedAt: null,
    })
  },
  markSaved: (timestamp) => {
    set({
      isDirty: false,
      isSaving: false,
      lastSavedAt: timestamp,
    })
  },
}))
