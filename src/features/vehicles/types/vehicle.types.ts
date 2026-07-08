import type { BranchSummary } from '@/features/branches/types/branch.types'

export type VehicleStatus = 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'INACTIVE'

export interface WarehouseSummary {
  id: string
  name: string
}

export interface Vehicle {
  id: string
  companyId: string
  plateNumber: string
  description: string | null
  vehicleType: string | null
  status: VehicleStatus
  branchId: string | null
  warehouseId: string | null
  branch?: BranchSummary | null
  warehouse?: WarehouseSummary | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface CreateVehicleInput {
  plateNumber: string
  description?: string
  status?: VehicleStatus
  vehicleType?: string
  branchId?: string
  warehouseId?: string
}

export type UpdateVehicleInput = Partial<CreateVehicleInput>
