import { Loader2 } from 'lucide-react'

import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { PERMISSIONS } from '@/constants/permissions'
import { PermissionGate } from '@/features/authorization/components/PermissionGate'

import { CancelTransactionDialog } from './CancelTransactionDialog'
import { ReopenTransactionDialog } from './ReopenTransactionDialog'
import { ReturnToDraftDialog } from './ReturnToDraftDialog'
import { SettleTransactionDialog } from './SettleTransactionDialog'
import {
  useCancelTransaction,
  useFinishTransaction,
  useReopenTransaction,
  useReturnToDraftTransaction,
  useSettleTransaction,
} from '../hooks/useSettlementMutations'
import { useSettlementDialogStore } from '../hooks/useSettlementDialogStore'
import {
  isCancelledStatus,
  isDraftStatus,
  isPaidStatus,
  isReadyForPaymentStatus,
} from '../lib/transaction-settlement'
import type { TransactionDetail } from '../types/transaction.types'

interface TransactionSettlementActionsProps {
  transaction: TransactionDetail
}

export function TransactionSettlementActions({ transaction }: TransactionSettlementActionsProps) {
  const { activeDialog, openDialog, closeDialog } = useSettlementDialogStore()

  const finishMutation = useFinishTransaction(transaction.id)
  const settleMutation = useSettleTransaction(transaction.id)
  const cancelMutation = useCancelTransaction(transaction.id)
  const returnMutation = useReturnToDraftTransaction(transaction.id)
  const reopenMutation = useReopenTransaction(transaction.id)

  const isPending =
    finishMutation.isPending ||
    settleMutation.isPending ||
    cancelMutation.isPending ||
    returnMutation.isPending ||
    reopenMutation.isPending

  if (isCancelledStatus(transaction.status)) {
    return null
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <PermissionGate anyOf={[PERMISSIONS.transactions.finish, PERMISSIONS.transactions.update]}>
          {isDraftStatus(transaction.status) ? (
            <Button
              type="button"
              size="sm"
              disabled={isPending}
              onClick={() => {
                openDialog('finish')
              }}
            >
              {finishMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
              Mark ready for payment
            </Button>
          ) : null}
        </PermissionGate>

        <PermissionGate permission={PERMISSIONS.transactions.settle}>
          {isReadyForPaymentStatus(transaction.status) ? (
            <Button
              type="button"
              size="sm"
              disabled={isPending}
              onClick={() => {
                openDialog('settle')
              }}
            >
              Mark as paid
            </Button>
          ) : null}
        </PermissionGate>

        <PermissionGate permission={PERMISSIONS.transactions.returnToDraft}>
          {isReadyForPaymentStatus(transaction.status) ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isPending}
              onClick={() => {
                openDialog('returnToDraft')
              }}
            >
              Return to draft
            </Button>
          ) : null}
        </PermissionGate>

        <PermissionGate permission={PERMISSIONS.transactions.cancel}>
          {isDraftStatus(transaction.status) || isReadyForPaymentStatus(transaction.status) ? (
            <Button
              type="button"
              size="sm"
              variant="destructive"
              disabled={isPending}
              onClick={() => {
                openDialog('cancel')
              }}
            >
              Cancel
            </Button>
          ) : null}
        </PermissionGate>

        <PermissionGate permission={PERMISSIONS.transactions.reopen}>
          {isPaidStatus(transaction.status) ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isPending}
              onClick={() => {
                openDialog('reopen')
              }}
            >
              Reopen
            </Button>
          ) : null}
        </PermissionGate>
      </div>

      <ConfirmDialog
        open={activeDialog === 'finish'}
        onOpenChange={(open) => {
          if (!open) closeDialog()
        }}
        title="Mark ready for payment?"
        description="Submit this draft for manager review and settlement. You will not be able to edit it as an employee after submission."
        confirmLabel="Mark ready for payment"
        isLoading={finishMutation.isPending}
        onConfirm={() => {
          void finishMutation.mutateAsync()
        }}
      />

      <SettleTransactionDialog
        open={activeDialog === 'settle'}
        onOpenChange={(open) => {
          if (!open) closeDialog()
        }}
        isLoading={settleMutation.isPending}
        onSubmit={(values) => {
          void settleMutation.mutateAsync({
            settlementNote: values.settlementNote?.trim()
              ? values.settlementNote.trim()
              : undefined,
          })
        }}
      />

      <CancelTransactionDialog
        open={activeDialog === 'cancel'}
        onOpenChange={(open) => {
          if (!open) closeDialog()
        }}
        isLoading={cancelMutation.isPending}
        onSubmit={(values) => {
          void cancelMutation.mutateAsync({
            cancellationReason: values.cancellationReason?.trim()
              ? values.cancellationReason.trim()
              : undefined,
          })
        }}
      />

      <ReturnToDraftDialog
        open={activeDialog === 'returnToDraft'}
        onOpenChange={(open) => {
          if (!open) closeDialog()
        }}
        isLoading={returnMutation.isPending}
        onSubmit={(values) => {
          void returnMutation.mutateAsync({
            reason: values.reason?.trim() ? values.reason.trim() : undefined,
          })
        }}
      />

      <ReopenTransactionDialog
        open={activeDialog === 'reopen'}
        onOpenChange={(open) => {
          if (!open) closeDialog()
        }}
        isLoading={reopenMutation.isPending}
        onSubmit={(values) => {
          void reopenMutation.mutateAsync({ reason: values.reason })
        }}
      />
    </>
  )
}
