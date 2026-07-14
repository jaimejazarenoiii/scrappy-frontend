/** Distance traveled = ending − starting when both readings exist. */
export function computeTripDistance(
  startingOdometer: number | null | undefined,
  endingOdometer: number | null | undefined,
): number | null {
  if (
    startingOdometer == null ||
    endingOdometer == null ||
    !Number.isFinite(startingOdometer) ||
    !Number.isFinite(endingOdometer)
  ) {
    return null
  }
  return endingOdometer - startingOdometer
}

export function asNullableOdometer(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

/** Prefer API `distance` when present; otherwise derive from odometer readings. */
export function resolveTripDistance(
  startingOdometer: number | null,
  endingOdometer: number | null,
  rawDistance?: unknown,
): number | null {
  const fromApi = asNullableOdometer(rawDistance)
  if (fromApi !== null) return fromApi
  return computeTripDistance(startingOdometer, endingOdometer)
}
