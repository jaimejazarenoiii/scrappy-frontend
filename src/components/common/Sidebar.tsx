import { NavLink } from 'react-router'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { navigationItems } from '@/constants/navigation'
import { usePermissions } from '@/features/authorization/hooks/usePermissions'
import { useIsMobile, useIsTablet } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store/ui.store'

function NavItems({
  collapsed = false,
  onNavigate,
}: {
  collapsed?: boolean
  onNavigate?: () => void
}) {
  const { hasAny } = usePermissions()
  const visibleItems = navigationItems.filter((item) => !item.anyOf || hasAny(item.anyOf))

  return (
    <nav className="flex flex-col gap-1 p-2">
      {visibleItems.map((item) => {
        const Icon = item.icon
        return (
          <NavLink key={item.id} to={item.href} onClick={onNavigate}>
            {({ isActive }) => (
              <span
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/70',
                  collapsed && 'justify-center px-2',
                )}
              >
                <Icon className="size-4 shrink-0" />
                {!collapsed ? <span className="truncate">{item.label}</span> : null}
                {!collapsed && item.disabled ? (
                  <Badge variant="secondary" className="ml-auto text-[10px]">
                    Soon
                  </Badge>
                ) : null}
              </span>
            )}
          </NavLink>
        )
      })}
    </nav>
  )
}

function DesktopSidebar() {
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed)
  const toggleSidebar = useUIStore((state) => state.toggleSidebar)
  const isTablet = useIsTablet()

  return (
    <aside
      className={cn(
        'bg-sidebar text-sidebar-foreground hidden border-r md:flex md:flex-col',
        sidebarCollapsed && isTablet ? 'w-16' : 'w-64',
      )}
    >
      <div className="flex h-14 items-center border-b px-4">
        {!sidebarCollapsed || !isTablet ? (
          <span className="font-semibold">Scrappy Web</span>
        ) : (
          <span className="mx-auto font-bold">S</span>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        <NavItems collapsed={sidebarCollapsed && isTablet} />
      </div>
      {isTablet ? (
        <div className="border-t p-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={toggleSidebar}
          >
            {sidebarCollapsed ? 'Expand' : 'Collapse'}
          </Button>
        </div>
      ) : null}
    </aside>
  )
}

function MobileSidebar() {
  const mobileNavOpen = useUIStore((state) => state.mobileNavOpen)
  const closeMobileNav = useUIStore((state) => state.closeMobileNav)

  return (
    <Sheet
      open={mobileNavOpen}
      onOpenChange={(open) => {
        if (!open) closeMobileNav()
      }}
    >
      <SheetContent side="left" className="bg-sidebar text-sidebar-foreground w-72 p-0">
        <SheetHeader className="border-b">
          <SheetTitle>Scrappy Web</SheetTitle>
        </SheetHeader>
        <NavItems onNavigate={closeMobileNav} />
      </SheetContent>
    </Sheet>
  )
}

export function Sidebar() {
  const isMobile = useIsMobile()

  if (isMobile) return <MobileSidebar />
  return <DesktopSidebar />
}
