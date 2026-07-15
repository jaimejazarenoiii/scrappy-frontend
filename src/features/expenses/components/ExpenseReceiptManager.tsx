import { Camera, Download, ImagePlus, Loader2, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { ImagePreviewDialog } from '@/components/common/ImagePreviewDialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuthStore } from '@/store/auth.store'
import { downloadImageFile } from '@/utils/download-image'

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

interface PreviewState {
  src: string
  fileName: string
}

const ACCEPTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

export function ExpenseReceiptManager({ expenseId, disabled = false }: ExpenseReceiptManagerProps) {
  const attachmentsQuery = useExpenseAttachments(expenseId)
  const uploadAttachment = useUploadExpenseAttachment(expenseId)
  const accessToken = useAuthStore((state) => state.accessToken)
  const [deletingAttachment, setDeletingAttachment] = useState<ExpenseAttachment | null>(null)
  const [preview, setPreview] = useState<PreviewState | null>(null)
  const [uploads, setUploads] = useState<UploadState[]>([])
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const deleteAttachment = useDeleteExpenseAttachment(expenseId)

  useEffect(() => {
    return () => {
      uploads.forEach((upload) => {
        URL.revokeObjectURL(upload.previewUrl)
      })
    }
  }, [uploads])

  async function uploadFile(file: File) {
    if (!ACCEPTED_IMAGE_TYPES.has(file.type) && !file.type.startsWith('image/')) {
      return
    }

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

  async function handleFilesSelected(files: FileList | null) {
    if (!files?.length || disabled) return

    for (const file of Array.from(files)) {
      await uploadFile(file)
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = ''
    }
  }

  const attachments = attachmentsQuery.data ?? []
  const isUploading = uploadAttachment.isPending

  return (
    <section className="space-y-4" aria-labelledby="expense-receipts-heading">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="expense-receipts-heading" className="text-lg font-semibold">
            Receipt photos
          </h2>
          <p className="text-muted-foreground text-sm">
            Upload or capture receipt images for audit and reconciliation.
          </p>
        </div>
        {!disabled ? (
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isUploading}
              onClick={() => {
                fileInputRef.current?.click()
              }}
            >
              {isUploading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ImagePlus className="size-4" />
              )}
              Upload
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isUploading}
              onClick={() => {
                cameraInputRef.current?.click()
              }}
            >
              <Camera className="size-4" />
              Take photo
            </Button>
          </div>
        ) : null}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="sr-only"
          disabled={disabled}
          onChange={(event) => {
            void handleFilesSelected(event.target.files)
          }}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
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
            <button
              type="button"
              className="focus-visible:ring-ring block w-full overflow-hidden rounded-md focus-visible:ring-2 focus-visible:outline-none"
              onClick={() => {
                setPreview({ src: upload.previewUrl, fileName: upload.fileName })
              }}
            >
              <img
                src={upload.previewUrl}
                alt={upload.fileName}
                className="aspect-video w-full object-cover transition-opacity hover:opacity-90"
              />
            </button>
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

        {attachments.map((attachment) => {
          const imageUrl = expenseAttachmentImageUrl(expenseId, attachment, accessToken)
          return (
            <Card key={attachment.id} className="gap-3 overflow-hidden p-3">
              <button
                type="button"
                className="focus-visible:ring-ring block w-full overflow-hidden rounded-md focus-visible:ring-2 focus-visible:outline-none"
                aria-label={`View ${attachment.fileName}`}
                onClick={() => {
                  setPreview({ src: imageUrl, fileName: attachment.fileName })
                }}
              >
                <img
                  src={imageUrl}
                  alt={attachment.fileName}
                  className="aspect-video w-full object-cover transition-opacity hover:opacity-90"
                  loading="lazy"
                />
              </button>
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-medium">{attachment.fileName}</p>
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label={`Download ${attachment.fileName}`}
                    disabled={downloadingId === attachment.id}
                    onClick={() => {
                      setDownloadingId(attachment.id)
                      void downloadImageFile(imageUrl, attachment.fileName)
                        .catch(() => {
                          toast.error('Could not download photo. Please try again.')
                        })
                        .finally(() => {
                          setDownloadingId(null)
                        })
                    }}
                  >
                    {downloadingId === attachment.id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Download className="size-4" />
                    )}
                  </Button>
                  {!disabled ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      aria-label={`Remove ${attachment.fileName}`}
                      onClick={() => {
                        setDeletingAttachment(attachment)
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  ) : null}
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {!attachmentsQuery.isLoading && attachments.length === 0 && uploads.length === 0 ? (
        <p className="text-muted-foreground rounded-lg border border-dashed p-6 text-center text-sm">
          No receipts yet. Upload from your device or take a photo with your camera.
        </p>
      ) : null}

      <ImagePreviewDialog
        open={Boolean(preview)}
        onOpenChange={(open) => {
          if (!open) setPreview(null)
        }}
        src={preview?.src ?? null}
        fileName={preview?.fileName ?? ''}
      />

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
