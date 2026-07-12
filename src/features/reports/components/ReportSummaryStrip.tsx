import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ReportSummary } from '../types/reports.types'
import { formatCurrency } from '@/utils/format-currency'
import { cn } from '@/lib/utils'

function formatSummaryValue(key: string, value: string | number | boolean | null): string {
  if (value == null) return '—'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (typeof value === 'number') {
    if (/amount|total|gross|net|pay/i.test(key)) return formatCurrency(value)
    return value.toLocaleString()
  }
  return value
}

function labelForKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^\w/, (char) => char.toUpperCase())
}

interface ReportSummaryStripProps {
  summary: ReportSummary | null | undefined
  generatedAt?: string | null
  className?: string
}

export function ReportSummaryStrip({ summary, generatedAt, className }: ReportSummaryStripProps) {
  const entries = summary ? Object.entries(summary) : []

  if (entries.length === 0 && !generatedAt) return null

  return (
    <div className={cn('space-y-3', className)}>
      {entries.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {entries.map(([key, value]) => (
            <Card key={key}>
              <CardHeader className="pb-2">
                <CardTitle className="text-muted-foreground text-sm font-medium">
                  {labelForKey(key)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-semibold tabular-nums">
                  {formatSummaryValue(key, value)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}
      {generatedAt ? (
        <p className="text-muted-foreground text-xs">
          Generated {new Date(generatedAt).toLocaleString()}
        </p>
      ) : null}
    </div>
  )
}
