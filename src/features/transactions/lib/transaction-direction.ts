import type { Direction } from '../types/transaction.types'

export function transactionDirectionLabel(direction: Direction): string {
  switch (direction) {
    case 'INBOUND':
      return 'Inbound'
    case 'OUTBOUND':
      return 'Outbound'
    default:
      return 'Transaction'
  }
}
