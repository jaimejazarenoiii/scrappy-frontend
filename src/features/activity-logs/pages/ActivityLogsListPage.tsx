import type { ColumnDef } from '@tanstack/react-table'
import { ScrollText } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router'

import { DataTable } from '@/components/common/DataTable'
import { FilterBar } from '@/components/common/FilterBar'
import { PageContainer } from '@/components/common/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { Pagination } from '@/components/common/Pagination'
import { StatusBadge } from '@/components/common/StatusBadge'
import { EmptyState } from '@/components/feedback/EmptyState'
import { ErrorState } from '@/components/feedback/ErrorState'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { buildRoute } from '@/constants/routes'
import { useFormatRecordEmployee } from '@/features/employees/hooks/useFormatRecordEmployee'
import { useListQuery } from '@/hooks/useListQuery'
import { formatDateTime } from '@/utils/format-date'

import { useActivityLogs } from '../hooks/useActivityLogs'
import {
  activityEventTypeLabel,
  activityEventTypeTone,
  formatActivityAction,
} from '../lib/activity-log-display'
import {
  ACTIVITY_EVENT_TYPES,
  ACTIVITY_MODULE_OPTIONS,
  ACTIVITY_SEARCH_BY_OPTIONS,
  type ActivityLog,
} from '../types/activity-log.types'

