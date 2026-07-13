import { Check, Copy, Loader2, RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

import { useResetEmployeePassword } from '../hooks/useEmployeeMutations'

interface ResetEmployeePasswordDialogProps {
  employeeId: string
  employeeName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ResetEmployeePasswordDialog({
  employeeId,
  employeeName,
  open,
  onOpenChange,
}: ResetEmployeePasswordDialogProps) {
  const resetPassword = useResetEmployeePassword(employeeId)
  const [temporaryPassword, setTemporaryPassword] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!open) {
      setTemporaryPassword(null)
      setCopied(false)
    }
  }, [open])

  const handleReset = () => {
    resetPassword.mutate(undefined, {
      onSuccess: (result) => {
        setTemporaryPassword(result.temporaryPassword)
      },
    })
  }

  const handleCopy = async () => {
    if (!temporaryPassword) return
    try {
      await navigator.clipboard.writeText(temporaryPassword)
      setCopied(true)
      window.setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          resetPassword.reset()
        }
        onOpenChange(next)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset password</DialogTitle>
          <DialogDescription>
            {temporaryPassword
              ? `Copy this temporary password for ${employeeName} now. It will not be shown again.`
              : `Generate a one-time temporary password for ${employeeName}. They must change it on next sign-in.`}
          </DialogDescription>
        </DialogHeader>

        {temporaryPassword ? (
          <div className="space-y-3">
            <div
              className="flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-950 dark:text-amber-100"
              role="status"
            >
              <span>
                Share this password out of band. Closing this dialog permanently hides it.
              </span>
            </div>
            <div className="flex gap-2">
              <Input readOnly value={temporaryPassword} className="font-mono" />
              <Button type="button" variant="outline" onClick={() => void handleCopy()}>
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            This invalidates their current password and signs them out of other devices.
          </p>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onOpenChange(false)
            }}
          >
            {temporaryPassword ? 'Done' : 'Cancel'}
          </Button>
          {!temporaryPassword ? (
            <Button type="button" disabled={resetPassword.isPending} onClick={handleReset}>
              {resetPassword.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Resetting…
                </>
              ) : (
                <>
                  <RotateCcw className="size-4" />
                  Reset password
                </>
              )}
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
