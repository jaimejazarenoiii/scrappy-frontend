import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { NormalizedApiError } from '@/lib/axios'

import { EmployeeService } from '../services/employee.service'
import type { CreateEmployeeInput, Employee, UpdateEmployeeInput } from '../types/employee.types'
import { employeeKeys } from './useEmployees'

export function useCreateEmployee() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateEmployeeInput) => EmployeeService.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: employeeKeys.all })
      toast.success('Employee created')
    },
    onError: (error: NormalizedApiError) => {
      toast.error(error.message || 'Could not create employee')
    },
  })
}

export function useUpdateEmployee(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: UpdateEmployeeInput & { linkUserId?: string }) => {
      const { linkUserId, ...updateInput } = input
      const employee = await EmployeeService.update(id, updateInput)
      if (linkUserId) {
        return EmployeeService.linkUser(id, { userId: linkUserId })
      }
      return employee
    },
    onSuccess: (employee) => {
      queryClient.setQueryData(employeeKeys.detail(id), employee)
      void queryClient.invalidateQueries({ queryKey: employeeKeys.all })
      toast.success('Employee updated')
    },
    onError: (error: NormalizedApiError) => {
      toast.error(error.message || 'Could not update employee')
    },
  })
}

export function useArchiveEmployee(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => EmployeeService.archive(id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: employeeKeys.detail(id) })
      const previous = queryClient.getQueryData<Employee>(employeeKeys.detail(id))
      if (previous) {
        queryClient.setQueryData<Employee>(employeeKeys.detail(id), {
          ...previous,
          deletedAt: new Date().toISOString(),
        })
      }
      return { previous }
    },
    onError: (error: NormalizedApiError, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(employeeKeys.detail(id), context.previous)
      }
      toast.error(error.message || 'Could not archive employee')
    },
    onSuccess: (employee) => {
      queryClient.setQueryData(employeeKeys.detail(id), employee)
      toast.success('Employee archived')
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: employeeKeys.all })
    },
  })
}
