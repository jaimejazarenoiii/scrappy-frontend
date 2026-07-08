import type { ReactNode } from 'react'

import { SearchInput } from '@/components/common/SearchInput'
import { cn } from '@/lib/utils'

interface FilterBarProps {
  search?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  children?: ReactNode
  actions?: ReactNode
  className?: string
}

export function FilterBar({
  search,
  onSearchChange,
  searchPlaceholder = 'Search…',
  children,
  actions,
  className,
}: FilterBarProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 md:flex-row md:items-center md:justify-between',
        className,
      )}
    >
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        {onSearchChange ? (
          <SearchInput
            value={search ?? ''}
            placeholder={searchPlaceholder}
            onChange={(event) => {
              onSearchChange(event.target.value)
            }}
            aria-label="Search"
          />
        ) : null}
        {children ? <div className="flex flex-wrap items-center gap-2">{children}</div> : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  )
}
