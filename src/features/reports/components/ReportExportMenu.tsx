import { Download } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useReportExport } from '@/features/reports/hooks/useReportQueries'
import { REPORT_EXPORT_FORMATS, type ReportDomain } from '@/features/reports/types/reports.types'

interface ReportExportMenuProps {
  domain: ReportDomain
  disabled?: boolean
}

export function ReportExportMenu({ domain, disabled }: ReportExportMenuProps) {
  const exportMutation = useReportExport(domain)
  const formats = REPORT_EXPORT_FORMATS.filter((item) => item.enabled)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled === true || exportMutation.isPending}
          aria-busy={exportMutation.isPending}
        >
          <Download className="mr-2 size-4" />
          {exportMutation.isPending ? 'Exporting…' : 'Export'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {formats.map((item) => (
          <DropdownMenuItem
            key={item.format}
            onSelect={() => {
              exportMutation.mutate(item.format)
            }}
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
