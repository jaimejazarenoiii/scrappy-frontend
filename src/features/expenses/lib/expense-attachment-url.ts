import type { ExpenseAttachment } from '../types/expense.types'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'

function apiOrigin(): string {
  return API_BASE.replace(/\/api\/v1\/?$/, '')
}

function resolveApiUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  const origin = apiOrigin()
  return path.startsWith('/') ? `${origin}${path}` : `${origin}/${path}`
}

export function expenseAttachmentImageUrl(
  expenseId: string,
  attachment: Pick<ExpenseAttachment, 'id' | 'downloadUrl'>,
  accessToken: string | null | undefined,
): string {
  const base = API_BASE.replace(/\/$/, '')
  const contentUrl = attachment.downloadUrl
    ? resolveApiUrl(attachment.downloadUrl)
    : `${base}/expenses/${expenseId}/attachments/${attachment.id}/content`

  if (!accessToken) return contentUrl

  const separator = contentUrl.includes('?') ? '&' : '?'
  return `${contentUrl}${separator}access_token=${encodeURIComponent(accessToken)}`
}
