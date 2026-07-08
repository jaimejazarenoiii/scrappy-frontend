import type { LucideIcon } from 'lucide-react'

export interface NavigationItem {
  id: string
  label: string
  href: string
  icon: LucideIcon
  disabled?: boolean
  badge?: string
  /** Item is shown only if the identity has ANY of these permissions. Omit for always-visible items. */
  anyOf?: string[]
  children?: NavigationItem[]
}
