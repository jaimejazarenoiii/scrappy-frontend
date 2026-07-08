import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { NormalizedApiError } from '@/lib/axios'

import { CashAdvanceService } from '../services/cash-advance.service'
import type { CreateCashAdvanceInput } from '../types/cash-advance.types'
import { cashAdvanceKeys } from './useCashAdvances'

export function useCreateCashAdvance() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateCashAdvanceInput) => CashAdvanceService.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: cashAdvanceKeys.all })
      toast.success('Cash advance created')
    },
    onError: (error: NormalizedApiError) => {
      toast.error(error.message || 'Could not create cash advance')
    },
  })
}
