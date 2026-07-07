import { create } from 'zustand'

import { THEME_STORAGE_KEY } from '@/constants/theme'
import type { ResolvedTheme, ThemeMode } from '@/types/theme.types'

interface ThemeState {
  mode: ThemeMode
  resolvedTheme: ResolvedTheme
  setMode: (mode: ThemeMode) => void
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function resolveTheme(mode: ThemeMode): ResolvedTheme {
  if (mode === 'system') return getSystemTheme()
  return mode
}

function applyThemeClass(resolved: ResolvedTheme) {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('dark', resolved === 'dark')
}

function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') return 'system'
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
  return 'system'
}

const initialMode = getInitialMode()
const initialResolved = resolveTheme(initialMode)
applyThemeClass(initialResolved)

export const useThemeStore = create<ThemeState>((set) => ({
  mode: initialMode,
  resolvedTheme: initialResolved,
  setMode: (mode) => {
    localStorage.setItem(THEME_STORAGE_KEY, mode)
    const resolvedTheme = resolveTheme(mode)
    applyThemeClass(resolvedTheme)
    set({ mode, resolvedTheme })
  },
}))

if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const { mode, setMode } = useThemeStore.getState()
    if (mode === 'system') setMode('system')
  })
}
