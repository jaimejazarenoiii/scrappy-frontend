import {
  Banknote,
  Building2,
  CalendarDays,
  Clock,
  Contact,
  LayoutDashboard,
  MapPin,
  Truck,
  Wallet,
  Warehouse,
} from 'lucide-react'

import { PERMISSIONS } from '@/constants/permissions'
import { ROUTES } from '@/constants/routes'
import type { NavigationItem } from '@/types/navigation.types'

export const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: ROUTES.dashboard,
    icon: LayoutDashboard,
  },
  {
    id: 'company',
    label: 'Company',
    href: ROUTES.company,
    icon: Building2,
    anyOf: [PERMISSIONS.company.view],
  },
  {
    id: 'employees',
    label: 'Employees',
    href: ROUTES.employees,
    icon: Contact,
    anyOf: [PERMISSIONS.employee.view],
  },
  {
    id: 'branches',
    label: 'Branches',
    href: ROUTES.branches,
    icon: MapPin,
    anyOf: [PERMISSIONS.branch.view],
  },
  {
    id: 'warehouses',
    label: 'Warehouses',
    href: ROUTES.warehouses,
    icon: Warehouse,
    anyOf: [PERMISSIONS.warehouse.view],
  },
  {
    id: 'vehicles',
    label: 'Vehicles',
    href: ROUTES.vehicles,
    icon: Truck,
    anyOf: [PERMISSIONS.vehicle.view],
  },
  {
    id: 'attendance',
    label: 'Attendance',
    href: ROUTES.attendance,
    icon: Clock,
    anyOf: [PERMISSIONS.attendance.view],
  },
  {
    id: 'leave',
    label: 'Leave',
    href: ROUTES.leave,
    icon: CalendarDays,
    anyOf: [PERMISSIONS.leave.view],
  },
  {
    id: 'cash-advances',
    label: 'Cash Advances',
    href: ROUTES.cashAdvances,
    icon: Wallet,
    anyOf: [PERMISSIONS.cashAdvance.view],
  },
  {
    id: 'payroll',
    label: 'Payroll',
    href: ROUTES.payroll,
    icon: Banknote,
    anyOf: [PERMISSIONS.payroll.view],
  },
]
