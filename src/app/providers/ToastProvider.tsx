import type { ReactNode } from 'react'
import { Toaster } from 'sonner'

import { useThemeStore } from '@/store/theme.store'

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const theme = useThemeStore((state) => state.resolvedTheme)

  return (
    <>
      {children}
      <Toaster
        theme={theme}
        position="bottom-right"
        toastOptions={{
          duration: 4000,
        }}
        className="toaster group"
      />
    </>
  )
}
