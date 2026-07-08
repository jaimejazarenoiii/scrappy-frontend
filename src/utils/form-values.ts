/** Returns undefined for empty/whitespace-only strings; otherwise the trimmed value. */
export function blankToUndefined(value?: string | null): string | undefined {
  if (value == null) return undefined
  const trimmed = value.trim()
  return trimmed === '' ? undefined : trimmed
}

/** Returns null for empty/whitespace-only strings; otherwise the trimmed value. */
export function blankToNull(value?: string | null): string | null {
  return blankToUndefined(value) ?? null
}
