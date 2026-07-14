import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router'

import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { FormField } from '@/components/common/FormField'
import { PageContainer } from '@/components/common/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { PageSkeleton } from '@/components/feedback/PageSkeleton'
import { ErrorState } from '@/components/feedback/ErrorState'
import { PermissionGate } from '@/features/authorization/components/PermissionGate'
import { useBranchOptions } from '@/features/branches/hooks/useBranchOptions'
import { useWarehouseOptions } from '@/features/warehouses/hooks/useWarehouseOptions'
import { applyApiValidationErrors } from '@/utils/form-errors'
import type { NormalizedApiError } from '@/lib/axios'
import { TransactionEmployeePicker } from '../components/TransactionEmployeePicker'
import { TransactionTripPicker } from '../components/TransactionTripPicker'
import { TransactionDraftIndicator } from '../components/TransactionDraftIndicator'
import { TransactionDirectionBadge } from '../components/TransactionDirectionBadge'
import { TransactionStatusBadge } from '../components/TransactionStatusBadge'
import { TransactionItemsEditor } from '../components/TransactionItemsEditor'
import { TripLoadValidationBanner } from '../components/TripLoadValidationBanner'
import { TransactionPhotosManager } from '../components/TransactionPhotosManager'
import { useDraftAutoSave } from '../hooks/useDraftAutoSave'
import { useTransaction } from '../hooks/useTransaction'
import { useTransactionItems } from '../hooks/useTransactionItems'
import { useTripLoadTransactionWarnings } from '../hooks/useTripLoadTransactionWarnings'
import {
  useUpdateTransactionDraft,
  useAutoSaveTransactionDraft,
} from '../hooks/useTransactionMutations'
import { useUnsavedChangesPrompt } from '../hooks/useUnsavedChangesPrompt'
import { useTransactionDraftStore } from '../hooks/useTransactionDraftStore'
import { toUpdateTransactionInput } from '../lib/transaction-draft-input'
import {
  transactionDraftSchema,
  type TransactionDraftValues,
} from '../validation/transaction.schema'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { PERMISSIONS } from '@/constants/permissions'
import { buildRoute } from '@/constants/routes'
import { formatTransactionDirectionAndParty } from '../lib/transaction-format'
import { toDateInputValue } from '@/utils/format-date'

function toFormValue(value: string | null | undefined): string {
  return value ?? ''
}

