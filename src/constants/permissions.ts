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
} as const

export type PermissionKey =
  | (typeof PERMISSIONS.company)[keyof typeof PERMISSIONS.company]
  | (typeof PERMISSIONS.user)[keyof typeof PERMISSIONS.user]
  | (typeof PERMISSIONS.employee)[keyof typeof PERMISSIONS.employee]
