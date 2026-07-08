/**
 * Transaction Management (Backend P004) types.
 *
 * Reference scaffolding for a later frontend specification. Not yet wired into UI, but the
 * shapes and enums here mirror the API contract so services/hooks/pages can be added without
 * redefining types.
 */

export type Direction = 'INBOUND' | 'OUTBOUND'
export type DirectionLabel = 'BUY' | 'SELL'
/** Accepted on create/update — the API normalizes to `Direction`. */
export type DirectionInput = Direction | DirectionLabel

export type TransactionStatus = 'DRAFT' | 'CANCELLED'
export type LocationType = 'BRANCH' | 'WAREHOUSE' | 'OUTSIDE'
export type ItemUnit = 'KG' | 'G' | 'TON' | 'LB' | 'PIECE' | 'BUNDLE' | 'SACK'
export type AttachmentType = 'PHOTO'

export interface TransactionItem {
  id: string
  transactionId: string
  materialName: string
  weight: number
  unit: ItemUnit
  price: number
  /** Server-computed as weight × price (2 dp). */
  total: number
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface TransactionAttachment {
  id: string
  transactionId: string
  attachmentType: AttachmentType
  fileName: string
  filePath: string
  mimeType: string
  fileSize: number
  uploadedByUserId: string
  /** API-provided path for fetching bytes; append `?access_token=` for `<img>` usage. */
  downloadUrl: string
  createdAt: string
}

export interface TransactionAssignment {
  employeeId: string
  assignedAt: string
}

interface TransactionBase {
  id: string
  companyId: string
  createdByUserId: string
  updatedByUserId: string | null
  direction: Direction
  directionLabel: DirectionLabel
  status: TransactionStatus
  partyName: string
  partyContactNumber: string | null
  transactionDate: string
  locationType: LocationType
  branchId: string | null
  warehouseId: string | null
  outsideLocationName: string | null
  outsideAddress: string | null
  tripId: string | null
  notes: string | null
  cancellationReason: string | null
  cancelledAt: string | null
  createdAt: string
  updatedAt: string
  /** Non-null = archived (soft delete). */
  deletedAt: string | null
  totalAmount: number
  assignedEmployeeIds: string[]
}

/** Returned by create/get/update/cancel/archive. */
export interface TransactionDetail extends TransactionBase {
  assignments: TransactionAssignment[]
  items: TransactionItem[]
  attachments: TransactionAttachment[]
}

/** Returned by list endpoints (no items/attachments arrays). */
export interface TransactionSummary extends TransactionBase {
  itemCount: number
}

export interface CreateTransactionItemInput {
  materialName: string
  weight: number
  unit: ItemUnit
  price: number
  notes?: string
}

export type UpdateTransactionItemInput = Partial<CreateTransactionItemInput>

export interface CreateTransactionInput {
  direction: DirectionInput
  partyName: string
  partyContactNumber?: string
  transactionDate?: string
  locationType: LocationType
  branchId?: string
  warehouseId?: string
  outsideLocationName?: string
  outsideAddress?: string
  tripId?: string
  notes?: string
  assignedEmployeeIds: string[]
  items: CreateTransactionItemInput[]
}

/** Partial auto-save update; nullable fields accept null. Empty body is rejected by the API. */
export type UpdateTransactionInput = Partial<
  Omit<CreateTransactionInput, 'items'> & {
    partyContactNumber: string | null
    transactionDate: string | null
    branchId: string | null
    warehouseId: string | null
    outsideLocationName: string | null
    outsideAddress: string | null
    tripId: string | null
    notes: string | null
  }
>

export interface CancelTransactionInput {
  cancellationReason?: string
}

export interface TransactionListParams {
  page?: number
  limit?: number
  sortBy?: 'transactionDate' | 'createdAt' | 'status'
  sortOrder?: 'asc' | 'desc'
  search?: string
  direction?: Direction
  status?: TransactionStatus
  locationType?: LocationType
  branchId?: string
  warehouseId?: string
  fromDate?: string
  toDate?: string
  includeArchived?: boolean
}

export interface MaterialSuggestion {
  materialName: string
  lastUsedAt: string
  usageCount: number
}

export interface PriceSuggestion {
  price: number
  lastUsedAt: string
}
