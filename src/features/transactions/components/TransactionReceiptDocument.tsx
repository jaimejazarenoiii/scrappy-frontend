import { formatCurrency } from '@/utils/format-currency'
import { formatDate } from '@/utils/format-date'

import { TransactionDirectionBadge } from './TransactionDirectionBadge'
import type { TransactionReceipt } from '../types/transaction.types'

interface TransactionReceiptDocumentProps {
  receipt: TransactionReceipt
}

export function TransactionReceiptDocument({ receipt }: TransactionReceiptDocumentProps) {
  const direction = receipt.directionLabel

  return (
    <article className="transaction-receipt-document bg-card mx-auto max-w-md space-y-0 overflow-hidden rounded-xl border shadow-sm print:max-w-none print:border-0 print:shadow-none">
      <header className="border-b border-dashed px-6 py-6 text-center print:border-black">
        <p className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
          {receipt.company.name}
        </p>
        <p className="text-muted-foreground mt-1 text-xs font-medium tracking-[0.2em] uppercase print:text-black">
          Scrap trading receipt
        </p>
        <div className="bg-border mx-auto mt-4 h-px w-full print:bg-black" />
        <p className="mt-4 font-mono text-sm font-medium">{receipt.transactionNumber}</p>
      </header>

      <section className="space-y-3 px-6 py-5 text-sm">
        <div className="flex items-start justify-between gap-3">
          <span className="text-muted-foreground print:text-black">Date</span>
          <span className="text-right font-medium">{formatDate(receipt.transactionDate)}</span>
        </div>
        <div className="flex items-start justify-between gap-3">
          <span className="text-muted-foreground print:text-black">Type</span>
          <span className="flex items-center gap-2">
            <TransactionDirectionBadge direction={receipt.direction} />
            <span className="sr-only">{direction}</span>
          </span>
        </div>
        <div className="flex items-start justify-between gap-3">
          <span className="text-muted-foreground print:text-black">Party</span>
          <span className="max-w-[60%] text-right font-medium text-balance">
            {receipt.partyName}
          </span>
        </div>
        <div className="flex items-start justify-between gap-3">
          <span className="text-muted-foreground print:text-black">Paid by</span>
          <span className="max-w-[60%] text-right font-medium">{receipt.paidByDisplayName}</span>
        </div>
        <div className="flex items-start justify-between gap-3">
          <span className="text-muted-foreground print:text-black">Paid at</span>
          <span className="text-right font-medium">{formatDate(receipt.paidAt)}</span>
        </div>
      </section>

      <div className="border-y border-dashed px-6 py-2 print:border-black">
        <div className="text-muted-foreground flex justify-between text-xs font-semibold tracking-wide uppercase print:text-black">
          <span>Item</span>
          <span>Amount</span>
        </div>
      </div>

      <section className="divide-y divide-dashed px-6 print:divide-black">
        {receipt.items.map((item) => (
          <div
            key={[item.materialName, item.weight, item.unit, item.price, item.total].join('-')}
            className="space-y-1 py-3 text-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="font-medium text-balance">{item.materialName}</p>
              <p className="shrink-0 font-medium tabular-nums">{formatCurrency(item.total)}</p>
            </div>
            <p className="text-muted-foreground text-xs print:text-black">
              {item.weight} {item.unit} × {formatCurrency(item.price)}
            </p>
            {item.notes ? (
              <p className="text-muted-foreground text-xs print:text-black">Note: {item.notes}</p>
            ) : null}
          </div>
        ))}
      </section>

      <section className="border-t border-dashed px-6 py-4 print:border-black">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold tracking-wide uppercase">Grand total</p>
          <p className="font-[family-name:var(--font-display)] text-xl font-semibold tabular-nums">
            {formatCurrency(receipt.grandTotal)}
          </p>
        </div>
      </section>

      <footer className="bg-muted/40 border-t border-dashed px-6 py-5 text-center print:border-black print:bg-transparent">
        <p className="text-sm">Thank you for your business</p>
        <p className="mt-3 font-[family-name:var(--font-display)] text-sm font-semibold">
          Powered by Scrappy
        </p>
        <p className="text-muted-foreground mt-0.5 text-xs print:text-black">
          Scrap trading operations
        </p>
      </footer>
    </article>
  )
}
