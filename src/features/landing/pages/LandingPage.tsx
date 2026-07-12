import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import {
  ArrowRight,
  BarChart3,
  ClipboardCheck,
  Mail,
  Phone,
  Route,
  ShieldCheck,
  Truck,
  Wallet,
} from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { BrandLogo } from '@/components/common/BrandLogo'
import { ROUTES } from '@/constants/routes'
import { useAuthStore } from '@/store/auth.store'
import { cn } from '@/lib/utils'

const FEATURES = [
  {
    title: 'Transactions & settlement',
    description:
      'Capture inbound and outbound deals, then settle payments with a clear audit trail.',
    icon: ClipboardCheck,
  },
  {
    title: 'Trips & fleet',
    description: 'Schedule runs, assign vehicles and crew, and keep every trip status visible.',
    icon: Truck,
  },
  {
    title: 'Workforce ops',
    description: 'Attendance, leave, cash advances, and payroll in one business-scoped workspace.',
    icon: Wallet,
  },
  {
    title: 'Analytics & reports',
    description:
      'KPIs, trends, and exportable reports from backend data—never spreadsheet guesswork.',
    icon: BarChart3,
  },
] as const

const STEPS = [
  {
    step: '01',
    title: 'Sign in to your business',
    description: 'Tenant-isolated access for owners, managers, and employees.',
  },
  {
    step: '02',
    title: 'Run the day’s operations',
    description: 'Clock in, log transactions, dispatch trips, and issue expenses as work happens.',
  },
  {
    step: '03',
    title: 'Review and settle',
    description: 'Approve workflows, settle payments, and export reports when you need proof.',
  },
] as const

