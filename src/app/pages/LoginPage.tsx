import { useEffect } from 'react'

import { LoginForm } from '@/features/auth/components/LoginForm'

export default function LoginPage() {
  useEffect(() => {
    document.title = 'Sign In | Scrappy Web'
  }, [])

  return <LoginForm />
}
