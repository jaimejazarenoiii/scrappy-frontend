import { useCallback, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'

import { formatEmployeeBreadcrumbLabel } from '../lib/employee-display'
import { EmployeeService } from '../services/employee.service'
import { employeeKeys } from './useEmployees'

/**
 * Resolve a user id to a readable actor name. Prefers the linked employee record,
 * then the current session user (covers owners without employee profiles),
 * then falls back to a shortened id.
 */
export function useFormatUserActor(): (userId: string | null | undefined) => string {
  const { currentUser } = useCurrentUser()
  const query = useQuery({
    queryKey: employeeKeys.picker,
    queryFn: () => EmployeeService.listAll(),
    staleTime: 60_000,
  })

  const labelByUserId = useMemo(() => {
    const map = new Map<string, string>()
    for (const employee of query.data ?? []) {
      if (employee.userId) {
        map.set(employee.userId, formatEmployeeBreadcrumbLabel(employee))
      }
    }
    return map
  }, [query.data])

  return useCallback(
    (userId: string | null | undefined): string => {
      if (!userId) return '—'
      const fromEmployee = labelByUserId.get(userId)
      if (fromEmployee) return fromEmployee
      if (currentUser?.id === userId) return currentUser.name || currentUser.email
      return `User ${userId.slice(0, 8)}…`
    },
    [labelByUserId, currentUser],
  )
}
