import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { FormField } from '@/components/common/FormField'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { NormalizedApiError } from '@/lib/axios'
import { applyApiValidationErrors } from '@/utils/form-errors'
import { blankToUndefined } from '@/utils/form-values'

import type { AttendanceCorrectionInput } from '../types/attendance.types'
import {
  attendanceCorrectionSchema,
  type AttendanceCorrectionFormValues,
} from '../validation/attendance.schema'

interface AttendanceCorrectionFormProps {
  defaultValues?: Partial<AttendanceCorrectionFormValues>
  onSubmit: (values: AttendanceCorrectionInput) => void
  onCancel: () => void
  isSubmitting: boolean
  apiError?: NormalizedApiError | null
}

export function AttendanceCorrectionForm({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
  apiError,
}: AttendanceCorrectionFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<AttendanceCorrectionFormValues>({
    resolver: zodResolver(attendanceCorrectionSchema),
    defaultValues: {
      timeInAt: defaultValues?.timeInAt ?? '',
      timeOutAt: defaultValues?.timeOutAt ?? '',
      note: defaultValues?.note ?? '',
      correctionNote: defaultValues?.correctionNote ?? '',
    },
  })

  useEffect(() => {
    if (apiError) {
      applyApiValidationErrors(apiError, setError)
    }
  }, [apiError, setError])

  const submitHandler = handleSubmit((values) => {
    onSubmit({
      timeInAt: blankToUndefined(values.timeInAt),
      timeOutAt: blankToUndefined(values.timeOutAt),
      note: blankToUndefined(values.note),
      correctionNote: values.correctionNote,
    })
  })

  return (
    <form
      onSubmit={(event) => {
        void submitHandler(event)
      }}
      className="space-y-4"
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Time in" htmlFor="timeInAt" error={errors.timeInAt?.message}>
          <Input id="timeInAt" type="datetime-local" {...register('timeInAt')} />
        </FormField>
        <FormField label="Time out" htmlFor="timeOutAt" error={errors.timeOutAt?.message}>
          <Input id="timeOutAt" type="datetime-local" {...register('timeOutAt')} />
        </FormField>
        <FormField
          label="Correction note"
          htmlFor="correctionNote"
          error={errors.correctionNote?.message}
          required
          className="sm:col-span-2"
        >
          <Input id="correctionNote" {...register('correctionNote')} />
        </FormField>
        <FormField
          label="Note"
          htmlFor="note"
          error={errors.note?.message}
          className="sm:col-span-2"
        >
          <Input id="note" {...register('note')} />
        </FormField>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving…
            </>
          ) : (
            'Save correction'
          )}
        </Button>
      </div>
    </form>
  )
}
