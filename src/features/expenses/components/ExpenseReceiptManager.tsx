import { ImagePlus, Loader2, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuthStore } from '@/store/auth.store'

import {
  useDeleteExpenseAttachment,
  useUploadExpenseAttachment,
} from '../hooks/useExpenseAttachmentMutations'
import { useExpenseAttachments } from '../hooks/useExpenseAttachments'
import { expenseAttachmentImageUrl } from '../lib/expense-attachment-url'
import type { ExpenseAttachment } from '../types/expense.types'

interface ExpenseReceiptManagerProps {
  expenseId: string
  disabled?: boolean
}

interface UploadState {
  fileName: string
  previewUrl: string
  progress: number
}

export function ExpenseReceiptManager({ expenseId, disabled = false }: ExpenseReceiptManagerProps) {
  const attachmentsQuery = useExpenseAttachments(expenseId)
  const uploadAttachment = useUploadExpenseAttachment(expenseId)
  const accessToken = useAuthStore((state) => state.accessToken)
  const [deletingAttachment, setDeletingAttachment] = useState<ExpenseAttachment | null>(null)
  const [uploads, setUploads] = useState<UploadState[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const deleteAttachment = useDeleteExpenseAttachment(expenseId)

  useEffect(() => {
    return () => {
      uploads.forEach((upload) => {
        URL.revokeObjectURL(upload.previewUrl)
      })
    }
  }, [uploads])

  async function handleFilesSelected(files: FileList | null) {
    if (!files?.length || disabled) return

    for (const file of Array.from(files)) {
      const previewUrl = URL.createObjectURL(file)
      setUploads((prev) => [...prev, { fileName: file.name, previewUrl, progress: 0 }])

      try {
        await uploadAttachment.mutateAsync({
          file,
          onProgress: (progress) => {
            setUploads((prev) =>
              prev.map((upload) =>
                upload.fileName === file.name && upload.previewUrl === previewUrl
                  ? { ...upload, progress }
                  : upload,
              ),
            )
          },
        })
      } finally {
        setUploads((prev) => prev.filter((upload) => upload.previewUrl !== previewUrl))
        URL.revokeObjectURL(previewUrl)
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const attachments = attachmentsQuery.data ?? []

  return (
    <section className="space-y-4" aria-labelledby="expense-receipts-heading">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="expense-receipts-heading" className="text-lg font-semibold">
            Receipt photos
          </h2>
          <p className="text-muted-foreground text-sm">
            Upload receipt images for audit and reconciliation.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={disabled || uploadAttachment.isPending}
          onClick={() => {
            fileInputRef.current?.click()
          }}
        >
          {uploadAttachment.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <ImagePlus className="size-4" />
          )}
          Upload receipts
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          disabled={disabled}
          onChange={(event) => {
            void handleFilesSelected(event.target.files)
          }}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {uploads.map((upload) => (
          <Card key={upload.previewUrl} className="gap-3 overflow-hidden p-3">
            <img
              src={upload.previewUrl}
              alt={upload.fileName}
              className="aspect-video w-full rounded-md object-cover"
            />
            <div className="space-y-2">
              <p className="truncate text-sm font-medium">{upload.fileName}</p>
              <progress
                className="h-2 w-full overflow-hidden rounded-full"
                value={upload.progress}
                max={100}
                aria-label={`Upload progress for ${upload.fileName}`}
              />
            </div>
          </Card>
        ))}

        {attachments.map((attachment) => (
          <Card key={attachment.id} className="gap-3 overflow-hidden p-3">
            <img
              src={expenseAttachmentImageUrl(expenseId, attachment, accessToken)}
              alt={attachment.fileName}
              className="aspect-video w-full rounded-md object-cover"
              loading="lazy"
            />
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-medium">{attachment.fileName}</p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={disabled}
                aria-label={`Remove ${attachment.fileName}`}
                onClick={() => {
                  setDeletingAttachment(attachment)
                }}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {!attachmentsQuery.isLoading && attachments.length === 0 && uploads.length === 0 ? (
        <p className="text-muted-foreground rounded-lg border border-dashed p-6 text-center text-sm">
          No receipt photos attached yet.
        </p>
      ) : null}

      <ConfirmDialog
        open={Boolean(deletingAttachment)}
        onOpenChange={(open) => {
          if (!open) setDeletingAttachment(null)
        }}
        title="Remove receipt?"
        description="This receipt will be removed from the expense."
        confirmLabel="Remove"
        variant="destructive"
        isLoading={deleteAttachment.isPending}
        onConfirm={() => {
          if (!deletingAttachment) return
          void deleteAttachment.mutateAsync(deletingAttachment.id).then(() => {
            setDeletingAttachment(null)
          })
        }}
      />
    </section>
  )
}
