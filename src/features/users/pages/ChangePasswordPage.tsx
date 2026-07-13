import { useEffect } from 'react'

import { ChangePasswordForm } from '../components/ChangePasswordForm'

export default function ChangePasswordPage() {
  useEffect(() => {
    document.title = 'Change password | Scrappy'
  }, [])

  return <ChangePasswordForm />
}
