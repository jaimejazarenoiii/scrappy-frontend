import { cn } from '@/lib/utils'

export const BRAND_LOGO_SRC = '/brand/scrappy-logo.jpg'

interface BrandLogoProps {
  /** Outer size of the mark (Tailwind size classes). */
  className?: string
  /** Show “Scrappy” wordmark beside the mark. */
  withWordmark?: boolean
  wordmarkClassName?: string
  /**
   * `dark` — black plate so the JPEG’s black background blends on light UI.
   * `none` — raw mark (use on already-dark surfaces).
   */
  plate?: 'dark' | 'none'
  alt?: string
}

export function BrandLogo({
  className,
  withWordmark = false,
  wordmarkClassName,
  plate = 'dark',
  alt = '',
}: BrandLogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', withWordmark && 'min-w-0')}>
      <span
        className={cn(
          'inline-flex shrink-0 items-center justify-center overflow-hidden',
          plate === 'dark' ? 'rounded-lg bg-black' : 'rounded-md',
          className ?? 'size-8',
        )}
      >
        <img
          src={BRAND_LOGO_SRC}
          alt={alt}
          width={128}
          height={128}
          className="size-full object-cover"
          decoding="async"
        />
      </span>
      {withWordmark ? (
        <span
          className={cn(
            'truncate font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight',
            wordmarkClassName,
          )}
        >
          Scrappy
        </span>
      ) : null}
    </span>
  )
}
