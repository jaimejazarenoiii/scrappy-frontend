/** Returns true when an organization entity has been archived (soft-deleted). */
export function isOrgEntityArchived(deletedAt: string | null): boolean {
  return deletedAt != null
}

export type OrgStatusTone = 'active' | 'archived' | 'inactive'

/** Maps branch/warehouse ACTIVE|INACTIVE status to badge tones. */
export function orgEntityStatusTone(
  status: 'ACTIVE' | 'INACTIVE',
  deletedAt: string | null,
): OrgStatusTone {
  if (isOrgEntityArchived(deletedAt)) return 'archived'
  return status === 'ACTIVE' ? 'active' : 'inactive'
}

export function orgEntityStatusLabel(
  status: 'ACTIVE' | 'INACTIVE',
  deletedAt: string | null,
): string {
  if (isOrgEntityArchived(deletedAt)) return 'archived'
  return status.toLowerCase()
}

export type VehicleStatus = 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'INACTIVE'

/** Maps vehicle operational status to badge tones. */
export function vehicleStatusTone(status: VehicleStatus, deletedAt: string | null): OrgStatusTone {
  if (isOrgEntityArchived(deletedAt)) return 'archived'
  if (status === 'AVAILABLE' || status === 'IN_USE') return 'active'
  return 'inactive'
}

export function vehicleStatusLabel(status: VehicleStatus, deletedAt: string | null): string {
  if (isOrgEntityArchived(deletedAt)) return 'archived'
  return status.toLowerCase().replace('_', ' ')
}
