/** Format an ISO/date string for display. Returns em dash when missing or invalid. */
export function formatDate(date: Date | string | null | undefined, locale = 'en-PH'): string {
  if (date == null || date === '') return '—'
  const value = typeof date === 'string' ? new Date(date) : date
  if (Number.isNaN(value.getTime())) return '—'
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(value)
}

/** Date + time with AM/PM (e.g. Jul 10, 2026, 2:48 PM). Date-only strings stay date-only. */
export function formatDateTime(date: Date | string | null | undefined, locale = 'en-PH'): string {
  if (date == null || date === '') return '—'
  if (typeof date === 'string') {
    const trimmed = date.trim()
    // Pure calendar dates have no clock time — don't invent midnight/AM/PM.
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return formatDate(trimmed, locale)
  }
  const value = typeof date === 'string' ? new Date(date) : date
  if (Number.isNaN(value.getTime())) return '—'
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(value)
}

/**
 * Normalize API date/datetime values for `<input type="date" />` (YYYY-MM-DD).
 * Full ISO strings like `2026-07-10T00:00:00.000Z` are invalid in date inputs and appear blank.
 */
export function toDateInputValue(value: string | null | undefined): string {
  if (!value) return ''
  const trimmed = value.trim()
  if (!trimmed) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed
  const match = /^(\d{4}-\d{2}-\d{2})/.exec(trimmed)
  if (match) return match[1]
  const parsed = new Date(trimmed)
  if (Number.isNaN(parsed.getTime())) return ''
  const year = String(parsed.getUTCFullYear())
  const month = String(parsed.getUTCMonth() + 1).padStart(2, '0')
  const day = String(parsed.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