const CONTACT = {
  phoneDisplay: '+63 917 577 2063',
  phoneHref: 'tel:+639175772063',
  email: 'contact@jaimejazarenoiii.me',
  emailHref: 'mailto:contact@jaimejazarenoiii.me?subject=Scrappy%20registration%20interest',
} as const

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function LandingPage() {
  const reduceMotion = useReducedMotion()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.35])

  useEffect(() => {
    document.title = 'Scrappy — Scrap trading operations, clarified'
  }, [])

  const primaryHref = isAuthenticated ? ROUTES.dashboard : ROUTES.login
  const primaryLabel = isAuthenticated ? 'Open dashboard' : 'Sign in'

  return (
    <div className="landing-root min-h-screen overflow-x-hidden bg-[var(--landing-bg)] text-[var(--landing-fg)]">
      <a
        href="#main"
        className="absolute top-[-100px] left-4 z-[100] rounded-md bg-[var(--landing-fg)] px-3 py-2 text-sm font-medium text-[var(--landing-bg)] transition-[top] focus:top-4"
      >
        Skip to content
      </a>

      <header className="absolute inset-x-0 top-0 z-40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link
            to={ROUTES.home}
            className="inline-flex items-center transition-opacity hover:opacity-90"
            aria-label="Scrappy home"
          >
            <BrandLogo
              className="size-9"
              withWordmark
              plate="none"
              wordmarkClassName="text-white drop-shadow-sm"
            />
          </Link>
          <nav className="flex items-center gap-2 sm:gap-3" aria-label="Primary">
            <a
              href="#features"
              className="hidden text-sm font-medium text-white/90 transition-colors hover:text-white sm:inline"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="hidden text-sm font-medium text-white/90 transition-colors hover:text-white md:inline"
            >
              How it works
            </a>
            <a
              href="#contact"
              className="hidden text-sm font-medium text-white/90 transition-colors hover:text-white sm:inline"
            >
              Contact
            </a>
            <Button
              asChild
              size="sm"
              className="cursor-pointer bg-[var(--landing-accent)] text-[var(--landing-accent-fg)] hover:bg-[var(--landing-accent)]/90"
            >
              <Link to={primaryHref}>
                {primaryLabel}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main id="main">
        {/* Hero — one composition: brand, headline, sentence, CTAs, full-bleed image */}
        <section
          ref={heroRef}
          className="relative flex min-h-[100svh] items-end overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20"
        >
          <motion.div
            className="absolute inset-0"
            style={reduceMotion ? undefined : { y: heroY, opacity: heroOpacity }}
          >
            <img
              src="/landing/landing-hero-yard.png"
              alt=""
              className="size-full object-cover"
              width={1920}
              height={1080}
              fetchPriority="high"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[var(--landing-ink)] via-[var(--landing-ink)]/60 to-[var(--landing-ink)]/45"
              aria-hidden
            />
            <div
              className="absolute inset-0 bg-gradient-to-b from-[var(--landing-ink)]/75 via-transparent to-transparent"
              aria-hidden
            />
            <div
              className="absolute inset-0 bg-gradient-to-r from-[var(--landing-ink)]/70 via-transparent to-transparent"
              aria-hidden
            />
          </motion.div>

          <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <motion.div
              className="flex items-center gap-3 sm:gap-4"
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="font-[family-name:var(--font-landing-display)] text-5xl font-semibold tracking-tight text-white sm:text-7xl lg:text-8xl">
                Scrappy
              </p>
            </motion.div>
            <motion.h1
              className="mt-4 max-w-2xl text-2xl font-medium text-balance text-white sm:text-3xl lg:text-4xl"
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              Scrap trading operations, clarified.
            </motion.h1>
            <motion.p
              className="mt-4 max-w-xl text-base text-pretty text-white/80 sm:text-lg"
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            >
              Run transactions, trips, workforce, and reports in one business-scoped system built
              for scrap and recycling businesses.
            </motion.p>
            <motion.div
              className="mt-8 flex flex-wrap gap-3"
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              <Button
                asChild
                size="lg"
                className="cursor-pointer bg-[var(--landing-accent)] text-[var(--landing-accent-fg)] hover:bg-[var(--landing-accent)]/90"
              >
                <Link to={primaryHref}>
                  {primaryLabel}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="cursor-pointer border-white/40 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
              >
                <a href="#product">See the product</a>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Promise */}
        <section className="border-b border-[var(--landing-border)] py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Reveal className="max-w-3xl">
              <p className="text-sm font-semibold tracking-wide text-[var(--landing-muted)] uppercase">
                Built for the yard
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-landing-display)] text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                From the weigh-in to the payout—without the spreadsheet scramble.
              </h2>
              <p className="mt-4 text-lg text-pretty text-[var(--landing-muted)]">
                Scrappy keeps branches, warehouses, vehicles, people, and money in one place so
                owners and managers can settle faster and employees can stay focused on the floor.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <h2 className="font-[family-name:var(--font-landing-display)] text-3xl font-semibold tracking-tight sm:text-4xl">
                Everything the shop needs to move
              </h2>
              <p className="mt-3 max-w-2xl text-lg text-[var(--landing-muted)]">
                One product surface for the work that already happens every day.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {FEATURES.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <Reveal key={feature.title} delay={index * 0.06}>
                    <article
                      className={cn(
                        'group rounded-2xl border border-[var(--landing-border)] bg-[var(--landing-surface)] p-6 transition-colors',
                        'hover:border-[var(--landing-primary)]/35',
                      )}
                    >
                      <div className="flex size-11 items-center justify-center rounded-xl bg-[var(--landing-primary)]/10 text-[var(--landing-primary)]">
                        <Icon className="size-5" aria-hidden />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold tracking-tight">{feature.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--landing-muted)]">
                        {feature.description}
                      </p>
                    </article>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>

        {/* Product visual */}
        <section id="product" className="bg-[var(--landing-ink)] py-20 text-white sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <Reveal>
                <p className="text-sm font-semibold tracking-wide text-[var(--landing-accent)] uppercase">
                  Live operations
                </p>
                <h2 className="mt-3 font-[family-name:var(--font-landing-display)] text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                  A dashboard that mirrors the yard—not a generic CRM.
                </h2>
                <p className="mt-4 text-base text-pretty text-white/70 sm:text-lg">
                  Track ready-for-payment queues, attendance, trips, and period analytics from the
                  same home base your team already uses.
                </p>
                <ul className="mt-8 space-y-3 text-sm text-white/80">
                  {[
                    'Permission-aware navigation for owners, managers, and employees',
                    'Backend-driven KPIs and reports—no client-side inventing totals',
                    'Settlement and workforce workflows with clear status',
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <ShieldCheck
                        className="mt-0.5 size-4 shrink-0 text-[var(--landing-accent)]"
                        aria-hidden
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="relative">
                  <div
                    className="absolute -inset-4 rounded-[2rem] bg-[var(--landing-primary)]/20 blur-2xl"
                    aria-hidden
                  />
                  <img
                    src="/landing/landing-product-dashboard.png"
                    alt="Scrappy operations dashboard preview on a laptop"
                    className="relative w-full rounded-2xl shadow-2xl"
                    width={1600}
                    height={900}
                    loading="lazy"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Logistics band */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/landing/landing-logistics.png"
              alt=""
              className="size-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-[var(--landing-ink)]/75" aria-hidden />
          </div>
          <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-28 lg:px-8">
            <Reveal className="max-w-2xl text-white">
              <Route className="size-8 text-[var(--landing-accent)]" aria-hidden />
              <h2 className="mt-4 font-[family-name:var(--font-landing-display)] text-3xl font-semibold tracking-tight sm:text-4xl">
                Trips, trucks, and materials—linked end to end.
              </h2>
              <p className="mt-4 text-lg text-white/75">
                Dispatch with context. Settle with confidence. Report without rebuilding the day in
                Excel.
              </p>
            </Reveal>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <h2 className="font-[family-name:var(--font-landing-display)] text-3xl font-semibold tracking-tight sm:text-4xl">
                How it works
              </h2>
            </Reveal>
            <ol className="mt-12 grid gap-8 md:grid-cols-3">
              {STEPS.map((item, index) => (
                <Reveal key={item.step} delay={index * 0.08}>
                  <li className="relative">
                    <p className="font-[family-name:var(--font-landing-display)] text-4xl font-semibold text-[var(--landing-primary)]">
                      {item.step}
                    </p>
                    <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--landing-muted)]">
                      {item.description}
                    </p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* Contact / register interest */}
        <section
          id="contact"
          className="border-t border-[var(--landing-border)] bg-[var(--landing-ink)] py-20 text-white sm:py-24"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="font-[family-name:var(--font-landing-display)] text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                  Want to register your business?
                </h2>
                <p className="mt-4 text-base text-pretty text-white/75 sm:text-lg">
                  Contact us and we will reach out to help you get set up on Scrappy.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-2">
                <a
                  href={CONTACT.phoneHref}
                  className="group flex items-start gap-3 rounded-2xl border border-white/15 bg-white/5 p-5 transition-colors hover:bg-white/10"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--landing-accent)] text-[var(--landing-accent-fg)]">
                    <Phone className="size-5" aria-hidden />
                  </span>
                  <span className="min-w-0 text-left">
                    <span className="block text-xs font-medium tracking-wide text-white/55 uppercase">
                      Phone
                    </span>
                    <span className="mt-1 block text-base font-medium break-all group-hover:underline">
                      {CONTACT.phoneDisplay}
                    </span>
                  </span>
                </a>

                <a
                  href={CONTACT.emailHref}
                  className="group flex items-start gap-3 rounded-2xl border border-white/15 bg-white/5 p-5 transition-colors hover:bg-white/10"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--landing-primary)] text-[var(--landing-primary-fg)]">
                    <Mail className="size-5" aria-hidden />
                  </span>
                  <span className="min-w-0 text-left">
                    <span className="block text-xs font-medium tracking-wide text-white/55 uppercase">
                      Email
                    </span>
                    <span className="mt-1 block text-base font-medium break-all group-hover:underline">
                      {CONTACT.email}
                    </span>
                  </span>
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-[var(--landing-border)] py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
            <Reveal>
              <h2 className="font-[family-name:var(--font-landing-display)] text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
                Ready to run the yard with Scrappy?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-[var(--landing-muted)]">
                Already onboarded? Sign in to your business workspace. New here?{' '}
                <a
                  href="#contact"
                  className="font-medium text-[var(--landing-primary)] underline-offset-4 hover:underline"
                >
                  Contact us to register
                </a>
                .
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button
                  asChild
                  size="lg"
                  className="cursor-pointer bg-[var(--landing-primary)] text-[var(--landing-primary-fg)] hover:bg-[var(--landing-primary)]/90"
                >
                  <Link to={primaryHref}>
                    {primaryLabel}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="cursor-pointer border-[var(--landing-border)]"
                >
                  <a href="#contact">Contact us</a>
                </Button>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--landing-border)] py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 text-sm text-[var(--landing-muted)] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <BrandLogo className="size-8" withWordmark plate="dark" />
          <p>Scrap trading management for modern operations.</p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              className="underline-offset-4 hover:text-[var(--landing-fg)] hover:underline"
            >
              Contact
            </a>
            <Link
              to={ROUTES.login}
              className="underline-offset-4 hover:text-[var(--landing-fg)] hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
