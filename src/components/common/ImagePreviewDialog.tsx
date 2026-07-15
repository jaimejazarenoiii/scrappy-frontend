import { Download, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { downloadImageFile } from '@/utils/download-image'

interface ImagePreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  src: string | null
  fileName: string
  alt?: string
}

export function ImagePreviewDialog({
  open,
  onOpenChange,
  src,
  fileName,
  alt,
}: ImagePreviewDialogProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-4 p-4 sm:max-w-4xl sm:p-6">
        <DialogHeader>
          <DialogTitle className="truncate pr-8">{fileName || 'Photo'}</DialogTitle>
          <DialogDescription className="sr-only">
            Full-size preview of {fileName || 'the selected photo'}.
          </DialogDescription>
        </DialogHeader>

        {src ? (
          <div className="bg-muted/40 flex max-h-[min(70vh,40rem)] items-center justify-center overflow-auto rounded-lg border">
            <img
              src={src}
              alt={alt ?? fileName}
              className="max-h-[min(70vh,40rem)] w-full object-contain"
            />
          </div>
        ) : null}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={!src || isDownloading}
            onClick={() => {
              if (!src) return
              setIsDownloading(true)
              void downloadImageFile(src, fileName)
                .catch(() => {
                  toast.error('Could not download photo. Please try again.')
                })
                .finally(() => {
                  setIsDownloading(false)
                })
            }}
          >
            {isDownloading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Download className="size-4" />
            )}
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
