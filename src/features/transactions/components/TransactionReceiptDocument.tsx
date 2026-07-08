import { formatDate } from '@/utils/format-date'

import { TransactionDirectionBadge } from './TransactionDirectionBadge'
import type { TransactionReceipt } from '../types/transaction.types'

interface TransactionReceiptDocumentProps {
  receipt: TransactionReceipt
}

export function TransactionReceiptDocument({ receipt }: TransactionReceiptDocumentProps) {
  return (
    <article className="transaction-receipt-document bg-card mx-auto max-w-2xl space-y-6 rounded-lg border p-6 print:border-0 print:p-0 print:shadow-none">
      <header className="space-y-1 border-b pb-4 text-center print:border-black">
        <p className="text-muted-foreground text-sm print:text-black">{receipt.company.name}</p>
        <h1 className="text-2xl font-semibold">Receipt</h1>
        <p className="text-muted-foreground text-sm print:text-black">
          {receipt.transactionNumber}
        </p>
      </header>

      <section className="grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <p className="text-muted-foreground print:text-black">Party</p>
          <p className="font-medium">{receipt.partyName}</p>
        </div>
        <div>
          <p className="text-muted-foreground print:text-black">Date</p>
          <p className="font-medium">{formatDate(receipt.transactionDate)}</p>
        </div>
        <div>
          <p className="text-muted-foreground print:text-black">Type</p>
          <TransactionDirectionBadge direction={receipt.direction} />
        </div>
        <div>
          <p className="text-muted-foreground print:text-black">Paid by</p>
          <p className="font-medium">{receipt.paidByDisplayName}</p>
        </div>
        <div>
          <p className="text-muted-foreground print:text-black">Paid at</p>
          <p className="font-medium">{formatDate(receipt.paidAt)}</p>
        </div>
      </section>

      <section>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2 font-medium">Material</th>
              <th className="py-2 font-medium">Weight</th>
              <th className="py-2 font-medium">Unit</th>
              <th className="py-2 font-medium">Price</th>
              <th className="py-2 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {receipt.items.map((item) => (
              <tr
                key={[item.materialName, item.weight, item.unit, item.price].join('-')}
                className="border-b"
              >
                <td className="py-2">{item.materialName}</td>
                <td className="py-2 tabular-nums">{item.weight}</td>
                <td className="py-2">{item.unit}</td>
                <td className="py-2 tabular-nums">{item.price.toFixed(2)}</td>
                <td className="py-2 text-right tabular-nums">{item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4} className="pt-4 text-right font-semibold">
                Grand total
              </td>
              <td className="pt-4 text-right font-semibold tabular-nums">
                {receipt.grandTotal.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </section>
    </article>
  )
}
