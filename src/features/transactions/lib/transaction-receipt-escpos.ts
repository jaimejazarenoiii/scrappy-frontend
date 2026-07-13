import { formatDateTime } from '@/utils/format-date'

import { downloadBinaryFile, ESC_POS_WIDTH_58MM, EscPosBuilder } from './escpos'
import { loadScrappyLogoRaster } from './escpos-logo'
import type { TransactionReceiptPrintExtras } from './transaction-receipt-location'
import type { TransactionReceipt } from '../types/transaction.types'

/** Compact thermal money — avoids long "PHP "/"₱" strings that wrap on 58mm paper. */
function money(amount: number): string {
  const formatted = new Intl.NumberFormat('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  }).format(amount)
  // Keep as one token (no spaces) so printers never split "1,234" / ".56"
  return `P${formatted}`
}

function safeFilenamePart(value: string): string {
  return value.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'receipt'
}

/**
 * Builds a graphically readable ESC/POS thermal receipt as raw `.bin` bytes
 * for EOS Print / similar thermal printer apps.
 */
export async function buildTransactionReceiptEscPos(
  receipt: TransactionReceipt,
  options?: { width?: number } & Partial<TransactionReceiptPrintExtras>,
): Promise<Uint8Array> {
  const builder = new EscPosBuilder(options?.width ?? ESC_POS_WIDTH_58MM)
  const direction = receipt.directionLabel
  const businessName = receipt.company.name.trim() || 'Scrappy'
  const issuedBy = receipt.paidByDisplayName.trim() || '—'
  const employees = (options?.assignedEmployeeNames ?? [])
    .map((name) => name.trim())
    .filter(Boolean)
  const location = options?.location ?? null
  const partyContact = options?.partyContactNumber?.trim() ?? ''
  const notes = options?.notes?.trim() ?? ''

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
    .columns('Date', formatDateTime(receipt.transactionDate))
    .columns('Type', direction)
    .feed(1)
    .bold(true)
    .line('Party')
    .bold(false)
    .wrap(receipt.partyName, 0)

  if (partyContact) {
    builder.wrap(partyContact, 0)
  }

  builder.feed(1).bold(true).line('Location').bold(false)

  if (!location) {
    builder.line('—')
  } else {
    builder.wrap(`${location.typeLabel}: ${location.primary}`, 0)
    for (const detail of location.details) {
      builder.wrap(detail, 0)
    }
  }

  builder.feed(1).bold(true).line('Employees').bold(false)

  if (employees.length === 0) {
    builder.line('—')
  } else {
    for (const name of employees) {
      builder.wrap(`- ${name}`, 0)
    }
  }

  builder
    .feed(1)
    .bold(true)
    .line('Issued by')
    .bold(false)
    .wrap(issuedBy, 0)
    .columns('Paid at', formatDateTime(receipt.paidAt))

  if (notes) {
    builder.feed(1).bold(true).line('Notes').bold(false).wrap(notes, 0)
  }

  builder.divider('=').bold(true).columns('ITEM', 'AMOUNT').bold(false).divider('-')

  for (const item of receipt.items) {
    builder.bold(true).wrap(item.materialName, 0).bold(false)

    // Qty/price on one compact line; line total always right-aligned alone.
    const qtyLine = `${formatQty(item.weight)} ${item.unit} x ${money(item.price)}`
    if (qtyLine.length <= builder.width) {
      builder.line(qtyLine)
    } else {
      builder.wrap(qtyLine, 0)
    }
    builder.columns('', money(item.total))

    if (item.notes?.trim()) {
      builder.wrap(`Note: ${item.notes.trim()}`, 2)
    }

    builder.line('')
  }

  builder
    .divider('=')
    // Keep TOTAL at normal width so amount stays on one line (double-width would wrap).
    .bold(true)
    .columns('TOTAL', money(receipt.grandTotal))
    .bold(false)
    .doubleDivider()
    .align('center')
    .line('Thank you for your business')
    .feed(1)

  const logo = await loadScrappyLogoRaster(144)
  if (logo) {
    builder.raster(logo.dots, logo.width, logo.height).feed(1)
  }

  builder
    .bold(true)
    .line('Powered by Scrappy')
    .bold(false)
    .line('scrap trading operations')
    .doubleDivider()
    .feed(3)
    .cut()

  return builder.toUint8Array()
}

export async function downloadTransactionReceiptBin(
  receipt: TransactionReceipt,
  options?: Partial<TransactionReceiptPrintExtras>,
): Promise<void> {
  const bytes = await buildTransactionReceiptEscPos(receipt, options)
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
