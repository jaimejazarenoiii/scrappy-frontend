import { useEffect } from 'react'
import { Link } from 'react-router'

import { PageContainer } from '@/components/common/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { ReportCategoryCard } from '@/features/reports/components/ReportCategoryCard'
import { REPORT_CATEGORIES } from '@/features/reports/lib/report-categories'
import { useReportPreferencesStore } from '@/features/reports/hooks/useReportPreferencesStore'
import { ROUTES } from '@/constants/routes'

export default function ReportsHubPage() {
  const lastDomain = useReportPreferencesStore((state) => state.lastDomain)

  useEffect(() => {
    document.title = 'Reports'
  }, [])

  const lastCategory = REPORT_CATEGORIES.find((item) => item.id === lastDomain)

  return (
    <PageContainer className="space-y-8">
      <PageHeader
        title="Reports"
        description="Generate, filter, export, and print operational reports from backend data."
        breadcrumbs={<span className="text-muted-foreground text-sm">Reports</span>}
      />

      {lastCategory ? (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold">Quick access</h2>
          <p className="text-muted-foreground text-sm">
            Continue with{' '}
            <Link to={lastCategory.href} className="text-primary font-medium hover:underline">
              {lastCategory.title}
            </Link>
          </p>
        </section>
      ) : null}

      <section className="space-y-3">
        <h2 className="text-sm font-semibold">Report categories</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {REPORT_CATEGORIES.map((category) => (
            <ReportCategoryCard
              key={category.id}
              title={category.title}
              description={category.description}
              href={category.href}
              icon={category.icon}
            />
          ))}
        </div>
      </section>

      <p className="text-muted-foreground text-xs">
        Recently generated reports and saved filters appear here when the backend provides them.
        Browse categories above to open a report. Home dashboard remains at{' '}
        <Link to={ROUTES.dashboard} className="hover:text-foreground underline">
          Dashboard
        </Link>
        .
      </p>
    </PageContainer>
  )
}
