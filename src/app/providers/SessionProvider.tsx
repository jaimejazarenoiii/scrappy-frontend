import type { ReactNode } from 'react'

import { useSessionBootstrap } from '@/features/auth/hooks/useSessionBootstrap'

interface SessionProviderProps {
  children: ReactNode
}

export function SessionProvider({ children }: SessionProviderProps) {
  useSessionBootstrap()
  return <>{children}</>
}
