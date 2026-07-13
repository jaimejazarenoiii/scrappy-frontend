import type { StatusTone } from '@/components/common/StatusBadge'

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
