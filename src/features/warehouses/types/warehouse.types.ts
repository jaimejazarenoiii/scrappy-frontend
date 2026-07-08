import type { BranchSummary } from '@/features/branches/types/branch.types'

export type WarehouseStatus = 'ACTIVE' | 'INACTIVE'

export interface Warehouse {
  id: string
  companyId: string
  name: string
  address: string | null
  contactNumber: string | null
  status: WarehouseStatus
  branchId: string | null
  branch?: BranchSummary | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface CreateWarehouseInput {
  name: string
  address?: string
  contactNumber?: string
  status?: WarehouseStatus
  branchId?: string
}

export type UpdateWarehouseInput = Partial<CreateWarehouseInput>
