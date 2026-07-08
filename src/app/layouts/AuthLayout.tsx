import { Outlet } from 'react-router'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function AuthLayout() {
  return (
    <div className="from-background via-muted/30 to-background flex min-h-screen items-center justify-center bg-gradient-to-br p-4">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Scrappy</CardTitle>
        </CardHeader>
        <CardContent>
          <Outlet />
        </CardContent>
      </Card>
    </div>
  )
}
