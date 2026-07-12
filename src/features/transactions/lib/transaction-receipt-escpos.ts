import { formatCurrency } from '@/utils/format-currency'
import { formatDate } from '@/utils/format-date'

import { downloadBinaryFile, ESC_POS_WIDTH_58MM, EscPosBuilder } from './escpos'
import type { TransactionReceipt } from '../types/transaction.types'

function money(amount: number): string {
  return formatCurrency(amount).replace(/\u00a0/g, ' ')
}

function safeFilenamePart(value: string): string {
  return value.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'receipt'
}

/**
 * Builds a graphically readable ESC/POS thermal receipt as raw `.bin` bytes
 * for EOS Print / similar thermal printer apps.
 */
export function buildTransactionReceiptEscPos(
  receipt: TransactionReceipt,
  options?: { width?: number },
): Uint8Array {
  const builder = new EscPosBuilder(options?.width ?? ESC_POS_WIDTH_58MM)
  const direction = receipt.directionLabel
  const businessName = receipt.company.name.trim() || 'Scrappy'

  builder.init().align('center').doubleDivider().size(1, 1).bold(true)

  for (const line of wrapBusinessName(businessName, builder.width)) {
    builder.line(line)
  }

  builder
    .size(0, 0)
    .bold(false)
    .line('SCRAP TRADING RECEIPT')
    .doubleDivider()
    .align('left')
    .columns('Txn', receipt.transactionNumber)
    .columns('Date', formatDate(receipt.transactionDate))
    .columns('Type', direction)
    .feed(1)
    .bold(true)
    .line('Party')
    .bold(false)
    .wrap(receipt.partyName, 0)
    .feed(1)
    .columns('Paid by', truncateFit(receipt.paidByDisplayName, builder.width - 9))
    .columns('Paid at', formatDate(receipt.paidAt))
    .divider('=')
    .bold(true)
    .columns('ITEM', 'AMOUNT')
    .bold(false)
    .divider('-')

  for (const item of receipt.items) {
    builder.bold(true).wrap(item.materialName, 0).bold(false)

    const qtyLine = `${formatQty(item.weight)} ${item.unit} x ${money(item.price)}`
    builder.wrap(qtyLine, 2)
    builder.columns('', money(item.total))

    if (item.notes?.trim()) {
      builder.wrap(`Note: ${item.notes.trim()}`, 2)
    }

    builder.line('')
  }

  builder
    .divider('=')
    .size(1, 0)
    .bold(true)
    .columns('TOTAL', money(receipt.grandTotal))
    .size(0, 0)
    .bold(false)
    .doubleDivider()
    .align('center')
    .line('Thank you for your business')
    .feed(1)
    .bold(true)
    .line('Powered by Scrappy')
    .bold(false)
    .line('scrap trading operations')
    .doubleDivider()
    .feed(3)
    .cut()

  return builder.toUint8Array()
}

export function downloadTransactionReceiptBin(receipt: TransactionReceipt): void {
  const bytes = buildTransactionReceiptEscPos(receipt)
  const name = safeFilenamePart(receipt.transactionNumber)
  downloadBinaryFile(bytes, `scrappy-receipt-${name}.bin`)
}

function wrapBusinessName(name: string, width: number): string[] {
  // Double-width characters use ~half the columns.
  const max = Math.max(8, Math.floor(width / 2))
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return ['BUSINESS']

  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const next = current ? `${current} ${word}` : word
    if (next.length <= max) {
      current = next
    } else {
      if (current) lines.push(current)
      current = word.length <= max ? word : word.slice(0, max)
    }
  }
  if (current) lines.push(current)
  return lines.slice(0, 3)
}

function formatQty(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(2)
}

function truncateFit(value: string, max: number): string {
  if (value.length <= max) return value
  if (max <= 1) return value.slice(0, max)
  return `${value.slice(0, max - 1)}.`
}
