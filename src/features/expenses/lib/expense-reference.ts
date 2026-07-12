import { buildRoute } from '@/constants/routes'

import type { ExpenseReferenceType } from '../types/expense.types'

const REFERENCE_TYPE_LABELS: Record<ExpenseReferenceType, string> = {
  COMPANY: 'Business',
  BRANCH: 'Branch',
  WAREHOUSE: 'Warehouse',
  VEHICLE: 'Vehicle',
  TRIP: 'Trip',
}

export const EXPENSE_REFERENCE_TYPE_OPTIONS: ExpenseReferenceType[] = [
  'COMPANY',
  'BRANCH',
  'WAREHOUSE',
  'VEHICLE',
  'TRIP',
]

export function expenseReferenceTypeLabel(type: ExpenseReferenceType): string {
  return REFERENCE_TYPE_LABELS[type]
}

export function referenceTypeRequiresEntityId(type: ExpenseReferenceType): boolean {
  return type !== 'COMPANY'
}

export function resolveExpenseReferenceRoute(
  type: ExpenseReferenceType,
  id: string | null | undefined,
): string | undefined {
  if (!id) return undefined

  switch (type) {
    case 'BRANCH':
      return buildRoute.branchDetail(id)
    case 'WAREHOUSE':
      return buildRoute.warehouseDetail(id)
    case 'VEHICLE':
      return buildRoute.vehicleDetail(id)
    case 'TRIP':
      return buildRoute.tripDetail(id)
    default:
      return undefined
  }
}
