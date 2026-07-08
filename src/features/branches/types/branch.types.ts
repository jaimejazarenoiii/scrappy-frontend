export type BranchStatus = 'ACTIVE' | 'INACTIVE'

export interface Branch {
  id: string
  companyId: string
  name: string
  address: string | null
  contactNumber: string | null
  status: BranchStatus
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface CreateBranchInput {
  name: string
  address?: string
  contactNumber?: string
  status?: BranchStatus
}

export type UpdateBranchInput = Partial<CreateBranchInput>

export interface BranchSummary {
  id: string
  name: string
}
