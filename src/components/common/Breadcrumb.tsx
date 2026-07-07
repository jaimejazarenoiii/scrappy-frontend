import { ChevronRight } from 'lucide-react'
import { Link, useLocation } from 'react-router'

import { cn } from '@/lib/utils'

export function Breadcrumb() {
  const location = useLocation()
  const segments = location.pathname.split('/').filter(Boolean)
  const label = segments[segments.length - 1]?.replace(/-/g, ' ') ?? 'home'

  return (
    <nav
      aria-label="Breadcrumb"
      className="text-muted-foreground flex items-center gap-1 text-sm capitalize"
    >
      <Link to="/dashboard" className="hover:text-foreground transition-colors">
        Home
      </Link>
      {segments.length > 0 ? <ChevronRight className="size-3.5" /> : null}
      <span className={cn('text-foreground font-medium')}>{label}</span>
    </nav>
  )
}
