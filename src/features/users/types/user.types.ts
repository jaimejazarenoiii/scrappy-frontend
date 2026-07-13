import type { UserRole } from '@/features/auth/types/auth.types'

export type UserStatus = 'ACTIVE' | 'INACTIVE'

/** `GET /users/me` — current authenticated user. */
export interface UserMe {
  id: string
  companyId: string
  employeeId: string | null
  email: string
  role: UserRole
  status: UserStatus
  lastLoginAt: string | null
  passwordChangeRequired?: boolean
}

/** `GET /users/me/password-status` */
export interface PasswordStatus {
  passwordChangeRequired: boolean
  passwordChangedAt: string | null
}

/** `POST /users/me/password` */
export interface ChangePasswordInput {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}
