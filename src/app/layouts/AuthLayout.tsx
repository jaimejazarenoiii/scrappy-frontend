import { Link, Outlet } from 'react-router'

import { BrandLogo } from '@/components/common/BrandLogo'
import { ROUTES } from '@/constants/routes'

export function AuthLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-[#0b1a12] text-white lg:flex lg:flex-col lg:justify-between lg:p-10 xl:p-12">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 20% 20%, oklch(0.42 0.1 150 / 0.55), transparent), radial-gradient(ellipse 70% 50% at 90% 80%, oklch(0.65 0.12 65 / 0.22), transparent)',
          }}
        />
        <div className="relative z-10">
          <Link to={ROUTES.home} className="inline-flex transition-opacity hover:opacity-90">
            <BrandLogo
              className="size-10"
              withWordmark
              plate="none"
              wordmarkClassName="text-white text-2xl"
            />
          </Link>
        </div>
        <div className="relative z-10 max-w-md space-y-4">
          <p className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-balance text-white xl:text-4xl">
            Scrap trading operations, clarified.
          </p>
          <p className="text-base text-pretty text-white/80">
            Sign in to run transactions, trips, workforce, and reports in one business workspace.
          </p>
        </div>
        <p className="relative z-10 text-sm text-white/55">
          Built for scrap and recycling businesses
        </p>
      </aside>

      <div className="bg-background relative flex flex-col">
        <div
          className="pointer-events-none absolute inset-0 opacity-60 lg:opacity-40"
          aria-hidden
          style={{
            background:
              'radial-gradient(ellipse 60% 40% at 50% 0%, oklch(0.5 0.12 150 / 0.08), transparent)',
          }}
        />
        <div className="relative z-10 flex items-center justify-between px-5 py-5 lg:hidden">
          <Link to={ROUTES.home} className="inline-flex">
            <BrandLogo className="size-8" withWordmark plate="dark" />
          </Link>
        </div>
        <div className="relative z-10 flex flex-1 items-center justify-center px-5 py-8 sm:px-8">
          <div className="bg-card w-full max-w-md rounded-2xl border p-6 shadow-[var(--shadow-md)] sm:p-8">
            <div className="mb-6 hidden justify-center lg:flex">
              <BrandLogo className="size-12" plate="dark" />
            </div>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
