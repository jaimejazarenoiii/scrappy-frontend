import {
  ArrowRight,
  BarChart3,
  ClipboardList,
  FileText,
  Plane,
  Plus,
  Receipt,
  Route,
  UserRoundCheck,
} from 'lucide-react'
import { useEffect } from 'react'
import { Link } from 'react-router'

import {
  HomeAtAGlanceCharts,
  HOME_ANALYTICS_PERMISSION,
} from '@/app/components/home/HomeAtAGlanceCharts'
import { HomeAttendanceClock } from '@/app/components/home/HomeAttendanceClock'
import { HomeReadyForPaymentSection } from '@/app/components/home/HomeReadyForPaymentSection'
import { useReadyForPaymentTotal } from '@/app/components/home/useReadyForPayment'
import { PageContainer } from '@/components/common/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { PermissionGate } from '@/features/authorization/components/PermissionGate'
import { usePermissions } from '@/features/authorization/hooks/usePermissions'
import { useLeaveDashboard } from '@/features/leave/hooks/useLeaveDashboard'
import { useTripDashboard } from '@/features/trips/hooks/useTrips'
import { isCompanyViewer } from '@/features/workforce/lib/workforce-roles'
import { PERMISSIONS } from '@/constants/permissions'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/utils'

const ROLE_LABEL: Record<string, string> = {
  OWNER: 'Owner',
  MANAGER: 'Manager',
  EMPLOYEE: 'Employee',
}

interface QuickAction {
  label: string
  href: string
  icon: typeof Plus
  permission?: string
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    label: 'New transaction',
    href: ROUTES.transactionNew,
    icon: Plus,
    permission: PERMISSIONS.transactions.create,
  },
  {
    label: 'New trip',
    href: ROUTES.tripsNew,
    icon: Route,
    permission: PERMISSIONS.trips.create,
  },
  {
    label: 'New expense',
    href: ROUTES.expensesNew,
    icon: Receipt,
    permission: PERMISSIONS.expenses.create,
  },
  {
    label: 'Attendance',
    href: ROUTES.attendance,
    icon: UserRoundCheck,
    permission: PERMISSIONS.attendance.view,
  },
  {
    label: 'Leave',
    href: ROUTES.leave,
    icon: Plane,
    permission: PERMISSIONS.leave.view,
  },
]

interface AttentionItem {
  label: string
  value: number
  href: string
  hint: string
}

function AttentionCard({ item }: { item: AttentionItem }) {
  return (
    <Link to={item.href} className="block cursor-pointer focus-visible:outline-none">
      <Card className="hover:border-primary/35 h-full transition-all duration-200 hover:shadow-[var(--shadow-md)]">
        <CardHeader className="space-y-1 pb-2">
          <CardDescription>{item.label}</CardDescription>
          <CardTitle className="font-[family-name:var(--font-display)] text-3xl tabular-nums">
            {item.value}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">{item.hint}</p>
          <span className="text-primary mt-3 inline-flex items-center gap-1 text-sm font-medium">
            Open <ArrowRight className="size-3.5" />
          </span>
        </CardContent>
      </Card>
    </Link>
  )
}

