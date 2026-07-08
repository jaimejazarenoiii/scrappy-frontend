import { useMemo } from 'react'
import { useLocation } from 'react-router'

import { useAttendance } from '@/features/attendance/hooks/useAttendance'
import { useBranch } from '@/features/branches/hooks/useBranch'
import { useCashAdvance } from '@/features/cash-advances/hooks/useCashAdvance'
import { useEmployee } from '@/features/employees/hooks/useEmployee'
import { useEmployeeLabelMap } from '@/features/employees/hooks/useEmployeeLabelMap'
import {
  formatEmployeeBreadcrumbLabel,
  formatRecordEmployeeLabel,
  type WorkforceEmployeeRecord,
} from '@/features/employees/lib/employee-display'
import { useLeave } from '@/features/leave/hooks/useLeave'
import { usePayroll } from '@/features/payroll/hooks/usePayroll'
import { useVehicle } from '@/features/vehicles/hooks/useVehicle'
import { useWarehouse } from '@/features/warehouses/hooks/useWarehouse'
import { useTransaction } from '@/features/transactions/hooks/useTransaction'
import {
  baseBreadcrumbItems,
  buildBreadcrumbPath,
  isEntityId,
  parseBreadcrumbEntity,
  type BreadcrumbEntityType,
  type BreadcrumbItem,
} from '@/lib/breadcrumb'
import { formatDate } from '@/utils/format-date'

import { transactionDirectionLabel } from '@/features/transactions/lib/transaction-direction'

function resolveEntityLabel(
  entityType: BreadcrumbEntityType,
  data: unknown,
  labelById?: ReadonlyMap<string, string>,
): string | undefined {
  if (!data || typeof data !== 'object') return undefined

  switch (entityType) {
    case 'attendance':
    case 'leave':
    case 'cash-advance': {
      return formatRecordEmployeeLabel(data as WorkforceEmployeeRecord, labelById)
    }
    case 'payroll': {
      const payroll = data as {
        employee?: {
          firstName?: string | null
          lastName?: string | null
          employeeNumber?: string | null
          id?: string
        }
        employeeId: string
        payPeriodStart: string
        payPeriodEnd: string
      }

      const employeeLabel = formatRecordEmployeeLabel(
        {
          employeeId: payroll.employeeId,
          firstName: payroll.employee?.firstName,
          lastName: payroll.employee?.lastName,
          employeeNumber: payroll.employee?.employeeNumber,
          employee: payroll.employee
            ? {
                id: payroll.employee.id ?? payroll.employeeId,
                firstName: payroll.employee.firstName ?? '',
                lastName: payroll.employee.lastName ?? '',
                employeeNumber: payroll.employee.employeeNumber,
              }
            : undefined,
        },
        labelById,
      )

      return `${employeeLabel} · ${formatDate(payroll.payPeriodStart)} – ${formatDate(payroll.payPeriodEnd)}`
    }
    case 'transaction': {
      const tx = data as {
        direction?: 'INBOUND' | 'OUTBOUND'
        directionLabel?: 'BUY' | 'SELL'
        partyName?: string
      }

      if (tx.direction) {
        return `${transactionDirectionLabel(tx.direction)} · ${tx.partyName ?? 'Details'}`
      }

      if (tx.directionLabel) {
        const inferredDirection = tx.directionLabel === 'BUY' ? 'INBOUND' : 'OUTBOUND'
        return `${transactionDirectionLabel(inferredDirection)} · ${tx.partyName ?? 'Details'}`
      }

      return tx.partyName
    }
    case 'employee': {
      const employee = data as {
        id: string
        firstName: string
        lastName: string
        employeeNumber: string | null
      }
      return formatEmployeeBreadcrumbLabel(employee)
    }
    case 'branch':
    case 'warehouse': {
      const entity = data as { name: string }
      return entity.name
    }
    case 'vehicle': {
      const vehicle = data as { plateNumber: string }
      return vehicle.plateNumber
    }
    default:
      return undefined
  }
}

