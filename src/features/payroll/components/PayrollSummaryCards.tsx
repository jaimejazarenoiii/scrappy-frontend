import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import type { Payroll } from '../types/payroll.types'

interface PayrollSummaryCardsProps {
  payroll: Pick<Payroll, 'grossSalary' | 'cashAdvanceDeductions' | 'netPay'>
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount)
}

export function PayrollSummaryCards({ payroll }: PayrollSummaryCardsProps) {
  const items = [
    { label: 'Gross salary', value: formatCurrency(payroll.grossSalary) },
    { label: 'Cash advance deductions', value: formatCurrency(payroll.cashAdvanceDeductions) },
    { label: 'Net pay', value: formatCurrency(payroll.netPay) },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <Card key={item.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              {item.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tabular-nums">{item.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