export default function TransactionEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const transactionQuery = useTransaction(id)
  const updateDraft = useUpdateTransactionDraft(id ?? '')
  const autoSaveDraft = useAutoSaveTransactionDraft(id ?? '')

  const branchOptions = useBranchOptions()
  const warehouseOptions = useWarehouseOptions()

  const {
    isDirty,
    isSaving,
    setDirty,
    setSaving,
    markSaved,
    reset: resetDraftStore,
  } = useTransactionDraftStore()

  const [hydrated, setHydrated] = useState(false)

  const form = useForm<TransactionDraftValues>({
    resolver: zodResolver(transactionDraftSchema),
    defaultValues: {
      direction: 'INBOUND',
      partyName: '',
      partyContactNumber: '',
      transactionDate: '',
      locationType: 'BRANCH',
      branchId: '',
      warehouseId: '',
      outsideLocationName: '',
      outsideAddress: '',
      tripId: '',
      notes: '',
      assignedEmployeeIds: [],
    },
  })

  const {
    register,
    handleSubmit,
    watch,
    setError,
    setValue,
    reset: resetForm,
    formState: { errors, isDirty: formDirty },
  } = form

  const locationType = watch('locationType')
  const assignedEmployeeIds = watch('assignedEmployeeIds')
  const tripId = watch('tripId')

  const navigationBlocker = useUnsavedChangesPrompt(isDirty && !isSaving)

  const tx = transactionQuery.data
  const draftEditingAllowed = tx?.status === 'DRAFT'

  const itemsQuery = useTransactionItems(id ?? '')
  const validationItems = useMemo(
    () =>
      (itemsQuery.data ?? []).map((item) => ({
        materialName: item.materialName,
        weight: item.weight,
        unit: item.unit,
      })),
    [itemsQuery.data],
  )
  const tripLoadWarningsQuery = useTripLoadTransactionWarnings({
    tripId: tripId ?? tx?.tripId ?? undefined,
    locationType,
    items: validationItems,
  })

  useEffect(() => {
    if (!tx || tx.status === 'DRAFT') return
    void navigate(buildRoute.transactionDetail(tx.id), { replace: true })
  }, [tx, navigate])

  useEffect(() => {
    if (!tx) return
    document.title = `Edit Draft · ${formatTransactionDirectionAndParty(tx)} | Scrappy`
  }, [tx])

  useEffect(() => {
    if (!tx) return

    setHydrated(false)
    resetDraftStore()

    resetForm({
      direction: tx.direction,
      partyName: tx.partyName,
      partyContactNumber: toFormValue(tx.partyContactNumber),
      transactionDate: toDateInputValue(tx.transactionDate),
      locationType: tx.locationType,
      branchId: tx.locationType === 'BRANCH' ? toFormValue(tx.branchId) : '',
      warehouseId: tx.locationType === 'WAREHOUSE' ? toFormValue(tx.warehouseId) : '',
      outsideLocationName: tx.locationType === 'OUTSIDE' ? toFormValue(tx.outsideLocationName) : '',
      outsideAddress: tx.locationType === 'OUTSIDE' ? toFormValue(tx.outsideAddress) : '',
      tripId: tx.locationType === 'TRIP' ? toFormValue(tx.tripId) : '',
      notes: toFormValue(tx.notes),
      assignedEmployeeIds: tx.assignedEmployeeIds,
    })

    markSaved(tx.updatedAt)
    setDirty(false)
    setHydrated(true)
  }, [tx, resetForm, resetDraftStore, markSaved, setDirty])

  useEffect(() => {
    if (!hydrated) return

    if (locationType === 'BRANCH') {
      setValue('warehouseId', '')
      setValue('outsideLocationName', '')
      setValue('outsideAddress', '')
      setValue('tripId', '')
    }
    if (locationType === 'WAREHOUSE') {
      setValue('branchId', '')
      setValue('outsideLocationName', '')
      setValue('outsideAddress', '')
      setValue('tripId', '')
    }
    if (locationType === 'OUTSIDE') {
      setValue('branchId', '')
      setValue('warehouseId', '')
      setValue('tripId', '')
    }
    if (locationType === 'TRIP') {
      setValue('branchId', '')
      setValue('warehouseId', '')
      setValue('outsideLocationName', '')
      setValue('outsideAddress', '')
    }
  }, [hydrated, locationType, setValue])

  useEffect(() => {
    setDirty(formDirty)
  }, [formDirty, setDirty])

  useDraftAutoSave({
    enabled: Boolean(id) && hydrated && draftEditingAllowed,
    form,
    save: autoSaveDraft,
    onSaved: (timestamp) => {
      markSaved(timestamp)
      setDirty(false)
    },
    setSaving,
  })

  const onSave = handleSubmit(async (values) => {
    if (!id) return

    setSaving(true)
    try {
      await updateDraft.mutateAsync(toUpdateTransactionInput(values))
      markSaved(new Date().toISOString())
      setDirty(false)
    } catch (error) {
      applyApiValidationErrors(error as NormalizedApiError, setError)
    } finally {
      setSaving(false)
    }
  })

  if (transactionQuery.isLoading) {
    return (
      <PageContainer maxWidth="lg">
        <PageSkeleton />
      </PageContainer>
    )
  }

  if (transactionQuery.isError || !tx) {
    return (
      <PageContainer maxWidth="lg">
        <ErrorState description="We couldn't load this draft transaction. Please try again." />
      </PageContainer>
    )
  }

  return (
    <PageContainer maxWidth="lg">
      <div className="space-y-8">
        <PageHeader
          title="Edit transaction draft"
          description={formatTransactionDirectionAndParty(tx)}
          actions={
            <>
              <TransactionDraftIndicator />
              <PermissionGate permission={PERMISSIONS.transactions.update}>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    void navigate(buildRoute.transactionDetail(tx.id))
                  }}
                >
                  Back to details
                </Button>
              </PermissionGate>
            </>
          }
        />

        {draftEditingAllowed ? (
          <p className="text-muted-foreground bg-muted/30 rounded-lg border px-4 py-3 text-sm">
            Resuming draft saved from the server. Changes auto-save while you edit.
          </p>
        ) : (
          <p className="text-muted-foreground rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm dark:border-amber-500/30 dark:bg-amber-500/10">
            This transaction is no longer editable as a draft.
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <TransactionStatusBadge status={tx.status} />
          <TransactionDirectionBadge direction={tx.direction} />
        </div>

        <form
          onSubmit={(event) => {
            void onSave(event)
          }}
          className="space-y-6"
          noValidate
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              label="Direction"
              htmlFor="direction"
              error={errors.direction?.message}
              required
            >
              <Select
                id="direction"
                aria-invalid={Boolean(errors.direction)}
                {...register('direction')}
                disabled={!draftEditingAllowed}
              >
                <option value="INBOUND">Inbound</option>
                <option value="OUTBOUND">Outbound</option>
              </Select>
            </FormField>

            <FormField
              label="Party name"
              htmlFor="partyName"
              error={errors.partyName?.message}
              required
            >
              <Input
                id="partyName"
                placeholder="Party name"
                {...register('partyName')}
                disabled={!draftEditingAllowed}
              />
            </FormField>

            <FormField
              label="Party contact"
              htmlFor="partyContactNumber"
              error={errors.partyContactNumber?.message}
            >
              <Input
                id="partyContactNumber"
                placeholder="Optional contact number"
                {...register('partyContactNumber')}
                disabled={!draftEditingAllowed}
              />
            </FormField>

            <FormField
              label="Transaction date"
              htmlFor="transactionDate"
              error={errors.transactionDate?.message}
            >
              <Input
                id="transactionDate"
                type="date"
                {...register('transactionDate')}
                disabled={!draftEditingAllowed}
              />
            </FormField>

            <FormField
              label="Location type"
              htmlFor="locationType"
              error={errors.locationType?.message}
              required
            >
              <Select
                id="locationType"
                aria-invalid={Boolean(errors.locationType)}
                {...register('locationType')}
                disabled={!draftEditingAllowed}
              >
                <option value="BRANCH">Branch</option>
                <option value="WAREHOUSE">Warehouse</option>
                <option value="OUTSIDE">Outside</option>
                <option value="TRIP">Trip</option>
              </Select>
            </FormField>

            {locationType === 'BRANCH' ? (
              <FormField
                label="Branch"
                htmlFor="branchId"
                error={errors.branchId?.message}
                required
              >
                <Select
                  id="branchId"
                  aria-invalid={Boolean(errors.branchId)}
                  {...register('branchId')}
                  disabled={!draftEditingAllowed || branchOptions.isLoading}
                >
                  <option value="">Select branch</option>
                  {(branchOptions.data ?? []).map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </Select>
              </FormField>
            ) : null}

            {locationType === 'WAREHOUSE' ? (
              <FormField
                label="Warehouse"
                htmlFor="warehouseId"
                error={errors.warehouseId?.message}
                required
              >
                <Select
                  id="warehouseId"
                  aria-invalid={Boolean(errors.warehouseId)}
                  {...register('warehouseId')}
                  disabled={!draftEditingAllowed || warehouseOptions.isLoading}
                >
                  <option value="">Select warehouse</option>
                  {(warehouseOptions.data ?? []).map((warehouse) => (
                    <option key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </option>
                  ))}
                </Select>
              </FormField>
            ) : null}

            {locationType === 'OUTSIDE' ? (
              <>
                <FormField
                  label="Outside location name"
                  htmlFor="outsideLocationName"
                  error={errors.outsideLocationName?.message}
                  required
                >
                  <Input
                    id="outsideLocationName"
                    {...register('outsideLocationName')}
                    disabled={!draftEditingAllowed}
                  />
                </FormField>

                <FormField
                  label="Outside address"
                  htmlFor="outsideAddress"
                  error={errors.outsideAddress?.message}
                  required
                >
                  <Input
                    id="outsideAddress"
                    {...register('outsideAddress')}
                    disabled={!draftEditingAllowed}
                  />
                </FormField>
              </>
            ) : null}

            {locationType === 'TRIP' ? (
              <FormField
                label="Trip"
                htmlFor="tripId"
                error={errors.tripId?.message}
                required
                className="sm:col-span-2"
              >
                <TransactionTripPicker
                  value={tripId ?? ''}
                  disabled={!draftEditingAllowed}
                  onChange={(nextTripId) => {
                    setValue('tripId', nextTripId, { shouldValidate: true, shouldDirty: true })
                  }}
                />
              </FormField>
            ) : null}

            <FormField
              label="Assigned employees"
              htmlFor="assignedEmployeeIds"
              error={errors.assignedEmployeeIds?.message}
              required
              className="sm:col-span-2"
            >
              <TransactionEmployeePicker
                selectedIds={assignedEmployeeIds}
                disabled={!draftEditingAllowed}
                onChange={(next) => {
                  setValue('assignedEmployeeIds', next, { shouldDirty: true, shouldValidate: true })
                }}
              />
            </FormField>

            <FormField
              label="Notes"
              htmlFor="notes"
              error={errors.notes?.message}
              className="sm:col-span-2"
            >
              <Textarea
                id="notes"
                placeholder="Draft notes…"
                {...register('notes')}
                disabled={!draftEditingAllowed}
              />
            </FormField>
          </div>

          <div className="flex justify-end gap-2 border-t pt-4">
            <Button type="submit" disabled={!draftEditingAllowed || isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving…
                </>
              ) : (
                'Save draft'
              )}
            </Button>
          </div>
        </form>

        {id ? (
          <>
            <TripLoadValidationBanner
              warnings={tripLoadWarningsQuery.warnings}
              strict={tripLoadWarningsQuery.strictLoadValidation}
            />
            <TransactionItemsEditor transactionId={id} disabled={!draftEditingAllowed} />
            <TransactionPhotosManager transactionId={id} disabled={!draftEditingAllowed} />
          </>
        ) : null}
      </div>

      <ConfirmDialog
        open={navigationBlocker.state === 'blocked'}
        onOpenChange={(open) => {
          if (!open) navigationBlocker.reset?.()
        }}
        title="Discard unsaved changes?"
        description="You have unsaved changes that may not be saved yet. Leave this page anyway?"
        confirmLabel="Leave page"
        variant="destructive"
        onConfirm={() => {
          navigationBlocker.proceed?.()
        }}
      />
    </PageContainer>
  )
}
