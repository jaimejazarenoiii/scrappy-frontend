import type { ColumnDef } from '@tanstack/react-table'
import { Contact, Pencil, Plus } from 'lucide-react'
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
import { Select } from '@/components/ui/select'
import { PERMISSIONS } from '@/constants/permissions'
import { buildRoute, ROUTES } from '@/constants/routes'
import { PermissionGate } from '@/features/authorization/components/PermissionGate'
import { useListQuery } from '@/hooks/useListQuery'
import { formatEmployeeBreadcrumbLabel, isEmployeeArchived } from '../lib/employee-display'
import { useEmployees } from '../hooks/useEmployees'
import type { Employee } from '../types/employee.types'

function employeeStatusTone(employee: Employee): 'active' | 'archived' | 'inactive' {
  if (isEmployeeArchived(employee)) return 'archived'
  return employee.status === 'ACTIVE' ? 'active' : 'inactive'
}

function employeeStatusLabel(employee: Employee): string {
  if (isEmployeeArchived(employee)) return 'archived'
  return employee.status.toLowerCase()
}

function formatEmployeeListLabel(employee: Employee): string {
  return formatEmployeeBreadcrumbLabel({
    id: employee.id,
    firstName: employee.firstName,
    lastName: employee.lastName,
    employeeNumber: employee.employeeNumber,
  })
}

export default function EmployeesListPage() {
  const navigate = useNavigate()
  const { params, setSearch, setPage, setSort, setFilter } = useListQuery({
    defaultSort: { field: 'name', direction: 'asc' },
  })
  const employeesQuery = useEmployees(params)

  useEffect(() => {
    document.title = 'Employees | Scrappy'
  }, [])

  const columns = useMemo<ColumnDef<Employee>[]>(
    () => [
      {
        id: 'name',
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => (
          <span className="font-medium">{formatEmployeeListLabel(row.original)}</span>
        ),
      },
      {
        id: 'employeeNumber',
        accessorKey: 'employeeNumber',
        header: 'Employee #',
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.employeeNumber ?? '—'}</span>
        ),
      },
      {
        id: 'contact',
        header: 'Contact',
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.contactNumber ?? '—'}</span>
        ),
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <StatusBadge
            label={employeeStatusLabel(row.original)}
            tone={employeeStatusTone(row.original)}
          />
        ),
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        cell: ({ row }) => {
          const name = formatEmployeeListLabel(row.original)
          return (
            <div className="flex justify-end gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  void navigate(buildRoute.employeeDetail(row.original.id))
                }}
              >
                View
              </Button>
              <PermissionGate permission={PERMISSIONS.employee.update}>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Edit ${name}`}
                  onClick={() => {
                    void navigate(buildRoute.employeeEdit(row.original.id))
                  }}
                >
                  <Pencil className="size-4" />
                </Button>
              </PermissionGate>
            </div>
          )
        },
      },
    ],
    [navigate],
  )

  const data = employeesQuery.data
  const hasNoResults = data && data.total === 0 && !params.search && !params.filters

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Employees"
          description="Manage your workforce records."
          actions={
            <PermissionGate permission={PERMISSIONS.employee.create}>
              <Button
                type="button"
                onClick={() => {
                  void navigate(ROUTES.employeeNew)
                }}
              >
                <Plus className="size-4" />
                New employee
              </Button>
            </PermissionGate>
          }
        />

        {employeesQuery.isError ? (
          <ErrorState description="We couldn't load employees. Please try again." />
        ) : hasNoResults ? (
          <EmptyState
            icon={Contact}
            title="No employees yet"
            description="Add your first employee to start building your workforce records."
            action={
              <PermissionGate permission={PERMISSIONS.employee.create}>
                <Button
                  type="button"
                  onClick={() => {
                    void navigate(ROUTES.employeeNew)
                  }}
                >
                  <Plus className="size-4" />
                  New employee
                </Button>
              </PermissionGate>
            }
          />
        ) : (
          <div className="space-y-4">
            <FilterBar
              search={params.search ?? ''}
              onSearchChange={setSearch}
              searchPlaceholder="Search employees…"
            >
              <Select
                aria-label="Filter by status"
                value={params.filters?.status ?? ''}
                onChange={(event) => {
                  setFilter('status', event.target.value || undefined)
                }}
                className="w-40"
              >
                <option value="">Active</option>
                <option value="archived">Archived</option>
                <option value="all">All</option>
              </Select>
            </FilterBar>

            <DataTable
              columns={columns}
              data={data?.data ?? []}
              isLoading={employeesQuery.isLoading}
              emptyMessage="No employees match your filters."
              sort={params.sort}
              onSortChange={setSort}
              getRowId={(row) => row.id}
              renderMobileCard={(employee) => (
                <Card className="gap-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{formatEmployeeListLabel(employee)}</p>
                      <p className="text-muted-foreground truncate text-sm">
                        {employee.employeeNumber ?? employee.contactNumber ?? '—'}
                      </p>
                    </div>
                    <StatusBadge
                      label={employeeStatusLabel(employee)}
                      tone={employeeStatusTone(employee)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        void navigate(buildRoute.employeeDetail(employee.id))
                      }}
                    >
                      View
                    </Button>
                    <PermissionGate permission={PERMISSIONS.employee.update}>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          void navigate(buildRoute.employeeEdit(employee.id))
                        }}
                      >
                        Edit
                      </Button>
                    </PermissionGate>
                  </div>
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
