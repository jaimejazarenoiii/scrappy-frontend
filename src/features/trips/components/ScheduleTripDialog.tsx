import { ConfirmDialog } from '@/components/common/ConfirmDialog'

interface ScheduleTripDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isLoading?: boolean
  onConfirm: () => void
}

export function ScheduleTripDialog({
  open,
  onOpenChange,
  isLoading = false,
  onConfirm,
}: ScheduleTripDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Schedule this trip?"
      description="The trip will move to Scheduled status and become ready for execution."
      confirmLabel="Schedule trip"
      isLoading={isLoading}
      onConfirm={onConfirm}
    />
  )
}
