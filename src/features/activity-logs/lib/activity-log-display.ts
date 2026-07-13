import type { StatusTone } from '@/components/common/StatusBadge'
import type { UserRole } from '@/features/auth/types/auth.types'

import type { ActivityPerformedBy } from '../types/activity-log.types'

const ROLE_LABELS: Record<UserRole, string> = {
  OWNER: 'Owner',
  MANAGER: 'Manager',
  EMPLOYEE: 'Employee',
}

export function activityEventTypeLabel(eventType: string): string {
  return eventType
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function activityEventTypeTone(eventType: string): StatusTone {
  if (eventType === 'AUTHENTICATION') return 'inactive'
  if (eventType === 'TRANSACTION' || eventType === 'EXPENSE') return 'active'
  if (eventType === 'TRIP' || eventType === 'WORKFORCE') return 'archived'
  return 'neutral'
}

export function formatActivityAction(action: string): string {
  return action.replaceAll('.', ' · ')
}

export function activityRoleLabel(role: UserRole): string {
  return ROLE_LABELS[role]
}

/** Primary display line for an activity actor (email preferred). */
export function formatPerformedBy(performedBy: ActivityPerformedBy | null | undefined): string {
  if (!performedBy) return '—'
  return performedBy.email || '—'
}

export function formatPerformedBySecondary(
  performedBy: ActivityPerformedBy | null | undefined,
): string | null {
  if (!performedBy?.role) return null
  return activityRoleLabel(performedBy.role)
}
