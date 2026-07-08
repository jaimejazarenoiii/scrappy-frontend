import * as React from 'react'
import { Check } from 'lucide-react'

import { cn } from '@/lib/utils'

export interface CheckboxProps extends Omit<React.ComponentProps<'input'>, 'type'> {
  label?: string
}

/**
 * Accessible checkbox built on a native input (no extra dependency). The native input
 * is visually hidden but remains focusable and keyboard-operable.
 */
const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { className, checked, ...props },
  ref,
) {
  return (
    <span className="relative inline-flex size-5 shrink-0 items-center justify-center">
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        className={cn(
          'peer size-5 cursor-pointer appearance-none rounded-[5px] border shadow-xs outline-none',
          'border-input bg-transparent',
          'checked:bg-primary checked:border-primary',
          'focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />
      <Check className="text-primary-foreground pointer-events-none absolute size-3.5 opacity-0 peer-checked:opacity-100" />
    </span>
  )
})

export { Checkbox }
