import { FileSpreadsheet, Route, Receipt, Banknote, Clock } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { ROUTES } from '@/constants/routes'
import type { ReportDomain, ReportFilterExtraKey } from '../types/reports.types'

export interface ReportCategoryConfig {
  id: ReportDomain
  title: string
  description: string
  href: string
  icon: LucideIcon
  allowedExtras: ReportFilterExtraKey[]
  defaultSortField: string
}

export const REPORT_CATEGORIES: ReportCategoryConfig[] = [
  {
    id: 'transactions',
    title: 'Transaction reports',
    description: 'Inbound and outbound transaction details for audit and export.',
    href: ROUTES.reportsTransactions,
    icon: FileSpreadsheet,
    allowedExtras: ['transactionType'],
    defaultSortField: 'transactionDate',
  },
  {
    id: 'trips',
    title: 'Trip reports',
    description: 'Trip status, vehicle utilization, and employee trip history.',
    href: ROUTES.reportsTrips,
    icon: Route,
    allowedExtras: ['tripStatus'],
    defaultSortField: 'scheduledStart',
  },
  {
    id: 'expenses',
    title: 'Expense reports',
    description: 'Expense details by category and reference type.',
    href: ROUTES.reportsExpenses,
    icon: Receipt,
    allowedExtras: ['expenseCategory'],
    defaultSortField: 'date',
  },
  {
    id: 'payroll',
    title: 'Payroll reports',
    description: 'Payroll by period and employee.',
    href: ROUTES.reportsPayroll,
    icon: Banknote,
    allowedExtras: ['payrollPeriod'],
    defaultSortField: 'payPeriodStart',
  },
  {
    id: 'attendance',
    title: 'Attendance reports',
    description: 'Employee attendance details for the selected range.',
    href: ROUTES.reportsAttendance,
    icon: Clock,
    allowedExtras: [],
    defaultSortField: 'timeInAt',
  },
]

export function getReportCategory(domain: ReportDomain): ReportCategoryConfig {
  const found = REPORT_CATEGORIES.find((item) => item.id === domain)
  if (!found) {
    throw new Error(`Unknown report domain: ${domain}`)
  }
  return found
}
