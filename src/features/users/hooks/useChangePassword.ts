import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { NormalizedApiError } from '@/lib/axios'
import { useAuthStore } from '@/store/auth.store'

import { UserService } from '../services/user.service'
import type { ChangePasswordInput } from '../types/user.types'

export function useChangePassword() {
  return useMutation({
    mutationFn: (input: ChangePasswordInput) => UserService.changePassword(input),
    onSuccess: () => {
      const { currentUser, setCurrentUser } = useAuthStore.getState()
      if (currentUser) {
        setCurrentUser({ ...currentUser, passwordChangeRequired: false })
      }
      toast.success('Password updated')
    },
    onError: (error: NormalizedApiError) => {
      toast.error(error.message || 'Could not update password')
    },
  })
}
