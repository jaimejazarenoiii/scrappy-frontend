export type ActivityEventType =
  | 'AUTHENTICATION'
  | 'COMPANY'
  | 'EMPLOYEE'
  | 'ORGANIZATION'
  | 'TRANSACTION'
  | 'TRIP'
  | 'EXPENSE'
  | 'WORKFORCE'

export type ActivitySearchBy =
  'employeeName' | 'transactionNumber' | 'tripNumber' | 'expenseNumber' | 'user' | 'action'

export type ActivitySortBy = 'createdAt' | 'module' | 'user'

export interface ActivityLog {
  id: string
  companyId: string
  eventType: ActivityEventType
  module: string
  action: string
  description: string
  userId: string | null
  employeeId: string | null
  resourceType: string | null
  resourceId: string | null
  resourceNumber: string | null
  ipAddress: string | null
  userAgent: string | null
  metadata: Record<string, unknown> | null
  createdAt: string
}

export interface ActivityLogListParams {
  page?: number
  limit?: number
  sortBy?: ActivitySortBy
  sortOrder?: 'asc' | 'desc'
  q?: string
  searchBy?: ActivitySearchBy
  module?: string
  action?: string
  userId?: string
  eventType?: ActivityEventType
  dateFrom?: string
  dateTo?: string
}

export const ACTIVITY_EVENT_TYPES: ActivityEventType[] = [
  'AUTHENTICATION',
  'COMPANY',
  'EMPLOYEE',
  'ORGANIZATION',
  'TRANSACTION',
  'TRIP',
  'EXPENSE',
  'WORKFORCE',
]

export const ACTIVITY_SEARCH_BY_OPTIONS: { value: ActivitySearchBy; label: string }[] = [
  { value: 'action', label: 'Action' },
  { value: 'user', label: 'User' },
  { value: 'employeeName', label: 'Employee name' },
  { value: 'transactionNumber', label: 'Transaction #' },
  { value: 'tripNumber', label: 'Trip #' },
  { value: 'expenseNumber', label: 'Expense #' },
]

export const ACTIVITY_MODULE_OPTIONS = [
  'auth',
  'company',
  'employee',
  'branch',
  'warehouse',
  'vehicle',
  'transaction',
  'trip',
  'expense',
  'attendance',
  'leave',
  'cash-advance',
  'payroll',
] as const
