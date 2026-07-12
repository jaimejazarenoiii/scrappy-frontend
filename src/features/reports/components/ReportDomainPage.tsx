import { useEffect } from 'react'
import type { UseQueryResult } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'
import type { ReactNode } from 'react'
import { Link } from 'react-router'

import { PageContainer } from '@/components/common/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { ReportExportMenu } from '@/features/reports/components/ReportExportMenu'
import { ReportFilterBar } from '@/features/reports/components/ReportFilterBar'
import { ReportPrintButton } from '@/features/reports/components/ReportPrintButton'
import {
  ReportEmptyState,
  ReportErrorState,
  ReportSkeleton,
} from '@/features/reports/components/ReportStates'
import { ReportSummaryStrip } from '@/features/reports/components/ReportSummaryStrip'
import { ReportTable } from '@/features/reports/components/ReportTable'
import { getReportCategory } from '@/features/reports/lib/report-categories'
import { useReportFilterStore } from '@/features/reports/hooks/useReportFilterStore'
import { useReportPreferencesStore } from '@/features/reports/hooks/useReportPreferencesStore'
import type { ReportDomain, ReportListResponse } from '@/features/reports/types/reports.types'
import { isReportFilterValid } from '@/features/reports/validation/report-filter.schema'
import { ROUTES } from '@/constants/routes'

interface ReportDomainPageProps<TRow extends { id: string }> {
  domain: ReportDomain
  title: string
  description: string
  query: UseQueryResult<ReportListResponse<TRow>>
  columns: ColumnDef<TRow>[]
  renderMobileCard?: (row: TRow) => ReactNode
}

export function ReportDomainPage<TRow extends { id: string }>({
  domain,
  title,
  description,
  query,
  columns,
  renderMobileCard,
}: ReportDomainPageProps<TRow>) {
  const filters = useReportFilterStore((state) => state.filtersByDomain[domain])
  const setPage = useReportFilterStore((state) => state.setPage)
  const setSort = useReportFilterStore((state) => state.setSort)
  const setLastDomain = useReportPreferencesStore((state) => state.setLastDomain)
  const category = getReportCategory(domain)
  const filtersValid = isReportFilterValid(filters)

  useEffect(() => {
    document.title = `${title} | Reports`
    setLastDomain(domain)
  }, [domain, setLastDomain, title])

  const data = query.data
  const isEmpty =
    filtersValid && !query.isLoading && !query.isError && (data?.data.length ?? 0) === 0

  return (
    <PageContainer className="report-print-root space-y-6">
      <PageHeader
        title={title}
        description={description}
        breadcrumbs={
          <span className="text-muted-foreground text-sm">
            <Link to={ROUTES.reports} className="hover:text-foreground">
              Reports
            </Link>
            {' / '}
            {category.title}
          </span>
        }
        actions={
          <div className="flex flex-wrap items-center gap-2 print:hidden">
            <ReportExportMenu domain={domain} disabled={!filtersValid || isEmpty} />
            <ReportPrintButton disabled={!filtersValid || isEmpty} />
          </div>
        }
      />

      <ReportFilterBar domain={domain} />

      {!filtersValid ? (
        <ReportErrorState
          title="Invalid filters"
          description="Fix the date range to load this report."
        />
      ) : null}

      {filtersValid && query.isLoading ? <ReportSkeleton /> : null}

      {filtersValid && query.isError ? (
        <div className="space-y-3">
          <ReportErrorState
            description={query.error instanceof Error ? query.error.message : undefined}
          />
          <Button type="button" variant="outline" onClick={() => void query.refetch()}>
            Retry
          </Button>
        </div>
      ) : null}

      {filtersValid && !query.isLoading && !query.isError && isEmpty ? <ReportEmptyState /> : null}

      {filtersValid && !query.isLoading && !query.isError && data && !isEmpty ? (
        <div className="space-y-6">
          <ReportSummaryStrip summary={data.summary} generatedAt={data.generatedAt} />
          <ReportTable
            columns={columns}
            data={data.data}
            page={filters.page}
            pageSize={filters.pageSize}
            total={data.total}
            onPageChange={(page) => {
              setPage(domain, page)
            }}
            sort={
              filters.sortField
                ? { field: filters.sortField, direction: filters.sortDirection }
                : undefined
            }
            onSortChange={(sort) => {
              setSort(domain, sort.field, sort.direction)
            }}
            renderMobileCard={renderMobileCard}
            getRowId={(row) => row.id}
          />
        </div>
      ) : null}
    </PageContainer>
  )
}
