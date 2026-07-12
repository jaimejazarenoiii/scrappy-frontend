import { LogOut, Menu, Moon, Sun, User as UserIcon } from 'lucide-react'

import { BrandLogo } from '@/components/common/BrandLogo'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { useLogout } from '@/features/auth/hooks/useLogout'
import { useTheme } from '@/hooks/useTheme'
import { useUIStore } from '@/store/ui.store'

export function Header() {
  const toggleMobileNav = useUIStore((state) => state.toggleMobileNav)
  const { mode, setMode } = useTheme()
  const { currentUser, tenant } = useCurrentUser()
  const logout = useLogout()

  return (
    <header className="bg-background/90 supports-[backdrop-filter]:bg-background/70 sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b px-4 backdrop-blur-md md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="cursor-pointer lg:hidden"
          onClick={toggleMobileNav}
          aria-label="Open navigation menu"
        >
          <Menu className="size-5" />
        </Button>
        <div className="lg:hidden">
          <BrandLogo className="size-7" withWordmark plate="dark" wordmarkClassName="text-base" />
        </div>
        {tenant?.companyName ? (
          <div className="hidden min-w-0 lg:block">
            <p className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
              Business
            </p>
            <p className="truncate text-sm font-medium">{tenant.companyName}</p>
          </div>
        ) : null}
      </div>

      <div className="flex items-center gap-1.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              className="relative cursor-pointer"
            >
              <Sun className="size-4 scale-100 rotate-0 transition-all duration-200 dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute size-4 scale-0 rotate-90 transition-all duration-200 dark:scale-100 dark:rotate-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                setMode('light')
              }}
            >
              Light {mode === 'light' ? '✓' : ''}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                setMode('dark')
              }}
            >
              Dark {mode === 'dark' ? '✓' : ''}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                setMode('system')
              }}
            >
              System {mode === 'system' ? '✓' : ''}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Open account menu"
              className="cursor-pointer"
            >
              <UserIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="truncate font-medium">{currentUser?.name ?? 'Account'}</span>
                {currentUser?.email ? (
                  <span className="text-muted-foreground truncate text-xs font-normal">
                    {currentUser.email}
                  </span>
                ) : null}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              disabled={logout.isPending}
              onClick={() => {
                logout.mutate()
              }}
            >
              <LogOut className="size-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
