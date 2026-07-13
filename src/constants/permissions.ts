/**
 * Permission key constants.
 *
 * These are opaque string identifiers that MUST match the keys the Scrappy Backend
 * (P001) returns on the current identity. They are data used for lookups only — the
 * frontend never hardcodes authorization RULES, only references these keys.
 */
export const PERMISSIONS = {
  company: {
    view: 'company.view',
    update: 'company.update',
  },
  user: {
    view: 'user.view',
    create: 'user.create',
    update: 'user.update',
    activate: 'user.activate',
    deactivate: 'user.deactivate',
  },
  employee: {
    view: 'employee.view',
    create: 'employee.create',
    update: 'employee.update',
    archive: 'employee.archive',
  },
  branch: {
    view: 'branch.view',
    create: 'branch.create',
    update: 'branch.update',
    archive: 'branch.archive',
  },
  warehouse: {
    view: 'warehouse.view',
    create: 'warehouse.create',
    update: 'warehouse.update',
    archive: 'warehouse.archive',
  },
  vehicle: {
    view: 'vehicle.view',
    create: 'vehicle.create',
    update: 'vehicle.update',
    archive: 'vehicle.archive',
  },
  attendance: {
    view: 'attendance.view',
    timeIn: 'attendance.timeIn',
    timeOut: 'attendance.timeOut',
    correct: 'attendance.correct',
  },
  leave: {
    view: 'leave.view',
    create: 'leave.create',
    update: 'leave.update',
    cancel: 'leave.cancel',
    approve: 'leave.approve',
    reject: 'leave.reject',
  },
  cashAdvance: {
    view: 'cashAdvance.view',
    create: 'cashAdvance.create',
    update: 'cashAdvance.update',
    cancel: 'cashAdvance.cancel',
    approve: 'cashAdvance.approve',
    reject: 'cashAdvance.reject',
  },
  payroll: {
    view: 'payroll.view',
  },
  transactions: {
    view: 'transactions.view',
    create: 'transactions.create',
    update: 'transactions.update',
    finish: 'transactions.finish',
    settle: 'transactions.settle',
    cancel: 'transactions.cancel',
    returnToDraft: 'transactions.returnToDraft',
    reopen: 'transactions.reopen',
  },
  trips: {
    view: 'trips.view',
    create: 'trips.create',
    update: 'trips.update',
    schedule: 'trips.schedule',
    start: 'trips.start',
    complete: 'trips.complete',
    cancel: 'trips.cancel',
  },
  expenses: {
    view: 'expenses.view',
    create: 'expenses.create',
    update: 'expenses.update',
    delete: 'expenses.delete',
    archive: 'expenses.archive',
  },
  analytics: {
    view: 'analytics.view',
  },
  reports: {
    view: 'reports.view',
    export: 'reports.export',
  },
  activityLogs: {
    view: 'activityLogs.view',
  },
} as const

export type PermissionKey =
  | (typeof PERMISSIONS.company)[keyof typeof PERMISSIONS.company]
  | (typeof PERMISSIONS.user)[keyof typeof PERMISSIONS.user]
  | (typeof PERMISSIONS.employee)[keyof typeof PERMISSIONS.employee]
  | (typeof PERMISSIONS.branch)[keyof typeof PERMISSIONS.branch]
  | (typeof PERMISSIONS.warehouse)[keyof typeof PERMISSIONS.warehouse]
  | (typeof PERMISSIONS.vehicle)[keyof typeof PERMISSIONS.vehicle]
  | (typeof PERMISSIONS.attendance)[keyof typeof PERMISSIONS.attendance]
  | (typeof PERMISSIONS.leave)[keyof typeof PERMISSIONS.leave]
  | (typeof PERMISSIONS.cashAdvance)[keyof typeof PERMISSIONS.cashAdvance]
  | (typeof PERMISSIONS.payroll)[keyof typeof PERMISSIONS.payroll]
  | (typeof PERMISSIONS.transactions)[keyof typeof PERMISSIONS.transactions]
  | (typeof PERMISSIONS.trips)[keyof typeof PERMISSIONS.trips]
  | (typeof PERMISSIONS.expenses)[keyof typeof PERMISSIONS.expenses]
  | (typeof PERMISSIONS.analytics)[keyof typeof PERMISSIONS.analytics]
  | (typeof PERMISSIONS.reports)[keyof typeof PERMISSIONS.reports]
  | (typeof PERMISSIONS.activityLogs)[keyof typeof PERMISSIONS.activityLogs]
