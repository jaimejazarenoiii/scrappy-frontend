import { useMemo, useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { TransactionDirectionBadge } from '@/features/transactions/components/TransactionDirectionBadge'
import { TransactionStatusBadge } from '@/features/transactions/components/TransactionStatusBadge'
import { formatDateTime } from '@/utils/format-date'

import { useSearchLinkableTransactions } from '../hooks/useTripTransactions'
import { useLinkTripTransaction } from '../hooks/useTripTransactionMutations'

interface TripTransactionAssignDialogProps {
  tripId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  linkedTransactionIds: string[]
}

export function TripTransactionAssignDialog({
  tripId,
  open,
  onOpenChange,
  linkedTransactionIds,
}: TripTransactionAssignDialogProps) {
  const [search, setSearch] = useState('')
  const params = useMemo(
    () => ({
      page: 1,
      pageSize: 20,
      search,
    }),
    [search],
  )
  const linkableQuery = useSearchLinkableTransactions(tripId, params, open)
  const linkTransaction = useLinkTripTransaction(tripId)

  const candidates = (linkableQuery.data?.data ?? []).filter(
    (transaction) => !linkedTransactionIds.includes(transaction.id),
  )

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setSearch('')
        onOpenChange(next)
      }}
    >
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assign transactions</DialogTitle>
          <DialogDescription>
            Search and link transactions to this trip. Linking rules are enforced by the backend.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <Input
            value={search}
            placeholder="Search transactions…"
            onChange={(event) => {
              setSearch(event.target.value)
            }}
          />

          {linkableQuery.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-14 w-full rounded-md" />
              ))}
            </div>
          ) : candidates.length === 0 ? (
            <p className="text-muted-foreground text-sm">No matching transactions found.</p>
          ) : (
            <ul className="divide-y rounded-md border">
              {candidates.map((transaction) => (
                <li
                  key={transaction.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <TransactionDirectionBadge direction={transaction.direction} />
                      <TransactionStatusBadge status={transaction.status} />
                    </div>
                    <p className="font-medium">
                      {transaction.transactionNumber ?? transaction.partyName}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {formatDateTime(transaction.transactionDate)} ·{' '}
                      <span className="tabular-nums">{transaction.totalAmount.toFixed(2)}</span>
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    disabled={linkTransaction.isPending}
                    onClick={() => {
                      void linkTransaction.mutateAsync({ transactionId: transaction.id })
                    }}
                  >
                    Link
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onOpenChange(false)
            }}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
