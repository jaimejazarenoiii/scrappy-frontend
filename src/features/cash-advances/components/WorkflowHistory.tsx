import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface WorkflowHistoryProps {
  deductedAmount?: number
  remainingAmount?: number
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount)
}

export function WorkflowHistory({ deductedAmount, remainingAmount }: WorkflowHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Balance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>
          Deducted:{' '}
          <span className="font-medium">
            {deductedAmount != null ? formatCurrency(deductedAmount) : '—'}
          </span>
        </p>
        <p>
          Remaining:{' '}
          <span className="font-medium">
            {remainingAmount != null ? formatCurrency(remainingAmount) : '—'}
          </span>
        </p>
      </CardContent>
    </Card>
  )
}