export function useBreadcrumbTrail(): BreadcrumbItem[] {
  const location = useLocation()
  const labelById = useEmployeeLabelMap()
  const segments = location.pathname.split('/').filter(Boolean)
  const { entityType, entityId } = parseBreadcrumbEntity(segments)

  const attendanceQuery = useAttendance(entityType === 'attendance' ? entityId : undefined)
  const leaveQuery = useLeave(entityType === 'leave' ? entityId : undefined)
  const cashAdvanceQuery = useCashAdvance(entityType === 'cash-advance' ? entityId : undefined)
  const payrollQuery = usePayroll(entityType === 'payroll' ? entityId : undefined)
  const transactionQuery = useTransaction(entityType === 'transaction' ? entityId : undefined)
  const payrollEmployeeQuery = useEmployee(
    entityType === 'payroll' && payrollQuery.data?.employeeId
      ? payrollQuery.data.employeeId
      : undefined,
  )
  const employeeQuery = useEmployee(entityType === 'employee' ? entityId : undefined)
  const branchQuery = useBranch(entityType === 'branch' ? entityId : undefined)
  const warehouseQuery = useWarehouse(entityType === 'warehouse' ? entityId : undefined)
  const vehicleQuery = useVehicle(entityType === 'vehicle' ? entityId : undefined)

  const isResolving =
    (entityType === 'attendance' && attendanceQuery.isLoading) ||
    (entityType === 'leave' && leaveQuery.isLoading) ||
    (entityType === 'cash-advance' && cashAdvanceQuery.isLoading) ||
    (entityType === 'payroll' && (payrollQuery.isLoading || payrollEmployeeQuery.isLoading)) ||
    (entityType === 'transaction' && transactionQuery.isLoading) ||
    (entityType === 'employee' && employeeQuery.isLoading) ||
    (entityType === 'branch' && branchQuery.isLoading) ||
    (entityType === 'warehouse' && warehouseQuery.isLoading) ||
    (entityType === 'vehicle' && vehicleQuery.isLoading)

  const entityData = useMemo(() => {
    if (entityType === 'attendance') return attendanceQuery.data
    if (entityType === 'leave') return leaveQuery.data
    if (entityType === 'cash-advance') return cashAdvanceQuery.data
    if (entityType === 'payroll') {
      if (!payrollQuery.data) return undefined
      return {
        ...payrollQuery.data,
        employee: payrollEmployeeQuery.data ?? payrollQuery.data.employee,
      }
    }
    if (entityType === 'transaction') return transactionQuery.data
    if (entityType === 'employee') return employeeQuery.data
    if (entityType === 'branch') return branchQuery.data
    if (entityType === 'warehouse') return warehouseQuery.data
    if (entityType === 'vehicle') return vehicleQuery.data
    return undefined
  }, [
    entityType,
    attendanceQuery.data,
    leaveQuery.data,
    cashAdvanceQuery.data,
    payrollQuery.data,
    transactionQuery.data,
    payrollEmployeeQuery.data,
    employeeQuery.data,
    branchQuery.data,
    warehouseQuery.data,
    vehicleQuery.data,
  ])

  return useMemo(() => {
    const items = baseBreadcrumbItems(segments)
    const resolvedLabel = entityType
      ? resolveEntityLabel(entityType, entityData, labelById)
      : undefined

    if (resolvedLabel && entityId) {
      const entityIndex = segments.findIndex((segment) => segment === entityId)
      if (entityIndex >= 0 && items[entityIndex]) {
        items[entityIndex] = {
          label: resolvedLabel,
          href:
            entityIndex < segments.length - 1
              ? buildBreadcrumbPath(segments, entityIndex)
              : undefined,
        }
      }
    }

    // Replace unresolved placeholders only after loading finishes.
    if (!isResolving) {
      items.forEach((item, index) => {
        if (item.label === '…' && segments[index] && isEntityId(segments[index])) {
          items[index] = {
            ...item,
            label: resolvedLabel ?? 'Details',
          }
        }
      })
    }

    return items
  }, [segments, entityType, entityId, entityData, isResolving, labelById])
}
