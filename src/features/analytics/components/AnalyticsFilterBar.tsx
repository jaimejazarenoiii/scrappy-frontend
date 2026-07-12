import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { FilterBar } from '@/components/common/FilterBar'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { useBranchOptions } from '@/features/branches/hooks/useBranchOptions'
import { useEmployeeOptions } from '@/features/employees/hooks/useEmployeeOptions'
import { VehicleService } from '@/features/vehicles/services/vehicle.service'
import { useWarehouseOptions } from '@/features/warehouses/hooks/useWarehouseOptions'
import { getAnalyticsFilterErrors } from '@/features/analytics/validation/analytics-filter.schema'
import type { AnalyticsPeriodPreset } from '@/features/analytics/types/analytics.types'
import { useAnalyticsFilterStore } from '@/features/analytics/hooks/useAnalyticsFilterStore'
import { cn } from '@/lib/utils'

const PERIOD_OPTIONS: { value: AnalyticsPeriodPreset; label: string }[] = [
  { value: 'TODAY', label: 'Today' },
  { value: 'YESTERDAY', label: 'Yesterday' },
  { value: 'THIS_WEEK', label: 'This week' },
  { value: 'THIS_MONTH', label: 'This month' },
  { value: 'THIS_YEAR', label: 'This year' },
  { value: 'CUSTOM', label: 'Custom range' },
]

const LIMIT_OPTIONS = [5, 10, 15, 20, 25]

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

export function AnalyticsFilterBar({ className }: { className?: string }) {
  const filters = useAnalyticsFilterStore((state) => state.filters)
  const setPeriod = useAnalyticsFilterStore((state) => state.setPeriod)
  const setCustomRange = useAnalyticsFilterStore((state) => state.setCustomRange)
  const setBranchId = useAnalyticsFilterStore((state) => state.setBranchId)
  const setWarehouseId = useAnalyticsFilterStore((state) => state.setWarehouseId)
  const setVehicleId = useAnalyticsFilterStore((state) => state.setVehicleId)
  const setEmployeeId = useAnalyticsFilterStore((state) => state.setEmployeeId)
  const setIncludeArchived = useAnalyticsFilterStore((state) => state.setIncludeArchived)
  const setLimit = useAnalyticsFilterStore((state) => state.setLimit)
  const resetFilters = useAnalyticsFilterStore((state) => state.resetFilters)

  const branchesQuery = useBranchOptions()
  const warehousesQuery = useWarehouseOptions()
  const employeesQuery = useEmployeeOptions()
  const vehiclesQuery = useQuery({
    queryKey: ['vehicles', 'analytics-picker'],
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

  const validationErrors = useMemo(() => getAnalyticsFilterErrors(filters), [filters])

  const activeFilterSummary = useMemo(() => {
    const parts: string[] = [
      PERIOD_OPTIONS.find((option) => option.value === filters.period)?.label ?? filters.period,
    ]
    if (filters.period === 'CUSTOM' && filters.from && filters.to) {
      parts.push(`${filters.from} → ${filters.to}`)
    }
    if (filters.branchId) parts.push('Branch filtered')
    if (filters.warehouseId) parts.push('Warehouse filtered')
    if (filters.vehicleId) parts.push('Vehicle filtered')
    if (filters.employeeId) parts.push('Employee filtered')
    if (filters.includeArchived) parts.push('Including archived')
    return parts.join(' · ')
  }, [filters])

  return (
    <div className={cn('space-y-3', className)}>
      <FilterBar
        actions={
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground text-sm font-medium"
            onClick={resetFilters}
          >
            Reset filters
          </button>
        }
      >
        <FilterField label="Period">
          <Select
            value={filters.period}
            onChange={(event) => {
              setPeriod(event.target.value as AnalyticsPeriodPreset)
            }}
            aria-label="Reporting period"
          >
            {PERIOD_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FilterField>

        {filters.period === 'CUSTOM' ? (
          <>
            <FilterField label="From">
              <Input
                type="date"
                value={filters.from ?? ''}
                onChange={(event) => {
                  setCustomRange(event.target.value || null, filters.to)
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
                value={filters.to ?? ''}
                onChange={(event) => {
                  setCustomRange(filters.from, event.target.value || null)
                }}
                aria-invalid={Boolean(validationErrors.to)}
              />
              {validationErrors.to ? (
                <p className="text-destructive text-xs">{validationErrors.to}</p>
              ) : null}
            </FilterField>
          </>
        ) : null}

        <FilterField label="Branch">
          <Select
            value={filters.branchId ?? ''}
            onChange={(event) => {
              setBranchId(event.target.value || null)
            }}
            aria-label="Branch filter"
          >
            <option value="">All branches</option>
            {(branchesQuery.data ?? []).map((branch) => (
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
              setWarehouseId(event.target.value || null)
            }}
            aria-label="Warehouse filter"
          >
            <option value="">All warehouses</option>
            {(warehousesQuery.data ?? []).map((warehouse) => (
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
              setVehicleId(event.target.value || null)
            }}
            aria-label="Vehicle filter"
          >
            <option value="">All vehicles</option>
            {(vehiclesQuery.data ?? []).map((vehicle) => (
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
              setEmployeeId(event.target.value || null)
            }}
            aria-label="Employee filter"
          >
            <option value="">All employees</option>
            {(employeesQuery.data ?? []).map((employee) => (
              <option key={employee.value} value={employee.value}>
                {employee.label}
              </option>
            ))}
          </Select>
        </FilterField>

        <FilterField label="Top N">
          <Select
            value={String(filters.limit)}
            onChange={(event) => {
              setLimit(Number(event.target.value))
            }}
            aria-label="Ranking limit"
          >
            {LIMIT_OPTIONS.map((limit) => (
              <option key={limit} value={limit}>
                Top {limit}
              </option>
            ))}
          </Select>
        </FilterField>

        <div className="flex items-end gap-2 pb-1">
          <Checkbox
            id="analytics-include-archived"
            checked={filters.includeArchived}
            onChange={(event) => {
              setIncludeArchived(event.target.checked)
            }}
          />
          <Label htmlFor="analytics-include-archived" className="text-sm font-normal">
            Include archived
          </Label>
        </div>
      </FilterBar>

      <p className="text-muted-foreground text-xs" aria-live="polite">
        Active filters: {activeFilterSummary}
      </p>
    </div>
  )
}
