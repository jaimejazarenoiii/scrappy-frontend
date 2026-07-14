import { Camera, Loader2, SwitchCamera } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const JPEG_QUALITY = 0.92
const MAX_FILE_BYTES = 5 * 1024 * 1024

interface CameraCaptureDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCapture: (file: File) => void | Promise<void>
  title?: string
  description?: string
}

type FacingMode = 'environment' | 'user'

function buildCaptureFileName(): string {
  return `photo-${String(Date.now())}.jpg`
}

async function canvasToJpegFile(
  canvas: HTMLCanvasElement,
  fileName: string,
  quality = JPEG_QUALITY,
): Promise<File | null> {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          resolve(null)
          return
        }
        resolve(new File([blob], fileName, { type: 'image/jpeg' }))
      },
      'image/jpeg',
      quality,
    )
  })
}

export function CameraCaptureDialog({
  open,
  onOpenChange,
  onCapture,
  title = 'Take photo',
  description = 'Position the subject in frame, then capture.',
}: CameraCaptureDialogProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const captureInputRef = useRef<HTMLInputElement>(null)

  const [facingMode, setFacingMode] = useState<FacingMode>('environment')
  const [isStarting, setIsStarting] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [useNativeCapture, setUseNativeCapture] = useState(false)

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => {
      track.stop()
    })
    streamRef.current = null
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }, [])

  const startStream = useCallback(
    async (facing: FacingMode) => {
      setIsStarting(true)
      setError(null)
      stopStream()

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facing },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        })
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
        setUseNativeCapture(false)
      } catch {
        stopStream()
        setUseNativeCapture(true)
        setError('Could not access the camera. Allow permission or use your device camera instead.')
      } finally {
        setIsStarting(false)
      }
    },
    [stopStream],
  )

  useEffect(() => {
    if (!open) {
      stopStream()
      setError(null)
      setUseNativeCapture(false)
      setFacingMode('environment')
      return
    }

    void startStream('environment')
    return stopStream
  }, [open, startStream, stopStream])

  async function handleCapture() {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || !video.videoWidth) return

    setIsCapturing(true)
    setError(null)
    try {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const context = canvas.getContext('2d')
      if (!context) return

      context.drawImage(video, 0, 0)

      let file = await canvasToJpegFile(canvas, buildCaptureFileName())
      if (!file) return

      if (file.size > MAX_FILE_BYTES) {
        file = await canvasToJpegFile(canvas, buildCaptureFileName(), 0.75)
      }

      if (!file || file.size > MAX_FILE_BYTES) {
        setError('Photo is too large. Move closer or use upload with a smaller image.')
        return
      }

      await onCapture(file)
      onOpenChange(false)
    } finally {
      setIsCapturing(false)
    }
  }

  async function handleNativeCapture(files: FileList | null) {
    const file = files?.[0]
    if (!file) return
    await onCapture(file)
    onOpenChange(false)
    if (captureInputRef.current) {
      captureInputRef.current.value = ''
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-4 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {error ? (
          <p className="text-destructive text-sm" role="alert">
            {error}
          </p>
        ) : null}

        {!useNativeCapture ? (
          <div className="relative overflow-hidden rounded-lg border bg-black">
            {isStarting ? (
              <div className="flex aspect-[4/3] items-center justify-center">
                <Loader2 className="size-8 animate-spin text-white/80" aria-hidden />
                <span className="sr-only">Starting camera</span>
              </div>
            ) : (
              <video
                ref={videoRef}
                className="aspect-[4/3] w-full object-cover"
                playsInline
                muted
                autoPlay
              />
            )}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-6 text-center">
            <Camera className="text-muted-foreground mx-auto size-8" aria-hidden />
            <p className="text-muted-foreground mt-3 text-sm">
              Open your device camera to capture a photo.
            </p>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" aria-hidden />

        <input
          ref={captureInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
          className="sr-only"
          onChange={(event) => {
            void handleNativeCapture(event.target.files)
          }}
        />

        <DialogFooter className="gap-2 sm:justify-between">
          {!useNativeCapture && !isStarting ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const nextFacing: FacingMode = facingMode === 'environment' ? 'user' : 'environment'
                setFacingMode(nextFacing)
                void startStream(nextFacing)
              }}
            >
              <SwitchCamera className="size-4" />
              Flip camera
            </Button>
          ) : (
            <span />
          )}

          <div className="flex flex-wrap justify-end gap-2">
            {useNativeCapture ? (
              <Button
                type="button"
                onClick={() => {
                  captureInputRef.current?.click()
                }}
              >
                <Camera className="size-4" />
                Open camera
              </Button>
            ) : (
              <Button
                type="button"
                disabled={isStarting || isCapturing}
                onClick={() => {
                  void handleCapture()
                }}
              >
                {isCapturing ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Camera className="size-4" />
                )}
                Capture
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
