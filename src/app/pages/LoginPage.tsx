import { useEffect } from 'react'

export default function LoginPage() {
  useEffect(() => {
    document.title = 'Sign In | Scrappy Web'
  }, [])

  return (
    <div className="space-y-2 text-center">
      <h1 className="text-2xl font-semibold">Sign In</h1>
      <p className="text-muted-foreground text-sm">
        Authentication form will be implemented in Specify 002.
      </p>
    </div>
  )
}
