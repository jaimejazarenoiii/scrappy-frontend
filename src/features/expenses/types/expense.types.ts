export type ExpenseStatus = 'ACTIVE' | 'ARCHIVED'

export type ExpenseReferenceType = 'COMPANY' | 'BRANCH' | 'WAREHOUSE' | 'VEHICLE' | 'TRIP'

/** Category name from `GET /expenses/categories` (string catalog). */
export type ExpenseCategoryName = string

export interface ExpenseReferenceSnapshot {
  type: ExpenseReferenceType
  id: string
  label: string
  metadata?: Record<string, unknown> | null
}

export interface ExpenseAttachment {
  id: string
  expenseId: string
  attachmentType: string
  fileName: string
  mimeType: string
  fileSize: number
  uploadedByUserId: string
  downloadUrl: string
  createdAt: string
}

interface ExpenseBase {
  id: string
  companyId: string
  expenseNumber: string | null
  status: ExpenseStatus
  category: string | null
  referenceType: ExpenseReferenceType
  referenceId: string | null
  referenceLabel: string | null
  description: string
  amount: number
  expenseDate: string
  notes: string | null
  receiptCount: number | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export type ExpenseSummary = ExpenseBase

/** Read-only row from GET /reports/expenses (field is `date`, not `expenseDate`). */
export interface ExpenseReportRow {
  id: string
  date: string
  description: string
  amount: number
  category: string | null
  expenseNumber: string | null
  referenceType: ExpenseReferenceType | null
  referenceId: string | null
  referenceLabel: string | null
  status: ExpenseStatus | null
  notes: string | null
  branchId: string | null
  warehouseId: string | null
  vehicleId: string | null
  employeeId: string | null
  tripId: string | null
}

export interface ExpenseReportListResponse {
  data: ExpenseReportRow[]
  total: number
  page: number
  pageSize: number
  generatedAt?: string
  appliedCriteria?: Record<string, unknown>
}

export interface ExpenseDetail extends ExpenseBase {
  reference: ExpenseReferenceSnapshot | null
  attachments: ExpenseAttachment[]
  createdByUserId: string | null
  updatedByUserId: string | null
}

export interface CreateExpenseInput {
  category: string
  referenceType: ExpenseReferenceType
  referenceId?: string | null
  description: string
  amount: number
  expenseDate: string
  notes?: string | null
}

export type UpdateExpenseInput = Partial<CreateExpenseInput>

export interface ExpenseDashboardSummary {
  totalAmount?: number | null
  expenseCount?: number | null
  byCategory?: {
    category: string
    amount: number
    count: number
  }[]
  byStatus?: { status: string; count: number }[]
  recentExpenses?: ExpenseSummary[]
}
