import { useQuery } from '@tanstack/react-query'

import type { ListQueryParams } from '@/types/pagination.types'

import { ActivityLogService } from '../services/activity-log.service'

export const activityLogKeys = {
  all: ['activity-logs'] as const,
  list: (params: ListQueryParams) => ['activity-logs', 'list', params] as const,
  detail: (id: string) => ['activity-logs', 'detail', id] as const,
}

export function useActivityLogs(params: ListQueryParams) {
  return useQuery({
    queryKey: activityLogKeys.list(params),
    queryFn: () => ActivityLogService.list(params),
  })
}

export function useActivityLog(id: string | undefined) {
  return useQuery({
    queryKey: activityLogKeys.detail(id ?? ''),
    queryFn: () => ActivityLogService.get(id ?? ''),
    enabled: Boolean(id),
  })
}
