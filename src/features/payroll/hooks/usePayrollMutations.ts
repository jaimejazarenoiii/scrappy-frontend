import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { NormalizedApiError } from '@/lib/axios'

import { PayrollService } from '../services/payroll.service'
import type { GeneratePayrollInput, MarkPayrollPaidInput, Payroll } from '../types/payroll.types'
import { payrollKeys } from './usePayrolls'

export function useGeneratePayroll() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: GeneratePayrollInput) => PayrollService.generate(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: payrollKeys.all })
      toast.success('Payroll generated')
    },
    onError: (error: NormalizedApiError) => {
      toast.error(error.message || 'Could not generate payroll')
    },
  })
}

export function useMarkPayrollPaid(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input?: MarkPayrollPaidInput) => PayrollService.markPaid(id, input),
    onSuccess: (payroll: Payroll) => {
      queryClient.setQueryData(payrollKeys.detail(id), payroll)
      void queryClient.invalidateQueries({ queryKey: payrollKeys.all })
      toast.success('Payroll marked as paid')
    },
    onError: (error: NormalizedApiError) => {
      toast.error(error.message || 'Could not mark payroll as paid')
    },
  })
}
