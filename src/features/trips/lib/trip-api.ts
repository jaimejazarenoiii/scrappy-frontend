import type { ListQueryParams } from '@/types/pagination.types'

import type {
  CreateTripInput,
  CreateTripMemberInput,
  TripDetail,
  TripMember,
  TripMemberRole,
  TripStatus,
  TripSummary,
  TripVehicleSummary,
  UpdateTripInput,
} from '../types/trip.types'
import { asNullableOdometer, resolveTripDistance } from './trip-odometer'

/** Raw list row shape from `GET /trips` (Backend P007). */
export interface TripSummaryApi {
  id: string
  companyId: string
  tripNumber: string | null
  status: string
  scheduledStart: string | null
  actualStart: string | null
  actualEnd: string | null
  origin: string
  destination: string
  notes: string | null
  /** Present on list/detail after start; Decimal may arrive as string. */
  startingOdometer?: number | string | null
  /** Present on list/detail after complete; Decimal may arrive as string. */
  endingOdometer?: number | string | null
  /** Computed as ending − starting when both readings exist (may be omitted). */
  distance?: number | string | null
  vehicle: TripVehicleSummary | null
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
  memberCount?: number
  loadEnabled?: boolean
  strictLoadValidation?: boolean
}

export interface TripMemberApi {
  id: string
  tripId?: string
  employeeId: string
  role: string
  status?: string | null
  assignedAt?: string
  assignedByUserId?: string | null
}

/** Accepts legacy `*At` field names until all endpoints are aligned. */
export type TripDetailApi = TripSummaryApi &
  Partial<{
    scheduledStartAt: string | null
    actualStartAt: string | null
    actualCompletedAt: string | null
    actualEndAt: string | null
    vehicleId: string | null
    cancellationReason: string | null
    cancelledAt: string | null
    cancelledByUserId: string | null
    scheduledByUserId: string | null
    startedByUserId: string | null
    completedByUserId: string | null
    members: TripMemberApi[]
    linkedTransactions: TripDetail['linkedTransactions']
  }>

const TRIP_STATUSES: TripStatus[] = ['DRAFT', 'STARTED', 'COMPLETED', 'CANCELLED']
const TRIP_MEMBER_ROLES: TripMemberRole[] = ['DRIVER', 'HELPER', 'BUYER', 'SUPERVISOR']

export function normalizeTripStatus(status: string): TripStatus {
  if ((TRIP_STATUSES as string[]).includes(status)) {
    return status as TripStatus
  }
  if (status === 'SCHEDULED') {
    return 'DRAFT'
  }
  return 'DRAFT'
}

export function normalizeTripMemberRole(role: string): TripMemberRole {
  if ((TRIP_MEMBER_ROLES as string[]).includes(role)) {
    return role as TripMemberRole
  }
  return 'HELPER'
}

export function normalizeTripMember(raw: TripMemberApi, tripId = ''): TripMember {
  return {
    id: raw.id,
    tripId: raw.tripId ?? tripId,
    employeeId: raw.employeeId,
    role: normalizeTripMemberRole(raw.role),
    status: raw.status as TripMember['status'],
    assignedAt: raw.assignedAt,
    assignedByUserId: raw.assignedByUserId ?? null,
  }
}

function pickScheduledStart(raw: TripSummaryApi): string | null {
  return raw.scheduledStart ?? (raw as TripDetailApi).scheduledStartAt ?? null
}

function pickActualStart(raw: TripSummaryApi): string | null {
  return raw.actualStart ?? (raw as TripDetailApi).actualStartAt ?? null
}

function pickActualEnd(raw: TripSummaryApi): string | null {
  return (
    raw.actualEnd ??
    (raw as TripDetailApi).actualEnd ??
    (raw as TripDetailApi).actualCompletedAt ??
    null
  )
}

function asNullableNumber(value: unknown): number | null {
  return asNullableOdometer(value)
}

