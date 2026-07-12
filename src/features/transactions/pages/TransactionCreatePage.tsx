import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'

import { FormField } from '@/components/common/FormField'
import { PageContainer } from '@/components/common/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { applyApiValidationErrors } from '@/utils/form-errors'
import type { NormalizedApiError } from '@/lib/axios'
import { useBranchOptions } from '@/features/branches/hooks/useBranchOptions'
import { useWarehouseOptions } from '@/features/warehouses/hooks/useWarehouseOptions'
import { TransactionEmployeePicker } from '../components/TransactionEmployeePicker'
import { TransactionTripPicker } from '../components/TransactionTripPicker'
import { useCreateTransactionDraft } from '../hooks/useTransactionMutations'
import {
  transactionDraftSchema,
  type TransactionDraftValues,
} from '../validation/transaction.schema'
import type { CreateTransactionInput } from '../types/transaction.types'
import { ROUTES, buildRoute } from '@/constants/routes'

export default function TransactionCreatePage() {
  const navigate = useNavigate()

  const branchOptions = useBranchOptions()
  const warehouseOptions = useWarehouseOptions()

  const createDraft = useCreateTransactionDraft()

  const {
    register,
    handleSubmit,
    watch,
    setError,
    setValue,
    formState: { errors },
  } = useForm<TransactionDraftValues>({
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

  const locationType = watch('locationType')

  useEffect(() => {
    const apiError = createDraft.error as NormalizedApiError | null | undefined
    if (!apiError) return
    applyApiValidationErrors(apiError, setError)
  }, [createDraft.error, setError])

  useEffect(() => {
    // Keep conditional fields from blocking validation.
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
  }, [locationType, setValue])

  useEffect(() => {
    document.title = 'Create Transaction | Scrappy'
  }, [])

  const onSubmit = handleSubmit(async (values) => {
    const input: CreateTransactionInput = {
      direction: values.direction,
      partyName: values.partyName,
      // API treats missing fields differently from empty strings; normalize "" -> undefined.
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      partyContactNumber: values.partyContactNumber?.trim() || undefined,
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      transactionDate: values.transactionDate?.trim() || undefined,
      locationType: values.locationType,
      branchId: values.locationType === 'BRANCH' && values.branchId ? values.branchId : undefined,
      warehouseId:
        values.locationType === 'WAREHOUSE' && values.warehouseId ? values.warehouseId : undefined,
      outsideLocationName:
        values.locationType === 'OUTSIDE' && values.outsideLocationName
          ? values.outsideLocationName
          : undefined,
      outsideAddress:
        values.locationType === 'OUTSIDE' && values.outsideAddress
          ? values.outsideAddress
          : undefined,
      tripId: values.locationType === 'TRIP' && values.tripId ? values.tripId : undefined,
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      notes: values.notes?.trim() || undefined,
      assignedEmployeeIds: values.assignedEmployeeIds,
      items: [],
    }

    const created = await createDraft.mutateAsync(input)
    void navigate(buildRoute.transactionEdit(created.id))
  })

  const assignedEmployeeIds = watch('assignedEmployeeIds')
  const tripId = watch('tripId')

  return (
    <PageContainer maxWidth="lg">
      <div className="space-y-6">
        <PageHeader
          title="Create transaction draft"
          description="Start an inbound or outbound draft transaction."
        />

        <form
          onSubmit={(event) => {
            void onSubmit(event)
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
                placeholder="e.g. John Doe / Supplier / Warehouse"
                {...register('partyName')}
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
              />
            </FormField>

            <FormField
              label="Transaction date"
              htmlFor="transactionDate"
              error={errors.transactionDate?.message}
            >
              <Input id="transactionDate" type="date" {...register('transactionDate')} />
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
                  disabled={branchOptions.isLoading}
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
                  disabled={warehouseOptions.isLoading}
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
                  <Input id="outsideLocationName" {...register('outsideLocationName')} />
                </FormField>

                <FormField
                  label="Outside address"
                  htmlFor="outsideAddress"
                  error={errors.outsideAddress?.message}
                  required
                >
                  <Input id="outsideAddress" {...register('outsideAddress')} />
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
                placeholder="Optional notes for this draft…"
                {...register('notes')}
              />
            </FormField>
          </div>

          <div className="flex justify-end gap-2 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              disabled={createDraft.isPending}
              onClick={() => {
                void navigate(ROUTES.transactions)
              }}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={createDraft.isPending}>
              {createDraft.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving…
                </>
              ) : (
                'Create draft'
              )}
            </Button>
          </div>
        </form>
      </div>
    </PageContainer>
  )
}
