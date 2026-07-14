/**
 * Scrappy API response envelope.
 *
 * Every backend response (success or error) is wrapped as
 * `{ success, data, meta, error }`. Paginated responses put the array in `data` and
 * pagination in `meta`. Use the helpers in `src/lib/api-envelope.ts` to unwrap.
 */

export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'RESOURCE_NOT_FOUND'
  | 'LIFECYCLE_CONFLICT'
  | 'BUSINESS_RULE_VIOLATION'
  // Allow forward-compatibility with codes not yet enumerated here.
  | (string & {})

export interface ApiErrorDetail {
  path?: string
  message: string
}

export interface ApiError {
  code: ApiErrorCode
  message: string
  details?: ApiErrorDetail[]
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

/**
 * `meta` holds pagination for list responses, optional soft warnings (e.g. trip-load),
 * or is empty for simple responses.
 */
export type ApiMeta = Partial<PaginationMeta> & Record<string, unknown>

export interface ApiEnvelope<T> {
  success: boolean
  data: T
  meta: ApiMeta
  error: ApiError | null
}

/** Normalized error thrown by the Axios layer to the app. */
export interface NormalizedApiError extends Error {
  status: number
  code?: ApiErrorCode
  details?: ApiErrorDetail[]
}
