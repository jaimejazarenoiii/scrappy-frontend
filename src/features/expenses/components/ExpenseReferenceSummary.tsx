import { ExternalLink } from 'lucide-react'
import { Link } from 'react-router'

import { DescriptionItem } from '@/components/common/DescriptionList'
import { PERMISSIONS } from '@/constants/permissions'
import { useBranch } from '@/features/branches/hooks/useBranch'
import { PermissionGate } from '@/features/authorization/components/PermissionGate'
import { useTrip } from '@/features/trips/hooks/useTrip'
import { useVehicle } from '@/features/vehicles/hooks/useVehicle'
import { useWarehouse } from '@/features/warehouses/hooks/useWarehouse'

import { expenseReferenceTypeLabel, resolveExpenseReferenceRoute } from '../lib/expense-reference'
import type { ExpenseDetail, ExpenseSummary } from '../types/expense.types'

interface ExpenseReferenceSummaryProps {
  expense: (ExpenseSummary | ExpenseDetail) & {
    reference?: ExpenseDetail['reference']
  }
}

function ReferenceLink({
  href,
  label,
  permission,
}: {
  href: string
  label: string
  permission: string
}) {
  return (
    <PermissionGate permission={permission}>
      <Link
        to={href}
        className="text-primary inline-flex items-center gap-1 font-medium hover:underline"
      >
        {label}
        <ExternalLink className="size-3.5" aria-hidden />
      </Link>
    </PermissionGate>
  )
}

function permissionForReference(type: ExpenseDetail['referenceType']): string | undefined {
  switch (type) {
    case 'BRANCH':
      return PERMISSIONS.branch.view
    case 'WAREHOUSE':
      return PERMISSIONS.warehouse.view
    case 'VEHICLE':
      return PERMISSIONS.vehicle.view
    case 'TRIP':
      return PERMISSIONS.trips.view
    default:
      return undefined
  }
}

export function ExpenseReferenceSummary({ expense }: ExpenseReferenceSummaryProps) {
  const referenceId = expense.referenceId ?? expense.reference?.id ?? null
  const embeddedLabel = expense.referenceLabel ?? expense.reference?.label ?? null

  const branchQuery = useBranch(
    expense.referenceType === 'BRANCH' && referenceId && !embeddedLabel ? referenceId : undefined,
  )
  const warehouseQuery = useWarehouse(
    expense.referenceType === 'WAREHOUSE' && referenceId && !embeddedLabel
      ? referenceId
      : undefined,
  )
  const vehicleQuery = useVehicle(
    expense.referenceType === 'VEHICLE' && referenceId && !embeddedLabel ? referenceId : undefined,
  )
  const tripQuery = useTrip(
    expense.referenceType === 'TRIP' && referenceId && !embeddedLabel ? referenceId : undefined,
  )

  let entityLabel = embeddedLabel

  if (!entityLabel && referenceId) {
    if (expense.referenceType === 'BRANCH') {
      entityLabel = branchQuery.data?.name ?? null
    } else if (expense.referenceType === 'WAREHOUSE') {
      entityLabel = warehouseQuery.data?.name ?? null
    } else if (expense.referenceType === 'VEHICLE') {
      entityLabel = vehicleQuery.data?.plateNumber ?? null
    } else if (expense.referenceType === 'TRIP') {
      const trip = tripQuery.data
      entityLabel = trip?.tripNumber ?? (trip ? `${trip.origin} → ${trip.destination}` : null)
    }
  }

  const displayLabel = entityLabel ?? referenceId ?? '—'
  const route = resolveExpenseReferenceRoute(expense.referenceType, referenceId)
  const permission = permissionForReference(expense.referenceType)

  return (
    <DescriptionItem label="Reference">
      <div className="space-y-1">
        <p className="text-muted-foreground text-sm">
          {expenseReferenceTypeLabel(expense.referenceType)}
        </p>
        {route && permission ? (
          <ReferenceLink href={route} label={displayLabel} permission={permission} />
        ) : (
          <p className="font-medium">{displayLabel}</p>
        )}
      </div>
    </DescriptionItem>
  )
}
