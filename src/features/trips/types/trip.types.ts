import type {
  Direction,
  DirectionLabel,
  LocationType,
  TransactionStatus,
} from '@/features/transactions/types/transaction.types'

/** Backend P007 lifecycle statuses (no separate SCHEDULED status). */
export type TripStatus = 'DRAFT' | 'STARTED' | 'COMPLETED' | 'CANCELLED'

export type TripMemberRole = 'DRIVER' | 'HELPER' | 'BUYER' | 'SUPERVISOR'

export type TripMemberStatus = 'INVITED' | 'CONFIRMED' | 'ACTIVE' | 'REMOVED'

export interface TripVehicleSummary {
  id: string
  plateNumber: string
  description: string | null
  status: string
}

export interface TripMember {
  id: string
  tripId: string
  employeeId: string
  role: TripMemberRole
  status?: TripMemberStatus | null
  assignedAt?: string
  assignedByUserId?: string | null
}

export interface LinkedTransactionSummary {
  id: string
  transactionNumber: string | null
  direction: Direction
  directionLabel: DirectionLabel
  status: TransactionStatus
  partyName: string
  transactionDate: string
  totalAmount: number
  locationType: LocationType
}

interface TripBase {
  id: string
  companyId: string
  tripNumber: string | null
  status: TripStatus
  /** Always true per API — Trip Load feature is always available. */
  loadEnabled: boolean
  /** When true, outbound overselling is blocked (409); when false, warnings only. */
  strictLoadValidation: boolean
  origin: string
  destination: string
  scheduledStart: string | null
  actualStart: string | null
  actualEnd: string | null
  vehicleId: string | null
  vehicle: TripVehicleSummary | null
  startingOdometer: number | null
  endingOdometer: number | null
  /** ending − starting when both readings exist; may be derived client-side if API omits it. */
  distance: number | null
  notes: string | null
  cancellationReason: string | null
  cancelledAt: string | null
  cancelledByUserId: string | null
  scheduledByUserId: string | null
  startedByUserId: string | null
  completedByUserId: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface TripSummary extends TripBase {
  memberCount?: number
  linkedTransactionCount?: number
}

export interface TripDetail extends TripBase {
  members: TripMember[]
  linkedTransactions: LinkedTransactionSummary[]
}

export interface CreateTripMemberInput {
  employeeId: string
  role: TripMemberRole
}

/** `POST /trips` request body (live). */
export interface CreateTripInput {
  vehicleId: string
  scheduledStart: string
  origin: string
  destination: string
  notes?: string | null
  members?: CreateTripMemberInput[]
}

/** `PATCH /trips/{tripId}` request body (planned). */
export interface UpdateTripInput {
  origin?: string
  destination?: string
  scheduledStart?: string
  vehicleId?: string
  notes?: string | null
}

export interface StartTripInput {
  startingOdometer?: number
}

export interface CompleteTripInput {
  endingOdometer?: number
}

export interface CancelTripInput {
  cancellationReason?: string
}

export interface AssignMemberInput {
  employeeId: string
  role: TripMemberRole
}

export interface AssignMembersInput {
  employeeIds: string[]
}

export interface AssignVehicleInput {
  vehicleId: string
}

export interface LinkTransactionInput {
  transactionId: string
}

export interface TripTimelineEvent {
  id: string
  action: string
  actionLabel: string
  actorUserId: string | null
  actorDisplayName: string | null
  occurredAt: string
  notes: string | null
}

/** `GET /trips/dashboard` — counts are company-scoped, non-archived. */
export interface TripDashboardSummary {
  /** DRAFT trips with scheduledStart today or in the past. */
  draftCount?: number
  /** DRAFT trips with scheduledStart in the future. */
  scheduledCount?: number
  startedCount?: number
  completedCount?: number
  cancelledCount?: number
}
