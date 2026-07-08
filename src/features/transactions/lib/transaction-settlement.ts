import type { TransactionStatus } from '../types/transaction.types'

/** Display hints only — authorization is enforced by the backend and PermissionGate. */
export function isDraftStatus(status: TransactionStatus): boolean {
  return status === 'DRAFT'
}

export function isReadyForPaymentStatus(status: TransactionStatus): boolean {
  return status === 'READY_FOR_PAYMENT'
}

export function isPaidStatus(status: TransactionStatus): boolean {
  return status === 'PAID'
}

export function isCancelledStatus(status: TransactionStatus): boolean {
  return status === 'CANCELLED'
}

export function canShowReceiptHint(status: TransactionStatus): boolean {
  return status === 'PAID'
}
