import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useAuthStore } from '@/store/auth.store'
import type { NormalizedApiError } from '@/lib/axios'
import { applyApiValidationErrors } from '@/utils/form-errors'

import {
  EXPENSE_REFERENCE_TYPE_OPTIONS,
  expenseReferenceTypeLabel,
  referenceTypeRequiresEntityId,
} from '../lib/expense-reference'
import { ExpenseReferencePicker } from './ExpenseReferencePicker'
import { ExpenseCategorySelect } from './ExpenseCategorySelect'
import { expenseSchema, type ExpenseFormValues } from '../validation/expense.schema'
import type { ExpenseReferenceType } from '../types/expense.types'

interface ExpenseFormProps {
  mode: 'create' | 'edit'
  defaultValues?: Partial<ExpenseFormValues>
  onSubmit: (values: ExpenseFormValues) => void
  onCancel: () => void
  isSubmitting: boolean
  apiError?: NormalizedApiError | null
}

/** Map API field paths to form field names used by ExpenseForm. */
const EXPENSE_API_FIELD_ALIASES: Record<string, keyof ExpenseFormValues> = {
  contextType: 'referenceType',
  tripId: 'referenceId',
  branchId: 'referenceId',
  warehouseId: 'referenceId',
  vehicleId: 'referenceId',
}

function toDateInputValue(value: string | undefined): string {
  if (!value) return ''
  return value.length >= 10 ? value.slice(0, 10) : value
}

function remapExpenseApiError(error: NormalizedApiError): NormalizedApiError {
  if (!error.details?.length) return error
  return {
    ...error,
    details: error.details.map((detail) => ({
      ...detail,
      path: detail.path ? (EXPENSE_API_FIELD_ALIASES[detail.path] ?? detail.path) : detail.path,
    })),
  }
}

export function ExpenseForm({
  mode,
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
  apiError,
}: ExpenseFormProps) {
  const tenant = useAuthStore((state) => state.tenant)

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      category: defaultValues?.category ?? '',
      referenceType: defaultValues?.referenceType ?? 'BRANCH',
      referenceId: defaultValues?.referenceId ?? '',
      description: defaultValues?.description ?? '',
      amount: defaultValues?.amount ?? undefined,
      expenseDate: toDateInputValue(defaultValues?.expenseDate),
      notes: defaultValues?.notes ?? '',
    },
  })

  const referenceType = watch('referenceType')

  useEffect(() => {
    if (apiError) {
      applyApiValidationErrors(remapExpenseApiError(apiError), setError)
    }
  }, [apiError, setError])

  useEffect(() => {
    setValue('referenceId', '')
    if (referenceType === 'COMPANY' && tenant?.companyId) {
      setValue('referenceId', tenant.companyId)
    }
  }, [referenceType, setValue, tenant?.companyId])

  return (
    <form
      onSubmit={(event) => {
        void handleSubmit(onSubmit)(event)
      }}
      className="space-y-6"
      noValidate
    >
      <Controller
        name="category"
        control={control}
        render={({ field }) => (
          <ExpenseCategorySelect
            value={field.value}
            onChange={field.onChange}
            disabled={isSubmitting}
            error={errors.category?.message}
          />
        )}
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          label="Reference type"
          htmlFor="referenceType"
          error={errors.referenceType?.message}
          required
        >
          <Select
            id="referenceType"
            aria-invalid={Boolean(errors.referenceType)}
            disabled={isSubmitting}
            {...register('referenceType')}
            onChange={(event) => {
              const nextType = event.target.value as ExpenseReferenceType
              setValue('referenceType', nextType)
              setValue('referenceId', nextType === 'COMPANY' ? (tenant?.companyId ?? '') : '')
            }}
          >
            {EXPENSE_REFERENCE_TYPE_OPTIONS.map((type) => (
              <option key={type} value={type}>
                {expenseReferenceTypeLabel(type)}
              </option>
            ))}
          </Select>
        </FormField>

        <div className="sm:col-span-2">
          <Controller
            name="referenceId"
            control={control}
            render={({ field }) => (
              <ExpenseReferencePicker
                referenceType={referenceType}
                referenceId={field.value ?? ''}
                onReferenceIdChange={field.onChange}
                disabled={isSubmitting || !referenceTypeRequiresEntityId(referenceType)}
                error={errors.referenceId?.message}
              />
            )}
          />
        </div>

        <FormField
          label="Description"
          htmlFor="description"
          error={errors.description?.message}
          required
        >
          <Input
            id="description"
            aria-invalid={Boolean(errors.description)}
            disabled={isSubmitting}
            {...register('description')}
          />
        </FormField>

        <FormField label="Amount" htmlFor="amount" error={errors.amount?.message} required>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            aria-invalid={Boolean(errors.amount)}
            disabled={isSubmitting}
            {...register('amount')}
          />
        </FormField>

        <FormField
          label="Expense date"
          htmlFor="expenseDate"
          error={errors.expenseDate?.message}
          required
        >
          <Input
            id="expenseDate"
            type="date"
            aria-invalid={Boolean(errors.expenseDate)}
            disabled={isSubmitting}
            {...register('expenseDate')}
          />
        </FormField>

        <div className="sm:col-span-2">
          <FormField label="Notes" htmlFor="notes" error={errors.notes?.message}>
            <Textarea
              id="notes"
              rows={3}
              aria-invalid={Boolean(errors.notes)}
              disabled={isSubmitting}
              {...register('notes')}
            />
          </FormField>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" disabled={isSubmitting} onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
          {mode === 'create' ? 'Create expense' : 'Save changes'}
        </Button>
      </div>
    </form>
  )
}
