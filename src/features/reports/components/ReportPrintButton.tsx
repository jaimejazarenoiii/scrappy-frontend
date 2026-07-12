import { Printer } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface ReportPrintButtonProps {
  disabled?: boolean
}

export function ReportPrintButton({ disabled }: ReportPrintButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={disabled}
      className="print:hidden"
      onClick={() => {
        window.print()
      }}
    >
      <Printer className="mr-2 size-4" />
      Print
    </Button>
  )
}
