import { asDateString, asNullableNumber, asNullableString, asRecord, asString } from './report-api'
import type { TripReportRow } from '../types/reports.types'

export function normalizeTripReportRow(raw: unknown): TripReportRow {
  const row = asRecord(raw)
  const vehicle = asRecord(row.vehicle)
  const members = Array.isArray(row.members) ? row.members : []
  const memberNames = members
    .map((member) => asNullableString(asRecord(member).name))
    .filter((name): name is string => Boolean(name))

  return {
    id: asString(row.tripId ?? row.id),
    tripNumber: asNullableString(row.tripNumber),
    date: asDateString(row.scheduledStart ?? row.date ?? row.startedAt ?? row.actualStart),
    status: asNullableString(row.status),
    vehicleId: asNullableString(row.vehicleId ?? vehicle.id),
    vehiclePlate: asNullableString(vehicle.plateNumber ?? row.vehiclePlate ?? row.plateNumber),
    employeeId: asNullableString(row.employeeId ?? row.driverId),
    employeeName:
      memberNames.length > 0
        ? memberNames.join(', ')
        : asNullableString(row.employeeName ?? row.driverName),
    origin: asNullableString(row.origin ?? row.originLabel),
    destination: asNullableString(row.destination ?? row.destinationLabel),
    durationMinutes: asNullableNumber(row.durationMinutes ?? row.averageDurationMinutes),
  }
}