function ExploreCard({
  title,
  description,
  href,
  icon: Icon,
  cta,
}: {
  title: string
  description: string
  href: string
  icon: typeof BarChart3
  cta: string
}) {
  return (
    <Link to={href} className="block cursor-pointer focus-visible:outline-none">
      <Card className="hover:border-primary/35 h-full transition-all duration-200 hover:shadow-[var(--shadow-md)]">
        <CardHeader className="flex flex-row items-start gap-3 space-y-0">
          <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
            <Icon className="size-5" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <span className="text-primary inline-flex items-center gap-1 text-sm font-medium">
            {cta} <ArrowRight className="size-3.5" />
          </span>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function DashboardPage() {
  const { currentUser, tenant } = useCurrentUser()
  const { has } = usePermissions()

  const canViewLeave = has(PERMISSIONS.leave.view)
  const canViewTrips = has(PERMISSIONS.trips.view)
  const canSettleQueue =
    isCompanyViewer(currentUser?.role) &&
    (has(PERMISSIONS.transactions.settle) || has(PERMISSIONS.transactions.view))
  const canViewAnalytics = has(HOME_ANALYTICS_PERMISSION)

  const leaveQuery = useLeaveDashboard()
  const tripQuery = useTripDashboard()
  const readyForPayment = useReadyForPaymentTotal(canSettleQueue)

  useEffect(() => {
    document.title = 'Dashboard | Scrappy'
  }, [])

  const greetingName = (() => {
    const name = currentUser?.name.trim()
    if (name) return name
    const email = currentUser?.email.trim()
    if (email) return email
    return 'there'
  })()
  const companyName = tenant?.companyName
  const roleLabel = currentUser?.role ? (ROLE_LABEL[currentUser.role] ?? currentUser.role) : null

  const attentionItems: AttentionItem[] = []

  if (canSettleQueue && readyForPayment.total > 0) {
    attentionItems.push({
      label: 'Ready for payment',
      value: readyForPayment.total,
      href: `${ROUTES.transactions}?status=READY_FOR_PAYMENT`,
      hint: 'Settle submitted transactions',
    })
  }

  if (canViewLeave && leaveQuery.data) {
    const pending = leaveQuery.data.summary.pendingRequests
    const onLeave = leaveQuery.data.summary.onLeaveToday
    if (pending > 0) {
      attentionItems.push({
        label: 'Pending leave',
        value: pending,
        href: ROUTES.leave,
        hint: 'Requests waiting for review',
      })
    }
    if (onLeave > 0) {
      attentionItems.push({
        label: 'On leave today',
        value: onLeave,
        href: ROUTES.leave,
        hint: 'Employees out today',
      })
    }
  }

  if (canViewTrips && tripQuery.data) {
    const started = tripQuery.data.startedCount ?? 0
    const drafts = tripQuery.data.draftCount ?? 0
    const scheduled = tripQuery.data.scheduledCount ?? 0
    if (started > 0) {
      attentionItems.push({
        label: 'Trips in progress',
        value: started,
        href: ROUTES.trips,
        hint: 'Started trips still open',
      })
    }
    if (drafts > 0) {
      attentionItems.push({
        label: 'Draft trips',
        value: drafts,
        href: ROUTES.trips,
        hint: 'Need scheduling or start',
      })
    }
    if (scheduled > 0) {
      attentionItems.push({
        label: 'Upcoming trips',
        value: scheduled,
        href: ROUTES.trips,
        hint: 'Drafts scheduled ahead',
      })
    }
  }

  const attentionLoading =
    (canSettleQueue && readyForPayment.isLoading) ||
    (canViewLeave && leaveQuery.isLoading) ||
    (canViewTrips && tripQuery.isLoading)

  return (
    <PageContainer className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Your day-to-day launchpad — actions, attention items, and shortcuts."
        breadcrumbs={<span className="text-muted-foreground text-sm">Home / Dashboard</span>}
      />

      <section className="from-primary/8 via-card to-card relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 sm:p-6">
        <div
          className="pointer-events-none absolute -top-16 -right-10 size-40 rounded-full bg-[var(--brand-amber)]/15 blur-2xl"
          aria-hidden
        />
        <div className="relative space-y-1">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight sm:text-3xl">
            Hello, {greetingName}
          </h2>
          <p className="text-muted-foreground text-sm">
            {[companyName, roleLabel].filter(Boolean).join(' · ') || 'Welcome back to Scrappy.'}
          </p>
        </div>
      </section>

      <HomeAttendanceClock />

      <section className="space-y-3">
        <h2 className="text-sm font-semibold tracking-wide uppercase">Quick actions</h2>
        <div className="bg-card flex flex-wrap gap-2 rounded-2xl border p-3 sm:p-4">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon
            const link = (
              <Button variant="outline" asChild className="cursor-pointer">
                <Link to={action.href}>
                  <Icon />
                  {action.label}
                </Link>
              </Button>
            )
            return action.permission ? (
              <PermissionGate key={action.label} permission={action.permission}>
                {link}
              </PermissionGate>
            ) : (
              <span key={action.label}>{link}</span>
            )
          })}
        </div>
      </section>

      <HomeAtAGlanceCharts enabled={canViewAnalytics} />

      <HomeReadyForPaymentSection enabled={canSettleQueue} />

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-sm font-semibold tracking-wide uppercase">Needs attention</h2>
          <p className="text-muted-foreground text-xs">Counts from module dashboards only</p>
        </div>

        {attentionLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index}>
                <CardHeader className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-12" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : attentionItems.length > 0 ? (
          <div
            className={cn(
              'grid grid-cols-1 gap-4 sm:grid-cols-2',
              attentionItems.length >= 3 ? 'xl:grid-cols-3' : '',
              attentionItems.length >= 4 ? 'xl:grid-cols-4' : '',
            )}
          >
            {attentionItems.map((item) => (
              <AttentionCard key={item.label} item={item} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-muted-foreground flex items-center gap-3 py-6 text-sm">
              <ClipboardList className="size-5 shrink-0" />
              Nothing needs attention right now. Use quick actions above or open Analytics and
              Reports for deeper views.
            </CardContent>
          </Card>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold tracking-wide uppercase">Explore</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <PermissionGate permission={PERMISSIONS.analytics.view}>
            <ExploreCard
              title="Analytics"
              description="KPIs, charts, and trends for the selected period."
              href={ROUTES.analyticsDashboard}
              icon={BarChart3}
              cta="Open analytics"
            />
          </PermissionGate>
          <PermissionGate permission={PERMISSIONS.reports.view}>
            <ExploreCard
              title="Reports"
              description="Filterable tables with export and print."
              href={ROUTES.reports}
              icon={FileText}
              cta="Open reports"
            />
          </PermissionGate>
        </div>
      </section>
    </PageContainer>
  )
}
