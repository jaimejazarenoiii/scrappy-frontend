import { NavLink } from 'react-router'

import { BrandLogo } from '@/components/common/BrandLogo'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { navigationItems } from '@/constants/navigation'
import { usePermissions } from '@/features/authorization/hooks/usePermissions'
import { useIsMobile, useIsTablet } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store/ui.store'

function BrandMark({ collapsed = false }: { collapsed?: boolean }) {
  if (collapsed) {
    return <BrandLogo className="size-8" plate="dark" />
  }

  return (
    <BrandLogo
      className="size-8"
      withWordmark
      plate="dark"
      wordmarkClassName="text-sidebar-foreground"
    />
  )
}

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
    <nav className="flex flex-col gap-0.5 p-2" aria-label="Main">
      {visibleItems.map((item) => {
        const Icon = item.icon
        return (
          <NavLink key={item.id} to={item.href} onClick={onNavigate} className="cursor-pointer">
            {({ isActive }) => (
              <span
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200',
                  isActive
                    ? 'bg-primary/12 text-primary dark:bg-primary/20 dark:text-primary'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground',
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
  const collapsed = sidebarCollapsed && isTablet

  return (
    <aside
      className={cn(
        'bg-sidebar text-sidebar-foreground sticky top-0 hidden h-dvh border-r md:flex md:flex-col',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      <div
        className={cn(
          'flex h-14 items-center border-b',
          collapsed ? 'justify-center px-2' : 'px-4',
        )}
      >
        <BrandMark collapsed={collapsed} />
      </div>
      <div className="flex-1 overflow-y-auto">
        <NavItems collapsed={collapsed} />
      </div>
      {isTablet ? (
        <div className="border-t p-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full cursor-pointer"
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
        <SheetHeader className="border-b px-4 py-3">
          <SheetTitle className="sr-only">Scrappy</SheetTitle>
          <BrandLogo className="size-8" withWordmark plate="dark" />
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <NavItems onNavigate={closeMobileNav} />
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function Sidebar() {
  const isMobile = useIsMobile()

  if (isMobile) return <MobileSidebar />
  return <DesktopSidebar />
}
