import { navigationItems } from '@/constants/navigation'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export interface BreadcrumbItem {
  label: string
  href?: string
}

export type BreadcrumbEntityType =
  | 'attendance'
  | 'leave'
  | 'cash-advance'
  | 'payroll'
  | 'employee'
  | 'branch'
  | 'warehouse'
  | 'vehicle'
  | 'user'

const ROOT_SEGMENT_LABELS = Object.fromEntries(
  navigationItems.map((item) => [item.href.replace(/^\//, ''), item.label]),
) as Record<string, string>

const SEGMENT_LABELS: Record<string, string> = {
  ...ROOT_SEGMENT_LABELS,
  dashboard: 'Dashboard',
  company: 'Company',
  users: 'Users',
  employees: 'Employees',
  branches: 'Branches',
  warehouses: 'Warehouses',
  vehicles: 'Vehicles',
  attendance: 'Attendance',
  leave: 'Leave',
  'cash-advances': 'Cash advances',
  payroll: 'Payroll',
  new: 'New',
  edit: 'Edit',
}

const ENTITY_PARENTS: Record<string, BreadcrumbEntityType> = {
  attendance: 'attendance',
  leave: 'leave',
  'cash-advances': 'cash-advance',
  payroll: 'payroll',
  employees: 'employee',
  branches: 'branch',
  warehouses: 'warehouse',
  vehicles: 'vehicle',
  users: 'user',
}

export function isEntityId(segment: string): boolean {
  return UUID_RE.test(segment)
}

export function labelForSegment(segment: string): string {
  const mapped = SEGMENT_LABELS[segment]
  if (mapped) return mapped
  return segment.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

export function parseBreadcrumbEntity(segments: string[]): {
  entityType?: BreadcrumbEntityType
  entityId?: string
} {
  if (segments.length < 2) return {}

  const parent = segments[0]
  const entityType = parent ? ENTITY_PARENTS[parent] : undefined
  if (!entityType) return {}

  const candidate = segments[1]
  if (!candidate || !isEntityId(candidate)) return {}

  return { entityType, entityId: candidate }
}

export function buildBreadcrumbPath(segments: string[], index: number): string {
  return `/${segments.slice(0, index + 1).join('/')}`
}

export function baseBreadcrumbItems(segments: string[]): BreadcrumbItem[] {
  if (segments.length === 0 || (segments.length === 1 && segments[0] === 'dashboard')) {
    return []
  }

  const items: BreadcrumbItem[] = []

  segments.forEach((segment, index) => {
    const isLast = index === segments.length - 1
    const entityIdAtIndex = isEntityId(segment)
    const parent = segments[index - 1]
    const isResolvableEntityId = entityIdAtIndex && index > 0 && parent in ENTITY_PARENTS

    if (isResolvableEntityId) {
      // Placeholder until async label resolves in the hook.
      items.push({
        label: '…',
        href: isLast ? undefined : buildBreadcrumbPath(segments, index),
      })
      return
    }

    const href =
      index === 0
        ? navigationItems.find((item) => item.href === `/${segment}`)?.href
        : buildBreadcrumbPath(segments, index)

    items.push({
      label: labelForSegment(segment),
      href: isLast ? undefined : href,
    })
  })

  return items
}
