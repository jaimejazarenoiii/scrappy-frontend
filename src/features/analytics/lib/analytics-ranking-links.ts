import { PERMISSIONS } from '@/constants/permissions'
import { buildRoute } from '@/constants/routes'
import { formatCurrency } from '@/utils/format-currency'

export function formatRankingCurrency(amount: number): string {
  return formatCurrency(amount)
}

export const rankingPermissions = {
  branch: PERMISSIONS.branch.view,
  warehouse: PERMISSIONS.warehouse.view,
  vehicle: PERMISSIONS.vehicle.view,
  employee: PERMISSIONS.employee.view,
  trip: PERMISSIONS.trips.view,
} as const

export const rankingRoutes = {
  branch: buildRoute.branchDetail,
  warehouse: buildRoute.warehouseDetail,
  vehicle: buildRoute.vehicleDetail,
  employee: buildRoute.employeeDetail,
  trip: buildRoute.tripDetail,
} as const
