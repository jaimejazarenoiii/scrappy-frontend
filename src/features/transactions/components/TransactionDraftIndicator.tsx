import { StatusBadge } from '@/components/common/StatusBadge'

import { useTransactionDraftStore } from '../hooks/useTransactionDraftStore'

function formatTime(ts: string): string {
  const date = new Date(ts)
  if (Number.isNaN(date.getTime())) return ts
  return new Intl.DateTimeFormat('en-PH', {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function TransactionDraftIndicator() {
  const { isDirty, isSaving, lastSavedAt } = useTransactionDraftStore()

  if (isSaving) return <StatusBadge label="Saving…" tone="neutral" />
  if (isDirty) return <StatusBadge label="Unsaved changes" tone="inactive" />
  if (lastSavedAt) return <StatusBadge label={`Saved · ${formatTime(lastSavedAt)}`} tone="active" />

  return <StatusBadge label="Draft" tone="neutral" />
}
