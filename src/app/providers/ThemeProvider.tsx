import type { ReactNode } from 'react'

import { useThemeStore } from '@/store/theme.store'

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  useThemeStore((state) => state.resolvedTheme)
  return <>{children}</>
}
