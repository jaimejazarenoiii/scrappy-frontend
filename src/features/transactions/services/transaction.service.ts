import { apiClient } from '@/lib/axios'
import { unwrap, unwrapList } from '@/lib/api-envelope'
import type { ApiEnvelope } from '@/types/api.types'
import type { PaginatedResponse } from '@/types/pagination.types'

import type {
  CancelTransactionInput,
  CreateTransactionInput,
  CreateTransactionItemInput,
  MaterialSuggestion,
  PriceSuggestion,
  TransactionAttachment,
  TransactionDetail,
  TransactionItem,
  TransactionListParams,
  TransactionSummary,
  UpdateTransactionInput,
  UpdateTransactionItemInput,
} from '../types/transaction.types'

const BASE = '/transactions'

/** Endpoint paths for the Transaction Management module (Backend P004). */
export const TRANSACTION_ENDPOINTS = {
  base: BASE,
  assigned: `${BASE}/assigned`,
  detail: (id: string) => `${BASE}/${id}`,
  cancel: (id: string) => `${BASE}/${id}/cancel`,
  archive: (id: string) => `${BASE}/${id}/archive`,
  items: (id: string) => `${BASE}/${id}/items`,
  item: (id: string, itemId: string) => `${BASE}/${id}/items/${itemId}`,
  attachments: (id: string) => `${BASE}/${id}/attachments`,
  attachment: (id: string, attachmentId: string) => `${BASE}/${id}/attachments/${attachmentId}`,
  attachmentContent: (id: string, attachmentId: string) =>
    `${BASE}/${id}/attachments/${attachmentId}/content`,
  materialSuggestions: `${BASE}/suggestions/materials`,
  priceSuggestions: `${BASE}/suggestions/prices`,
} as const

/**
 * Transaction Management service (reference scaffolding for a later spec).
 * All calls are tenant-scoped by the backend via the access token.
 */
export const TransactionService = {
  async list(params: TransactionListParams = {}): Promise<PaginatedResponse<TransactionSummary>> {
    const response = await apiClient.get<ApiEnvelope<TransactionSummary[]>>(
      TRANSACTION_ENDPOINTS.base,
      { params },
    )
    return unwrapList(response)
  },

  async listAssigned(
    params: TransactionListParams = {},
  ): Promise<PaginatedResponse<TransactionSummary>> {
    const response = await apiClient.get<ApiEnvelope<TransactionSummary[]>>(
      TRANSACTION_ENDPOINTS.assigned,
      { params },
    )
    return unwrapList(response)
  },

  async get(id: string): Promise<TransactionDetail> {
    const response = await apiClient.get<ApiEnvelope<TransactionDetail>>(
      TRANSACTION_ENDPOINTS.detail(id),
    )
    return unwrap(response)
  },

  async create(input: CreateTransactionInput): Promise<TransactionDetail> {
    const response = await apiClient.post<ApiEnvelope<TransactionDetail>>(
      TRANSACTION_ENDPOINTS.base,
      input,
    )
    return unwrap(response)
  },

  async update(id: string, input: UpdateTransactionInput): Promise<TransactionDetail> {
    const response = await apiClient.patch<ApiEnvelope<TransactionDetail>>(
      TRANSACTION_ENDPOINTS.detail(id),
      input,
    )
    return unwrap(response)
  },

  async cancel(id: string, input: CancelTransactionInput = {}): Promise<TransactionDetail> {
    const response = await apiClient.post<ApiEnvelope<TransactionDetail>>(
      TRANSACTION_ENDPOINTS.cancel(id),
      input,
    )
    return unwrap(response)
  },

  async archive(id: string): Promise<TransactionDetail> {
    const response = await apiClient.post<ApiEnvelope<TransactionDetail>>(
      TRANSACTION_ENDPOINTS.archive(id),
    )
    return unwrap(response)
  },

  // Items (DRAFT-only)
  async listItems(id: string): Promise<TransactionItem[]> {
    const response = await apiClient.get<ApiEnvelope<TransactionItem[]>>(
      TRANSACTION_ENDPOINTS.items(id),
    )
    return unwrap(response)
  },

  async addItem(id: string, input: CreateTransactionItemInput): Promise<TransactionItem> {
    const response = await apiClient.post<ApiEnvelope<TransactionItem>>(
      TRANSACTION_ENDPOINTS.items(id),
      input,
    )
    return unwrap(response)
  },

  async updateItem(
    id: string,
    itemId: string,
    input: UpdateTransactionItemInput,
  ): Promise<TransactionItem> {
    const response = await apiClient.patch<ApiEnvelope<TransactionItem>>(
      TRANSACTION_ENDPOINTS.item(id, itemId),
      input,
    )
    return unwrap(response)
  },

  async deleteItem(id: string, itemId: string): Promise<{ deleted: true }> {
    const response = await apiClient.delete<ApiEnvelope<{ deleted: true }>>(
      TRANSACTION_ENDPOINTS.item(id, itemId),
    )
    return unwrap(response)
  },

  // Photo attachments (DRAFT-only, multipart)
  async listAttachments(id: string): Promise<TransactionAttachment[]> {
    const response = await apiClient.get<ApiEnvelope<TransactionAttachment[]>>(
      TRANSACTION_ENDPOINTS.attachments(id),
    )
    return unwrap(response)
  },

  async uploadAttachment(
    id: string,
    file: File,
    onProgress?: (percent: number) => void,
  ): Promise<TransactionAttachment> {
    const form = new FormData()
    form.append('file', file, file.name)
    const response = await apiClient.post<ApiEnvelope<TransactionAttachment>>(
      TRANSACTION_ENDPOINTS.attachments(id),
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

  async deleteAttachment(id: string, attachmentId: string): Promise<{ deleted: true }> {
    const response = await apiClient.delete<ApiEnvelope<{ deleted: true }>>(
      TRANSACTION_ENDPOINTS.attachment(id, attachmentId),
    )
    return unwrap(response)
  },

  // Suggestions (autocomplete)
  async materialSuggestions(q?: string, limit = 10): Promise<MaterialSuggestion[]> {
    const response = await apiClient.get<ApiEnvelope<MaterialSuggestion[]>>(
      TRANSACTION_ENDPOINTS.materialSuggestions,
      { params: { q, limit } },
    )
    return unwrap(response)
  },

  async priceSuggestions(materialName: string, limit = 10): Promise<PriceSuggestion[]> {
    const response = await apiClient.get<ApiEnvelope<PriceSuggestion[]>>(
      TRANSACTION_ENDPOINTS.priceSuggestions,
      { params: { materialName, limit } },
    )
    return unwrap(response)
  },
}
