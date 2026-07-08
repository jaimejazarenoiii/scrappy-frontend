import { Building2, Contact, LayoutDashboard, MapPin, Truck, Warehouse } from 'lucide-react'

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
]
