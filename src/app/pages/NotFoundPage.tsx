import { useEffect } from 'react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'

export default function NotFoundPage() {
  useEffect(() => {
    document.title = 'Page Not Found | Scrappy Web'
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-3xl font-semibold">Page Not Found</h1>
      <p className="text-muted-foreground max-w-md text-sm">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Button asChild>
        <Link to={ROUTES.dashboard}>Return to dashboard</Link>
      </Button>
    </div>
  )
}
