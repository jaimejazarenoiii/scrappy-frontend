import { BrandLogo } from '@/components/common/BrandLogo'

export function Footer() {
  return (
    <footer className="text-muted-foreground border-t px-4 py-4 md:px-6">
      <div className="mx-auto flex max-w-full flex-col items-center justify-center gap-2 sm:flex-row sm:gap-3">
        <BrandLogo className="size-6" plate="dark" />
        <p className="text-center text-xs">
          © {new Date().getFullYear()} Scrappy · Scrap trading operations
        </p>
      </div>
    </footer>
  )
}
