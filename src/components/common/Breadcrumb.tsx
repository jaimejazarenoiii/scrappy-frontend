import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'

import { useBreadcrumbTrail } from '@/hooks/useBreadcrumbTrail'
import { type BreadcrumbItem } from '@/lib/breadcrumb'
import { cn } from '@/lib/utils'

export function Breadcrumb() {
  const items: BreadcrumbItem[] = useBreadcrumbTrail()

  return (
    <nav
      aria-label="Breadcrumb"
      className="text-muted-foreground flex flex-wrap items-center gap-1 text-sm"
    >
      <Link to="/dashboard" className="hover:text-foreground transition-colors">
        Home
      </Link>
      {items.map((item) => (
        <span key={`${item.label}-${item.href ?? 'current'}`} className="flex items-center gap-1">
          <ChevronRight className="size-3.5" />
          {item.href ? (
            <Link to={item.href} className="hover:text-foreground transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className={cn('text-foreground font-medium')}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