export default function ActivityLogsListPage() {
  const navigate = useNavigate()
  const formatEmployee = useFormatRecordEmployee()
  const { params, setSearch, setPage, setSort, setFilter, clearFilters } = useListQuery({
    defaultSort: { field: 'createdAt', direction: 'desc' },
  })
  const logsQuery = useActivityLogs(params)

  const searchBy = params.filters?.searchBy ?? 'action'
  const eventType = params.filters?.eventType ?? ''
  const moduleFilter = params.filters?.module ?? ''
  const dateFrom = params.filters?.dateFrom ?? ''
  const dateTo = params.filters?.dateTo ?? ''

  useEffect(() => {
    document.title = 'Activity logs | Scrappy'
  }, [])

  // When searching, API requires searchBy — default it once.
  useEffect(() => {
    if (params.search && !params.filters?.searchBy) {
      setFilter('searchBy', 'action')
    }
  }, [params.search, params.filters?.searchBy, setFilter])

  const columns = useMemo<ColumnDef<ActivityLog>[]>(
    () => [
      {
        id: 'createdAt',
        accessorKey: 'createdAt',
        header: 'When',
        cell: ({ row }) => (
          <span className="text-sm whitespace-nowrap">
            {formatDateTime(row.original.createdAt)}
          </span>
        ),
      },
      {
        id: 'eventType',
        accessorKey: 'eventType',
        header: 'Type',
        enableSorting: false,
        cell: ({ row }) => (
          <StatusBadge
            label={activityEventTypeLabel(row.original.eventType)}
            tone={activityEventTypeTone(row.original.eventType)}
          />
        ),
      },
      {
        id: 'module',
        accessorKey: 'module',
        header: 'Module',
        cell: ({ row }) => <span className="capitalize">{row.original.module}</span>,
      },
      {
        id: 'action',
        accessorKey: 'action',
        header: 'Action',
        enableSorting: false,
        cell: ({ row }) => (
          <span className="font-mono text-xs">{formatActivityAction(row.original.action)}</span>
        ),
      },
      {
        id: 'description',
        accessorKey: 'description',
        header: 'Description',
        enableSorting: false,
        cell: ({ row }) => (
          <span className="line-clamp-2 max-w-md text-sm">{row.original.description}</span>
        ),
      },
      {
        id: 'user',
        header: 'Actor',
        enableSorting: true,
        cell: ({ row }) => {
          if (row.original.employeeId) {
            return formatEmployee({ employeeId: row.original.employeeId })
          }
          if (row.original.userId) {
            return (
              <span className="text-muted-foreground font-mono text-xs">
                {row.original.userId.slice(0, 8)}…
              </span>
            )
          }
          return '—'
        },
      },
      {
        id: 'resource',
        header: 'Resource',
        enableSorting: false,
        cell: ({ row }) => row.original.resourceNumber ?? row.original.resourceType ?? '—',
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                void navigate(buildRoute.activityLogDetail(row.original.id))
              }}
            >
              View
            </Button>
          </div>
        ),
      },
    ],
    [formatEmployee, navigate],
  )

  const data = logsQuery.data
  const hasActiveFilters = [
    params.search,
    eventType,
    moduleFilter,
    dateFrom,
    dateTo,
    params.filters?.searchBy !== undefined && params.filters.searchBy !== 'action'
      ? params.filters.searchBy
      : undefined,
  ].some(Boolean)
  const hasNoResults = data && data.total === 0 && !hasActiveFilters

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Activity logs"
          description="Company audit trail of authentication and business operations."
        />

        {logsQuery.isError ? (
          <ErrorState description="We couldn't load activity logs. Please try again." />
        ) : hasNoResults ? (
          <EmptyState
            icon={ScrollText}
            title="No activity yet"
            description="Operational events will appear here as the business runs."
          />
        ) : (
          <div className="space-y-4">
            <FilterBar
              search={params.search ?? ''}
              onSearchChange={setSearch}
              searchPlaceholder="Search activity…"
            >
              <Select
                aria-label="Search by"
                value={searchBy}
                onChange={(event) => {
                  setFilter('searchBy', event.target.value || undefined)
                }}
                className="w-44"
              >
                {ACTIVITY_SEARCH_BY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              <Select
                aria-label="Event type"
                value={eventType}
                onChange={(event) => {
                  setFilter('eventType', event.target.value || undefined)
                }}
                className="w-44"
              >
                <option value="">All types</option>
                {ACTIVITY_EVENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {activityEventTypeLabel(type)}
                  </option>
                ))}
              </Select>
              <Select
                aria-label="Module"
                value={moduleFilter}
                onChange={(event) => {
                  setFilter('module', event.target.value || undefined)
                }}
                className="w-40"
              >
                <option value="">All modules</option>
                {ACTIVITY_MODULE_OPTIONS.map((module) => (
                  <option key={module} value={module}>
                    {module}
                  </option>
                ))}
              </Select>
              <Input
                type="date"
                aria-label="From date"
                value={dateFrom.slice(0, 10)}
                onChange={(event) => {
                  const value = event.target.value
                  setFilter('dateFrom', value ? `${value}T00:00:00.000Z` : undefined)
                }}
                className="w-auto"
              />
              <Input
                type="date"
                aria-label="To date"
                value={dateTo.slice(0, 10)}
                onChange={(event) => {
                  const value = event.target.value
                  setFilter('dateTo', value ? `${value}T23:59:59.999Z` : undefined)
                }}
                className="w-auto"
              />
              {hasActiveFilters ? (
                <Button type="button" variant="ghost" size="sm" onClick={clearFilters}>
                  Clear
                </Button>
              ) : null}
            </FilterBar>

            <DataTable
              columns={columns}
              data={data?.data ?? []}
              isLoading={logsQuery.isLoading}
              emptyMessage="No activity logs match your filters."
              sort={params.sort}
              onSortChange={setSort}
              getRowId={(row) => row.id}
              renderMobileCard={(log) => (
                <Card className="gap-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="line-clamp-2 font-medium">{log.description}</p>
                      <p className="text-muted-foreground font-mono text-xs">
                        {formatActivityAction(log.action)}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {formatDateTime(log.createdAt)}
                      </p>
                    </div>
                    <StatusBadge
                      label={activityEventTypeLabel(log.eventType)}
                      tone={activityEventTypeTone(log.eventType)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      void navigate(buildRoute.activityLogDetail(log.id))
                    }}
                  >
                    View
                  </Button>
                </Card>
              )}
              footer={
                data ? (
                  <Pagination
                    page={data.page}
                    pageSize={data.pageSize}
                    total={data.total}
                    onPageChange={setPage}
                  />
                ) : null
              }
            />
          </div>
        )}
      </div>
    </PageContainer>
  )
}
