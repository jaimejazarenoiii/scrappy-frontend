import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

/** Per-employee payroll records do not include nested line-item tables in the current API. */
export function PayrollLineItemsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          Payroll values are returned as a single employee record. No nested line items are provided
          by the backend.
        </p>
      </CardContent>
    </Card>
  )
}
