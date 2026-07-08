import { ImagePlus, Loader2, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuthStore } from '@/store/auth.store'

import {
  useDeleteTransactionAttachment,
  useUploadTransactionAttachment,
} from '../hooks/useTransactionAttachmentsMutations'
import { useTransactionAttachments } from '../hooks/useTransactionAttachments'
import { transactionAttachmentImageUrl } from '../lib/transaction-attachment-url'
import type { TransactionAttachment } from '../types/transaction.types'

interface TransactionPhotosManagerProps {
  transactionId: string
  disabled?: boolean
}

interface UploadState {
  fileName: string
  previewUrl: string
  progress: number
}

export function TransactionPhotosManager({
  transactionId,
  disabled = false,
}: TransactionPhotosManagerProps) {
  const attachmentsQuery = useTransactionAttachments(transactionId)
  const uploadAttachment = useUploadTransactionAttachment(transactionId)
  const accessToken = useAuthStore((state) => state.accessToken)
  const [deletingAttachment, setDeletingAttachment] = useState<TransactionAttachment | null>(null)
  const [uploads, setUploads] = useState<UploadState[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const deleteAttachment = useDeleteTransactionAttachment(transactionId)

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
    <section className="space-y-4" aria-labelledby="transaction-photos-heading">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="transaction-photos-heading" className="text-lg font-semibold">
            Photos
          </h2>
          <p className="text-muted-foreground text-sm">Upload supporting photos for this draft.</p>
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
          Upload photos
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
              src={transactionAttachmentImageUrl(transactionId, attachment, accessToken)}
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
          No photos uploaded yet.
        </p>
      ) : null}

      <ConfirmDialog
        open={Boolean(deletingAttachment)}
        onOpenChange={(open) => {
          if (!open) setDeletingAttachment(null)
        }}
        title="Remove photo?"
        description="This photo will be removed from the draft transaction."
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
