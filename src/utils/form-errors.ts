import type { FieldPath, FieldValues, UseFormSetError } from 'react-hook-form'

import type { NormalizedApiError } from '@/lib/axios'

/** Maps API `VALIDATION_ERROR` details to React Hook Form field errors. Returns true if mapped. */
export function applyApiValidationErrors<T extends FieldValues>(
  error: NormalizedApiError,
  setError: UseFormSetError<T>,
): boolean {
  if (error.code !== 'VALIDATION_ERROR' || !error.details?.length) return false

  for (const detail of error.details) {
    if (detail.path) {
      setError(detail.path as FieldPath<T>, { message: detail.message })
    }
  }

  return true
}
