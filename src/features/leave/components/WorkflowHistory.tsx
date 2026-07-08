import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface WorkflowHistoryProps {
  managerNote?: string | null
}

/** Leave API currently returns managerNote instead of a history timeline. */
export function WorkflowHistory({ managerNote }: WorkflowHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manager note</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          {managerNote ?? 'No manager note available.'}
        </p>
      </CardContent>
    </Card>
  )
}
