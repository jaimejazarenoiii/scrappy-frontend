import { LogOut, Menu, Moon, Sun, User as UserIcon } from 'lucide-react'

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
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={toggleMobileNav}
          aria-label="Open navigation menu"
        >
          <Menu className="size-5" />
        </Button>
        <div className="font-semibold lg:hidden">Scrappy Web</div>
        {tenant?.companyName ? (
          <span className="text-muted-foreground hidden text-sm lg:inline">
            {tenant.companyName}
          </span>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              className="relative"
            >
              <Sun className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setMode('light')
              }}
            >
              Light {mode === 'light' ? '✓' : ''}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setMode('dark')
              }}
            >
              Dark {mode === 'dark' ? '✓' : ''}
            </DropdownMenuItem>
            <DropdownMenuItem
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
            <Button type="button" variant="ghost" size="icon" aria-label="Open account menu">
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
