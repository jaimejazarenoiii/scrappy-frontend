import { Menu, Moon, Sun } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme } from '@/hooks/useTheme'
import { useUIStore } from '@/store/ui.store'

export function Header() {
  const toggleMobileNav = useUIStore((state) => state.toggleMobileNav)
  const { mode, setMode } = useTheme()

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
      </div>
    </header>
  )
}
