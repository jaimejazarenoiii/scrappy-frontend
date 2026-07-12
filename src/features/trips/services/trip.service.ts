import { apiClient } from '@/lib/axios'
import { unwrap, unwrapList } from '@/lib/api-envelope'
import { toQueryParams } from '@/lib/list-params'
import type { ApiEnvelope } from '@/types/api.types'
import type { ListQueryParams, PaginatedResponse } from '@/types/pagination.types'

import {
  normalizeTripDetail,
  normalizeTripSummary,
  toTripCreateBody,
  toTripListQueryParams,
  toTripUpdateBody,
  type TripDetailApi,
  type TripSummaryApi,
} from '../lib/trip-api'

import type {
  AssignMembersInput,
  AssignVehicleInput,
  CancelTripInput,
  CompleteTripInput,
  CreateTripInput,
  LinkTransactionInput,
  LinkedTransactionSummary,
  StartTripInput,
  TripDashboardSummary,
  TripDetail,
  TripMember,
  TripSummary,
  TripTimelineEvent,
  UpdateTripInput,
} from '../types/trip.types'

export const TRIP_ENDPOINTS = {
  base: '/trips',
  dashboard: '/trips/dashboard',
  detail: (tripId: string) => `/trips/${tripId}`,
  mine: '/trips/mine',
  start: (tripId: string) => `/trips/${tripId}/start`,
  complete: (tripId: string) => `/trips/${tripId}/complete`,
  cancel: (tripId: string) => `/trips/${tripId}/cancel`,
  archive: (tripId: string) => `/trips/${tripId}/archive`,
  members: (tripId: string) => `/trips/${tripId}/members`,
  member: (tripId: string, memberId: string) => `/trips/${tripId}/members/${memberId}`,
  vehicle: (tripId: string) => `/trips/${tripId}/vehicle`,
  transactions: (tripId: string) => `/trips/${tripId}/transactions`,
  linkableTransactions: (tripId: string) => `/trips/${tripId}/transactions/linkable`,
  transaction: (tripId: string, transactionId: string) =>
    `/trips/${tripId}/transactions/${transactionId}`,
  history: (tripId: string) => `/trips/${tripId}/history`,
} as const

export const TripService = {
  async list(params: ListQueryParams): Promise<PaginatedResponse<TripSummary>> {
    const response = await apiClient.get<ApiEnvelope<TripSummaryApi[]>>(TRIP_ENDPOINTS.base, {
      params: toTripListQueryParams(params),
    })
    const page = unwrapList(response)
    return {
      ...page,
      data: page.data.map(normalizeTripSummary),
    }
  },

  async get(tripId: string): Promise<TripDetail> {
    const response = await apiClient.get<ApiEnvelope<TripDetailApi>>(TRIP_ENDPOINTS.detail(tripId))
    return normalizeTripDetail(unwrap(response))
  },

  async create(input: CreateTripInput): Promise<TripDetail> {
    const response = await apiClient.post<ApiEnvelope<TripDetailApi>>(
      TRIP_ENDPOINTS.base,
      toTripCreateBody(input),
    )
    return normalizeTripDetail(unwrap(response))
  },

  async update(tripId: string, input: UpdateTripInput): Promise<TripDetail> {
    const response = await apiClient.patch<ApiEnvelope<TripDetailApi>>(
      TRIP_ENDPOINTS.detail(tripId),
      toTripUpdateBody(input),
    )
    return normalizeTripDetail(unwrap(response))
  },

  async start(tripId: string, input?: StartTripInput): Promise<TripDetail> {
    const response = await apiClient.post<ApiEnvelope<TripDetailApi>>(
      TRIP_ENDPOINTS.start(tripId),
      input ?? {},
    )
    return normalizeTripDetail(unwrap(response))
  },

  async complete(tripId: string, input?: CompleteTripInput): Promise<TripDetail> {
    const response = await apiClient.post<ApiEnvelope<TripDetailApi>>(
      TRIP_ENDPOINTS.complete(tripId),
      input ?? {},
    )
    return normalizeTripDetail(unwrap(response))
  },

  async cancel(tripId: string, input?: CancelTripInput): Promise<TripDetail> {
    const response = await apiClient.post<ApiEnvelope<TripDetailApi>>(
      TRIP_ENDPOINTS.cancel(tripId),
      input ?? {},
    )
    return normalizeTripDetail(unwrap(response))
  },

  async archive(tripId: string): Promise<TripDetail> {
    const response = await apiClient.post<ApiEnvelope<TripDetailApi>>(
      TRIP_ENDPOINTS.archive(tripId),
    )
    return normalizeTripDetail(unwrap(response))
  },

  async getDashboard(): Promise<TripDashboardSummary> {
    const response = await apiClient.get<ApiEnvelope<TripDashboardSummary>>(
      TRIP_ENDPOINTS.dashboard,
    )
    return unwrap(response)
  },

  async listMembers(tripId: string): Promise<TripMember[]> {
    const response = await apiClient.get<ApiEnvelope<TripMember[]>>(TRIP_ENDPOINTS.members(tripId))
    return unwrap(response)
  },

  async addMembers(tripId: string, input: AssignMembersInput): Promise<TripMember[]> {
    const response = await apiClient.post<ApiEnvelope<TripMember[]>>(
      TRIP_ENDPOINTS.members(tripId),
      input,
    )
    return unwrap(response)
  },

  async removeMember(tripId: string, memberId: string): Promise<void> {
    await apiClient.delete(TRIP_ENDPOINTS.member(tripId, memberId))
  },

  async assignVehicle(tripId: string, input: AssignVehicleInput): Promise<TripDetail> {
    const response = await apiClient.put<ApiEnvelope<TripDetailApi>>(
      TRIP_ENDPOINTS.vehicle(tripId),
      input,
    )
    return normalizeTripDetail(unwrap(response))
  },

  async listLinkedTransactions(tripId: string): Promise<LinkedTransactionSummary[]> {
    const response = await apiClient.get<ApiEnvelope<LinkedTransactionSummary[]>>(
      TRIP_ENDPOINTS.transactions(tripId),
    )
    return unwrap(response)
  },

  async searchLinkableTransactions(
    tripId: string,
    params: ListQueryParams,
  ): Promise<PaginatedResponse<LinkedTransactionSummary>> {
    const response = await apiClient.get<ApiEnvelope<LinkedTransactionSummary[]>>(
      TRIP_ENDPOINTS.linkableTransactions(tripId),
      { params: toQueryParams(params) },
    )
    return unwrapList(response)
  },

  async linkTransaction(tripId: string, input: LinkTransactionInput): Promise<TripDetail> {
    const response = await apiClient.post<ApiEnvelope<TripDetailApi>>(
      TRIP_ENDPOINTS.transactions(tripId),
      input,
    )
    return normalizeTripDetail(unwrap(response))
  },

  async unlinkTransaction(tripId: string, transactionId: string): Promise<void> {
    await apiClient.delete(TRIP_ENDPOINTS.transaction(tripId, transactionId))
  },

  async getHistory(tripId: string): Promise<TripTimelineEvent[]> {
    const response = await apiClient.get<ApiEnvelope<TripTimelineEvent[]>>(
      TRIP_ENDPOINTS.history(tripId),
    )
    return unwrap(response)
  },
}
