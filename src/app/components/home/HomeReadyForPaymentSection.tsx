import { ArrowRight, Banknote } from 'lucide-react'
import { Link } from 'react-router'

import { useReadyForPaymentQueue } from '@/app/components/home/useReadyForPayment'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { PermissionGate } from '@/features/authorization/components/PermissionGate'
import { TransactionDirectionBadge } from '@/features/transactions/components/TransactionDirectionBadge'
import { PERMISSIONS } from '@/constants/permissions'
import { buildRoute, ROUTES } from '@/constants/routes'
import { formatCurrency } from '@/utils/format-currency'
import { formatDate } from '@/utils/format-date'

interface HomeReadyForPaymentSectionProps {
  enabled: boolean
}

export function HomeReadyForPaymentSection({ enabled }: HomeReadyForPaymentSectionProps) {
  const query = useReadyForPaymentQueue(enabled)

  if (!enabled) return null

  const rows = query.data?.data ?? []
  const total = query.data?.total ?? 0
  const listHref = `${ROUTES.transactions}?status=READY_FOR_PAYMENT`

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-sm font-semibold">Ready for payment</h2>
          <p className="text-muted-foreground text-xs">
            Transactions submitted for manager settlement
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to={listHref}>
            View all
            {total > 0 ? ` (${String(total)})` : ''}
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </div>

      {query.isLoading ? (
        <Card>
          <CardContent className="space-y-3 py-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </CardContent>
        </Card>
      ) : query.isError ? (
        <Card>
          <CardContent className="text-muted-foreground py-6 text-sm">
            Could not load transactions ready for payment. Try again from the transactions list.
          </CardContent>
        </Card>
      ) : rows.length === 0 ? (
        <Card>
          <CardContent className="text-muted-foreground flex items-center gap-3 py-6 text-sm">
            <Banknote className="size-5 shrink-0" />
            No transactions waiting for payment.
          </CardContent>
        </Card>
      ) : (
        <Card className="gap-0 py-0">
          <CardHeader className="border-b px-4 py-3 sm:px-6">
            <CardTitle className="text-base">Payment queue</CardTitle>
            <CardDescription>
              Settle each transaction or open the full pending-payment list.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y">
              {rows.map((transaction) => (
                <li
                  key={transaction.id}
                  className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-medium">{transaction.partyName}</p>
                      <TransactionDirectionBadge direction={transaction.direction} />
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {transaction.transactionNumber ?? transaction.id.slice(0, 8)} ·{' '}
                      {formatDate(transaction.transactionDate)} ·{' '}
                      <span className="text-foreground font-medium tabular-nums">
                        {formatCurrency(transaction.totalAmount)}
                      </span>
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={buildRoute.transactionDetail(transaction.id)}>View</Link>
                    </Button>
                    <PermissionGate permission={PERMISSIONS.transactions.settle}>
                      <Button size="sm" asChild>
                        <Link to={buildRoute.transactionSettlement(transaction.id)}>Settle</Link>
                      </Button>
                    </PermissionGate>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </section>
  )
}
