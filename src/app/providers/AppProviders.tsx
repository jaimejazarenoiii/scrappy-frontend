import type { ReactNode } from 'react'

import { QueryProvider } from '@/app/providers/QueryProvider'
import { SessionProvider } from '@/app/providers/SessionProvider'
import { ThemeProvider } from '@/app/providers/ThemeProvider'
import { ToastProvider } from '@/app/providers/ToastProvider'
import { TooltipProvider } from '@/components/ui/tooltip'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <TooltipProvider>
          <ToastProvider>
            <SessionProvider>{children}</SessionProvider>
          </ToastProvider>
        </TooltipProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}
