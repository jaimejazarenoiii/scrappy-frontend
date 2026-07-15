import { apiClient } from '@/lib/axios'
import { unwrap, unwrapList } from '@/lib/api-envelope'
import type { ApiEnvelope } from '@/types/api.types'
import type { ListQueryParams, PaginatedResponse } from '@/types/pagination.types'

import {
  normalizeExpenseDetail,
  normalizeExpenseSummary,
  normalizeExpenseCategoryList,
  toExpenseCreateBody,
  toExpenseListQueryParams,
  toExpenseUpdateBody,
  type ExpenseDetailApi,
  type ExpenseSummaryApi,
} from '../lib/expense-api'
import {
  normalizeExpenseReportRow,
  parseExpenseReportMeta,
  toExpenseReportQueryParams,
  type ExpenseReportQueryParams,
  type ExpenseReportRowApi,
} from '../lib/expense-report-api'

import type {
  CreateExpenseInput,
  ExpenseAttachment,
  ExpenseDashboardSummary,
  ExpenseDetail,
  ExpenseReportListResponse,
  ExpenseSummary,
  UpdateExpenseInput,
} from '../types/expense.types'

export const EXPENSE_ENDPOINTS = {
  base: '/expenses',
  report: '/reports/expenses',
  dashboard: '/expenses/dashboard',
  categories: '/expenses/categories',
  detail: (expenseId: string) => `/expenses/${expenseId}`,
  archive: (expenseId: string) => `/expenses/${expenseId}/archive`,
  attachments: (expenseId: string) => `/expenses/${expenseId}/attachments`,
  attachment: (expenseId: string, attachmentId: string) =>
    `/expenses/${expenseId}/attachments/${attachmentId}`,
} as const

export const ExpenseService = {
  /** @deprecated Spec 010 — use ReportService.listExpenses. Kept for transitional callers. */
  async listReport(
    params: ExpenseReportQueryParams & {
      sort?: ListQueryParams['sort']
      filters?: ListQueryParams['filters']
    },
  ): Promise<ExpenseReportListResponse> {
    const response = await apiClient.get<ApiEnvelope<ExpenseReportRowApi[]>>(
      EXPENSE_ENDPOINTS.report,
      {
        params: toExpenseReportQueryParams(params),
      },
    )
    const page = unwrapList(response)
    const reportMeta = parseExpenseReportMeta(response.data.meta)
    return {
      ...page,
      ...reportMeta,
      data: page.data.map(normalizeExpenseReportRow),
    }
  },

  async list(params: ListQueryParams): Promise<PaginatedResponse<ExpenseSummary>> {
    const response = await apiClient.get<ApiEnvelope<ExpenseSummaryApi[]>>(EXPENSE_ENDPOINTS.base, {
      params: toExpenseListQueryParams(params),
    })
    const page = unwrapList(response)
    return {
      ...page,
      data: page.data.map(normalizeExpenseSummary),
    }
  },

  async get(expenseId: string): Promise<ExpenseDetail> {
    const response = await apiClient.get<ApiEnvelope<ExpenseDetailApi>>(
      EXPENSE_ENDPOINTS.detail(expenseId),
    )
    return normalizeExpenseDetail(unwrap(response))
  },

  async create(input: CreateExpenseInput): Promise<ExpenseDetail> {
    const response = await apiClient.post<ApiEnvelope<ExpenseDetailApi>>(
      EXPENSE_ENDPOINTS.base,
      toExpenseCreateBody(input),
    )
    return normalizeExpenseDetail(unwrap(response))
  },

  async update(expenseId: string, input: UpdateExpenseInput): Promise<ExpenseDetail> {
    const response = await apiClient.patch<ApiEnvelope<ExpenseDetailApi>>(
      EXPENSE_ENDPOINTS.detail(expenseId),
      toExpenseUpdateBody(input),
    )
    return normalizeExpenseDetail(unwrap(response))
  },

  async delete(expenseId: string): Promise<void> {
    await apiClient.delete(EXPENSE_ENDPOINTS.detail(expenseId))
  },

  async archive(expenseId: string): Promise<ExpenseDetail> {
    const response = await apiClient.post<ApiEnvelope<ExpenseDetailApi>>(
      EXPENSE_ENDPOINTS.archive(expenseId),
    )
    return normalizeExpenseDetail(unwrap(response))
  },

  async listCategories(): Promise<string[]> {
    const response = await apiClient.get<ApiEnvelope<unknown>>(EXPENSE_ENDPOINTS.categories)
    return normalizeExpenseCategoryList(unwrap(response))
  },

  async getDashboard(): Promise<ExpenseDashboardSummary> {
    const response = await apiClient.get<ApiEnvelope<ExpenseDashboardSummary>>(
      EXPENSE_ENDPOINTS.dashboard,
    )
    return unwrap(response)
  },

  async listAttachments(expenseId: string): Promise<ExpenseAttachment[]> {
    const response = await apiClient.get<ApiEnvelope<ExpenseAttachment[]>>(
      EXPENSE_ENDPOINTS.attachments(expenseId),
    )
    return unwrap(response)
  },

  async uploadAttachment(
    expenseId: string,
    file: File,
    onProgress?: (percent: number) => void,
  ): Promise<ExpenseAttachment> {
    const form = new FormData()
    form.append('file', file, file.name)
    const response = await apiClient.post<ApiEnvelope<ExpenseAttachment>>(
      EXPENSE_ENDPOINTS.attachments(expenseId),
      form,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event) => {
          if (event.total) {
            onProgress?.(Math.round((event.loaded * 100) / event.total))
          }
        },
      },
    )
    return unwrap(response)
  },

  async deleteAttachment(expenseId: string, attachmentId: string): Promise<{ deleted: true }> {
    // API returns 204 No Content on success.
    await apiClient.delete(EXPENSE_ENDPOINTS.attachment(expenseId, attachmentId))
    return { deleted: true }
  },
}
