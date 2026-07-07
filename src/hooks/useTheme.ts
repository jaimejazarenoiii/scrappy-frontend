import { useThemeStore } from '@/store/theme.store'
import type { ThemeMode } from '@/types/theme.types'

export function useTheme() {
  const mode = useThemeStore((state) => state.mode)
  const resolvedTheme = useThemeStore((state) => state.resolvedTheme)
  const setMode = useThemeStore((state) => state.setMode)

  return {
    mode,
    resolvedTheme,
    setMode: (nextMode: ThemeMode) => {
      setMode(nextMode)
    },
    setTheme: (nextMode: ThemeMode) => {
      setMode(nextMode)
    },
    theme: resolvedTheme,
  }
}
