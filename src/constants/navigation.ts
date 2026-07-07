import { LayoutDashboard, Settings, Shield } from 'lucide-react'

import { ROUTES } from '@/constants/routes'
import type { NavigationItem } from '@/types/navigation.types'

export const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: ROUTES.dashboard,
    icon: LayoutDashboard,
  },
  {
    id: 'administration',
    label: 'Administration',
    href: ROUTES.comingSoon,
    icon: Shield,
    disabled: true,
  },
  {
    id: 'settings',
    label: 'Settings',
    href: ROUTES.comingSoon,
    icon: Settings,
    disabled: true,
  },
]
