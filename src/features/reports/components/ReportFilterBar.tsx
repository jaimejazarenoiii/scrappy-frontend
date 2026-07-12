import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { FilterBar } from '@/components/common/FilterBar'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { useBranchOptions } from '@/features/branches/hooks/useBranchOptions'
import { useEmployeeOptions } from '@/features/employees/hooks/useEmployeeOptions'
import { getReportCategory } from '@/features/reports/lib/report-categories'
import { useReportFilterStore } from '@/features/reports/hooks/useReportFilterStore'
import type { ReportDomain, ReportFilterExtraKey } from '@/features/reports/types/reports.types'
import { getReportFilterErrors } from '@/features/reports/validation/report-filter.schema'
import { VehicleService } from '@/features/vehicles/services/vehicle.service'
import { useWarehouseOptions } from '@/features/warehouses/hooks/useWarehouseOptions'
import { cn } from '@/lib/utils'

const EXTRA_LABELS: Record<ReportFilterExtraKey, string> = {
  transactionType: 'Transaction type',
  expenseCategory: 'Expense category',
  payrollPeriod: 'Payroll period',
  tripStatus: 'Trip status',
}

/** Empty select value means “all” → persist as null so the param is omitted. */
function optionalIdFromSelect(value: string): string | null {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function FilterField({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex min-w-[10rem] flex-col gap-1.5', className)}>
      <Label className="text-xs font-medium">{label}</Label>
      {children}
    </div>
  )
}

interface ReportFilterBarProps {
  domain: ReportDomain
  className?: string
}

export function ReportFilterBar({ domain, className }: ReportFilterBarProps) {
  const filters = useReportFilterStore((state) => state.filtersByDomain[domain])
  const setFilters = useReportFilterStore((state) => state.setFilters)
  const setDateRange = useReportFilterStore((state) => state.setDateRange)
  const resetDomain = useReportFilterStore((state) => state.resetDomain)
  const category = getReportCategory(domain)

  const branchesQuery = useBranchOptions()
  const warehousesQuery = useWarehouseOptions()
  const employeesQuery = useEmployeeOptions()
  const vehiclesQuery = useQuery({
    queryKey: ['vehicles', 'reports-picker'],
    queryFn: () =>
      VehicleService.list({
        page: 1,
        pageSize: 100,
      }),
    staleTime: 60_000,
    select: (result) =>
      result.data
        .filter((vehicle) => vehicle.status !== 'INACTIVE' && vehicle.deletedAt == null)
        .map((vehicle) => ({
          value: vehicle.id,
          label: vehicle.plateNumber,
        })),
  })

  const validationErrors = useMemo(() => getReportFilterErrors(filters), [filters])

  const branchOptions = branchesQuery.data ?? []
  const warehouseOptions = warehousesQuery.data ?? []
  const vehicleOptions = vehiclesQuery.data ?? []
  const employeeOptions = employeesQuery.data ?? []

  const hasBranch = Boolean(
    filters.branchId && branchOptions.some((branch) => branch.id === filters.branchId),
  )
  const hasWarehouse = Boolean(
    filters.warehouseId &&
    warehouseOptions.some((warehouse) => warehouse.id === filters.warehouseId),
  )
  const hasVehicle = Boolean(
    filters.vehicleId && vehicleOptions.some((vehicle) => vehicle.value === filters.vehicleId),
  )
  const hasEmployee = Boolean(
    filters.employeeId && employeeOptions.some((employee) => employee.value === filters.employeeId),
  )

  const activeSummary = useMemo(() => {
    const parts = [`${filters.from} → ${filters.to}`]
    if (filters.branchId) parts.push('Branch')
    if (filters.warehouseId) parts.push('Warehouse')
    if (filters.vehicleId) parts.push('Vehicle')
    if (filters.employeeId) parts.push('Employee')
    if (filters.search) parts.push(`Search: ${filters.search}`)
    if (filters.includeArchived) parts.push('Including archived')
    return parts.join(' · ')
  }, [filters])

  return (
    <div className={cn('space-y-3 print:hidden', className)}>
      <FilterBar
        search={filters.search ?? ''}
        searchPlaceholder="Search report…"
        onSearchChange={(value) => {
          setFilters(domain, { search: optionalIdFromSelect(value) })
        }}
        actions={
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground cursor-pointer text-sm font-medium"
            onClick={() => {
              resetDomain(domain)
            }}
          >
            Reset filters
          </button>
        }
      >
        <FilterField label="From">
          <Input
            type="date"
            value={filters.from}
            onChange={(event) => {
              setDateRange(domain, event.target.value, filters.to)
            }}
            aria-invalid={Boolean(validationErrors.from)}
          />
          {validationErrors.from ? (
            <p className="text-destructive text-xs">{validationErrors.from}</p>
          ) : null}
        </FilterField>

        <FilterField label="To">
          <Input
            type="date"
            value={filters.to}
            onChange={(event) => {
              setDateRange(domain, filters.from, event.target.value)
            }}
            aria-invalid={Boolean(validationErrors.to)}
          />
          {validationErrors.to ? (
            <p className="text-destructive text-xs">{validationErrors.to}</p>
          ) : null}
        </FilterField>

        <FilterField label="Branch">
          <Select
            value={filters.branchId ?? ''}
            onChange={(event) => {
              setFilters(domain, { branchId: optionalIdFromSelect(event.target.value) })
            }}
            aria-label="Branch filter"
          >
            <option value="">All branches</option>
            {filters.branchId && !hasBranch ? (
              <option value={filters.branchId}>Selected branch</option>
            ) : null}
            {branchOptions.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </Select>
        </FilterField>

        <FilterField label="Warehouse">
          <Select
            value={filters.warehouseId ?? ''}
            onChange={(event) => {
              setFilters(domain, { warehouseId: optionalIdFromSelect(event.target.value) })
            }}
            aria-label="Warehouse filter"
          >
            <option value="">All warehouses</option>
            {filters.warehouseId && !hasWarehouse ? (
              <option value={filters.warehouseId}>Selected warehouse</option>
            ) : null}
            {warehouseOptions.map((warehouse) => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
              </option>
            ))}
          </Select>
        </FilterField>

        <FilterField label="Vehicle">
          <Select
            value={filters.vehicleId ?? ''}
            onChange={(event) => {
              setFilters(domain, { vehicleId: optionalIdFromSelect(event.target.value) })
            }}
            aria-label="Vehicle filter"
          >
            <option value="">All vehicles</option>
            {filters.vehicleId && !hasVehicle ? (
              <option value={filters.vehicleId}>Selected vehicle</option>
            ) : null}
            {vehicleOptions.map((vehicle) => (
              <option key={vehicle.value} value={vehicle.value}>
                {vehicle.label}
              </option>
            ))}
          </Select>
        </FilterField>

        <FilterField label="Employee">
          <Select
            value={filters.employeeId ?? ''}
            onChange={(event) => {
              setFilters(domain, { employeeId: optionalIdFromSelect(event.target.value) })
            }}
            aria-label="Employee filter"
          >
            <option value="">All employees</option>
            {filters.employeeId && !hasEmployee ? (
              <option value={filters.employeeId}>Selected employee</option>
            ) : null}
            {employeeOptions.map((employee) => (
              <option key={employee.value} value={employee.value}>
                {employee.label}
              </option>
            ))}
          </Select>
        </FilterField>

        {category.allowedExtras.map((extra) => (
          <FilterField key={extra} label={EXTRA_LABELS[extra]}>
            <Input
              value={filters[extra] ?? ''}
              onChange={(event) => {
                setFilters(domain, { [extra]: optionalIdFromSelect(event.target.value) })
              }}
              placeholder={`Filter by ${EXTRA_LABELS[extra].toLowerCase()}`}
            />
          </FilterField>
        ))}

        <div className="flex items-end gap-2 pb-1">
          <Checkbox
            id={`report-include-archived-${domain}`}
            checked={filters.includeArchived}
            onChange={(event) => {
              setFilters(domain, { includeArchived: event.target.checked })
            }}
          />
          <Label htmlFor={`report-include-archived-${domain}`} className="text-sm font-normal">
            Include archived
          </Label>
        </div>
      </FilterBar>

      <p className="text-muted-foreground text-xs" aria-live="polite">
        Active filters: {activeSummary}
      </p>
    </div>
  )
}
