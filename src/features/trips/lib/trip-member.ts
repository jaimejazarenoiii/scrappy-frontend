import type { TripMemberRole } from '../types/trip.types'

const TRIP_MEMBER_ROLE_LABELS: Record<TripMemberRole, string> = {
  DRIVER: 'Driver',
  HELPER: 'Helper',
  BUYER: 'Buyer',
  SUPERVISOR: 'Supervisor',
}

export function tripMemberRoleLabel(role: TripMemberRole): string {
  return TRIP_MEMBER_ROLE_LABELS[role]
}