export function normalizeTripSummary(raw: TripSummaryApi): TripSummary {
  const vehicle = raw.vehicle ?? null
  const detail = raw as TripDetailApi
  const startingOdometer = asNullableNumber(raw.startingOdometer ?? detail.startingOdometer)
  const endingOdometer = asNullableNumber(raw.endingOdometer ?? detail.endingOdometer)

  return {
    id: raw.id,
    companyId: raw.companyId,
    tripNumber: raw.tripNumber,
    status: normalizeTripStatus(raw.status),
    origin: raw.origin,
    destination: raw.destination,
    scheduledStart: pickScheduledStart(raw),
    actualStart: pickActualStart(raw),
    actualEnd: pickActualEnd(raw),
    vehicleId: vehicle?.id ?? detail.vehicleId ?? null,
    vehicle,
    startingOdometer,
    endingOdometer,
    distance: resolveTripDistance(
      startingOdometer,
      endingOdometer,
      raw.distance ?? detail.distance,
    ),
    notes: raw.notes,
    cancellationReason: detail.cancellationReason ?? null,
    cancelledAt: detail.cancelledAt ?? null,
    cancelledByUserId: detail.cancelledByUserId ?? null,
    scheduledByUserId: detail.scheduledByUserId ?? null,
    startedByUserId: detail.startedByUserId ?? null,
    completedByUserId: detail.completedByUserId ?? null,
    loadEnabled: raw.loadEnabled !== false,
    strictLoadValidation: raw.strictLoadValidation === true,
    createdAt: raw.createdAt ?? new Date(0).toISOString(),
    updatedAt: raw.updatedAt ?? raw.createdAt ?? new Date(0).toISOString(),
    deletedAt: raw.deletedAt ?? null,
    memberCount: raw.memberCount,
  }
}

export function normalizeTripDetail(raw: TripDetailApi): TripDetail {
  const summary = normalizeTripSummary(raw)

  return {
    ...summary,
    members: (raw.members ?? []).map((member) => normalizeTripMember(member, summary.id)),
    linkedTransactions: raw.linkedTransactions ?? [],
  }
}

const SORT_FIELD_ALIASES: Record<string, string> = {
  scheduledStartAt: 'scheduledStart',
  scheduledStart: 'scheduledStart',
  createdAt: 'createdAt',
  tripNumber: 'tripNumber',
}

/** Maps list UI params to `GET /trips` query params. */
export function toTripListQueryParams(params: ListQueryParams): Record<string, string | number> {
  const query: Record<string, string | number> = {
    page: params.page,
    limit: params.pageSize,
  }

  if (params.search) {
    query.tripNumber = params.search
  }

  if (params.sort) {
    query.sortBy = SORT_FIELD_ALIASES[params.sort.field] ?? params.sort.field
    query.sortOrder = params.sort.direction
  }

  if (params.filters) {
    for (const [key, value] of Object.entries(params.filters)) {
      if (value) {
        query[key] = value
      }
    }
  }

  return query
}

/** Maps `POST /trips` body to the live API contract. */
export function toTripCreateBody(input: CreateTripInput): Record<string, unknown> {
  const body: Record<string, unknown> = {
    vehicleId: input.vehicleId,
    scheduledStart: input.scheduledStart,
    origin: input.origin,
    destination: input.destination,
  }

  if (input.notes) {
    body.notes = input.notes
  }

  if (input.members?.length) {
    body.members = input.members.map((member: CreateTripMemberInput) => ({
      employeeId: member.employeeId,
      role: member.role,
    }))
  }

  return body
}

/** Maps `PATCH /trips/{tripId}` body (planned endpoint). */
export function toTripUpdateBody(input: UpdateTripInput): Record<string, unknown> {
  const body: Record<string, unknown> = {}

  if (input.origin !== undefined) body.origin = input.origin
  if (input.destination !== undefined) body.destination = input.destination
  if (input.scheduledStart !== undefined) body.scheduledStart = input.scheduledStart
  if (input.vehicleId !== undefined) body.vehicleId = input.vehicleId
  if (input.notes !== undefined) body.notes = input.notes

  return body
}
