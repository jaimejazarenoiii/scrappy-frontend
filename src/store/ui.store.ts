import { create } from 'zustand'

interface UIState {
  sidebarCollapsed: boolean
  mobileNavOpen: boolean
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  openMobileNav: () => void
  closeMobileNav: () => void
  toggleMobileNav: () => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  mobileNavOpen: false,
  toggleSidebar: () => {
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }))
  },
  setSidebarCollapsed: (sidebarCollapsed) => {
    set({ sidebarCollapsed })
  },
  openMobileNav: () => {
    set({ mobileNavOpen: true })
  },
  closeMobileNav: () => {
    set({ mobileNavOpen: false })
  },
  toggleMobileNav: () => {
    set((state) => ({ mobileNavOpen: !state.mobileNavOpen }))
  },
}))
