import { useEffect, useMemo, useRef } from 'react'
import type { UseFormReturn } from 'react-hook-form'

import type { NormalizedApiError } from '@/lib/axios'
import { debounce } from '@/utils/debounce'
import { applyApiValidationErrors } from '@/utils/form-errors'

import { hasUpdatePayload, toUpdateTransactionInput } from '../lib/transaction-draft-input'
import type { UpdateTransactionInput } from '../types/transaction.types'
import type { TransactionDraftValues } from '../validation/transaction.schema'

interface UseDraftAutoSaveOptions {
  enabled: boolean
  form: Pick<
    UseFormReturn<TransactionDraftValues>,
    'watch' | 'getValues' | 'setError' | 'formState'
  >
  save: (input: UpdateTransactionInput) => Promise<unknown>
  onSaved: (timestamp: string) => void
  setSaving: (saving: boolean) => void
  debounceMs?: number
}

export function useDraftAutoSave({
  enabled,
  form,
  save,
  onSaved,
  setSaving,
  debounceMs = 800,
}: UseDraftAutoSaveOptions) {
  const { watch, getValues, setError, formState } = form
  const isSavingRef = useRef(false)

  const debouncedSave = useMemo(
    () =>
      debounce(() => {
        if (!enabled || isSavingRef.current || !formState.isDirty) return

        const input = toUpdateTransactionInput(getValues())
        if (!hasUpdatePayload(input)) return

        isSavingRef.current = true
        setSaving(true)

        void save(input)
          .then(() => {
            onSaved(new Date().toISOString())
          })
          .catch((error: unknown) => {
            const apiError = error as NormalizedApiError
            applyApiValidationErrors(apiError, setError)
          })
          .finally(() => {
            isSavingRef.current = false
            setSaving(false)
          })
      }, debounceMs),
    [enabled, formState.isDirty, getValues, save, onSaved, setSaving, setError, debounceMs],
  )

  useEffect(() => {
    if (!enabled) {
      debouncedSave.cancel()
      return
    }

    const subscription = watch(() => {
      debouncedSave()
    })

    return () => {
      subscription.unsubscribe()
      debouncedSave.cancel()
    }
  }, [enabled, watch, debouncedSave])
}
