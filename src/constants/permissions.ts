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
