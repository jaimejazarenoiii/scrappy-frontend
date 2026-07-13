import type { LocationType } from '../types/transaction.types'

export interface ReceiptLocationSummary {
  typeLabel: 'Branch' | 'Warehouse' | 'Outside' | 'Trip'
  /** Main place / trip identity line. */
  primary: string
  /** Extra lines: address, route, plate, etc. */
  details: string[]
}

export interface TransactionReceiptPrintExtras {
  assignedEmployeeNames: string[]
  location: ReceiptLocationSummary | null
  partyContactNumber: string | null
  notes: string | null
}

interface BuildReceiptLocationInput {
  locationType: LocationType
  branchId?: string | null
  warehouseId?: string | null
  tripId?: string | null
  outsideLocationName?: string | null
  outsideAddress?: string | null
  branch?: { name: string; address?: string | null } | null
  warehouse?: { name: string; address?: string | null } | null
  trip?: {
    tripNumber: string | null
    origin: string
    destination: string
    vehicle?: { plateNumber: string } | null
  } | null
}

export function buildReceiptLocationSummary(
  input: BuildReceiptLocationInput,
): ReceiptLocationSummary {
  switch (input.locationType) {
    case 'BRANCH': {
      const name = nonempty(input.branch?.name) ?? fallbackId(input.branchId) ?? '—'
      const details = compact([nonempty(input.branch?.address)])
      return { typeLabel: 'Branch', primary: name, details }
    }
    case 'WAREHOUSE': {
      const name = nonempty(input.warehouse?.name) ?? fallbackId(input.warehouseId) ?? '—'
      const details = compact([nonempty(input.warehouse?.address)])
      return { typeLabel: 'Warehouse', primary: name, details }
    }
    case 'OUTSIDE': {
      const primary = nonempty(input.outsideLocationName) ?? 'Outside location'
      const details = compact([nonempty(input.outsideAddress)])
      return { typeLabel: 'Outside', primary, details }
    }
    case 'TRIP': {
      const trip = input.trip
      if (!trip) {
        return {
          typeLabel: 'Trip',
          primary: input.tripId ? 'Linked trip' : '—',
          details: [],
        }
      }
      const tripNo = nonempty(trip.tripNumber)
      const route = `${trip.origin.trim()} → ${trip.destination.trim()}`
      const primary = tripNo ?? route
      const plate = nonempty(trip.vehicle?.plateNumber)
      const details = compact([tripNo ? route : null, plate ? `Plate ${plate}` : null])
      return { typeLabel: 'Trip', primary, details }
    }
  }
}

function nonempty(value: string | null | undefined): string | null {
  if (value == null) return null
  const trimmed = value.trim()
  if (trimmed.length === 0) return null
  return trimmed
}

function fallbackId(id: string | null | undefined): string | null {
  return nonempty(id)
}

function compact(values: (string | null | undefined)[]): string[] {
  return values.filter((value): value is string => Boolean(value))
}
