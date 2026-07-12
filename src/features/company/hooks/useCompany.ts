import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { NormalizedApiError } from '@/lib/axios'
import { useAuthStore } from '@/store/auth.store'

import { CompanyService } from '../services/company.service'
import type { UpdateCompanyInput } from '../types/company.types'

export const companyKeys = {
  all: ['company'] as const,
}

export function useCompany() {
  return useQuery({
    queryKey: companyKeys.all,
    queryFn: () => CompanyService.getMe(),
  })
}

export function useUpdateCompany() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: UpdateCompanyInput) => {
      const company = await queryClient.ensureQueryData({
        queryKey: companyKeys.all,
        queryFn: () => CompanyService.getMe(),
      })
      return CompanyService.update(company.id, input)
    },
    onSuccess: (company) => {
      queryClient.setQueryData(companyKeys.all, company)
      const { tenant } = useAuthStore.getState()
      if (tenant) {
        useAuthStore.setState({ tenant: { ...tenant, companyName: company.name } })
      }
      toast.success('Business updated')
    },
    onError: (error: NormalizedApiError) => {
      toast.error(error.message || 'Could not update business')
    },
  })
}
