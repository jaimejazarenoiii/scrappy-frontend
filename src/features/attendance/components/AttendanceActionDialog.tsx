import { ConfirmDialog } from '@/components/common/ConfirmDialog'

interface AttendanceActionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  action: 'time-in' | 'time-out'
  onConfirm: () => void
  isLoading: boolean
}

export function AttendanceActionDialog({
  open,
  onOpenChange,
  action,
  onConfirm,
  isLoading,
}: AttendanceActionDialogProps) {
  const isTimeIn = action === 'time-in'

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isTimeIn ? 'Record time in?' : 'Record time out?'}
      description={
        isTimeIn
          ? 'This will record the current time as the employee clock-in.'
          : 'This will record the current time as the employee clock-out.'
      }
      confirmLabel={isTimeIn ? 'Time in' : 'Time out'}
      isLoading={isLoading}
      onConfirm={onConfirm}
    />
  )
}
