import type { ComponentProps } from 'react'
import { Search } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface SearchInputProps extends ComponentProps<'input'> {
  containerClassName?: string
}

export function SearchInput({ className, containerClassName, ...props }: SearchInputProps) {
  return (
    <div className={cn('relative w-full max-w-md', containerClassName)}>
      <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
      <Input className={cn('pl-9', className)} type="search" {...props} />
    </div>
  )
}
